import { Setting } from "../../Setting";
import { ChangeEvent, InputElement, SettingBox } from "../../SettingBox";


/**
 *  Boolean setting box. Will render as a toggle switch. 
 * 
 *  @author aarontburn
 */
export class BooleanSettingBox extends SettingBox<boolean> {
    private readonly parentSetting: Setting<boolean> = this.getSetting();

    public createLeft(): string {
        return `
            <div class="left-component">
                <label class="switch">
                    <input type="checkbox" id="${this.parentSetting.getID()}" ${this.parentSetting.getValue() ? 'checked' : ''}>
                    <span class="slider round"></span>
                </label>   
            </div> 
        `;
    }

    public getInputIdAndType(): InputElement[] {
        return [{ id: this.parentSetting.getID(), inputType: "checkbox" }];
    }

    public onChange(newValue: any): ChangeEvent[] {
        return [{id: this.parentSetting.getID(), attribute: 'checked', value: newValue}]
    }

    public getStyle(): string {
        return `
            /* The switch - the box around the slider */
            .switch {
                position: relative;
                display: inline-block;
                width: 60px;
                height: 34px;
            }
            
            /* Hide default HTML checkbox */
            .switch input {
                opacity: 0;
                width: 0;
                height: 0;
            }
            
            /* The slider */
            .slider {
                position: absolute;
                cursor: pointer;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: #7f7f7f;
                -webkit-transition: .3s;
                transition: .3s;
            }
            
            .slider:before {
                position: absolute;
                content: "";
                height: 26px;
                width: 26px;
                left: 4px;
                bottom: 4px;
                background-color: white;
                -webkit-transition: .4s;
                transition: .4s;
            }
            
            input:checked + .slider {
                background-color: var(--accent-color);
            }
            
            input:focus + .slider {
                box-shadow: 0 0 1px var(--accent-color);
            }
            
            input:checked + .slider:before {
                -webkit-transform: translateX(26px);
                -ms-transform: translateX(26px);
                transform: translateX(26px);
            }
            
            /* Rounded sliders */
            .slider.round {
                border-radius: 34px;
            }
            
            .slider.round:before {
                border-radius: 50%;
            }
        
        `
    }







}