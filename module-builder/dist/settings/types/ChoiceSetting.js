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
exports.ChoiceSetting = void 0;
var Setting_1 = require("../../Setting");
var DropdownSettingBox_1 = require("../ui_components/DropdownSettingBox");
var RadioSettingBox_1 = require("../ui_components/RadioSettingBox");
/**
 *  A setting that allows the user to selected from preset options.
 *      Only one option is able to be selected.
 *
 *  @author aarontburn
 */
var ChoiceSetting = /** @class */ (function (_super) {
    __extends(ChoiceSetting, _super);
    /**
     *  @param module The parent module.
     */
    function ChoiceSetting(module) {
        var _this = _super.call(this, module, true) || this;
        /**
         *  The stored options. Does not allow duplicate options.
         */
        _this.options = new Set();
        /**
         *  @see useDropdown()
         *
         *  If this is true, the UI will be a dropdown selector
         *      instead of radio buttons.
         */
        _this.dropdown = false;
        return _this;
    }
    /**
     *  @see dropdown
     *  If this function is called, the UI will be replaced with
     *      a dropdown selector instead of radio buttons.
     *
     *  @returns itself.
     */
    ChoiceSetting.prototype.useDropdown = function () {
        this.dropdown = true;
        this.reInitUI();
        return this;
    };
    /**
     *  Adds a single option.
     *
     *  To add multiple at once, @see addOptions
     *
     *  @example addOption("Apple");
     *  @param option The name of the option to add.
     *  @returns itself.
     */
    ChoiceSetting.prototype.addOption = function (option) {
        return this.addOptions(option);
    };
    /**
     *  Add option(s).
     *
     *  @example addOptions("Apple", "Orange", "Banana");
     *  @param options The option(s) to add.
     *  @returns itself.
     */
    ChoiceSetting.prototype.addOptions = function () {
        var options = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            options[_i] = arguments[_i];
        }
        for (var _a = 0, options_1 = options; _a < options_1.length; _a++) {
            var option = options_1[_a];
            this.options.add(option);
        }
        this.reInitUI();
        return this;
    };
    /**
     *  @returns a copy of all options.
     */
    ChoiceSetting.prototype.getOptionNames = function () {
        return new Set(this.options.keys());
    };
    ChoiceSetting.prototype.validateInput = function (input) {
        var s = JSON.stringify(input).replace(/"/g, '');
        if (!this.options.has(s)) {
            return null;
        }
        return s;
    };
    ChoiceSetting.prototype.setUIComponent = function () {
        if (this.dropdown) {
            return new DropdownSettingBox_1.DropdownSettingBox(this);
        }
        return new RadioSettingBox_1.RadioSettingBox(this);
    };
    return ChoiceSetting;
}(Setting_1.Setting));
exports.ChoiceSetting = ChoiceSetting;
