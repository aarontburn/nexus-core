import { Process } from "./Process";
import { SettingBox } from "./SettingBox";

export abstract class Setting<T> {

    public readonly parentModule: Process;
    public readonly settingID: string = "setting_id_" + Math.random().toString(36).replace('0.', '');

    public name: string;
    public description: string;
    public accessID: string;

    public inputValidator: (input: any) => T;

    public defaultValue: T;
    public currentValue: T;

    public settingBox: SettingBox<T>;



    /**
     *  Creates a new setting with the module that this setting belongs to.
     * 
     *  Use the following methods to set the state of the setting:
     *     - {@link setName} Sets the name of the setting (REQUIRED).
     *     - {@link setDefault} Sets the default value of the setting (REQUIRED).
     *     - {@link setDescription} Sets the description of the setting.
     *
     *  @param parentModule The module that this setting belongs to.
     */
    public constructor(parentModule: Process, defer: boolean = false) {
        this.parentModule = parentModule;

        if (!defer) {
            this.settingBox = this.setUIComponent();
        }
    }


    /**
     * @private
     * 
     * Checks if the required fields are set before data can be accessed or set.
     * 
     * The required fields are {@link name} and {@link defaultValue}.
     *
     * @throws Error if the required fields were NOT set.
     */
    public _checkRequiredFields(): void {
        if (this.name === undefined
            || this.defaultValue === undefined) {

            throw new Error(
                `Attempted to access '${this.name}' before all values were set. Missing: `
                + (this.name === undefined ? "NAME " : "")
                + (this.defaultValue === undefined ? "DEFAULT " : "")
            );
        }
    }


    public reInitUI(): void {
        this.settingBox = this.setUIComponent();
    }



    /**
     * Sets the name of this setting. This is a required field.
     *
     * @param name The name of the setting.
     * @return This setting.
     * @throws Error if the name of the setting is already set.
     */
    public setName(name: string): Setting<T> {
        if (this.name !== undefined) {
            throw new Error("Cannot reassign setting name for " + this.name);
        }
        this.name = name;
        return this;
    }

    /**
     *  Set a unique access ID for the setting. Can be useful
     *      to access settings without using their name. 
     * 
     *  @param id The ID of the setting.
     *  @returns itself.
     */
    public setAccessID(id: string): Setting<T> {
        if (this.accessID !== undefined) {
            throw new Error("Cannot reassign access ID for " + this.name);
        }
        this.accessID = id;
        return this;
    }

    /**
     *  @returns the ID of this setting.
     */
    public getAccessID(): string {
        return this.accessID ? this.accessID : this.name;
    }



    /**
     *  Sets the default value of this setting. This is a required field.
     *
     *  @param defaultValue The default value of the setting.
     *  @return itself.
     *  @throws {Error} if the default value of the setting is already set.
     */
    public setDefault(defaultValue: T): Setting<T> {
        if (this.defaultValue !== undefined) {
            throw new Error("Cannot reassign default value for " + this.name);
        }
        this.defaultValue = defaultValue;
        this.currentValue = defaultValue;
        return this;
    }


    /**
     * Sets the description of this setting. This is NOT a required field.
     *
     * @param description The description of this setting.
     * @return itself.
     * @throws {Error} if the description of the setting is already set.
     */
    public setDescription(description: string): Setting<T> {
        if (this.description != undefined) {
            throw new Error("Cannot reassign description for " + this.name);
        }
        this.description = description;
        return this;
    }



    /**
     * @return The name of this setting.
     */
    public getName(): string {
        return this.name;
    }


    /**
     * @return The description of this setting, or an empty string if it hasn't been set.
     */
    public getDescription(): string {
        return this.description === undefined ? "" : this.description;
    }



    /**
     * Returns the value of this setting.
     *
     * @return The value of this setting.
     * @throws {Error} if an attempt was made to access the value of this setting before all
     *                               appropriate fields were set.
     */
    public getValue(): T {
        this._checkRequiredFields();
        return this.currentValue;
    }


    /**
     *  Changes the value of this setting.
     * 
     *  It passes the value into @see _parseInput, which returns either
     *      a value of type that matches this settings type, or null indicating that it could
     *      not properly parse the input.
     * 
     *  If the input is null, the current value will remain the same. Otherwise, it will update
     *      its value to the new one.
     * 
     * @param value The new value, not null.
     * @throws Error if an attempt was made to set the value before all
     *                               appropriate fields were set.
     */
    public setValue(value: any): void {
        this._checkRequiredFields();

        const parsedValue: T = this._parseInput(value);
        this.currentValue = parsedValue != null ? parsedValue : this.currentValue;
    }


    /**
     *  @private
     * 
     *  Converts a generic 'any' input into a {@link T} type input.
     * 
     *  If an {@link inputValidator} is specified, it will use it to parse the input.
     * 
     *  Otherwise, it will use {@link validateInput} to parse the input.
     *
     *  @param input The input to parse.
     *  @return A {@link T} type valid input, or null if the input couldn't be parsed.
     */
    public _parseInput(input: any): T {
        if (this.inputValidator !== undefined) {
            return this.inputValidator(input);
        }

        return this.validateInput(input);
    }


    /**
     *  Child-overridden method to parse inputs IF a {@link inputValidator} is
     *      not specified.
     * 
     *  If the input is valid, it should return a {@link T} as the input.
     * 
     *  Otherwise, it should send null. If null is not sent, it will attempt to assign potentially
     *      invalid inputs to this setting.
     *
     *  @param input The input to parse.
     *  @return A {@link T} valid input, or null if the input could not be parsed.
     */
    public abstract validateInput(input: any): T | null;


    /**
     * Resets the setting to default.
     */
    public resetToDefault(): void {
        this.setValue(this.defaultValue);
    }

    /**
     *  Sets the input validator for this setting.
     * 
     *  The {@link _parseInput} function will use the specified input validator instead of
     *      the {@link validateInput} to parse input.
     *
     *  @param inputValidator The input validator to use over the default {@link _parseInput}.
     *  @return itself.
     *  @throws {Error} if the input validator is already defined.
     */
    public setValidator(inputValidator: (input: any) => T): Setting<T> {
        if (this.inputValidator !== undefined) {
            throw new Error("Cannot redefine input validator for " + this.name);
        }
        this.inputValidator = inputValidator;
        return this;
    }

    /**
     *  Abstract function to be defined by child classes. 
     * 
     *  @returns the corresponding SettingBox of the setting.
     */
    public abstract setUIComponent(): SettingBox<T>;

    /**
     *  @returns the UI component of this setting. 
     */
    public getUIComponent(): SettingBox<T> {
        return this.settingBox;
    }

    /**
     *  @returns The setting ID.
     */
    public getID(): string {
        return this.settingID;
    }

    /**
     *  @returns a reference to the parent module.
     */
    public getParentModule(): Process {
        return this.parentModule;
    }


}
