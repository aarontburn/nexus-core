import { Setting } from "../../Setting";
import { InputElement, SettingBox } from "../../SettingBox";
import { ChoiceSetting } from "../types/ChoiceSetting";


/**
 *  Alternative SettingBox to the radio buttons to hold choice input.
 * 
 *  @author aarontburn 
 */
export class DropdownSettingBox extends SettingBox<string> {

    public constructor(setting: Setting<string>) {
        super(setting)
    }


    public createLeft(): string {
        return `
            <div class="left-component" style="display: flex;"></div>
        `;
    }

    public createRight(): string {
        const html: string = `
            <div class="right-component Nexus-Dropdown-Setting-Box">
                <div style="display: flex; flex-wrap: wrap">
                    <h1><span id='${this.resetID}'>↩</span> ${this.getSetting().getName()}</h1>
                    <p style="align-self: flex-end; padding-left: 24px;">${this.getSetting().getDescription()}</p>
                </div>

                <div class='select-container'>
                    <select id=${this.getSetting().getID()}>
                        ${this.getInputOptions()}
                    </select>
                </div>


            </div>
        `;
        return html;
    }

    private getInputOptions(): string {
        let s: string = '';
        const setting: ChoiceSetting = this.getSetting() as ChoiceSetting;

        setting.getOptionNames().forEach((optionName: string) => {
            s += `
                <option value=${optionName} ${setting.getValue() === optionName ? 'selected' : ''}>${optionName}</option>
                \n
            `
        });
        return s;
    }


    public getInputIdAndType(): InputElement[] {
        return [{ id: this.getSetting().getID(), inputType: "select" }];
    }

    public getStyle(): string {
        return `
            .Nexus-Dropdown-Setting-Box {
                .select-container {
                    position: relative;
                    display: flex;
                    max-width: 500px;
                    width: calc(100% - 5px);
                    height: 2.5em;
                    border-radius: 5px;
                    overflow: hidden;
                    margin-top: 5px;
                    background-color: var(--background-color);
                    border: 1px solid var(--text-color);
                    outline: none;


                    &::after {
                        content: '\\25BC';
                        position: absolute;
                        
                        right: 0;
                        padding: 0.5em;
                        transition: .25s all ease;
                        pointer-events: none;
                    }

                    &:hover::after {
                        color: var(--accent-color);
                    }
                }

                select {
                    appearance: none;
                    box-shadow: none;
                    border: none;
                    outline: none;

                    flex: 1;
                    padding: 0 1em;
                    color: var(--text-color);
                    background-color: var(--background-color);
                    cursor: pointer;
                    font-size: 18px;
                }


                select option {
                    color: var(--text-color);
                }

            }
        `;
    }

}