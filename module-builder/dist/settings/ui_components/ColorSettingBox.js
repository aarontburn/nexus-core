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
exports.ColorSettingBox = void 0;
var StringSettingBox_1 = require("./StringSettingBox");
/**
 *  Color setting box. The user can use a color picker or paste in
 *      a color of their choosing, in hexadecimal.
 *
 *  @author aarontburn
 */
var ColorSettingBox = /** @class */ (function (_super) {
    __extends(ColorSettingBox, _super);
    function ColorSettingBox() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ColorSettingBox.prototype.createLeft = function () {
        return "\n            <div class=\"left-component\">\n                <input id='".concat(this.getSetting().getID() + "_color-picker", "' style='width: 115px; height: 48px' type=\"color\" value=\"").concat(_super.prototype.getSetting.call(this).getValue(), "\" />\n            </div>\n        ");
    };
    ColorSettingBox.prototype.getInputIdAndType = function () {
        return [
            { id: this.getSetting().getID(), inputType: 'text' },
            { id: this.getSetting().getID() + "_color-picker", inputType: 'color' }
        ];
    };
    ColorSettingBox.prototype.onChange = function (newValue) {
        return [
            { id: this.getSetting().getID(), attribute: 'value', value: newValue },
            { id: this.getSetting().getID() + "_color-picker", attribute: 'value', value: newValue }
        ];
    };
    return ColorSettingBox;
}(StringSettingBox_1.StringSettingBox));
exports.ColorSettingBox = ColorSettingBox;
