import { Setting } from "../../Setting";
import { Process } from "../../Process";
import { SettingBox } from "../../SettingBox";
/**
 *  Setting to receive boolean input. Will render in the form of a toggle switch
 *      instead of a checkbox.
 *
 *  @author aarontburn
 */
export declare class BooleanSetting extends Setting<boolean> {
    constructor(module: Process);
    validateInput(input: any): boolean | null;
    setUIComponent(): SettingBox<boolean>;
}
