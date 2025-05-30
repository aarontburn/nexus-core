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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
        return __awaiter(this, void 0, void 0, function () {
            var s;
            return __generator(this, function (_a) {
                s = JSON.stringify(input).replace(/"/g, '');
                if (!this.options.has(s)) {
                    return [2 /*return*/, null];
                }
                return [2 /*return*/, s];
            });
        });
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
