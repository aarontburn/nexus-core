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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RangeSettingBox = void 0;
var NumberSettingBox_1 = require("./NumberSettingBox");
/**
 *  Range setting UI. Will render as a slider.
 *
 *  @author aarontburn
 */
var RangeSettingBox = /** @class */ (function (_super) {
    __extends(RangeSettingBox, _super);
    function RangeSettingBox(setting) {
        return _super.call(this, setting) || this;
    }
    RangeSettingBox.prototype.createRight = function () {
        var setting = this.getSetting();
        var range = setting.getRange();
        var step = setting.getStep();
        return "\n            <div class=\"right-component\">\n                <div style=\"display: flex; flex-wrap: wrap\">\n                    <h1><span id='".concat(this.resetID, "'>\u21A9</span> ").concat(setting.getName(), "</h1>\n                    <p style=\"align-self: flex-end; padding-left: 24px;\">").concat(setting.getDescription(), "</p>\n                </div>\n\n                <input type=\"range\" \n                    style='width: 500px;'\n                    min=\"").concat(range.min, "\" max=\"").concat(range.max, "\" step='").concat(step, "' \n                    id=\"").concat(setting.getID(), "_slider\" value='").concat(setting.getValue(), "'>\n            </div>\n        ");
    };
    RangeSettingBox.prototype.getInputIdAndType = function () {
        return [
            { id: this.getSetting().getID(), inputType: 'number' },
            { id: this.getSetting().getID() + "_slider", inputType: "range" }
        ];
    };
    RangeSettingBox.prototype.onChange = function (newValue) {
        return [
            { id: this.getSetting().getID(), attribute: 'value', value: newValue },
            { id: this.getSetting().getID() + "_slider", attribute: 'value', value: newValue }
        ];
    };
    return RangeSettingBox;
}(NumberSettingBox_1.NumberSettingBox));
exports.RangeSettingBox = RangeSettingBox;
