import { ChangeEvent, InputElement, SettingBox } from "../../SettingBox";
export declare class StringSettingBox extends SettingBox<string> {
    createLeft(): string;
    createRight(): string;
    getInputIdAndType(): InputElement[];
    onChange(newValue: any): ChangeEvent[];
}
