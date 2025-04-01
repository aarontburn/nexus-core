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
                loadModules(data);
                break;
            }
            case "swap-modules": {
                swapLayout(data);
                break;
            }
        }
    });
    var handleButtonClick = function (moduleID, buttonElement) {
        if (selectedTab !== undefined) {
            selectedTab.style.color = "";
            selectedTab.style.borderColor = "";
        }
        selectedTab = buttonElement;
        selectedTab.setAttribute("style", "color: var(--accent-color); border-color: var(--accent-color);");
        document.getElementById("logo-button").style.backgroundColor = selectedTab.id === "home-button" ? 'var(--accent-color)' : 'var(--off-white)';
        sendToProcess("swap-modules", moduleID);
    };
    function registerHome() {
        var headerHtml = document.getElementById("header");
        var headerButtonElement = document.createElement("button");
        headerButtonElement.innerHTML = "<div id=\"logo-button\"></div>";
        headerButtonElement.setAttribute("style", "color: var(--accent-color); border-color: var(--accent-color);");
        headerButtonElement.id = "home-button";
        selectedTab = headerButtonElement;
        headerButtonElement.addEventListener("click", function () {
            handleButtonClick("built_ins.Home", headerButtonElement);
        });
        headerHtml.insertAdjacentElement("beforeend", headerButtonElement);
        headerHtml.insertAdjacentHTML("beforeend", '<div style="background-color: white; height: 1px; margin: 5px 5px"></div>');
    }
    registerHome();
    function swapLayout(swapToLayoutId) {
        var modules = document.getElementById("modules").getElementsByTagName("*");
        for (var i = 0; i < modules.length; i++) {
            modules[i].setAttribute("style", IFRAME_DEFAULT_STYLE + "display: none;");
        }
        document.getElementById(swapToLayoutId).setAttribute("style", IFRAME_DEFAULT_STYLE);
    }
    function loadModules(data) {
        var moduleHtml = document.getElementById("modules");
        var headerHtml = document.getElementById("header");
        var _loop_1 = function (obj) {
            var moduleName = obj.moduleName, moduleID = obj.moduleID, htmlPath = obj.htmlPath;
            if (htmlPath === undefined) {
                return "continue";
            }
            var moduleIFrameElement = document.createElement("iframe");
            moduleIFrameElement.id = moduleID;
            moduleIFrameElement.setAttribute("src", htmlPath);
            moduleIFrameElement.setAttribute("style", IFRAME_DEFAULT_STYLE);
            // moduleView.setAttribute("sandbox", SANDBOX_RESTRICTIONS)
            moduleHtml.insertAdjacentElement("beforeend", moduleIFrameElement);
            if (moduleID === "built_ins.Home") {
                return "continue";
            }
            var headerButtonElement = document.createElement("button");
            headerButtonElement.textContent = moduleName.split(" ").map(function (s) { return s[0]; }).join("");
            headerButtonElement.addEventListener("click", function () {
                handleButtonClick(moduleID, headerButtonElement);
            });
            headerHtml.insertAdjacentElement("beforeend", headerButtonElement);
        };
        for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
            var obj = data_1[_i];
            _loop_1(obj);
        }
    }
})();
//# sourceMappingURL=renderer.js.map