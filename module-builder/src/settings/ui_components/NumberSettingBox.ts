import { ChangeEvent, InputElement, SettingBox } from "../../SettingBox";
import { NumberSetting } from "../types/NumberSetting";


/**
 *  Number setting box. 
 * 
 *  @author aarontburn
 */
export class NumberSettingBox extends SettingBox<number> {

    public createLeft(): string {
        const range: { min: number, max: number } = (this.getSetting() as NumberSetting).getRange();

        let rangeText: string;
        if (range !== undefined) {
            if (range.min === undefined && range.max !== undefined) {
                rangeText = '≤ ' + range.max
            } else if (range.min !== undefined && range.max === undefined) {
                rangeText = '≥ ' + range.min
            } else if (range.min !== undefined && range.max !== undefined) {
                rangeText = `${range.min} - ${range.max}`
            }
        }

        return `
            <div class="left-component">
                <input type="number" style="width: 110px; text-align: center;"
                    id="${this.getSetting().getID()}" value='${this.getSetting().getValue()}'>
                ${rangeText !== undefined
                ? `<p style='line-height: 21px;'>${rangeText}</p>`
                : ''
            }
            </div>
        `
    }

    public getInputIdAndType(): InputElement[] {
        return [{ id: this.getSetting().getID(), inputType: 'number' }];
    }

    public onChange(newValue: any): ChangeEvent[] {
        return [{ id: this.getSetting().getID(), attribute: 'value', value: newValue }];
    }





}