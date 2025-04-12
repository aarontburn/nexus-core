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
exports.DropdownSettingBox = void 0;
var SettingBox_1 = require("../../SettingBox");
/**
 *  Alternative SettingBox to the radio buttons to hold choice input.
 *
 *  @author aarontburn
 */
var DropdownSettingBox = /** @class */ (function (_super) {
    __extends(DropdownSettingBox, _super);
    function DropdownSettingBox(setting) {
        return _super.call(this, setting) || this;
    }
    DropdownSettingBox.prototype.createLeft = function () {
        return "\n            <div class=\"left-component\" style=\"display: flex;\"></div>\n        ";
    };
    DropdownSettingBox.prototype.createRight = function () {
        var html = "\n            <div class=\"right-component\">\n                <div style=\"display: flex; flex-wrap: wrap\">\n                    <h1><span id='".concat(this.resetID, "'>\u21A9</span> ").concat(this.getSetting().getName(), "</h1>\n                    <p style=\"align-self: flex-end; padding-left: 24px;\">").concat(this.getSetting().getDescription(), "</p>\n                </div>\n\n                <div class='select'>\n                    <select id=").concat(this.getSetting().getID(), ">\n                        ").concat(this.getInputOptions(), "\n                    </select>\n                </div>\n\n\n            </div>\n        ");
        return html;
    };
    DropdownSettingBox.prototype.getInputOptions = function () {
        var s = '';
        var setting = this.getSetting();
        setting.getOptionNames().forEach(function (optionName) {
            s += "\n                <option value=".concat(optionName, " ").concat(setting.getValue() === optionName ? 'selected' : '', ">").concat(optionName, "</option>\n                \n\n            ");
        });
        return s;
    };
    DropdownSettingBox.prototype.getInputIdAndType = function () {
        return [{ id: this.getSetting().getID(), inputType: "select" }];
    };
    DropdownSettingBox.prototype.getStyle = function () {
        return "\n            select {\n                /* Reset Select */\n                appearance: none;\n                outline: 10px red;\n                border: 0;\n                box-shadow: none;\n\n                /* Personalize */\n                flex: 1;\n                padding: 0 1em;\n                color: var(--accent-color);\n                background-color: var(--off-black);\n                cursor: pointer;\n                font-size: 18px;\n            }\n\n            /* Custom Select wrapper */\n            .select {\n                position: relative;\n                display: flex;\n                width: 500px;\n                height: 2.5em;\n                border-radius: .25em;\n                overflow: hidden;\n                margin-top: 5px;\n                border: 1px solid var(--off-white);\n            }\n\n            select option {\n                color: var(--off-white);\n            }\n\n            /* Arrow */\n            .select::after {\n                content: '\\25BC';\n                position: absolute;\n                \n                right: 0;\n                padding: 0.5em;\n                transition: .25s all ease;\n                pointer-events: none;\n            }\n\n            /* Transition */\n            .select:hover::after {\n                color: var(--accent-color);\n            }\n        \n        ";
    };
    return DropdownSettingBox;
}(SettingBox_1.SettingBox));
exports.DropdownSettingBox = DropdownSettingBox;
