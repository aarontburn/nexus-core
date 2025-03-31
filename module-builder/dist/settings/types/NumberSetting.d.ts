import { Setting } from "../../Setting";
import { Process } from "../../Process";
import { SettingBox } from "../../SettingBox";
/**
 *  Setting to receive number input.
 *
 *  Without specifying a min and max, the user may enter any number they want.
 *
 *  @author aarontburn
 */
export declare class NumberSetting extends Setting<number> {
    /**
     *  The minimum possible value. By default, it is unrestrained.
     */
    private min;
    /**
     *  The maximum possible value. By default, it is unrestrained.
     */
    private max;
    private step;
    private useSlider;
    private withoutIncrement;
    constructor(module: Process, defer?: boolean);
    useRangeSliderUI(): NumberSetting;
    useNonIncrementableUI(): NumberSetting;
    /**
     *  Sets a minimum value. If the user inputs a number less than
     *      the specified minimum, it will default to the minimum.
     *
     *  @param min The lowest possible value for this setting.
     *  @returns itself.
     */
    setMin(min: number): NumberSetting;
    /**
     *  Sets a maximum value. If the user inputs a number greater than the
     *      specified maximum, it will default to the maximum.
     *
     *  @param max The maximum possible value.
     *  @returns itself.
     */
    setMax(max: number): NumberSetting;
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
    setRange(min: number, max: number): NumberSetting;
    setStep(step: number): NumberSetting;
    getStep(): number;
    /**
     *  Returns the range. If both the minimum and maximum are
     *      undefined, it will return undefined. Otherwise,
     *      it will return an object, where the minimum and maximum could
     *      either be a number or undefined.
     *
     *  @returns An object with the specified minimum and maximum.
     */
    getRange(): {
        min: number | undefined;
        max: number | undefined;
    } | undefined;
    validateInput(input: any): number | null;
    setUIComponent(): SettingBox<number>;
}
