import { Setting } from "../../Setting";
import { ChangeEvent, InputElement } from "../../SettingBox";
import { NumberSetting } from "../types/NumberSetting";
import { NumberSettingBox } from "./NumberSettingBox";

/**
 *  Range setting UI. Will render as a slider.
 * 
 *  @author aarontburn 
 */
export class RangeSettingBox extends NumberSettingBox {

    public constructor(setting: Setting<number>) {
        super(setting);
    }

    public createRight(): string {
        const setting: NumberSetting = this.getSetting() as NumberSetting;
        const range: { min: number, max: number } = setting.getRange();
        const step: number = setting.getStep();

        return `
            <div class="right-component">
                <div style="display: flex; flex-wrap: wrap">
                    <h1><span id='${this.resetID}'>↩</span> ${setting.getName()}</h1>
                    <p style="align-self: flex-end; padding-left: 24px;">${setting.getDescription()}</p>
                </div>

                <input type="range" 
                    style='width: 500px;'
                    min="${range.min}" max="${range.max}" step='${step}' 
                    id="${setting.getID()}_slider" value='${setting.getValue()}'>
            </div>
        `;
    }

    public getInputIdAndType(): InputElement[] {
        return [
            { id: this.getSetting().getID(), inputType: 'number' },
            { id: this.getSetting().getID() + "_slider", inputType: "range" }
        ];
    }

    public onChange(newValue: any): ChangeEvent[] {
        return [
            { id: this.getSetting().getID(), attribute: 'value', value: newValue },
            { id: this.getSetting().getID() + "_slider", attribute: 'value', value: newValue }
        ];
    }

}