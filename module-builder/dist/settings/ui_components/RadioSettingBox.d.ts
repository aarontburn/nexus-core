import { Setting } from "../../Setting";
import { ChangeEvent, InputElement, SettingBox } from "../../SettingBox";
/**
 *  Setting UI to handle selection input. The user will be presented with multiple options,
 *
 *  @author aarontburn
 */
export declare class RadioSettingBox extends SettingBox<string> {
    private readonly optionsIDMap;
    constructor(setting: Setting<string>);
    createLeft(): string;
    createRight(): string;
    private getInputOptions;
    getInputIdAndType(): InputElement[];
    onChange(newValue: any): ChangeEvent[];
    getStyle(): string;
}
