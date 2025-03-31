import { ChangeEvent, InputElement, SettingBox } from "../../SettingBox";
/**
 *  Number setting box.
 *
 *  @author aarontburn
 */
export declare class NumberSettingBox extends SettingBox<number> {
    createLeft(): string;
    getInputIdAndType(): InputElement[];
    onChange(newValue: any): ChangeEvent[];
}
