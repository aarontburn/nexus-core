import { Process } from "./Process";
import { SettingBox } from "./SettingBox";
export declare abstract class Setting<T> {
    readonly parentModule: Process;
    readonly settingID: string;
    name: string;
    description: string;
    accessID: string;
    inputValidator: (input: any) => T;
    defaultValue: T;
    currentValue: T;
    settingBox: SettingBox<T>;
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
    constructor(parentModule: Process, defer?: boolean);
    /**
     * @private
     *
     * Checks if the required fields are set before data can be accessed or set.
     *
     * The required fields are {@link name} and {@link defaultValue}.
     *
     * @throws Error if the required fields were NOT set.
     */
    _checkRequiredFields(): void;
    reInitUI(): void;
    /**
     * Sets the name of this setting. This is a required field.
     *
     * @param name The name of the setting.
     * @return This setting.
     * @throws Error if the name of the setting is already set.
     */
    setName(name: string): Setting<T>;
    /**
     *  Set a unique access ID for the setting. Can be useful
     *      to access settings without using their name.
     *
     *  @param id The ID of the setting.
     *  @returns itself.
     */
    setAccessID(id: string): Setting<T>;
    /**
     *  @returns the ID of this setting.
     */
    getAccessID(): string;
    /**
     *  Sets the default value of this setting. This is a required field.
     *
     *  @param defaultValue The default value of the setting.
     *  @return itself.
     *  @throws {Error} if the default value of the setting is already set.
     */
    setDefault(defaultValue: T): Setting<T>;
    /**
     * Sets the description of this setting. This is NOT a required field.
     *
     * @param description The description of this setting.
     * @return itself.
     * @throws {Error} if the description of the setting is already set.
     */
    setDescription(description: string): Setting<T>;
    /**
     * @return The name of this setting.
     */
    getName(): string;
    /**
     * @return The description of this setting, or an empty string if it hasn't been set.
     */
    getDescription(): string;
    /**
     * Returns the value of this setting.
     *
     * @return The value of this setting.
     * @throws {Error} if an attempt was made to access the value of this setting before all
     *                               appropriate fields were set.
     */
    getValue(): T;
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
    setValue(value: any): void;
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
    _parseInput(input: any): T;
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
    abstract validateInput(input: any): T | null;
    /**
     * Resets the setting to default.
     */
    resetToDefault(): void;
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
    setValidator(inputValidator: (input: any) => T): Setting<T>;
    /**
     *  Abstract function to be defined by child classes.
     *
     *  @returns the corresponding SettingBox of the setting.
     */
    abstract setUIComponent(): SettingBox<T>;
    /**
     *  @returns the UI component of this setting.
     */
    getUIComponent(): SettingBox<T>;
    /**
     *  @returns The setting ID.
     */
    getID(): string;
    /**
     *  @returns a reference to the parent module.
     */
    getParentModule(): Process;
}
