import { ChangeEvent, InputElement, SettingBox } from "../../SettingBox";

export class FileUploadSettingBox extends SettingBox<string> {

    public createLeft(): string {
        return `
            <div class="left-component Nexus-File-Setting-Box" style="display: flex;">
                <input type="file" id="${this.getSetting().getID()}">
                <label for="${this.getSetting().getID()}" >
                    Choose File
                </label>   
            </div>
        `;
    }

    public createRight(): string {
        return `
            <div class="right-component Nexus-File-Setting-Box">
                <div style="display: flex; flex-wrap: wrap">
                    <h1><span id='${this.resetID}'>↩</span> ${this.getSetting().getName()}</h1>
                    <p style="align-self: flex-end; padding-left: 24px; margin: 0;">${this.getSetting().getDescription()}</p>
                </div>

                <p id="${this.getSetting().getID()}-value">${this.getSetting().getValue()}</p>
            </div>
        `;
    }

    public getStyle(): string {
        return `
            .Nexus-File-Setting-Box {
                input {
                    display: none;
                }

                label {
                    font-size: 18px;
                    padding: 10px 5px;
                    display: block;
                    width: fit-content;
                    border: 1px solid var(--text-color);
                    border-radius: 5px;
                    margin-top: 10px;
                    transition: 0.25s;
                    cursor: pointer;

                    &:hover {
                        border-color: var(--accent-color);
                    }
                }
            }
        `

    }

    public getInputIdAndType(): InputElement[] {
        return [{ id: this.getSetting().getID(), inputType: 'file' }];
    }

    public onChange(newValue: any): ChangeEvent[] {
        return [
            { id: `${this.getSetting().getID()}-value`, attribute: 'textContent', value: newValue },

        ];
    }







}