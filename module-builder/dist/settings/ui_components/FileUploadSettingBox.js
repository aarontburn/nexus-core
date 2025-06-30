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
exports.FileUploadSettingBox = void 0;
var SettingBox_1 = require("../../SettingBox");
var FileUploadSettingBox = /** @class */ (function (_super) {
    __extends(FileUploadSettingBox, _super);
    function FileUploadSettingBox() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FileUploadSettingBox.prototype.createLeft = function () {
        return "\n            <div class=\"left-component Nexus-File-Setting-Box\" style=\"display: flex;\">\n                <input type=\"file\" id=\"".concat(this.getSetting().getID(), "\">\n                <label for=\"").concat(this.getSetting().getID(), "\" >\n                    Choose File\n                </label>   \n            </div>\n        ");
    };
    FileUploadSettingBox.prototype.createRight = function () {
        return "\n            <div class=\"right-component Nexus-File-Setting-Box\">\n                <div style=\"display: flex; flex-wrap: wrap\">\n                    <h1><span id='".concat(this.resetID, "'>\u21A9</span> ").concat(this.getSetting().getName(), "</h1>\n                    <p style=\"align-self: flex-end; padding-left: 24px; margin: 0;\">").concat(this.getSetting().getDescription(), "</p>\n                </div>\n\n                <p class=\"file-path\" id=\"").concat(this.getSetting().getID(), "-value\">").concat(this.getSetting().getValue(), "</p>\n            </div>\n        ");
    };
    FileUploadSettingBox.prototype.getStyle = function () {
        return "\n            .Nexus-File-Setting-Box {\n                input {\n                    display: none;\n                }\n\n                .file-path {\n                    text-overflow: ellipsis;\n                    overflow: hidden;\n                    width: 100%;\n                    direction: rtl;\n                    white-space: nowrap;\n                    text-align: left;\n                    padding-right: 20px;\n                }\n\n                label {\n                    font-size: 18px;\n                    padding: 10px 5px;\n                    display: block;\n                    width: fit-content;\n                    border: 1px solid var(--text-color);\n                    border-radius: 5px;\n                    margin-top: 10px;\n                    transition: 0.25s;\n                    cursor: pointer;\n\n                    &:hover {\n                        border-color: var(--accent-color);\n                    }\n                }\n            }\n        ";
    };
    FileUploadSettingBox.prototype.getInputIdAndType = function () {
        return [{ id: this.getSetting().getID(), inputType: 'file' }];
    };
    FileUploadSettingBox.prototype.onChange = function (newValue) {
        return [
            { id: "".concat(this.getSetting().getID(), "-value"), attribute: 'textContent', value: newValue },
        ];
    };
    return FileUploadSettingBox;
}(SettingBox_1.SettingBox));
exports.FileUploadSettingBox = FileUploadSettingBox;
