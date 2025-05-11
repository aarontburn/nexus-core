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
(function () {
    var sendToProcess = function (eventName) {
        var data = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            data[_i - 1] = arguments[_i];
        }
        return window.ipc.send(window, eventName, data);
    };
    var getAbbreviation = function (moduleName) {
        var ABBREVIATION_LENGTH = 3;
        var abbreviation = moduleName.split(" ").map(function (s) { return s[0]; });
        var out = [];
        for (var i = 0; i < ABBREVIATION_LENGTH; i++) {
            if (i >= abbreviation.length) {
                break;
            }
            out.push(abbreviation[i]);
        }
        return out.join("");
    };
    var manageButton = document.getElementById('manage-button');
    manageButton.addEventListener('click', function () {
        sendToProcess('manage-modules').then(function (data) {
            openManageScreen(data);
        });
    });
    var renderIfTrue = function (condition, html) { return condition ? html : ''; };
    var list = document.getElementById('installed-modules-list');
    var forceReloadedModules = [];
    var updatedModules = [];
    function openManageScreen(data) {
        var _this = this;
        document.getElementById("manage-module").hidden = false;
        // Clear list
        while (list.firstChild) {
            list.removeChild(list.lastChild);
        }
        if (data.length === 0) { // No external modules
            list.insertAdjacentHTML('beforeend', "<p style='margin: 0; margin-left: 15px;'>No external modules found.</p>");
        }
        data = data.sort(function (a, b) {
            if (a.isDeleted !== b.isDeleted) {
                return a.isDeleted ? 1 : -1;
            }
            return a.moduleName.localeCompare(b.moduleName);
        });
        data.forEach(function (info) {
            var div = document.createElement('div');
            div.className = 'installed-module';
            div.innerHTML = "\n                <div class=\"module-icon\">\n                    ".concat(info.iconPath ? "<img src=\"".concat(info.iconPath, "\"></img>") : "<p>".concat(getAbbreviation(info.moduleName), "</p>"), "\n                </div>\n\n                <div ").concat(info.isDeleted ? 'class="deleted"' : '', ">\n                    <p class=\"module-name\">").concat(info.moduleName).concat(renderIfTrue(info.isDeleted, ' (Deleted)'), "</p>\n                    <p class=\"module-id\">").concat(info.moduleID, " <span class=\"module-version\">| ").concat(info.version).concat(renderIfTrue(info.updateAvailable, " (Update Available)"), "</span></p>\n                    <p class=\"module-path\">").concat(info.path, "</p>\n                </div>\n\n                <div style=\"margin-right: auto;\"></div>\n\n                <div class=\"module-controls\">\n                ").concat(!info.isDeleted
                ? " \n                        <p class='check-update-button clickable'>".concat(updatedModules.includes(info.moduleID) ? 'Restart Now' : info.updateAvailable ? "Update Now" : 'Check For Update', "</p>\n                        <p class='force-reload-button clickable'>").concat(forceReloadedModules.includes(info.moduleID) ? 'Reloading Next Launch' : 'Force Reload', "</p>\n                        <p class='remove-module-button clickable';\">Uninstall</p>\n                    ")
                : "<p style=\"font-style: italic; text-align: right; color: gray;\">Restart Required</p>", "\n                </div>\n\n            ");
            if (!info.isDeleted) {
                var checkUpdateButton_1 = div.querySelector('.check-update-button');
                if (updatedModules.includes(info.moduleID)) {
                    checkUpdateButton_1.style.pointerEvents = "none";
                    checkUpdateButton_1.style.color = "var(--accent-color)";
                }
                checkUpdateButton_1.addEventListener('click', function () { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        if (checkUpdateButton_1.textContent === "Restart Now") {
                            sendToProcess('restart-now');
                        }
                        else if (checkUpdateButton_1.textContent === "Update Now") {
                            checkUpdateButton_1.textContent = "Updating...";
                            checkUpdateButton_1.style.pointerEvents = "none";
                            checkUpdateButton_1.style.color = "var(--accent-color)";
                            sendToProcess('update-module', info.moduleID).then(function (successful) {
                                if (successful) {
                                    updatedModules.push(info.moduleID);
                                    checkUpdateButton_1.textContent = "Restart Now";
                                    checkUpdateButton_1.style.pointerEvents = "";
                                }
                                else {
                                    checkUpdateButton_1.textContent = "Couldn't Install Update";
                                    setTimeout(function () {
                                        checkUpdateButton_1.textContent = "Update Now";
                                        checkUpdateButton_1.style.pointerEvents = "";
                                        checkUpdateButton_1.style.color = "";
                                    }, 2000);
                                }
                            });
                        }
                        else if (checkUpdateButton_1.textContent === "Check For Update") {
                            checkUpdateButton_1.textContent = "Checking for update...";
                            checkUpdateButton_1.style.pointerEvents = "none";
                            checkUpdateButton_1.style.color = "var(--accent-color)";
                            Promise.all([
                                sendToProcess('check-for-update', info.moduleID),
                                new Promise(function (resolve) { return setTimeout(resolve, 1000); }),
                            ]).then(function (_a) {
                                var isUpdateAvailable = _a[0];
                                if (isUpdateAvailable) {
                                    checkUpdateButton_1.textContent = "Update Now";
                                    div.querySelector('.module-version').textContent = "| ".concat(info.version, " (Update Available)");
                                }
                                else {
                                    checkUpdateButton_1.textContent = "No Update Found";
                                    setTimeout(function () {
                                        checkUpdateButton_1.textContent = "Check For Update";
                                        checkUpdateButton_1.style.pointerEvents = "";
                                        checkUpdateButton_1.style.color = "";
                                    }, 2000);
                                }
                            });
                        }
                        return [2 /*return*/];
                    });
                }); });
                var forceReloadButton_1 = div.querySelector('.force-reload-button');
                if (forceReloadedModules.includes(info.moduleID)) {
                    forceReloadButton_1.style.pointerEvents = "none";
                    forceReloadButton_1.style.color = "var(--faded-color)";
                }
                forceReloadButton_1.addEventListener('click', function () { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        forceReloadedModules.push(info.moduleID);
                        forceReloadButton_1.textContent = 'Reloading Next Launch';
                        forceReloadButton_1.style.pointerEvents = "none";
                        forceReloadButton_1.style.color = "var(--faded-color)";
                        sendToProcess('force-reload-module', info.moduleID);
                        return [2 /*return*/];
                    });
                }); });
                div.querySelector('.remove-module-button').addEventListener('click', function () { return __awaiter(_this, void 0, void 0, function () {
                    var proceed;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, openConfirmModuleDeletionPopup()];
                            case 1:
                                proceed = _a.sent();
                                if (proceed) {
                                    sendToProcess('remove-module', info).then(function (successful) {
                                        if (successful) {
                                            openDeletedPopup();
                                        }
                                        sendToProcess('manage-modules').then(openManageScreen);
                                    });
                                }
                                return [2 /*return*/];
                        }
                    });
                }); });
            }
            list.insertAdjacentElement('beforeend', div);
        });
    }
    var importButton = document.getElementById('import-button');
    importButton.addEventListener('click', function () {
        sendToProcess('import-module').then(function (successful) {
            if (successful) {
                openRestartPopup();
            }
            else {
                console.log("Error importing module.");
            }
        });
    });
    function openPopup(html) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) {
                        var _a, _b;
                        var div = document.createElement("div");
                        div.classList.add('overlay');
                        div.innerHTML = html;
                        document.body.prepend(div);
                        div.addEventListener('click', function (event) {
                            if (event.target.className.includes('overlay')) {
                                div.remove();
                                resolve(false);
                            }
                        });
                        (_a = div.querySelector("#dialog-cancel")) === null || _a === void 0 ? void 0 : _a.addEventListener('click', function () {
                            div.remove();
                            resolve(false);
                        });
                        (_b = div.querySelector("#dialog-proceed")) === null || _b === void 0 ? void 0 : _b.addEventListener('click', function () {
                            div.remove();
                            resolve(true);
                        });
                    })];
            });
        });
    }
    function color(text, color) {
        if (color === void 0) { color = 'var(--accent-color)'; }
        return "<span style='color: ".concat(color, ";'>").concat(text, "</span>");
    }
    function openConfirmModuleDeletionPopup() {
        var html = "\n            <div class='dialog'>\n                <h3>Are you sure you want to ".concat(color('delete', 'red'), " this module?</h3>\n                <h4>Your data will be saved.<h4/>\n                <h4 style=\"padding-top: 10px;\">Proceed?</h4>\n\n                <div id=\"dialog-controls-container\">\n                    <h3 id='dialog-cancel'>Cancel</h3>\n                    <h3 id='dialog-proceed'>Delete</h3>\n                </div>\n            </div>\n        ");
        return openPopup(html);
    }
    function openDeletedPopup() {
        var html = "\n            <div class='dialog'>\n                <h3 >".concat(color('Successfully', 'green'), " deleted module.</h3>\n                <h4>Restart required for the changes to take effect.<h4/>\n                <h4 style=\"padding-top: 10px;\">Restart now?</h4>\n\n                <div id=\"dialog-controls-container\">\n                    <h3 id='dialog-cancel'>Not Now</h3>\n                    <h3 id='dialog-proceed'>Restart</h3>\n                </div>\n            </div>\n        ");
        openPopup(html).then(function (proceed) {
            if (proceed) {
                sendToProcess("restart-now");
            }
        });
    }
    function openRestartPopup() {
        var html = "\n            <div class='dialog'>\n                <h3>".concat(color('Successfully', 'green'), " imported the module.</h3>\n                <h4>You need to restart to finish the setup.<h4/>\n                <h4 style=\"padding-top: 10px;\">Restart now?</h4>\n\n                <div id=\"dialog-controls-container\">\n                    <h3 id='dialog-cancel'>Not now</h3>\n                    <h3 id='dialog-proceed'>Restart</h3>\n                </div>\n            </div>\n        ");
        openPopup(html).then(function (proceed) {
            if (proceed) {
                sendToProcess("restart-now");
            }
        });
    }
    function openLinkPopup(link) {
        var html = "\n            <div class=\"dialog\">\n                <h3>You are navigating to an ".concat(color('external', 'red'), " website.</h3>\n                <h4 class='link'>").concat(link, "</h4>\n                <h4 style=\"padding-top: 10px;\">Only visit the site if you trust it.</h4>\n\n                <div id=\"dialog-controls-container\">\n                    <h3 id='dialog-cancel'>Cancel</h3>\n                    <h3 id='dialog-proceed'>Proceed</h3>\n                </div>\n            </div>\n        ");
        openPopup(html).then(function (proceed) {
            if (proceed) {
                sendToProcess("open-link", link);
            }
        });
    }
    document.body.addEventListener('click', function (event) {
        if (event.target.tagName.toLowerCase() === 'a') {
            event.preventDefault();
            openLinkPopup(event.target.href);
        }
    });
})();
//# sourceMappingURL=installed-module-renderer.js.map