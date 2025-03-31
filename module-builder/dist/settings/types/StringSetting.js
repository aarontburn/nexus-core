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
exports.StringSetting = void 0;
var Setting_1 = require("../../Setting");
var StringSettingBox_1 = require("../ui_components/StringSettingBox");
/**
 *  Setting to hold string input.
 *
 *  @author aarontburn
 */
var StringSetting = /** @class */ (function (_super) {
    __extends(StringSetting, _super);
    function StringSetting(module) {
        return _super.call(this, module) || this;
    }
    StringSetting.prototype.validateInput = function (input) {
        var s = JSON.stringify(input).replace(/"/g, '');
        return s === "" ? null : s;
    };
    StringSetting.prototype.setUIComponent = function () {
        return new StringSettingBox_1.StringSettingBox(this);
    };
    return StringSetting;
}(Setting_1.Setting));
exports.StringSetting = StringSetting;
