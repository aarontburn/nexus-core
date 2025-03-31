import { ChangeEvent, InputElement, SettingBox } from "../../SettingBox";

export class StringSettingBox extends SettingBox<string> {

    public createLeft(): string {
        return `
            <div class="left-component" style="display: flex;"></div>
        `;
    }

    public createRight(): string {
        return `
            <div class="right-component">
                <div style="display: flex; flex-wrap: wrap">
                    <h1><span id='${this.resetID}'>↩</span> ${this.getSetting().getName()}</h1>
                    <p style="align-self: flex-end; padding-left: 24px;">${this.getSetting().getDescription()}</p>
                </div>

                <input type="text" style="width: 500px; box-sizing: border-box; padding-left: 15px; margin-top: 5px;" 
                    value="${this.getSetting().getValue()}" id="${this.getSetting().getID()}">
            </div>
        `;
    }

    public getInputIdAndType(): InputElement[] {
        return [{ id: this.getSetting().getID(), inputType: 'text' }];
    }

    public onChange(newValue: any): ChangeEvent[] {
        return [{ id: this.getSetting().getID(), attribute: 'value', value: newValue }];
    }




}