import { Setting } from "../../Setting";
import { Process } from "../../Process";
import { SettingBox } from "../../SettingBox";
import { NumberSettingBox } from "../ui_components/NumberSettingBox";
import { RangeSettingBox } from "../ui_components/RangeSettingBox";
import { IncrementableNumberSettingBox } from "../ui_components/IncrementableNumberSettingBox";

/**
 *  Setting to receive number input.
 * 
 *  Without specifying a min and max, the user may enter any number they want.
 * 
 *  @author aarontburn
 */
export class NumberSetting extends Setting<number> {

    /**
     *  The minimum possible value. By default, it is unrestrained.
     */
    private min: number | undefined = undefined;

    /**
     *  The maximum possible value. By default, it is unrestrained.
     */
    private max: number | undefined = undefined;

    private step: number = 1;

    private useSlider: boolean = false;

    private withoutIncrement: boolean = false;


    public constructor(module: Process, defer: boolean = false) {
        super(module, defer);
    }

    public useRangeSliderUI(): NumberSetting {
        this.withoutIncrement = false;
        this.useSlider = true;

        if (this.min === undefined) {
            this.setMin(0);
        }

        if (this.max === undefined) {
            this.setMax(100);
        }

 
        this.reInitUI();
        return this;
    }

    public useNonIncrementableUI(): NumberSetting {
        this.useSlider = false;
        this.withoutIncrement = true;
        this.reInitUI();
        return this;
    }


    /**
     *  Sets a minimum value. If the user inputs a number less than
     *      the specified minimum, it will default to the minimum. 
     * 
     *  @param min The lowest possible value for this setting.
     *  @returns itself.
     */
    public setMin(min: number): NumberSetting {
        if (this.max !== undefined && min > this.max) {
            throw new Error(`Attempted to set a greater min than max. Min: ${min} | Max: ${this.max}`);
        }

        this.min = min;
        return this;
    }

    /**
     *  Sets a maximum value. If the user inputs a number greater than the
     *      specified maximum, it will default to the maximum.
     *  
     *  @param max The maximum possible value.
     *  @returns itself.
     */
    public setMax(max: number): NumberSetting {
        if (this.min !== undefined && max < this.min) {
            throw new Error(`Attempted to set a lower max than min. Min: ${this.min} | Max: ${max}`);
        }

        this.max = max;
        return this;
    }

    /**
     *  Sets the minimum and maximum possible values. If the
     *      user enters a number outside of the bounds, it will
     *      default to the minimum or the maximum, depending
     *      on which bound was exceeded. 
     * 
     *  @param min The minimum possible value.
     *  @param max The maximum possible value.
     *  @returns itself.
     */
    public setRange(min: number, max: number): NumberSetting {
        if (min > max) {
            throw new Error(`Attempted to set a greater min than max. Min: ${min} | Max: ${max}`);
        }

        this.min = min;
        this.max = max;
        return this;
    }

    public setStep(step: number): NumberSetting {
        this.step = step;
        return this;
    }

    public getStep(): number {
        return this.step;
    }




    /**
     *  Returns the range. If both the minimum and maximum are
     *      undefined, it will return undefined. Otherwise,
     *      it will return an object, where the minimum and maximum could
     *      either be a number or undefined.
     * 
     *  @returns An object with the specified minimum and maximum.
     */
    public getRange(): { min: number | undefined, max: number | undefined } | undefined{
        if (this.min === undefined && this.max === undefined) {
            return undefined;
        }
        return { min: this.min, max: this.max };
    }


    public validateInput(input: any): number | null {
        let value: number;

        if (input === 'increase') {
            value = (this.getValue() as number) + this.step
        } else if (input === 'decrease') {
            value = (this.getValue() as number) - this.step;
        } else if (typeof input === 'number') {
            value = Number(input);
        } else {
            try {
                const parsedValue: number = parseFloat(JSON.stringify(input).replace(/"/g, ''));
                if (!isNaN(parsedValue)) {
                    value = Number(parsedValue)
                } else {
                    return null;
                }
            } catch (err) {
                return null;
            }
        }




        const roundedValue = (value: number) => Number(value.toFixed(1));

        if (this.min === undefined && this.max === undefined) {
            return roundedValue(value);
        }

        if (this.min !== undefined) {
            value = Math.max(this.min, value);
        }

        if (this.max !== undefined) {
            value = Math.min(this.max, value);
        }

        return roundedValue(value);

    }


    public setUIComponent(): SettingBox<number> {
        if (this.useSlider) {
            return new RangeSettingBox(this);
        } else if (this.withoutIncrement) {
            return new NumberSettingBox(this);
        }
        return new IncrementableNumberSettingBox(this);
    }
}