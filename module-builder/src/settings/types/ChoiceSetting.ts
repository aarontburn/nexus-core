import { Process } from "../../Process";
import { Setting } from "../../Setting";
import { SettingBox } from "../../SettingBox";
import { DropdownSettingBox } from "../ui_components/DropdownSettingBox";
import { RadioSettingBox } from "../ui_components/RadioSettingBox";


/**
 *  A setting that allows the user to selected from preset options.
 *      Only one option is able to be selected.
 * 
 *  @author aarontburn
 */
export class ChoiceSetting extends Setting<string> {

    /**
     *  The stored options. Does not allow duplicate options. 
     */
    private readonly options: Set<string> = new Set();

    /**
     *  @see useDropdown()
     * 
     *  If this is true, the UI will be a dropdown selector
     *      instead of radio buttons.
     */
    private dropdown: boolean = false


    /**
     *  @param module The parent module.
     */
    public constructor(module: Process) {
        super(module, true);
    }

    /**
     *  @see dropdown
     *  If this function is called, the UI will be replaced with
     *      a dropdown selector instead of radio buttons.
     * 
     *  @returns itself.
     */
    public useDropdown(): ChoiceSetting {
        this.dropdown = true;
        this.reInitUI();
        return this;

    }

    /**
     *  Adds a single option.
     * 
     *  To add multiple at once, @see addOptions
     * 
     *  @example addOption("Apple");
     *  @param option The name of the option to add.
     *  @returns itself.
     */
    public addOption(option: string): ChoiceSetting {
        return this.addOptions(option);
    }

    /**
     *  Add option(s).
     * 
     *  @example addOptions("Apple", "Orange", "Banana");
     *  @param options The option(s) to add.
     *  @returns itself.
     */
    public addOptions(...options: string[]): ChoiceSetting {
        for (const option of options) {
            this.options.add(option);
        }
        this.reInitUI();

        return this;
    }

    /**
     *  @returns a copy of all options.
     */
    public getOptionNames(): Set<string> {
        return new Set(this.options.keys());
    }

    public validateInput(input: any): string | null {
        const s: string = JSON.stringify(input).replace(/"/g, '');

        if (!this.options.has(s)) {
            return null;
        }
        return s;
    }

    public setUIComponent(): SettingBox<string> {
        if (this.dropdown) {
            return new DropdownSettingBox(this);
        }
        return new RadioSettingBox(this);
    }

}