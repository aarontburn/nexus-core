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
exports.RadioSettingBox = void 0;
var SettingBox_1 = require("../../SettingBox");
/**
 *  Setting UI to handle selection input. The user will be presented with multiple options,
 *
 *  @author aarontburn
 */
var RadioSettingBox = /** @class */ (function (_super) {
    __extends(RadioSettingBox, _super);
    function RadioSettingBox(setting) {
        var _this = _super.call(this, setting) || this;
        _this.optionsIDMap = new Map();
        var options = _this.getSetting().getOptionNames();
        var i = 0;
        options.forEach(function (option) {
            _this.optionsIDMap.set(option, _this.getSetting().getID() + 'option_' + i);
            i++;
        });
        return _this;
    }
    RadioSettingBox.prototype.createLeft = function () {
        return "\n            <div class=\"left-component\" style=\"display: flex;\"></div>\n        ";
    };
    RadioSettingBox.prototype.createRight = function () {
        var html = "\n            <div class=\"right-component\">\n                <div style=\"display: flex; flex-wrap: wrap\">\n                    <h1><span id='".concat(this.resetID, "'>\u21A9</span> ").concat(this.getSetting().getName(), "</h1>\n                    <p style=\"align-self: flex-end; padding-left: 24px;\">").concat(this.getSetting().getDescription(), "</p>\n                </div>\n\n                <div style='display: flex; flex-wrap: wrap; align-items: center'>\n                    ").concat(this.getInputOptions(), "\n                </div>\n            </div>\n        ");
        return html;
    };
    RadioSettingBox.prototype.getInputOptions = function () {
        var _this = this;
        var s = '';
        var setting = this.getSetting();
        this.optionsIDMap.forEach(function (id, optionName) {
            s += "\n                <input type=\"radio\" id=\"".concat(id, "\" name=\"").concat(_this.getSetting().getName(), "\" \n                    value=\"").concat(optionName, "\" ").concat(setting.getValue() === optionName ? 'checked' : '', ">\n\n                <label class='radio-label' for=\"").concat(id, "\">").concat(optionName, "</label>\n                \n\n            ");
        });
        return s;
    };
    RadioSettingBox.prototype.getInputIdAndType = function () {
        var inputElements = [];
        this.optionsIDMap.forEach(function (id, optionName) {
            inputElements.push({ id: id, inputType: 'radio', returnValue: optionName });
        });
        return inputElements;
    };
    RadioSettingBox.prototype.onChange = function (newValue) {
        var changeEvents = [];
        this.optionsIDMap.forEach(function (id, optionName) {
            changeEvents.push({ id: id, attribute: 'checked', value: newValue === optionName });
        });
        return changeEvents;
    };
    RadioSettingBox.prototype.getStyle = function () {
        return "\n            .radio-label {\n                margin-left: 10px;\n                margin-right: 25px;\n                font-size: 18px;\n            }\n\n            input[type='radio'] {\n                margin: 0;\n                padding: 0;\n            }\n\n            input[type='radio']:after {\n                width: 15px;\n                height: 15px;\n                border-radius: 15px;\n                top: -3px;\n                left: -1px;\n                position: relative;\n                background-color: #6a6a6a;\n                content: '';\n                display: inline-block;\n                visibility: visible;\n                transition: 0.2s;\n                cursor: pointer;\n            }\n\n            input[type='radio']:checked:after {\n                background-color: var(--accent-color);\n            }\n        ";
    };
    return RadioSettingBox;
}(SettingBox_1.SettingBox));
exports.RadioSettingBox = RadioSettingBox;
