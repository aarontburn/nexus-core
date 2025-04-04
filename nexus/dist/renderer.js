(function () {
    window["INTERNAL_ID_DO_NOT_USE"] = "built_ins.Main";
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
    var handleEvent = function (eventType, data) {
        switch (eventType) {
            case "load-modules": {
                loadModules(data[0]);
                break;
            }
            case "swap-modules": {
                swapLayout(data[0]);
                break;
            }
        }
    };
    var handleButtonClick = function (moduleID, buttonElement) {
        if (selectedTab !== undefined) {
            selectedTab.style.color = "";
            selectedTab.style.borderColor = "";
        }
        selectedTab = buttonElement;
        selectedTab.setAttribute("style", "color: var(--accent-color); border-color: var(--accent-color);");
        Array.from(document.getElementsByClassName("svg")).forEach(function (e) {
            e.style.backgroundColor = e.parentElement.id === (moduleID + "-header-button") ? 'var(--accent-color)' : 'var(--off-white)';
        });
        sendToProcess("swap-modules", moduleID);
    };
    function swapLayout(swapToLayoutId) {
        var modules = document.getElementById("modules").getElementsByTagName("*");
        for (var i = 0; i < modules.length; i++) {
            modules[i].setAttribute("style", IFRAME_DEFAULT_STYLE + "display: none;");
        }
        document.getElementById(swapToLayoutId).setAttribute("style", IFRAME_DEFAULT_STYLE);
    }
    function loadModules(data) {
        var builtIns = ["built_ins.Home", "built_ins.Settings"];
        var moduleHtml = document.getElementById("modules");
        var headerHtml = document.getElementById("header");
        var _loop_1 = function (obj) {
            var moduleName = obj.moduleName, moduleID = obj.moduleID, htmlPath = obj.htmlPath, iconPath = obj.iconPath;
            if (htmlPath === undefined) { // internal module, ignore
                return "continue";
            }
            var moduleIFrameElement = document.createElement("iframe");
            moduleIFrameElement.id = moduleID;
            moduleIFrameElement.setAttribute("src", htmlPath);
            moduleIFrameElement.setAttribute("style", IFRAME_DEFAULT_STYLE);
            // moduleView.setAttribute("sandbox", SANDBOX_RESTRICTIONS)
            moduleHtml.insertAdjacentElement("beforeend", moduleIFrameElement);
            var headerButtonElement = document.createElement("button");
            headerButtonElement.id = moduleID + "-header-button";
            if (iconPath === undefined) {
                headerButtonElement.textContent = moduleName.split(" ").map(function (s) { return s[0]; }).join("");
            }
            else {
                if (iconPath.split(".").at(-1) === "svg") {
                    headerButtonElement.innerHTML = "<div class=\"svg\" style=\"mask-image: url('".concat(iconPath.replace(/\\/g, "/"), "')\"></div>");
                }
                else { // TODO: Handle other images (jpg and png)
                }
            }
            headerButtonElement.addEventListener("click", function () {
                handleButtonClick(moduleID, headerButtonElement);
            });
            if (builtIns.includes(moduleID)) {
                document.getElementById('built-ins').insertAdjacentElement("beforeend", headerButtonElement);
            }
            else {
                headerHtml.insertAdjacentElement("beforeend", headerButtonElement);
            }
        };
        for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
            var obj = data_1[_i];
            _loop_1(obj);
        }
    }
})();
//# sourceMappingURL=renderer.js.map