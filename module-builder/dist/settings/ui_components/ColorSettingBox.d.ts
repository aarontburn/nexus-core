import { ChangeEvent, InputElement } from "../../SettingBox";
import { StringSettingBox } from "./StringSettingBox";
/**
 *  Color setting box. The user can use a color picker or paste in
 *      a color of their choosing, in hexadecimal.
 *
 *  @author aarontburn
 */
export declare class ColorSettingBox extends StringSettingBox {
    createLeft(): string;
    getInputIdAndType(): InputElement[];
    onChange(newValue: any): ChangeEvent[];
}
