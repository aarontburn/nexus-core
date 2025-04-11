"use strict";
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
exports.Setting = void 0;
var Setting = /** @class */ (function () {
    /**
     *  Creates a new setting with the module that this setting belongs to.
     *
     *  Use the following methods to set the state of the setting:
     *     - {@link setName} Sets the name of the setting (REQUIRED).
     *     - {@link setDefault} Sets the default value of the setting (REQUIRED).
     *     - {@link setDescription} Sets the description of the setting.
     *
     *  @param parentModule The module that this setting belongs to.
     */
    function Setting(parentModule, defer) {
        if (defer === void 0) { defer = false; }
        this.settingID = "setting_id_" + Math.random().toString(36).replace('0.', '');
        this.parentModule = parentModule;
        if (!defer) {
            this.settingBox = this.setUIComponent();
        }
    }
    /**
     * Checks if the required fields are set before data can be accessed or set.
     *
     * The required fields are {@link name} and {@link defaultValue}.
     *
     * @throws Error if the required fields were NOT set.
     */
    Setting.prototype.checkRequiredFields = function () {
        if (this.name === undefined
            || this.defaultValue === undefined) {
            throw new Error("Attempted to access '".concat(this.name, "' before all values were set. Missing: ")
                + (this.name === undefined ? "NAME " : "")
                + (this.defaultValue === undefined ? "DEFAULT " : ""));
        }
    };
    Setting.prototype.reInitUI = function () {
        this.settingBox = this.setUIComponent();
    };
    /**
     * Sets the name of this setting. This is a required field.
     *
     * @param name The name of the setting.
     * @return This setting.
     * @throws Error if the name of the setting is already set.
     */
    Setting.prototype.setName = function (name) {
        if (this.name !== undefined) {
            throw new Error("Cannot reassign setting name for " + this.name);
        }
        this.name = name;
        return this;
    };
    /**
     *  Set a unique access ID for the setting. Can be useful
     *      to access settings without using their name.
     *
     *  @param id The ID of the setting.
     *  @returns itself.
     */
    Setting.prototype.setAccessID = function (id) {
        if (this.accessID !== undefined) {
            throw new Error("Cannot reassign access ID for " + this.name);
        }
        this.accessID = id;
        return this;
    };
    /**
     *  @returns the ID of this setting.
     */
    Setting.prototype.getAccessID = function () {
        return this.accessID ? this.accessID : this.name;
    };
    /**
     *  Sets the default value of this setting. This is a required field.
     *
     *  @param defaultValue The default value of the setting.
     *  @return itself.
     *  @throws {Error} if the default value of the setting is already set.
     */
    Setting.prototype.setDefault = function (defaultValue) {
        if (this.defaultValue !== undefined) {
            throw new Error("Cannot reassign default value for " + this.name);
        }
        this.defaultValue = defaultValue;
        this.currentValue = defaultValue;
        return this;
    };
    /**
     * Sets the description of this setting. This is NOT a required field.
     *
     * @param description The description of this setting.
     * @return itself.
     * @throws {Error} if the description of the setting is already set.
     */
    Setting.prototype.setDescription = function (description) {
        if (this.description != undefined) {
            throw new Error("Cannot reassign description for " + this.name);
        }
        this.description = description;
        return this;
    };
    /**
     * @return The name of this setting.
     */
    Setting.prototype.getName = function () {
        return this.name;
    };
    /**
     * @return The description of this setting, or an empty string if it hasn't been set.
     */
    Setting.prototype.getDescription = function () {
        return this.description === undefined ? "" : this.description;
    };
    /**
     * Returns the value of this setting.
     *
     * @return The value of this setting.
     * @throws {Error} if an attempt was made to access the value of this setting before all
     *                               appropriate fields were set.
     */
    Setting.prototype.getValue = function () {
        this.checkRequiredFields();
        return this.currentValue;
    };
    /**
     *  Changes the value of this setting.
     *
     *  It passes the value into @see parseInput, which returns either
     *      a value of type that matches this settings type, or null indicating that it could
     *      not properly parse the input.
     *
     *  If the input is null, the current value will remain the same. Otherwise, it will update
     *      its value to the new one.
     *
     * @param value The new value, not null.
     * @throws Error if an attempt was made to set the value before all
     *                               appropriate fields were set.
     */
    Setting.prototype.setValue = function (value) {
        return __awaiter(this, void 0, void 0, function () {
            var parsedValue;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.checkRequiredFields();
                        return [4 /*yield*/, this.parseInput(value)];
                    case 1:
                        parsedValue = _a.sent();
                        this.currentValue = parsedValue != null ? parsedValue : this.currentValue;
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     *  @private
     *
     *  Converts a generic 'any' input into a {@link T} type input.
     *
     *  If an {@link inputValidator} is specified, it will use it to parse the input.
     *
     *  Otherwise, it will use {@link validateInput} to parse the input.
     *
     *  @param input The input to parse.
     *  @return A {@link T} type valid input, or null if the input couldn't be parsed.
     */
    Setting.prototype.parseInput = function (input) {
        return __awaiter(this, void 0, void 0, function () {
            var validatorType;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.inputValidator !== undefined)) return [3 /*break*/, 3];
                        validatorType = this.inputValidator(input);
                        if (!(validatorType instanceof Promise)) return [3 /*break*/, 2];
                        return [4 /*yield*/, validatorType];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2: return [2 /*return*/, validatorType];
                    case 3: return [2 /*return*/, this.validateInput(input)];
                }
            });
        });
    };
    /**
     * Resets the setting to default.
     */
    Setting.prototype.resetToDefault = function () {
        this.setValue(this.defaultValue);
    };
    /**
     *  Sets the input validator for this setting.
     *
     *  The {@link parseInput} function will use the specified input validator instead of
     *      the {@link validateInput} to parse input.
     *
     *  @param inputValidator The input validator to use over the default {@link parseInput}.
     *  @return itself.
     *  @throws {Error} if the input validator is already defined.
     */
    Setting.prototype.setValidator = function (inputValidator) {
        if (this.inputValidator !== undefined) {
            throw new Error("Cannot redefine input validator for " + this.name);
        }
        this.inputValidator = inputValidator;
        return this;
    };
    /**
     *  @returns the UI component of this setting.
     */
    Setting.prototype.getUIComponent = function () {
        return this.settingBox;
    };
    /**
     *  @returns The setting ID.
     */
    Setting.prototype.getID = function () {
        return this.settingID;
    };
    /**
     *  @returns a reference to the parent module.
     */
    Setting.prototype.getParentModule = function () {
        return this.parentModule;
    };
    return Setting;
}());
exports.Setting = Setting;
