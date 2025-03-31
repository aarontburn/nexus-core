import { Setting } from "./Setting";



export interface InputElement {
    id: string,
    inputType: string,
    returnValue?: any;
}

export interface ChangeEvent {
    id: string,
    attribute: string,
    value: any
}


/**
 * This parent class encapsulates the visual component of each setting.
 * 
 * There are some nuances when creating a new SettingBox.
 * 
 * 1. The Reset-To-Default Button
 *      If your setting supports a reset-to-default, embed the following html somewhere in your code.
 *          <span id='${SettingBox.RESET_ID + "_" + this.setting.getId()}'>↩</span>
 *      When passed to the renderer, the element with an ID of '"reset-button_" + this.setting.getId()' will
 *          be assigned a click handler to reset the setting to its specified default value.
 * 
 * 2. @see getInputIdAndType():
 *      When creating your SettingBox, you may use multiple types of interactive inputs. To differentiate between then,
 *          you will need to create IDs for each input element.
 * 
 *      Many <input> types have different attributes to modify (e.g. type='text' uses 'value', while type='checkbox' uses 'checked')
 * 
 *      @see InputElement
 *      This function needs to return an array of InputElement objects.
 *          @param id: The ID of the input element.
 *          @param inputType: The input type of the input element (e.g. 'text', 'checkbox', 'number', etc.)
 *          @param returnValue: An optional parameter to indicate a fixed return value. If the setting is
 *              modified, this value will be sent back to the process.
 * 
 *      Use 'this.getSetting().getId() + <IDENTIFIER>' to ensure unique identifiers. 
 * 
 * 3. @see onChange(newValue):
 *      When the setting is modified from the process, it will pass the new value
 *          through the {@link onChange} function. This function is to correctly map
 *          what should change in the renderer.
 * 
 *      For example, the ColorSettingBox has two input elements: a text input, and
 *          a color selector. When the color is modified in the process, it needs to 
 *          modify both the color selector and the text input to reflect this change.
 * 
 *      @see ChangeEvent
 *      This function needs to return an array of ChangeEvent objects.
 *          @param id: The ID of the input element.
 *          @param attribute: The attribute to modify.
 *          @param value: The value to set the attribute to.
 * 
 */

export abstract class SettingBox<T> {

    protected readonly resetID: string;

    public readonly setting: Setting<T>;

    public constructor(setting: Setting<T>) {
        this.setting = setting;
        this.resetID = 'reset-button_' + this.setting.getID()
    }

    public getUI(): string {
        return `
            <div class="setting">
                ${this.createLeft()}
                <div class="spacer"></div>
                ${this.createRight()}
            </div>
        `;
    }


    /**
     * Creates the left element. 
     * 
     * @returns 
     */
    public createLeft(): string {
        return `
            <div class="left-component" style="display: inline-block;">
                <input id="${this.setting.getID()}" type="text" value='${this.setting.getValue()}'>
            </div>
        `;
    }

    /**
     * 
     * @returns 
     */
    public createRight(): string {
        return `
            <div class="right-component" style="display: inline-block;">
                <h1><span id='${this.resetID}'>↩</span> ${this.setting.getName()}</h1>
                <p>${this.setting.getDescription()}</p>
            </div>
        `;

    }

    /**
     * Get the parent setting.
     * @returns The setting
     */
    public getSetting(): Setting<T> {
        return this.setting;
    }

    /**
     * For all elements that can be interacted with, you must assign an ID, input type, and attribute to modify.
     *      - For example, a text input field would have an input type of "text" and attribute of "value".
     * 
     * @returns An array of interactable elements
     */
    public getInputIdAndType(): InputElement[] {
        return [
            { id: this.setting.getID(), inputType: "text" }
        ];
    }

    /**
     * When the parent setting is modified, this function is called. 
     * Specify the ID of the element(s) to change, the attribute to modify, and the value.
     * 
     * @param newValue The new value of the setting
     * @returns An array of modified elements.
     */
    public onChange(newValue: any): ChangeEvent[] {
        return [
            { id: this.setting.getID(), attribute: 'value', value: newValue }
        ]
    }

    /**
     * Overridable method to add custom CSS to a setting component.
     * 
     * @returns A valid CSS style string.
     */
    public getStyle(): string {
        return '';
    }








}