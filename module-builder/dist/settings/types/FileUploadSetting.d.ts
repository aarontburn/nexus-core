import { SettingBox } from "../../SettingBox";
import { Setting } from "../../Setting";
import { Process } from "../../Process";
/**
 *  Setting to receive color input.
 *
 *  @author aarontburn
 */
export declare class FileUploadSetting extends Setting<string> {
    constructor(module: Process);
    validateInput(input: any): Promise<string>;
    setUIComponent(): SettingBox<string>;
}
