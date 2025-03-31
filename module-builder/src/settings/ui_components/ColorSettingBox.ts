import { ChangeEvent, InputElement } from "../../SettingBox";
import { StringSettingBox } from "./StringSettingBox";



/**
 *  Color setting box. The user can use a color picker or paste in
 *      a color of their choosing, in hexadecimal.
 *  
 *  @author aarontburn
 */
export class ColorSettingBox extends StringSettingBox {

    public createLeft(): string {
        return `
            <div class="left-component">
                <input id='${this.getSetting().getID() + "_color-picker"}' style='width: 115px; height: 48px' type="color" value="${super.getSetting().getValue()}" />
            </div>
        `;
    }

    public getInputIdAndType(): InputElement[] {
        return [
            { id: this.getSetting().getID(), inputType: 'text' },
            { id: this.getSetting().getID() + "_color-picker", inputType: 'color' }
        ];
    }
    public onChange(newValue: any): ChangeEvent[] {
        return [
            { id: this.getSetting().getID(), attribute: 'value', value: newValue },
            { id: this.getSetting().getID() + "_color-picker", attribute: 'value', value: newValue }
        ];
    }

}
