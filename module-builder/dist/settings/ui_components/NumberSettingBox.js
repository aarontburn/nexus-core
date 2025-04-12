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
exports.NumberSettingBox = void 0;
var SettingBox_1 = require("../../SettingBox");
/**
 *  Number setting box.
 *
 *  @author aarontburn
 */
var NumberSettingBox = /** @class */ (function (_super) {
    __extends(NumberSettingBox, _super);
    function NumberSettingBox() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NumberSettingBox.prototype.createLeft = function () {
        var range = this.getSetting().getRange();
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
        return "\n            <div class=\"left-component\">\n                <input type=\"number\" style=\"width: 110px; text-align: center;\"\n                    id=\"".concat(this.getSetting().getID(), "\" value='").concat(this.getSetting().getValue(), "'>\n                ").concat(rangeText !== undefined
            ? "<p style='line-height: 21px;'>".concat(rangeText, "</p>")
            : '', "\n            </div>\n        ");
    };
    NumberSettingBox.prototype.getInputIdAndType = function () {
        return [{ id: this.getSetting().getID(), inputType: 'number' }];
    };
    NumberSettingBox.prototype.onChange = function (newValue) {
        return [{ id: this.getSetting().getID(), attribute: 'value', value: newValue }];
    };
    return NumberSettingBox;
}(SettingBox_1.SettingBox));
exports.NumberSettingBox = NumberSettingBox;
