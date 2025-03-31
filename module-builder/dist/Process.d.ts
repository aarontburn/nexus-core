import { IPCCallback, IPCSource } from "./IPCObjects";
import { ModuleSettings } from "./ModuleSettings";
import { Setting } from "./Setting";
export interface ModuleInfo {
    moduleName: string;
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
 *  Many fields/methods are not intended to be public. However, the process
 *      of loading external modules forces everything to be public, for some reason.
 *      Fields/methods that have the @private annotations should be treated as if they were
 *      private and should NOT be accessed directly.
 *
 *  @interface
 *  @author aarontburn
 */
export declare abstract class Process implements IPCSource {
    /**
     *  @private
     *  @see getSetting
     *
     *  Object to store this module's settings.
     *  This should not be directly accessed.
     */
    readonly _moduleSettings: ModuleSettings;
    /**
     *  @private
     *
     *  IPC callback function.
     */
    readonly _ipcCallback: IPCCallback;
    /**
     *  @private
     *  @see getName
     *
     *  Ths name of this module.
     */
    readonly _moduleName: string;
    /**
     *  @private
     *  @see ModuleInfo
     *  @see getModuleInfo
     *
     *  The information about this module.
     *
     */
    _moduleInfo: ModuleInfo;
    /**
     *  @private
     *  @see isInitialized
     *
     *  Boolean indicating if this module has been initialized.
     */
    _hasBeenInit: boolean;
    /**
     *  @private
     *  @see getHTMLPath
     *
     *  The path to the HTML.
     */
    readonly _htmlPath: string;
    /**
     *  @private
     *  @see getIPCSource
     *
     *  The ID of this module.
     */
    readonly _moduleID: string;
    /**
     *  Entry point.
     *
     *  @param moduleName   The name of the module,
     *  @param htmlPath     The path to the HTML frontend.
     *  @param ipcCallback  The IPC callback function.
     */
    constructor(moduleID: string, moduleName: string, htmlPath: string, ipcCallback: IPCCallback);
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
     *      set @see _hasBeenInit, if the module depends on it.
     */
    initialize(): void;
    /**
     *  @returns the info for this module.
     *  @see ModuleInfo
     */
    getModuleInfo(): ModuleInfo;
    /**
     *  Sets the info for this module.
     *  For external modules, this information is stored within 'moduleinfo.json',
     *      and will automatically be set here.
     *
     *  @param moduleInfo The module info.
     */
    setModuleInfo(moduleInfo: ModuleInfo): void;
    /**
     *  Abstract function to register settings for this module.
     *
     *  This should not be called externally.
     *
     *  @returns An array of both Settings and strings (for section headers.)
     */
    abstract registerSettings(): (Setting<unknown> | string)[];
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
    abstract refreshSettings(modifiedSetting: Setting<unknown>): void;
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
    onExit(): void;
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
    abstract handleEvent(eventType: string, ...data: any[]): Promise<any>;
    /**
     *  Send an event to the renderer.
     *
     *  @param eventType    The name of the event.
     *  @param data         The data to send.
     *  @see https://www.electronjs.org/docs/latest/tutorial/ipc#object-serialization
     */
    sendToRenderer(eventType: string, ...data: any): void;
    /**
     *  Exposes an API to external modules.
     *
     *  @param source       The module requesting data.
     *  @param eventType    The event type.
     *  @param data         Any additional data supplied;
     *  @returns            A Promise of the data to return.
     */
    handleExternal(source: IPCSource, eventType: string, ...data: any[]): Promise<any>;
    /**
     *  Requests information from another module.
     *
     *  @param target       The ID of the target module.
     *  @param eventType    The event type.
     *  @param data         Any additional data to be supplied
     *  @returns            The data returned from the request.
     */
    requestExternal(target: string, eventType: string, ...data: any[]): Promise<any>;
}
