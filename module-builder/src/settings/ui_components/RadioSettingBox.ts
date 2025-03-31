import { Setting } from "../../Setting";
import { ChangeEvent, InputElement, SettingBox } from "../../SettingBox";
import { ChoiceSetting } from "../types/ChoiceSetting";


/**
 *  Setting UI to handle selection input. The user will be presented with multiple options,
 * 
 *  @author aarontburn
 */
export class RadioSettingBox extends SettingBox<string> {

    private readonly optionsIDMap: Map<string, string> = new Map();

    public constructor(setting: Setting<string>) {
        super(setting);

        const options: Set<string> = (this.getSetting() as ChoiceSetting).getOptionNames();
        let i: number = 0;
        options.forEach((option: string) => {
            this.optionsIDMap.set(option, this.getSetting().getID() + 'option_' + i);
            i++;
        });

    }


    public createLeft(): string {
        return `
            <div class="left-component" style="display: flex;"></div>
        `;
    }


    public createRight(): string {
        const html: string = `
            <div class="right-component">
                <div style="display: flex; flex-wrap: wrap">
                    <h1><span id='${this.resetID}'>↩</span> ${this.getSetting().getName()}</h1>
                    <p style="align-self: flex-end; padding-left: 24px;">${this.getSetting().getDescription()}</p>
                </div>

                <div style='display: flex; flex-wrap: wrap; align-items: center'>
                    ${this.getInputOptions()}
                </div>
            </div>
        `;
        return html;
    }

    private getInputOptions(): string {
        let s: string = '';
        const setting: ChoiceSetting = this.getSetting() as ChoiceSetting;

        this.optionsIDMap.forEach((id: string, optionName: string) => {
            s += `
                <input type="radio" id="${id}" name="${this.getSetting().getName()}" 
                    value="${optionName}" ${setting.getValue() === optionName ? 'checked' : ''}>

                <label class='radio-label' for="${id}">${optionName}</label>
                \n
            `
        });
        return s;
    }

    public getInputIdAndType(): InputElement[] {
        const inputElements: InputElement[] = [];
        this.optionsIDMap.forEach((id: string, optionName: string) => {
            inputElements.push({ id: id, inputType: 'radio', returnValue: optionName })
        });
        return inputElements;
    }


    public onChange(newValue: any): ChangeEvent[] {
        const changeEvents: ChangeEvent[] = [];
        this.optionsIDMap.forEach((id: string, optionName: string) => {
            changeEvents.push({ id: id, attribute: 'checked', value: newValue === optionName })
        });
        return changeEvents;
    }

    public getStyle(): string {
        return `
            .radio-label {
                margin-left: 10px;
                margin-right: 25px;
                font-size: 18px;
            }

            input[type='radio'] {
                margin: 0;
                padding: 0;
            }

            input[type='radio']:after {
                width: 15px;
                height: 15px;
                border-radius: 15px;
                top: -3px;
                left: -1px;
                position: relative;
                background-color: #6a6a6a;
                content: '';
                display: inline-block;
                visibility: visible;
                transition: 0.2s;
                cursor: pointer;
            }

            input[type='radio']:checked:after {
                background-color: var(--accent-color);
            }
        `
    }




}