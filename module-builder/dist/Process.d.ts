import { IPCCallback, IPCSource } from "./IPCObjects";
import { ModuleSettings } from "./ModuleSettings";
import { DataResponse } from "./DataResponse";
import { Setting } from "./Setting";
export interface ModuleInfo {
    name: string;
    author: string;
    version?: string;
    description: string;
    buildVersion?: number;
    platforms?: string[];
    link?: string;
}
/**
 *  Class to encapsulate module behavior.
 *
 *  @interface
 *  @author aarontburn
 */
export declare abstract class Process implements IPCSource {
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
    private ipcCallback;
    /**
     *  @see getName
     *
     *  Ths name of this module.
     */
    private readonly moduleName;
    /**
     *  @see ModuleInfo
     *  @see getModuleInfo
     *
     *  The information about this module.
     *
     */
    private moduleInfo;
    /**
     *  Boolean indicating if this module has been initialized.
     */
    private hasBeenInit;
    /**
     *  @see getHTMLPath
     *
     *  The path to the HTML.
     */
    private readonly htmlPath;
    /**
     *  The ID of this module.
     */
    private readonly moduleID;
    private readonly iconPath;
    /**
     *  Entry point.
     *
     *  @param moduleName   The name of the module,
     *  @param htmlPath     The path to the HTML frontend.
     */
    constructor(moduleID: string, moduleName: string, htmlPath: string, iconPath?: string);
    getIconPath(): string;
    setIPC(ipc: IPCCallback): void;
    /**
     *  @returns the ID of the module.
     */
    getID(): string;
    /**
     *  @returns the name of the IPC source. By default,
     *      returns the module ID. This should not be modified.
     */
    getIPCSource(): string;
    /**
     *  @returns the name of the module.
     */
    getName(): string;
    /**
     *  @returns the settings associated with this module.
     */
    getSettings(): ModuleSettings;
    /**
     *  @returns the name of the settings file associated with this module.
     */
    getSettingsFileName(): string;
    /**
     *  @returns true if @see initialize() has been called, false otherwise.
     */
    isInitialized(): boolean;
    /**
     *  Lifecycle function that is (usually) called when the renderer is ready.
     *  Should be overridden and treated as the entry point to the module.
     *
     *  Child classes MUST do super.initialize() to properly
     *      set @see hasBeenInit, if the module depends on it.
     */
    initialize(): void;
    /**
     *  @returns the info for this module.
     *  @see ModuleInfo
     */
    getModuleInfo(): ModuleInfo;
    /**
     *  Sets the info for this module.
     *  For external modules, this information is stored within 'module-info.json',
     *      and will automatically be set here.
     *
     *  @param moduleInfo The module info.
     */
    setModuleInfo(moduleInfo: ModuleInfo): void;
    /**
     *  Function to register settings for this module.
     *
     *  This should not be called externally.
     *
     *  @returns An array of both Settings and strings (for section headers.)
     */
    registerSettings(): (Setting<unknown> | string)[];
    /**
     *  Registers internal settings that will not appear under the settings window.
     *
     *  @returns An array of Settings.
     */
    registerInternalSettings(): Setting<unknown>[];
    /**
     *  Function that is called whenever a setting that belongs to this
     *      module is modified.
     *
     *  For an example on how to use this, see {@link HomeProcess}
     */
    refreshSettings(modifiedSetting: Setting<unknown>): void;
    /**
     *  Refreshes all settings by passing them into {@link refreshSettings}
     *
     *  If the implementation of your {@link refreshSettings} refreshes ALL settings,
     *      this may result in many frontend updates. Use cautiously.
     */
    refreshAllSettings(): void;
    /**
     *  @private
     *
     *  Lifecycle function that is called whenever the module is shown.
     */
    onGUIShown(): void;
    /**
     *  @private
     *
     *  Lifecycle function that is called whenever the module is hidden.
     */
    onGUIHidden(): void;
    /**
     *  @private
     *
     *  Lifecycle function that is called before the application exits.
     */
    onExit(): Promise<void>;
    /**
     *  @returns the path to the HTML file associated with this module.
     */
    getHTMLPath(): string;
    /**
     *  @returns a string representation of this module. Currently, just returns the name.
     */
    toString(): string;
    /**
     *  Entry point to receive events from the renderer.
     *
     *  @param eventType    The name of the event
     *  @param data         The data sent from the renderer.
     */
    handleEvent(eventType: string, data: any[]): Promise<any>;
    /**
     *  Send an event to the renderer.
     *
     *  @param eventType    The name of the event.
     *  @param data         The data to send.
     *  @see https://www.electronjs.org/docs/latest/tutorial/ipc#object-serialization
     */
    sendToRenderer(eventType: string, ...data: any[]): void;
    /**
     *  Exposes an API to external modules.
     *
     *  @param source       The module requesting data.
     *  @param eventType    The event type.
     *  @param data         Any additional data supplied;
     *  @returns            A Promise of the data to return.
     */
    handleExternal(source: IPCSource, eventType: string, ...data: any[]): Promise<DataResponse>;
    /**
     *  Requests information from another module.
     *
     *  @param target       The ID of the target module.
     *  @param eventType    The event type.
     *  @param data         Any additional data to be supplied
     *  @returns            The data returned from the request.
     */
    requestExternal(target: string, eventType: string, ...data: any[]): Promise<DataResponse>;
}
