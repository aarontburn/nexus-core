import { Process } from "./Process";
import { Setting } from "./Setting";
/**
 *  Class to manage module settings.
 *
 *  @author aarontburn
 */
export declare class ModuleSettings {
    private readonly settingsMap;
    private readonly settingsDisplay;
    private readonly parentModule;
    private settingsName;
    constructor(module: Process);
    /**
     *  Get the name of the module settings.
     *
     *  If it isn't set, which is default, it will return the name
     *      of the parent module. Only change this if you need to modify how
     *      the name of the settings appears.
     *
     *  @see setDisplayName
     *  @returns The name of the settings.
     */
    getDisplayName(): string;
    /**
     *  @returns An array of all the settings.
     */
    allToArray(): Setting<unknown>[];
    /**
     *  Get all display settings and headers.
     *  @returns An array of both settings and strings.
     */
    getSettingsAndHeaders(): (Setting<unknown> | string)[];
    /**
     *  Modify the name of the setting group.
     *
     *  Under normal conditions, there are very few reasons to change this.
     *
     *  @see getDisplayName
     *  @param name The name of the settings group.
     */
    setDisplayName(name: string): void;
    /**
     *  Add multiple settings.
     *
     *  @param settings The settings to add.
     */
    private addSettings;
    /**
     *  Adds a setting.
     *
     *  Registers the setting under both its name and ID, if set.
     *
     *  @param setting The setting to add.
     */
    private addSetting;
    /**
     *  Add multiple internal settings.
     *
     *  @see                addInternalSetting
     *  @param settings     An array of internal settings to add.
     */
    private addInternalSettings;
    /**
     *  Adds an internal setting.
     *
     *  Internal settings do not show up in the settings UI, and thus are only modified
     *      through code.
     *
     *  @param setting  The internal setting to add.
     */
    private addInternalSetting;
    /**
     *  Search for a setting by either name or ID.
     *
     *  @param nameOrAccessID The name or access ID of the setting
     *  @returns The setting, or undefined if not found.
     */
    findSetting(nameOrAccessID: string): Setting<unknown> | undefined;
    /**
     *  @returns A reference to the parent process.
     */
    getProcess(): Process;
}
