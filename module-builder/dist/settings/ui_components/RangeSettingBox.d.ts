import { Setting } from "../../Setting";
import { ChangeEvent, InputElement } from "../../SettingBox";
import { NumberSettingBox } from "./NumberSettingBox";
/**
 *  Range setting UI. Will render as a slider.
 *
 *  @author aarontburn
 */
export declare class RangeSettingBox extends NumberSettingBox {
    constructor(setting: Setting<number>);
    createRight(): string;
    getInputIdAndType(): InputElement[];
    onChange(newValue: any): ChangeEvent[];
}
