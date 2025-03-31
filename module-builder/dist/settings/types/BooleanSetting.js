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
exports.BooleanSetting = void 0;
var Setting_1 = require("../../Setting");
var BooleanSettingBox_1 = require("../ui_components/BooleanSettingBox");
/**
 *  Setting to receive boolean input. Will render in the form of a toggle switch
 *      instead of a checkbox.
 *
 *  @author aarontburn
 */
var BooleanSetting = /** @class */ (function (_super) {
    __extends(BooleanSetting, _super);
    function BooleanSetting(module) {
        return _super.call(this, module) || this;
    }
    BooleanSetting.prototype.validateInput = function (input) {
        if (input === null) {
            return null;
        }
        if (typeof input === "boolean") {
            return input;
        }
        var s = JSON.stringify(input).replace(/"/g, '');
        if (s === "true") {
            return true;
        }
        else if (s === "false") {
            return false;
        }
        return null;
    };
    BooleanSetting.prototype.setUIComponent = function () {
        return new BooleanSettingBox_1.BooleanSettingBox(this);
    };
    return BooleanSetting;
}(Setting_1.Setting));
exports.BooleanSetting = BooleanSetting;
