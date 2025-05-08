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
    window.ipc.on(window, function (eventName, data) {
        handleEvent(eventName, data);
    });
    sendToProcess("settings-init");
    var isDeveloperMode = false;
    var selectedTabElement = undefined;
    var moduleList = document.getElementById("left-list");
    var settingsList = document.getElementById("right");
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
    var manageButton = document.getElementById('manage-button');
    manageButton.addEventListener('click', function () {
        sendToProcess('manage-modules').then(function (data) {
            swapTabs('manage');
            openManageScreen(data);
        });
    });
    var handleEvent = function (eventType, data) {
        switch (eventType) {
            case 'is-dev': {
                isDeveloperMode = data[0];
                var element = document.getElementById('moduleID');
                if (element) {
                    element.hidden = !isDeveloperMode;
                }
                break;
            }
            case "populate-settings-list": {
                populateSettings(data[0]);
                break;
            }
            case "swap-tabs": {
                var tabInfo = data[0];
                console.log(tabInfo);
                swapTabs(tabInfo);
                onTabButtonPressed(document.getElementById("".concat(tabInfo.moduleID, "-tab-button")));
                break;
            }
            case "setting-modified": {
                var event_2 = data[0];
                for (var _i = 0, event_1 = event_2; _i < event_1.length; _i++) {
                    var group = event_1[_i];
                    var element = document.getElementById(group.id);
                    element[group.attribute] = group.value;
                }
                break;
            }
        }
    };
    function onTabButtonPressed(pressedTabButton) {
        if (selectedTabElement !== undefined) {
            selectedTabElement.style.color = "";
        }
        selectedTabElement = pressedTabButton;
        selectedTabElement.setAttribute("style", "color: var(--accent-color);");
    }
    function populateSettings(data) {
        var firstModule = undefined;
        data.forEach(function (obj) {
            // Setting group click button
            var tabButton = document.createElement("p");
            tabButton.className = 'setting-group';
            tabButton.innerText = obj.moduleSettingsName;
            tabButton.id = "".concat(obj.moduleID, "-tab-button");
            tabButton.addEventListener("click", function () {
                onTabButtonPressed(tabButton);
                sendToProcess('swap-settings-tab', obj.moduleID).then(swapTabs);
            });
            if (firstModule === undefined) {
                firstModule = tabButton;
            }
            moduleList.insertAdjacentElement("beforeend", tabButton);
        });
        firstModule.click();
    }
    var inputTypeToStateMap = new Map([
        ['text', 'value'],
        ['number', 'value'],
        ['password', 'value'],
        ['checkbox', 'checked'],
        ['radio', 'checked'],
        ['button', 'value'],
        ['submit', 'value'],
        ['file', 'files'],
        ['color', 'value'],
        ['date', 'value'],
        ['range', 'value'],
        ['select', 'value'],
        ['click', 'value'],
    ]);
    var keyBlacklist = [
        'moduleName', 'module_name',
        'buildVersion', 'build_version',
    ];
    var nonDevWhitelist = [
        'moduleName', 'module_name',
        'description',
        'link',
        'author',
    ];
    function swapTabs(tab) {
        // Clear existing settings
        var removeNodes = [];
        settingsList.childNodes.forEach(function (node) {
            if (node.id !== 'manage-module') {
                removeNodes.push(node);
            }
            else {
                node.hidden = true;
            }
        });
        removeNodes.forEach(function (node) { return settingsList.removeChild(node); });
        if (tab === 'manage') {
            return;
        }
        var tabInfo = tab;
        function getModuleInfoHTML(moduleInfo) {
            var toSentenceCase = function (key) { return key.charAt(0).toUpperCase() + key.slice(1); };
            var inner = [];
            inner.push("<p id='open-folder' class='setting-group' style='float: right; font-size: 25px; margin-top: -12px;'>\uD83D\uDDC0</p>");
            inner.push("<p style=\"font-size: 27px; color: var(--accent-color);\">".concat(moduleInfo.moduleName || tabInfo.moduleName, "</p>"));
            inner.push("<p id='moduleID' ".concat(!isDeveloperMode ? 'hidden' : '', "><span>Module ID: </span>").concat(tabInfo.moduleID, "<p/>"));
            for (var key in moduleInfo) {
                if (keyBlacklist.includes(key)) {
                    continue;
                }
                var value = moduleInfo[key];
                if (!value || value.length === 0) {
                    continue;
                }
                if (!isDeveloperMode) {
                    if (key.toLowerCase() === "link") {
                        inner.push("<p><span>".concat(toSentenceCase(key), ": </span><a href=").concat(value, ">").concat(value, "</a><p/>"));
                    }
                    else if (nonDevWhitelist.includes(key)) {
                        inner.push("<p><span>".concat(toSentenceCase(key), ":</span> ").concat(value, "</p>"));
                    }
                }
                else {
                    if (key.toLowerCase() === "link") {
                        inner.push("<p><span>".concat(toSentenceCase(key), ": </span><a href=").concat(value, ">").concat(value, "</a><p/>"));
                        continue;
                    }
                    inner.push("<p><span>".concat(toSentenceCase(key), ":</span> ").concat(value, "</p>"));
                }
            }
            return inner.reduce(function (acc, html) { return acc += html + "\n"; }, '');
        }
        var moduleInfo = tabInfo.moduleInfo;
        if (moduleInfo !== undefined) {
            var moduleInfoHTML = "\n                <div class='module-info'>\n                    ".concat(getModuleInfoHTML(moduleInfo), "\n                </div>\n            ");
            settingsList.insertAdjacentHTML("beforeend", moduleInfoHTML);
            document.getElementById('open-folder').addEventListener('click', function () {
                sendToProcess('open-module-folder', tabInfo.moduleID);
            });
        }
        tabInfo.settings.forEach(function (settingInfo) {
            if (typeof settingInfo === 'string') {
                var headerHTML = "\n                    <div class='section'>\n                        <p>\u2014    ".concat(settingInfo, "    \u2014</p>\n                    </div>\n\n                ");
                settingsList.insertAdjacentHTML('beforeend', headerHTML);
                return;
            }
            var settingId = settingInfo.settingId;
            var inputTypeAndId = settingInfo.inputTypeAndId;
            var uiHTML = settingInfo.ui;
            var _a = settingInfo.style, sourceObject = _a[0], style = _a[1];
            settingsList.insertAdjacentHTML("beforeend", uiHTML);
            // Attach events to reset button
            var resetButton = document.getElementById("reset-button_".concat(settingId));
            resetButton === null || resetButton === void 0 ? void 0 : resetButton.addEventListener("click", function () {
                sendToProcess("setting-reset", inputTypeAndId[0].id);
            });
            // Add custom setting css to setting
            if (style !== "") {
                var styleId = sourceObject;
                if (document.getElementById(styleId) === null) {
                    var styleSheet = document.createElement('style');
                    styleSheet.id = sourceObject;
                    styleSheet.innerHTML = style;
                    settingsList.appendChild(styleSheet);
                }
            }
            inputTypeAndId.forEach(function (group) {
                var id = group.id;
                var inputType = group.inputType;
                var returnValue = group.returnValue;
                var attribute = inputTypeToStateMap.get(inputType);
                if (attribute === undefined) {
                    console.error('Invalid input type found: ' + inputType);
                    console.error('Attempting to assign it "value"');
                    attribute = 'value';
                }
                var element = document.getElementById(id);
                switch (inputType) {
                    case 'click': {
                        element.addEventListener('click', function () {
                            sendToProcess("setting-modified", id, returnValue ? returnValue : element[attribute]);
                        });
                        break;
                    }
                    case 'number':
                    case 'text': {
                        element.addEventListener('keyup', function (event) {
                            if (event.key === "Enter") {
                                sendToProcess("setting-modified", id, returnValue ? returnValue : element[attribute]);
                                element.blur();
                            }
                        });
                        element.addEventListener('blur', function () { return sendToProcess("setting-modified", id, returnValue ? returnValue : element[attribute]); });
                        break;
                    }
                    case 'color':
                    case 'range': {
                        var debounceTimer_1;
                        element.addEventListener('input', function () {
                            clearTimeout(debounceTimer_1);
                            debounceTimer_1 = setTimeout(function () {
                                sendToProcess('setting-modified', id, returnValue ? returnValue : element[attribute]);
                            }, 100);
                        });
                        break;
                    }
                    case "checkbox":
                    case 'select':
                    case 'radio': {
                        element.addEventListener('change', function () {
                            sendToProcess('setting-modified', id, returnValue ? returnValue : element[attribute]);
                        });
                        break;
                    }
                    // TODO: Add additional options
                }
            });
        });
        // Add spacers to the bottom
        var spacerHTML = "\n            <br/>\n            <br/>\n        ";
        settingsList.insertAdjacentHTML("beforeend", spacerHTML);
    }
    var screen = document.getElementById("manage-module");
    var list = document.getElementById('installed-modules-list');
    function openManageScreen(data) {
        var _this = this;
        screen.hidden = false;
        // Clear list
        while (list.firstChild) {
            list.removeChild(list.lastChild);
        }
        if (data.length === 0) { // No external modules
            var html = "\n                <p style='margin: 0; margin-left: 15px;'>No external modules found.</p>\n            ";
            list.insertAdjacentHTML('beforeend', html);
        }
        data.forEach(function (_a) {
            var _b;
            var moduleName = _a.moduleName, moduleID = _a.moduleID, isDeleted = _a.isDeleted;
            var div = document.createElement('div');
            div.className = 'installed-module';
            div.innerHTML = "\n                <div>\n                    <p class=\"module-name\">".concat(moduleName, "</p>\n                    <p class=\"module-id\">").concat(moduleID, "</p>\n                </div>\n\n                <div style=\"margin-right: auto;\"></div>\n\n                ").concat(!isDeleted ?
                "<p class='remove-module-button clickable' style=\"color: red; margin-right: 15px\">Remove</p>"
                : "<p style=\"margin-right: 15px; font-style: italic;\">Restart Required</p>", "\n            ");
            (_b = div.querySelector('.remove-module-button')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', function () { return __awaiter(_this, void 0, void 0, function () {
                var proceed;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, openConfirmModuleDeletionPopup()];
                        case 1:
                            proceed = _a.sent();
                            if (proceed) {
                                sendToProcess('remove-module', moduleID).then(function (successful) {
                                    if (successful) {
                                        console.log('Removed ' + moduleID);
                                        openDeletedPopup();
                                    }
                                    else {
                                        console.log('Failed to remove ' + moduleID);
                                    }
                                    sendToProcess('manage-modules').then(openManageScreen);
                                });
                            }
                            return [2 /*return*/];
                    }
                });
            }); });
            list.insertAdjacentElement('beforeend', div);
        });
    }
    function openPopup(html, rejectID, resolveID) {
        if (rejectID === void 0) { rejectID = 'dialog-cancel'; }
        if (resolveID === void 0) { resolveID = 'dialog-proceed'; }
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
                        (_a = div.querySelector("#".concat(rejectID))) === null || _a === void 0 ? void 0 : _a.addEventListener('click', function () {
                            div.remove();
                            resolve(false);
                        });
                        (_b = div.querySelector("#".concat(resolveID))) === null || _b === void 0 ? void 0 : _b.addEventListener('click', function () {
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
        var html = "\n            <div class='dialog'>\n                <h3 class='disable-highlight'>Are you sure you want to ".concat(color('delete', 'red'), " this module?</h3>\n                <h4>Your data will be saved.<h4/>\n                <h4 style=\"padding-top: 10px;\" class='disable-highlight'>Proceed?</h4>\n\n                <div style=\"display: flex; justify-content: space-between; margin: 0px 15px; margin-top: 15px;\">\n                    <h3 class='disable-highlight' id='dialog-cancel'>Cancel</h3>\n                    <h3 class='disable-highlight' id='dialog-proceed'>Delete</h3>\n                </div>\n            </div>\n        ");
        return openPopup(html);
    }
    function openDeletedPopup() {
        var html = "\n            <div class='dialog'>\n                <h3 class='disable-highlight'>".concat(color('Successfully', 'green'), " deleted module.</h3>\n                <h4>Restart required for the changes to take effect.<h4/>\n                <h4 style=\"padding-top: 10px;\" class='disable-highlight'>Restart now?</h4>\n\n                <div style=\"display: flex; justify-content: space-between; margin: 0px 15px; margin-top: 15px;\">\n                    <h3 class='disable-highlight' id='dialog-cancel'>Not Now</h3>\n                    <h3 class='disable-highlight' id='dialog-proceed'>Restart</h3>\n                </div>\n            </div>\n        ");
        openPopup(html).then(function (proceed) {
            if (proceed) {
                sendToProcess("restart-now");
            }
        });
    }
    function openRestartPopup() {
        var html = "\n            <div class='dialog'>\n                <h3 class='disable-highlight'>".concat(color('Successfully', 'green'), " imported the module.</h3>\n                <h4>You need to restart to finish the setup.<h4/>\n                <h4 style=\"padding-top: 10px;\" class='disable-highlight'>Restart now?</h4>\n\n                <div style=\"display: flex; justify-content: space-between; margin: 0px 15px; margin-top: 15px;\">\n                    <h3 class='disable-highlight' id='dialog-cancel'>Not now</h3>\n                    <h3 class='disable-highlight' id='dialog-proceed'>Restart</h3>\n                </div>\n            </div>\n        ");
        openPopup(html).then(function (proceed) {
            if (proceed) {
                sendToProcess("restart-now");
            }
        });
    }
    function openLinkPopup(link) {
        var html = "\n            <div class=\"dialog\">\n                <h3 class='disable-highlight'>You are navigating to an ".concat(color('external', 'red'), " website.</h3>\n                <h4 class='link'>").concat(link, "</h4>\n                <h4 style=\"padding-top: 10px;\" class='disable-highlight'>Only visit the site if you trust it.</h4>\n\n                <div style=\"display: flex; justify-content: space-between; margin: 0px 15px; margin-top: 15px;\">\n                    <h3 class='disable-highlight' id='dialog-cancel'>Cancel</h3>\n                    <h3 class='disable-highlight' id='dialog-proceed'>Proceed</h3>\n                </div>\n            </div>\n        ");
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
//# sourceMappingURL=SettingsRenderer.js.map