import { Setting } from "../../Setting";
import { Process } from "../../Process";
import { SettingBox } from "../../SettingBox";
import { BooleanSettingBox } from "../ui_components/BooleanSettingBox";



/**
 *  Setting to receive boolean input. Will render in the form of a toggle switch
 *      instead of a checkbox. 
 * 
 *  @author aarontburn
 */
export class BooleanSetting extends Setting<boolean> {

    public constructor(module: Process) {
        super(module);
    }


    public validateInput(input: any): boolean | null {
        if (input === null) {
            return null;
        }

        if (typeof input === "boolean") {
            return input;
        }

        const s: string = JSON.stringify(input).replace(/"/g, '');

        if (s === "true") {
            return true;
        } else if (s === "false") {
            return false;
        }
        return null;

    }

    public setUIComponent(): SettingBox<boolean> {
        return new BooleanSettingBox(this);
    }

}