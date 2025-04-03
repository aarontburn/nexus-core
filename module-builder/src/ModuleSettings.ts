import { Process } from "./Process";
import { Setting } from "./Setting";



/**
 *  Class to manage module settings.
 * 
 *  @author aarontburn
 */
export class ModuleSettings {
    private readonly settingsMap: Map<string, Setting<unknown>>;
    private readonly settingsDisplay: (Setting<unknown> | string)[];
    private readonly parentModule: Process;

    private settingsName: string;


    public constructor(module: Process) {
        this.parentModule = module;

        this.settingsMap = new Map();
        this.settingsDisplay = [];

        console.log(this.settingsDisplay)

        this.addSettings(module.registerSettings());
        this.addInternalSettings(module.registerInternalSettings());

        // Bind everything
        Object.getOwnPropertyNames(ModuleSettings.prototype).forEach((key) => {
            if (key !== 'constructor') {
                (this as any)[key] = (this as any)[key].bind(this);
            }
        });

    }

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
    public getDisplayName(): string {
        return this.settingsName === undefined
            ? this.parentModule.getName()
            : this.settingsName;
    }


    /**
     *  @returns An array of all the settings.
     */
    public allToArray(): Setting<unknown>[] {
        return Array.from(new Set(this.settingsMap.values()));
    }


    /**
     *  Get all display settings and headers.
     *  @returns An array of both settings and strings.
     */
    public getSettingsAndHeaders(): (Setting<unknown> | string)[] {
        return this.settingsDisplay;
    }


    /**
     *  Modify the name of the setting group.
     *  
     *  Under normal conditions, there are very few reasons to change this.
     * 
     *  @see getDisplayName
     *  @param name The name of the settings group.
     */
    public setDisplayName(name: string): void {
        this.settingsName = name;
    }


    /**
     *  Add multiple settings.
     * 
     *  @param settings The settings to add. 
     */
    private addSettings(settings: (Setting<unknown> | string)[]): void {
        settings.forEach(this.addSetting);
    }



    /**
     *  Adds a setting.
     * 
     *  Registers the setting under both its name and ID, if set.
     * 
     *  @param setting The setting to add.
     */
    private addSetting(s: Setting<unknown> | string): void {
        this.settingsDisplay.push(s);
        if (typeof s === 'string') {
            return;
        }


        const setting: Setting<unknown> = s as Setting<unknown>;
        const settingID: string = setting.getAccessID();
        const settingName: string = setting.getName();

        if (settingID === settingName) { // No ID was set, or they used the same ID as the setting name.
            this.settingsMap.set(settingID, setting);
            return;
        }

        this.settingsMap.set(settingID, setting);
        this.settingsMap.set(settingName, setting);
    }




    /**
     *  Add multiple internal settings.
     * 
     *  @see                addInternalSetting
     *  @param settings     An array of internal settings to add.
     */
    private addInternalSettings(settings: Setting<unknown>[]): void {
        settings.forEach(this.addInternalSetting);
    }


    /**
     *  Adds an internal setting.
     *  
     *  Internal settings do not show up in the settings UI, and thus are only modified
     *      through code.
     * 
     *  @param setting  The internal setting to add.
     */
    private addInternalSetting(setting: Setting<unknown>): void {
        const settingID: string = setting.getAccessID();
        const settingName: string = setting.getName();

        if (settingID === settingName) { // No ID was set, or they used the same ID as the setting name.
            this.settingsMap.set(settingID, setting);
            return;
        }
        this.settingsMap.set(settingID, setting);
        this.settingsMap.set(settingName, setting);
    }


    /**
     *  Search for a setting by either name or ID. 
     * 
     *  @param nameOrAccessID The name or access ID of the setting
     *  @returns The setting, or undefined if not found.
     */
    public findSetting(nameOrAccessID: string): Setting<unknown> | undefined {
        return this.settingsMap.get(nameOrAccessID);
    }


    /**
     *  @returns A reference to the parent process.
     */
    public getProcess(): Process {
        return this.parentModule;
    }




}