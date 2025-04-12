"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NumberSetting = void 0;
var Setting_1 = require("../../Setting");
var NumberSettingBox_1 = require("../ui_components/NumberSettingBox");
var RangeSettingBox_1 = require("../ui_components/RangeSettingBox");
var IncrementableNumberSettingBox_1 = require("../ui_components/IncrementableNumberSettingBox");
/**
 *  Setting to receive number input.
 *
 *  Without specifying a min and max, the user may enter any number they want.
 *
 *  @author aarontburn
 */
var NumberSetting = /** @class */ (function (_super) {
    __extends(NumberSetting, _super);
    function NumberSetting(module, defer) {
        if (defer === void 0) { defer = false; }
        var _this = _super.call(this, module, defer) || this;
        /**
         *  The minimum possible value. By default, it is unrestrained.
         */
        _this.min = undefined;
        /**
         *  The maximum possible value. By default, it is unrestrained.
         */
        _this.max = undefined;
        _this.step = 1;
        _this.useSlider = false;
        _this.withoutIncrement = false;
        return _this;
    }
    NumberSetting.prototype.useRangeSliderUI = function () {
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
    };
    NumberSetting.prototype.useNonIncrementableUI = function () {
        this.useSlider = false;
        this.withoutIncrement = true;
        this.reInitUI();
        return this;
    };
    /**
     *  Sets a minimum value. If the user inputs a number less than
     *      the specified minimum, it will default to the minimum.
     *
     *  @param min The lowest possible value for this setting.
     *  @returns itself.
     */
    NumberSetting.prototype.setMin = function (min) {
        if (this.max !== undefined && min > this.max) {
            throw new Error("Attempted to set a greater min than max. Min: ".concat(min, " | Max: ").concat(this.max));
        }
        this.min = min;
        return this;
    };
    /**
     *  Sets a maximum value. If the user inputs a number greater than the
     *      specified maximum, it will default to the maximum.
     *
     *  @param max The maximum possible value.
     *  @returns itself.
     */
    NumberSetting.prototype.setMax = function (max) {
        if (this.min !== undefined && max < this.min) {
            throw new Error("Attempted to set a lower max than min. Min: ".concat(this.min, " | Max: ").concat(max));
        }
        this.max = max;
        return this;
    };
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
    NumberSetting.prototype.setRange = function (min, max) {
        if (min > max) {
            throw new Error("Attempted to set a greater min than max. Min: ".concat(min, " | Max: ").concat(max));
        }
        this.min = min;
        this.max = max;
        return this;
    };
    NumberSetting.prototype.setStep = function (step) {
        this.step = step;
        return this;
    };
    NumberSetting.prototype.getStep = function () {
        return this.step;
    };
    /**
     *  Returns the range. If both the minimum and maximum are
     *      undefined, it will return undefined. Otherwise,
     *      it will return an object, where the minimum and maximum could
     *      either be a number or undefined.
     *
     *  @returns An object with the specified minimum and maximum.
     */
    NumberSetting.prototype.getRange = function () {
        if (this.min === undefined && this.max === undefined) {
            return undefined;
        }
        return { min: this.min, max: this.max };
    };
    NumberSetting.prototype.validateInput = function (input) {
        return __awaiter(this, void 0, void 0, function () {
            var value, parsedValue, roundedValue;
            return __generator(this, function (_a) {
                if (input === 'increase') {
                    value = this.getValue() + this.step;
                }
                else if (input === 'decrease') {
                    value = this.getValue() - this.step;
                }
                else if (typeof input === 'number') {
                    value = Number(input);
                }
                else {
                    try {
                        parsedValue = parseFloat(JSON.stringify(input).replace(/"/g, ''));
                        if (!isNaN(parsedValue)) {
                            value = Number(parsedValue);
                        }
                        else {
                            return [2 /*return*/, null];
                        }
                    }
                    catch (err) {
                        return [2 /*return*/, null];
                    }
                }
                roundedValue = function (value) { return Number(value.toFixed(1)); };
                if (this.min === undefined && this.max === undefined) {
                    return [2 /*return*/, roundedValue(value)];
                }
                if (this.min !== undefined) {
                    value = Math.max(this.min, value);
                }
                if (this.max !== undefined) {
                    value = Math.min(this.max, value);
                }
                return [2 /*return*/, roundedValue(value)];
            });
        });
    };
    NumberSetting.prototype.setUIComponent = function () {
        if (this.useSlider) {
            return new RangeSettingBox_1.RangeSettingBox(this);
        }
        else if (this.withoutIncrement) {
            return new NumberSettingBox_1.NumberSettingBox(this);
        }
        return new IncrementableNumberSettingBox_1.IncrementableNumberSettingBox(this);
    };
    return NumberSetting;
}(Setting_1.Setting));
exports.NumberSetting = NumberSetting;
