import { SettingBox } from "../../SettingBox";
import { Setting } from "../../Setting";
import { Process } from "../../Process";
/**
 *  Setting to receive color input.
 *
 *  @author aarontburn
 */
export declare class HexColorSetting extends Setting<string> {
    constructor(module: Process);
    validateInput(input: any): string | null;
    setUIComponent(): SettingBox<string>;
}
