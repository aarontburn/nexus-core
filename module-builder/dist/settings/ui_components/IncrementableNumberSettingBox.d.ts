import { Setting } from "../../Setting";
import { InputElement } from "../../SettingBox";
import { NumberSettingBox } from "./NumberSettingBox";
/**
 *  Similar to NumberSettingBox, but has buttons to increment.
 *
 *  @author aarontburn
 */
export declare class IncrementableNumberSettingBox extends NumberSettingBox {
    constructor(setting: Setting<number>);
    createLeft(): string;
    getInputIdAndType(): InputElement[];
    getStyle(): string;
}
