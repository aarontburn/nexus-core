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
exports.BooleanSettingBox = void 0;
var SettingBox_1 = require("../../SettingBox");
/**
 *  Boolean setting box. Will render as a toggle switch.
 *
 *  @author aarontburn
 */
var BooleanSettingBox = /** @class */ (function (_super) {
    __extends(BooleanSettingBox, _super);
    function BooleanSettingBox() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.parentSetting = _this.getSetting();
        return _this;
    }
    BooleanSettingBox.prototype.createLeft = function () {
        return "\n            <div class=\"left-component\">\n                <label class=\"switch\">\n                    <input type=\"checkbox\" id=\"".concat(this.parentSetting.getID(), "\" ").concat(this.parentSetting.getValue() ? 'checked' : '', ">\n                    <span class=\"slider round\"></span>\n                </label>   \n            </div> \n        ");
    };
    BooleanSettingBox.prototype.getInputIdAndType = function () {
        return [{ id: this.parentSetting.getID(), inputType: "checkbox" }];
    };
    BooleanSettingBox.prototype.onChange = function (newValue) {
        return [{ id: this.parentSetting.getID(), attribute: 'checked', value: newValue }];
    };
    BooleanSettingBox.prototype.getStyle = function () {
        return "\n            /* The switch - the box around the slider */\n            .switch {\n                position: relative;\n                display: inline-block;\n                width: 60px;\n                height: 34px;\n            }\n            \n            /* Hide default HTML checkbox */\n            .switch input {\n                opacity: 0;\n                width: 0;\n                height: 0;\n            }\n            \n            /* The slider */\n            .slider {\n                position: absolute;\n                cursor: pointer;\n                top: 0;\n                left: 0;\n                right: 0;\n                bottom: 0;\n                background-color: #7f7f7f;\n                -webkit-transition: .3s;\n                transition: .3s;\n            }\n            \n            .slider:before {\n                position: absolute;\n                content: \"\";\n                height: 26px;\n                width: 26px;\n                left: 4px;\n                bottom: 4px;\n                background-color: white;\n                -webkit-transition: .4s;\n                transition: .4s;\n            }\n            \n            input:checked + .slider {\n                background-color: var(--accent-color);\n            }\n            \n            input:focus + .slider {\n                box-shadow: 0 0 1px var(--accent-color);\n            }\n            \n            input:checked + .slider:before {\n                -webkit-transform: translateX(26px);\n                -ms-transform: translateX(26px);\n                transform: translateX(26px);\n            }\n            \n            /* Rounded sliders */\n            .slider.round {\n                border-radius: 34px;\n            }\n            \n            .slider.round:before {\n                border-radius: 50%;\n            }\n        \n        ";
    };
    return BooleanSettingBox;
}(SettingBox_1.SettingBox));
exports.BooleanSettingBox = BooleanSettingBox;
