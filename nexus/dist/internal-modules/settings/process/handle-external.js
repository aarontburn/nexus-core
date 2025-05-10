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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
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
exports.__esModule = true;
var nexus_module_builder_1 = require("@nexus-app/nexus-module-builder");
function handleExternal(process, source, eventType, data) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var nameOrAccessID, setting, target, output, callback;
        return __generator(this, function (_b) {
            switch (eventType) {
                case "get-setting": {
                    if (typeof data[0] !== 'string') {
                        return [2 /*return*/, { body: new Error("Parameter is not a string."), code: nexus_module_builder_1.HTTPStatusCodes.BAD_REQUEST }];
                    }
                    nameOrAccessID = data[0];
                    setting = this.getSettings().findSetting(nameOrAccessID);
                    if (setting === undefined) {
                        return [2 /*return*/, { body: new Error("No setting found with the name or ID of ".concat(nameOrAccessID, ".")), code: nexus_module_builder_1.HTTPStatusCodes.BAD_REQUEST }];
                    }
                    return [2 /*return*/, { body: setting.getValue(), code: nexus_module_builder_1.HTTPStatusCodes.OK }];
                }
                case "open-settings-for-module": {
                    target = (_a = data[0]) !== null && _a !== void 0 ? _a : source.getIPCSource();
                    output = this.swapSettingsTab(target);
                    if (output === undefined) {
                        return [2 /*return*/, { body: new Error("The specified module '".concat(target, "' either doesn't exist or has no settings.")), code: nexus_module_builder_1.HTTPStatusCodes.BAD_REQUEST }];
                    }
                    this.requestExternal('nexus.Main', 'swap-to-module');
                    this.sendToRenderer("swap-tabs", output);
                    return [2 /*return*/, { body: undefined, code: nexus_module_builder_1.HTTPStatusCodes.OK }];
                }
                case 'is-developer-mode': {
                    return [2 /*return*/, { body: this.getSettings().findSetting('dev_mode').getValue(), code: nexus_module_builder_1.HTTPStatusCodes.OK }];
                }
                case "get-accent-color": {
                    return [2 /*return*/, { body: this.getSettings().findSetting("accent_color").getValue(), code: nexus_module_builder_1.HTTPStatusCodes.OK }];
                }
                case "get-module-order": {
                    return [2 /*return*/, { body: this.getSettings().findSetting("module_order").getValue(), code: nexus_module_builder_1.HTTPStatusCodes.OK }];
                }
                case 'on-developer-mode-changed': {
                    callback = data[0];
                    if (typeof callback !== "function") {
                        return [2 /*return*/, { body: new Error("Callback is invalid."), code: nexus_module_builder_1.HTTPStatusCodes.BAD_REQUEST }];
                    }
                    this.devModeSubscribers.push(callback);
                    callback(this.getSettings().findSetting('dev_mode').getValue());
                    return [2 /*return*/, { body: undefined, code: nexus_module_builder_1.HTTPStatusCodes.OK }];
                }
                default: {
                    return [2 /*return*/, { body: undefined, code: nexus_module_builder_1.HTTPStatusCodes.NOT_IMPLEMENTED }];
                }
            }
            return [2 /*return*/];
        });
    });
}
exports["default"] = handleExternal;
//# sourceMappingURL=handle-external.js.map