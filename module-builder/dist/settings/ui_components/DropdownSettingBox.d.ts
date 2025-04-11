import { Setting } from "../../Setting";
import { InputElement, SettingBox } from "../../SettingBox";
/**
 *  Alternative SettingBox to the radio buttons to hold choice input.
 *
 *  @author aarontburn
 */
export declare class DropdownSettingBox extends SettingBox<string> {
    constructor(setting: Setting<string>);
    createLeft(): string;
    createRight(): string;
    private getInputOptions;
    getInputIdAndType(): InputElement[];
    getStyle(): string;
}
