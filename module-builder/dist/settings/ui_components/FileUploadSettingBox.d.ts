import { ChangeEvent, InputElement, SettingBox } from "../../SettingBox";
export declare class FileUploadSettingBox extends SettingBox<string> {
    createLeft(): string;
    createRight(): string;
    getStyle(): string;
    getInputIdAndType(): InputElement[];
    onChange(newValue: any): ChangeEvent[];
}
