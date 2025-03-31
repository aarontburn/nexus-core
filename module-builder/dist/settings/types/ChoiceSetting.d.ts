import { Process } from "../../Process";
import { Setting } from "../../Setting";
import { SettingBox } from "../../SettingBox";
/**
 *  A setting that allows the user to selected from preset options.
 *      Only one option is able to be selected.
 *
 *  @author aarontburn
 */
export declare class ChoiceSetting extends Setting<string> {
    /**
     *  The stored options. Does not allow duplicate options.
     */
    private readonly options;
    /**
     *  @see useDropdown()
     *
     *  If this is true, the UI will be a dropdown selector
     *      instead of radio buttons.
     */
    private dropdown;
    /**
     *  @param module The parent module.
     */
    constructor(module: Process);
    /**
     *  @see dropdown
     *  If this function is called, the UI will be replaced with
     *      a dropdown selector instead of radio buttons.
     *
     *  @returns itself.
     */
    useDropdown(): ChoiceSetting;
    /**
     *  Adds a single option.
     *
     *  To add multiple at once, @see addOptions
     *
     *  @example addOption("Apple");
     *  @param option The name of the option to add.
     *  @returns itself.
     */
    addOption(option: string): ChoiceSetting;
    /**
     *  Add option(s).
     *
     *  @example addOptions("Apple", "Orange", "Banana");
     *  @param options The option(s) to add.
     *  @returns itself.
     */
    addOptions(...options: string[]): ChoiceSetting;
    /**
     *  @returns a copy of all options.
     */
    getOptionNames(): Set<string>;
    validateInput(input: any): string | null;
    setUIComponent(): SettingBox<string>;
}
