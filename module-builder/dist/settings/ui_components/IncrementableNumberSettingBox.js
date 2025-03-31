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
exports.IncrementableNumberSettingBox = void 0;
var NumberSettingBox_1 = require("./NumberSettingBox");
/**
 *  Similar to NumberSettingBox, but has buttons to increment.
 *
 *  @author aarontburn
 */
var IncrementableNumberSettingBox = /** @class */ (function (_super) {
    __extends(IncrementableNumberSettingBox, _super);
    function IncrementableNumberSettingBox(setting) {
        return _super.call(this, setting) || this;
    }
    IncrementableNumberSettingBox.prototype.createLeft = function () {
        var setting = this.getSetting();
        var range = setting.getRange();
        var rangeText;
        if (range !== undefined) {
            if (range.min === undefined && range.max !== undefined) {
                rangeText = '≤ ' + range.max;
            }
            else if (range.min !== undefined && range.max === undefined) {
                rangeText = '≥ ' + range.min;
            }
            else if (range.min !== undefined && range.max !== undefined) {
                rangeText = "".concat(range.min, " - ").concat(range.max);
            }
        }
        return "\n            <div class=\"left-component\">\n                <div style='display: flex; align-items: center'>\n                    <p class='spinner' id='".concat(setting.getID() + "_decrease", "'>\u2013</p>\n\n                        <input type=\"number\" \n                            style=\"width: 70px; text-align: center; margin: 0px 5px;\"\n                            id=\"").concat(setting.getID(), "\" value='").concat(setting.getValue(), "'>\n\n                    <p class='spinner' id='").concat(setting.getID() + "_increase", "'>+</p>\n                </div>\n                ").concat(rangeText !== undefined
            ? "<p style='line-height: 21px; text-align: center'>".concat(rangeText, "</p>")
            : '', "\n            </div>\n        ");
    };
    IncrementableNumberSettingBox.prototype.getInputIdAndType = function () {
        return [
            { id: this.getSetting().getID(), inputType: 'number' },
            { id: this.getSetting().getID() + "_decrease", inputType: 'click', returnValue: 'decrease' },
            { id: this.getSetting().getID() + '_increase', inputType: 'click', returnValue: "increase" }
        ];
    };
    IncrementableNumberSettingBox.prototype.getStyle = function () {
        return "\n            .spinner.spinner {\n                font-size: 25px;\n                width: 0.7em;\n            }\n\n            .spinner:hover {\n                color: var(--accent-color);\n                transition: 0.2s; \n            }\n        ";
    };
    return IncrementableNumberSettingBox;
}(NumberSettingBox_1.NumberSettingBox));
exports.IncrementableNumberSettingBox = IncrementableNumberSettingBox;
