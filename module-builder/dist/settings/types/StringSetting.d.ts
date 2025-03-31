import { Setting } from "../../Setting";
import { Process } from "../../Process";
import { SettingBox } from "../../SettingBox";
/**
 *  Setting to hold string input.
 *
 *  @author aarontburn
 */
export declare class StringSetting extends Setting<string> {
    constructor(module: Process);
    validateInput(input: any): string | null;
    setUIComponent(): SettingBox<string>;
}
