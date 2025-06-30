import { SettingBox } from "../../SettingBox";
import { Setting } from "../../Setting";
import { Process } from "../../Process";
import { FileUploadSettingBox } from "../ui_components";
import { normalize } from "path";

/**
 *  Setting to receive color input.
 * 
 *  @author aarontburn
 */
export class FileUploadSetting extends Setting<string> {


    public constructor(module: Process) {
        super(module);
    }

    public async validateInput(input: any): Promise<string> {
        return normalize(typeof input === 'string' ? input : input[0]);
    }

    public setUIComponent(): SettingBox<string> {
        return new FileUploadSettingBox(this);
    }


}