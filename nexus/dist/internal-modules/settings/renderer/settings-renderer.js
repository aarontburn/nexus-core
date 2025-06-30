(function () {
    var sendToProcess = function (eventName) {
        var data = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            data[_i - 1] = arguments[_i];
        }
        return window.ipc.sendToProcess(eventName, data);
    };
    var isDeveloperMode = false;
    var selectedTabElement = undefined;
    var moduleList = document.getElementById("left-list");
    var settingsList = document.getElementById("right");
    var manageButton = document.getElementById('manage-button');
    manageButton.addEventListener('click', function () {
        swapTabs('manage');
        onTabButtonPressed(undefined);
    });
    window.ipc.onProcessEvent(function (eventType, data) {
        switch (eventType) {
            case 'is-dev': {
                isDeveloperMode = data[0];
                Array.from(document.getElementsByClassName("hidden-unless-dev")).forEach(function (e) {
                    if (isDeveloperMode) {
                        e.classList.remove('hidden');
                    }
                    else {
                        e.classList.add('hidden');
                    }
                });
                break;
            }
            case "populate-settings-list": {
                populateSettings(data[0]);
                break;
            }
            case "swap-tabs": {
                var tabInfo = data[0];
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
    });
    sendToProcess("settings-init");
    function onTabButtonPressed(pressedTabButton) {
        if (selectedTabElement !== undefined) {
            selectedTabElement.style.color = "";
        }
        selectedTabElement = pressedTabButton;
        selectedTabElement === null || selectedTabElement === void 0 ? void 0 : selectedTabElement.setAttribute("style", "color: var(--accent-color);");
    }
    function populateSettings(data) {
        var firstModule = undefined;
        var priority = {
            "nexus.Settings": 0,
            "nexus.Home": 1
        };
        data = data.sort(function (a, b) {
            var aPriority = priority[a.moduleID] !== undefined ? priority[a.moduleID] : 2;
            var bPriority = priority[b.moduleID] !== undefined ? priority[b.moduleID] : 2;
            if (aPriority !== bPriority) {
                return aPriority - bPriority;
            }
            return a.moduleSettingsName.localeCompare(b.moduleSettingsName);
        });
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
            return "\n                <p id='open-folder' class='setting-group'>\uD83D\uDDC0</p>\n                <div class=\"header\">\n                    <p class=\"module-name\">".concat(moduleInfo.name || tabInfo.moduleName, "</p>\n                    <p class=\"module-id hidden-unless-dev ").concat(!isDeveloperMode ? 'hidden' : '', "\" id=\"moduleID\">").concat(tabInfo.moduleID, " (v").concat(moduleInfo.version, ")</p>\n                </div>\n                ").concat(moduleInfo.description ? "<p class=\"module-desc\">".concat(moduleInfo.description, "</p>") : '', "\n\n                ").concat(moduleInfo.author ? "<p><span>Author: </span> ".concat(moduleInfo.author, "</p>") : '', "\n                ").concat(moduleInfo.link ? "<p><span>Link: </span><a href=".concat(moduleInfo.link, ">").concat(moduleInfo.link, "</a><p/>") : '', "\n            ");
        }
        var moduleInfo = tabInfo.moduleInfo;
        if (moduleInfo !== undefined) {
            var moduleInfoHTML = "\n                <div class='module-info'>\n                    ".concat(getModuleInfoHTML(moduleInfo).replace(/  /g, '').replace(/\n/g, '').trim(), "\n                </div>\n            ");
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
                    case "file": {
                        element.addEventListener('change', function () {
                            console.log(Array.from(element[attribute]));
                            sendToProcess("setting-modified", id, returnValue ? returnValue : Array.from(element[attribute]).map(function (file) { return window.webUtils.getPathForFile(file); }));
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
        settingsList.insertAdjacentHTML("beforeend", "<br/><br/>");
    }
})();
//# sourceMappingURL=settings-renderer.js.map