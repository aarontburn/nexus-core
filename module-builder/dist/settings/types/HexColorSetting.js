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
exports.HexColorSetting = void 0;
var Setting_1 = require("../../Setting");
var ColorSettingBox_1 = require("../ui_components/ColorSettingBox");
/**
 *  Setting to receive color input.
 *
 *  @author aarontburn
 */
var HexColorSetting = /** @class */ (function (_super) {
    __extends(HexColorSetting, _super);
    function HexColorSetting(module) {
        return _super.call(this, module) || this;
    }
    HexColorSetting.prototype.validateInput = function (input) {
        if (input === null) {
            return null;
        }
        var s = JSON.stringify(input).replace(/"/g, '').toUpperCase();
        return s.match("^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$") ? s : null;
    };
    HexColorSetting.prototype.setUIComponent = function () {
        return new ColorSettingBox_1.ColorSettingBox(this);
    };
    return HexColorSetting;
}(Setting_1.Setting));
exports.HexColorSetting = HexColorSetting;
