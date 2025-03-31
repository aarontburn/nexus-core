"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModuleSettings = void 0;
/**
 *  Class to manage module settings.
 *
 *  @author aarontburn
 */
var ModuleSettings = /** @class */ (function () {
    function ModuleSettings(module) {
        var _this = this;
        this.settingsMap = new Map();
        this.settingsDisplay = [];
        this.parentModule = module;
        // Bind everything
        Object.getOwnPropertyNames(ModuleSettings.prototype).forEach(function (key) {
            if (key !== 'constructor') {
                _this[key] = _this[key].bind(_this);
            }
        });
    }
    /**
     *  Get the name of the module settings.
     *
     *  If it isn't set, which is default, it will return the name
     *      of the parent module. Only change this if you need to modify how
     *      the name of the settings appears.
     *
     *  @see setName
     *  @returns The name of the settings.
     */
    ModuleSettings.prototype.getName = function () {
        return this.settingsName === undefined
            ? this.parentModule.getName()
            : this.settingsName;
    };
    /**
     *  @returns An array of all the settings.
     */
    ModuleSettings.prototype.getSettings = function () {
        return Array.from(new Set(this.settingsMap.values()));
    };
    /**
     *  Get all display settings and headers.
     *  @returns An array of both settings and strings.
     */
    ModuleSettings.prototype.getSettingsAndHeaders = function () {
        return this.settingsDisplay;
    };
    /**
     *  Modify the name of the setting group.
     *
     *  Under normal conditions, there are very few reasons to change this.
     *
     *  @see getName
     *  @param name The name of the settings group.
     */
    ModuleSettings.prototype.setName = function (name) {
        this.settingsName = name;
    };
    /**
     *  Adds a setting.
     *
     *  Registers the setting under both its name and ID, if set.
     *
     *  @param setting The setting to add.
     */
    ModuleSettings.prototype._addSetting = function (s) {
        this.settingsDisplay.push(s);
        if (typeof s === 'string') {
            return;
        }
        var setting = s;
        var settingID = setting.getAccessID();
        var settingName = setting.getName();
        if (settingID === settingName) { // No ID was set, or they used the same ID as the setting name.
            this.settingsMap.set(settingID, setting);
            return;
        }
        this.settingsMap.set(settingID, setting);
        this.settingsMap.set(settingName, setting);
    };
    /**
     *  Add multiple settings.
     *
     *  @param settings The settings to add.
     */
    ModuleSettings.prototype._addSettings = function (settings) {
        settings.forEach(this._addSetting);
    };
    /**
     *  Add multiple internal settings.
     *
     *  @see                _addInternalSetting
     *  @param settings     An array of internal settings to add.
     */
    ModuleSettings.prototype._addInternalSettings = function (settings) {
        settings.forEach(this._addInternalSetting);
    };
    /**
     *  Adds an internal setting.
     *
     *  Internal settings do not show up in the settings UI, and thus are only modified
     *      through code.
     *
     *  @param setting  The internal setting to add.
     */
    ModuleSettings.prototype._addInternalSetting = function (setting) {
        var settingID = setting.getAccessID();
        var settingName = setting.getName();
        if (settingID === settingName) { // No ID was set, or they used the same ID as the setting name.
            this.settingsMap.set(settingID, setting);
            return;
        }
        this.settingsMap.set(settingID, setting);
        this.settingsMap.set(settingName, setting);
    };
    /**
     *  Search for a setting by either name or ID.
     *
     *  @param nameOrID The name or ID of the setting
     *  @returns The setting, or undefined if not found.
     */
    ModuleSettings.prototype.getSetting = function (nameOrID) {
        return this.settingsMap.get(nameOrID);
    };
    /**
     *  @returns A reference to the parent module.
     */
    ModuleSettings.prototype.getModule = function () {
        return this.parentModule;
    };
    return ModuleSettings;
}());
exports.ModuleSettings = ModuleSettings;
