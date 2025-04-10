import { HTTPStatusCode } from "./HTTPStatusCodes";
import { IPCCallback, IPCSource } from "./IPCObjects";
import { ModuleSettings } from "./ModuleSettings";
import { DataResponse } from "./DataResponse";
import { Setting } from "./Setting";



export interface ModuleInfo {
    name: string,
    author: string,
    version?: string,
    description: string,
    buildVersion?: number,
    platforms?: string[],
    link?: string
}

/**
 *  Class to encapsulate module behavior.
 * 
 *  @interface
 *  @author aarontburn
 */
export abstract class Process implements IPCSource {

    /**
     *  @see getSettings
     * 
     *  Object to store this module's settings.
     *  This should not be directly accessed.
     */
    private readonly moduleSettings;

    /**
     *  IPC callback function.
     */
    private ipcCallback: IPCCallback;

    /**
     *  @see getName
     * 
     *  Ths name of this module.
     */
    private readonly moduleName: string;

    /**
     *  @see ModuleInfo
     *  @see getModuleInfo
     * 
     *  The information about this module.
     *
     */
    private moduleInfo: ModuleInfo;

    /**
     *  Boolean indicating if this module has been initialized.
     */
    private hasBeenInit: boolean = false;

    /**
     *  @see getHTMLPath
     * 
     *  The path to the HTML.
     */
    private readonly htmlPath: string;

    /**
     *  The ID of this module.
     */
    private readonly moduleID: string;

    private readonly iconPath: string;

    private readonly url: URL | undefined;

    /**
     *  Entry point.
     * 
     *  @param moduleName   The name of the module,
     *  @param htmlPath     The path to the HTML frontend.
     */
    public constructor(moduleID: string, moduleName: string, htmlPath: string | URL, iconPath?: string) {
        this.moduleID = moduleID;
        this.moduleName = moduleName;

        if (typeof htmlPath === "string") {
            this.htmlPath = htmlPath;
        } else {
            this.url = htmlPath;
        }

        this.iconPath = iconPath;
        this.moduleSettings = new ModuleSettings(this);
    }

    public getIconPath(): string {
        return this.iconPath;
    }

    public getURL(): URL | undefined {
        return this.url;
    }


    public setIPC(ipc: IPCCallback) {
        if (this.ipcCallback !== undefined) {
            throw new Error("Cannot reassign IPC callback");
        }
        this.ipcCallback = ipc;
    }


    /**
     *  @returns the ID of the module.
     */
    public getID(): string {
        return this.moduleID;
    }

    /**
     *  @returns the name of the IPC source. By default,
     *      returns the module ID. This should not be modified.
     */
    public getIPCSource(): string {
        return this.moduleID;
    }


    /**
     *  @returns the name of the module.
     */
    public getName(): string {
        return this.moduleName;
    }


    /**
     *  @returns the settings associated with this module. 
     */
    public getSettings(): ModuleSettings {
        return this.moduleSettings;
    }



    /**
     *  @returns true if @see initialize() has been called, false otherwise.
     */
    public isInitialized(): boolean {
        return this.hasBeenInit;
    }


    /**
     *  Lifecycle function that is (usually) called when the renderer is ready.
     *  Should be overridden and treated as the entry point to the module.
     * 
     *  Child classes MUST do super.initialize() to properly
     *      set @see hasBeenInit, if the module depends on it.
     */
    public initialize(): void {
        this.hasBeenInit = true;
        // Override this, and do a super.initialize() after initializing module..
    }


    /**
     *  @returns the info for this module.
     *  @see ModuleInfo
     */
    public getModuleInfo(): ModuleInfo {
        return this.moduleInfo;
    }


    /**
     *  Sets the info for this module.
     *  For external modules, this information is stored within 'module-info.json',
     *      and will automatically be set here.
     * 
     *  @param moduleInfo The module info.
     */
    public setModuleInfo(moduleInfo: ModuleInfo) {
        if (this.moduleInfo !== undefined) {
            throw new Error("Attempted to reassign module info for " + this.moduleName);
        }
        this.moduleInfo = moduleInfo;
    }


    /**
     *  Function to register settings for this module.
     * 
     *  This should not be called externally.
     *  
     *  @returns An array of both Settings and strings (for section headers.)
     */
    public registerSettings(): (Setting<unknown> | string)[] {
        return [];
    }


    /**
     *  Registers internal settings that will not appear under the settings window.
     * 
     *  @returns An array of Settings.
     */
    public registerInternalSettings(): Setting<unknown>[] {
        return [];
    }


    /**
     *  Function that is called whenever a setting that belongs to this
     *      module is modified.
     * 
     *  For an example on how to use this, see {@link HomeProcess}
     */
    public refreshSettings(modifiedSetting: Setting<unknown>): void {
        console.warn(`Uncaught setting change: ${this.getName()} has no handler for setting modification.`);
    }


    /**
     *  Refreshes all settings by passing them into {@link refreshSettings}
     * 
     *  If the implementation of your {@link refreshSettings} refreshes ALL settings,
     *      this may result in many frontend updates. Use cautiously.
     */
    public refreshAllSettings(): void {
        for (const setting of this.getSettings().allToArray()) {
            this.refreshSettings(setting);
        }
    }


    /**
     *  @private
     * 
     *  Lifecycle function that is called whenever the module is shown.
     */
    public onGUIShown() {
        // Do nothing by default.
    }


    /**
     *  @private 
     * 
     *  Lifecycle function that is called whenever the module is hidden.
     */
    public onGUIHidden() {
        // Do nothing by default. 
    }


    /**
     *  @private
     * 
     *  Lifecycle function that is called before the application exits.
     */
    public async onExit(): Promise<void> {
        // Do nothing by default.
    }


    /**
     *  @returns the path to the HTML file associated with this module. 
     */
    public getHTMLPath(): string {
        return this.htmlPath;
    }


    /**
     *  Entry point to receive events from the renderer. 
     * 
     *  @param eventType    The name of the event
     *  @param data         The data sent from the renderer.
     */
    public async handleEvent(eventType: string, data: any[]): Promise<any> {
        console.warn(`Uncaught message: ${this.getName()} has no renderer event handler.`);
    }


    /**
     *  Send an event to the renderer.
     * 
     *  @param eventType    The name of the event.
     *  @param data         The data to send.
     *  @see https://www.electronjs.org/docs/latest/tutorial/ipc#object-serialization
     */
    public sendToRenderer(eventType: string, ...data: any[]): void {
        if (this.getHTMLPath() === undefined) {
            return;
        }

        this.ipcCallback.notifyRenderer(this, eventType, ...data);
    }


    /**
     *  Exposes an API to external modules. 
     * 
     *  @param source       The module requesting data.
     *  @param eventType    The event type.
     *  @param data         Any additional data supplied;
     *  @returns            A Promise of the data to return.
     */
    public async handleExternal(source: IPCSource, eventType: string, ...data: any[]): Promise<DataResponse> {
        return { code: HTTPStatusCode.NOT_IMPLEMENTED, body: undefined };
    }


    /**
     *  Requests information from another module. 
     * 
     *  @param target       The ID of the target module.
     *  @param eventType    The event type.
     *  @param data         Any additional data to be supplied
     *  @returns            The data returned from the request.
     */
    public async requestExternal(target: string, eventType: string, ...data: any[]): Promise<DataResponse> {
        return await this.ipcCallback.requestExternalModule(this, target, eventType, ...data);
    }


}