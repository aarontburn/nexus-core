var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
(function () {
    var MODULE_ID = 'built_ins.Main';
    var sendToProcess = function (eventType) {
        var _a;
        var data = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            data[_i - 1] = arguments[_i];
        }
        return (_a = window.ipc).send.apply(_a, __spreadArray([MODULE_ID, eventType], data, false));
    };
    sendToProcess("renderer-init");
    var IFRAME_DEFAULT_STYLE = "height: 100%; width: 100%;";
    // const SANDBOX_RESTRICTIONS: string = Array.from(new Map([
    //     ["allow-forms", true], // Module can submit forms.
    //     ['allow-modals', true],  // Module can spawn alerts, prompts, and confirms
    //     ['allow-orientation-lock', false],
    //     ['allow-pointer-lock', false], // Module can 
    //     ['allow-popups', true],
    //     ['allow-popups-to-escape-sandbox', true],
    //     ['allow-presentation', false],
    //     ['allow-same-origin', true],
    //     ['allow-scripts', true],
    //     ['allow-top-navigation', false],
    //     ['allow-top-navigation-by-user-activation', false],
    // ])).filter(([_, v]) => v).reduce((prev, [k, _]) => prev += `${k} `, "");
    var selectedTab = undefined;
    window.ipc.on(MODULE_ID, function (_, eventType, data) {
        // data = data[0];
        switch (eventType) {
            case "load-modules": {
                var moduleHtml = document.getElementById("modules");
                var headerHtml = document.getElementById("header");
                headerHtml.innerHTML = "";
                moduleHtml.innerHTML = "";
                var _loop_1 = function (moduleName, moduleID, htmlPath) {
                    var moduleView = document.createElement("iframe");
                    moduleView.id = moduleID;
                    moduleView.setAttribute("src", htmlPath);
                    moduleView.setAttribute("style", IFRAME_DEFAULT_STYLE);
                    // moduleView.setAttribute("sandbox", SANDBOX_RESTRICTIONS)
                    moduleHtml.insertAdjacentElement("beforeend", moduleView);
                    var headerButton = document.createElement("button");
                    headerButton.id = moduleName + "HeaderButton";
                    headerButton.textContent = moduleName;
                    if (moduleName === "Home") {
                        headerButton.setAttribute("style", "color: var(--accent-color);");
                        selectedTab = headerButton;
                    }
                    headerButton.addEventListener("click", function () {
                        if (selectedTab !== undefined) {
                            selectedTab.style.color = "";
                        }
                        selectedTab = headerButton;
                        selectedTab.setAttribute("style", "color: var(--accent-color);");
                        sendToProcess("swap-modules", moduleID);
                    });
                    headerHtml.insertAdjacentElement("beforeend", headerButton);
                };
                for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
                    var _a = data_1[_i], moduleName = _a.moduleName, moduleID = _a.moduleID, htmlPath = _a.htmlPath;
                    _loop_1(moduleName, moduleID, htmlPath);
                }
                break;
            }
            case "swap-modules": {
                swapLayout(data);
                break;
            }
        }
    });
    function swapLayout(swapToLayoutId) {
        var modules = document.getElementById("modules").getElementsByTagName("*");
        for (var i = 0; i < modules.length; i++) {
            modules[i].setAttribute("style", IFRAME_DEFAULT_STYLE + "display: none;");
        }
        document.getElementById(swapToLayoutId).setAttribute("style", IFRAME_DEFAULT_STYLE);
    }
})();
//# sourceMappingURL=renderer.js.map