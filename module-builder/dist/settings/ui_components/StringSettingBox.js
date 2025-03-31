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
exports.StringSettingBox = void 0;
var SettingBox_1 = require("../../SettingBox");
var StringSettingBox = /** @class */ (function (_super) {
    __extends(StringSettingBox, _super);
    function StringSettingBox() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    StringSettingBox.prototype.createLeft = function () {
        return "\n            <div class=\"left-component\" style=\"display: flex;\"></div>\n        ";
    };
    StringSettingBox.prototype.createRight = function () {
        return "\n            <div class=\"right-component\">\n                <div style=\"display: flex; flex-wrap: wrap\">\n                    <h1><span id='".concat(this.resetID, "'>\u21A9</span> ").concat(this.getSetting().getName(), "</h1>\n                    <p style=\"align-self: flex-end; padding-left: 24px;\">").concat(this.getSetting().getDescription(), "</p>\n                </div>\n\n                <input type=\"text\" style=\"width: 500px; box-sizing: border-box; padding-left: 15px; margin-top: 5px;\" \n                    value=\"").concat(this.getSetting().getValue(), "\" id=\"").concat(this.getSetting().getID(), "\">\n            </div>\n        ");
    };
    StringSettingBox.prototype.getInputIdAndType = function () {
        return [{ id: this.getSetting().getID(), inputType: 'text' }];
    };
    StringSettingBox.prototype.onChange = function (newValue) {
        return [{ id: this.getSetting().getID(), attribute: 'value', value: newValue }];
    };
    return StringSettingBox;
}(SettingBox_1.SettingBox));
exports.StringSettingBox = StringSettingBox;
