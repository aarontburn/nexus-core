import { Process } from "./Process";
import { Setting } from "./Setting";
/**
 *  Class to manage module settings.
 *
 *  @author aarontburn
 */
export declare class ModuleSettings {
    readonly settingsMap: Map<string, Setting<unknown>>;
    readonly settingsDisplay: (Setting<unknown> | string)[];
    readonly parentModule: Process;
    settingsName: string;
    constructor(module: Process);
    /**
     *  Get the name of the module settings.
     *
     *  If it isn't set, which is default, it will return the name
     *      of the parent module. Only change this if you need to modify how
     *      the name of the settings appears.
     *
     *  @see setName
     *  @returns The name of the settings.
     */
    getName(): string;
    /**
     *  @returns An array of all the settings.
     */
    getSettings(): Setting<unknown>[];
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
     *  @see getName
     *  @param name The name of the settings group.
     */
    setName(name: string): void;
    /**
     *  Adds a setting.
     *
     *  Registers the setting under both its name and ID, if set.
     *
     *  @param setting The setting to add.
     */
    _addSetting(s: Setting<unknown> | string): void;
    /**
     *  Add multiple settings.
     *
     *  @param settings The settings to add.
     */
    _addSettings(settings: (Setting<unknown> | string)[]): void;
    /**
     *  Add multiple internal settings.
     *
     *  @see                _addInternalSetting
     *  @param settings     An array of internal settings to add.
     */
    _addInternalSettings(settings: Setting<unknown>[]): void;
    /**
     *  Adds an internal setting.
     *
     *  Internal settings do not show up in the settings UI, and thus are only modified
     *      through code.
     *
     *  @param setting  The internal setting to add.
     */
    _addInternalSetting(setting: Setting<unknown>): void;
    /**
     *  Search for a setting by either name or ID.
     *
     *  @param nameOrID The name or ID of the setting
     *  @returns The setting, or undefined if not found.
     */
    getSetting(nameOrID: string): Setting<unknown> | undefined;
    /**
     *  @returns A reference to the parent module.
     */
    getModule(): Process;
}
