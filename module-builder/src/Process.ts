import { IPCCallback, IPCSource } from "./IPCObjects";
import { ModuleSettings } from "./ModuleSettings";
import { Setting } from "./Setting";



export interface ModuleInfo {
    moduleName: string,
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
 *  Many fields/methods are not intended to be public. However, the process
 *      of loading external modules forces everything to be public, for some reason.
 *      Fields/methods that have the @private annotations should be treated as if they were
 *      private and should NOT be accessed directly.
 * 
 *  @interface
 *  @author aarontburn
 */
export abstract class Process implements IPCSource {

    /**
     *  @private 
     *  @see getSetting
     * 
     *  Object to store this module's settings.
     *  This should not be directly accessed.
     */
    public readonly _moduleSettings = new ModuleSettings(this);

    /**
     *  @private 
     * 
     *  IPC callback function.
     */
    public readonly _ipcCallback: IPCCallback;

    /**
     *  @private 
     *  @see getName
     * 
     *  Ths name of this module.
     */
    public readonly _moduleName: string;

    /**
     *  @private
     *  @see ModuleInfo
     *  @see getModuleInfo
     * 
     *  The information about this module.
     *
     */
    public _moduleInfo: ModuleInfo;

    /**
     *  @private
     *  @see isInitialized
     * 
     *  Boolean indicating if this module has been initialized.
     */
    public _hasBeenInit: boolean = false;

    /**
     *  @private
     *  @see getHTMLPath
     * 
     *  The path to the HTML.
     */
    public readonly _htmlPath: string;

    /**
     *  @private
     *  @see getIPCSource
     * 
     *  The ID of this module.
     */
    public readonly _moduleID: string;

    /**
     *  Entry point.
     * 
     *  @param moduleName   The name of the module,
     *  @param htmlPath     The path to the HTML frontend.
     *  @param ipcCallback  The IPC callback function.
     */
    public constructor(moduleID: string, moduleName: string, htmlPath: string, ipcCallback: IPCCallback) {
        this._moduleID = moduleID;
        this._moduleName = moduleName;
        this._htmlPath = htmlPath;
        this._ipcCallback = ipcCallback;

        this._moduleSettings._addSettings(this.registerSettings());
        this._moduleSettings._addInternalSettings(this.registerInternalSettings());
    }


    /**
     *  @returns the name of the IPC source. By default,
     *      returns the module ID. This should not be modified.
     */
    public getIPCSource(): string {
        return this._moduleID;
    }


    /**
     *  @returns the name of the module.
     */
    public getName(): string {
        return this._moduleName;
    }


    /**
     *  @returns the settings associated with this module. 
     */
    public getSettings(): ModuleSettings {
        return this._moduleSettings;
    }


    /**
     *  @returns the name of the settings file associated with this module.
     */
    public getSettingsFileName(): string {
        return this._moduleName.toLowerCase() + "_settings.json";
    }


    /**
     *  @returns true if @see initialize() has been called, false otherwise.
     */
    public isInitialized(): boolean {
        return this._hasBeenInit;
    }


    /**
     *  Lifecycle function that is (usually) called when the renderer is ready.
     *  Should be overridden and treated as the entry point to the module.
     * 
     *  Child classes MUST do super.initialize() to properly
     *      set @see _hasBeenInit, if the module depends on it.
     */
    public initialize(): void {
        this._hasBeenInit = true;
        // Override this, and do a super.initialize() after initializing model.
    }


    /**
     *  @returns the info for this module.
     *  @see ModuleInfo
     */
    public getModuleInfo(): ModuleInfo {
        return this._moduleInfo;
    }


    /**
     *  Sets the info for this module.
     *  For external modules, this information is stored within 'moduleinfo.json',
     *      and will automatically be set here.
     * 
     *  @param moduleInfo The module info.
     */
    public setModuleInfo(moduleInfo: ModuleInfo) {
        if (this._moduleInfo !== undefined) {
            throw new Error("Attempted to reassign module info for " + this._moduleName);
        }
        this._moduleInfo = moduleInfo;
    }


    /**
     *  Abstract function to register settings for this module.
     * 
     *  This should not be called externally.
     *  
     *  @returns An array of both Settings and strings (for section headers.)
     */
    public abstract registerSettings(): (Setting<unknown> | string)[];


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
    public abstract refreshSettings(modifiedSetting: Setting<unknown>): void;


    /**
     *  Refreshes all settings by passing them into {@link refreshSettings}
     * 
     *  If the implementation of your {@link refreshSettings} refreshes ALL settings,
     *      this may result in many frontend updates. Use cautiously.
     */
    public refreshAllSettings(): void {
        for (const setting of this.getSettings().getSettings()) {
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
    public onExit(): void {
        // Do nothing by default.
    }


    /**
     *  @returns the path to the HTML file associated with this module. 
     */
    public getHTMLPath(): string {
        return this._htmlPath;
    }


    /**
     *  @returns a string representation of this module. Currently, just returns the name.
     */
    public toString(): string {
        return this._moduleName;
    }


    /**
     *  Entry point to receive events from the renderer. 
     * 
     *  @param eventType    The name of the event
     *  @param data         The data sent from the renderer.
     */
    public abstract handleEvent(eventType: string, ...data: any[]): Promise<any>


    /**
     *  Send an event to the renderer.
     * 
     *  @param eventType    The name of the event.
     *  @param data         The data to send.
     *  @see https://www.electronjs.org/docs/latest/tutorial/ipc#object-serialization
     */
    public sendToRenderer(eventType: string, ...data: any): void {
        this._ipcCallback.notifyRenderer(this, eventType, ...data);
    }


    /**
     *  Exposes an API to external modules. 
     * 
     *  @param source       The module requesting data.
     *  @param eventType    The event type.
     *  @param data         Any additional data supplied;
     *  @returns            A Promise of the data to return.
     */
    public async handleExternal(source: IPCSource, eventType: string, ...data: any[]): Promise<any> {
        console.warn(`[${this._moduleName}]: External module, '${source.getIPCSource()}' requested data.'`);
        console.warn(`\tWith event type of: ${eventType}`);
        console.warn(`\tAnd data:`);
        console.warn(data);
        return null;
    }

    
    /**
     *  Requests information from another module. 
     * 
     *  @param target       The ID of the target module.
     *  @param eventType    The event type.
     *  @param data         Any additional data to be supplied
     *  @returns            The data returned from the request.
     */
    public async requestExternal(target: string, eventType: string, ...data: any[]): Promise<any> {
        return this._ipcCallback.requestExternalModule(this, target, eventType, ...data);
    }


}