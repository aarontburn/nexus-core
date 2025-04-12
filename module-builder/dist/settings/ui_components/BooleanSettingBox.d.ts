import { ChangeEvent, InputElement, SettingBox } from "../../SettingBox";
/**
 *  Boolean setting box. Will render as a toggle switch.
 *
 *  @author aarontburn
 */
export declare class BooleanSettingBox extends SettingBox<boolean> {
    private readonly parentSetting;
    createLeft(): string;
    getInputIdAndType(): InputElement[];
    onChange(newValue: any): ChangeEvent[];
    getStyle(): string;
}
