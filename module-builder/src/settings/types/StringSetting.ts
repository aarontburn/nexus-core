import { Setting } from "../../Setting";
import { Process } from "../../Process";
import { SettingBox } from "../../SettingBox";
import { StringSettingBox } from "../ui_components/StringSettingBox";

/**
 *  Setting to hold string input.
 * 
 *  @author aarontburn 
 */
export class StringSetting extends Setting<string> {

    public constructor(module: Process) {
        super(module);
    }


    public validateInput(input: any): string | null {
        const s: string = JSON.stringify(input).replace(/"/g, '')
        return s === "" ? null : s;
    }

    public setUIComponent(): SettingBox<string> {
        return new StringSettingBox(this);
    }


}
