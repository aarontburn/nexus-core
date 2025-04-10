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
        switch (eventName) {
            case "load-modules": {
                loadModules(data[0]);
                break;
            }
            case "swap-modules": {
                swapVisibleModule(data[0]);
                break;
            }
        }
    });
    sendToProcess("renderer-init");
    var IFRAME_DEFAULT_STYLE = "height: 100%; width: 100%;";
    var selectedTab = undefined;
    var handleButtonClick = function (moduleID, buttonElement) {
        if (selectedTab !== undefined) {
            selectedTab.style.color = "";
            selectedTab.style.outlineColor = "";
            selectedTab.style.outlineWidth = "";
        }
        selectedTab = buttonElement;
        selectedTab.setAttribute("style", "color: var(--accent-color); outline-color: var(--accent-color); outline-width: 3px;");
        Array.from(document.getElementsByClassName("svg")).forEach(function (e) {
            e.style.backgroundColor = e.parentElement.id === (moduleID + "-header-button") ? 'var(--accent-color)' : 'var(--off-white)';
        });
        sendToProcess("swap-modules", moduleID);
    };
    function swapVisibleModule(moduleIDToSwapTo) {
        var modules = document.getElementById("modules").getElementsByTagName("*");
        for (var i = 0; i < modules.length; i++) {
            modules[i].setAttribute("style", IFRAME_DEFAULT_STYLE + "display: none;");
        }
        document.getElementById(moduleIDToSwapTo).setAttribute("style", IFRAME_DEFAULT_STYLE);
    }
    function loadModules(data) {
        var moduleFrameHTML = document.getElementById("modules");
        var moduleIconsHTML = document.getElementById("header");
        var createAndInsertIFrame = function (moduleID, htmlPath, url) {
            if (url) {
                var webView = document.createElement("webview");
                webView.setAttribute("src", url);
                webView.setAttribute("style", IFRAME_DEFAULT_STYLE);
                webView.id = moduleID;
                moduleFrameHTML.insertAdjacentElement("beforeend", webView);
                return;
            }
            var iframe = document.createElement("iframe");
            iframe.id = moduleID;
            iframe.setAttribute("src", htmlPath);
            iframe.setAttribute("style", IFRAME_DEFAULT_STYLE);
            moduleFrameHTML.insertAdjacentElement("beforeend", iframe);
        };
        var createAndInsertButton = function (moduleName, moduleID, iconPath) {
            var _a;
            var getAbbreviation = function () {
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
            var button = document.createElement("button");
            button.id = moduleID + "-header-button";
            button.className = "header-button drag-item";
            button.draggable = true;
            if (iconPath === undefined) {
                button.textContent = getAbbreviation();
            }
            else {
                switch (((_a = iconPath.split(".").at(-1)) !== null && _a !== void 0 ? _a : '').toLowerCase()) {
                    case "svg": {
                        button.innerHTML = "<div class=\"module-icon svg\" style=\"mask-image: url('".concat(iconPath.replace(/\\/g, "/"), "')\"></div>");
                        break;
                    }
                    case "png":
                    case "jpeg":
                    case "jpg": {
                        button.innerHTML = "<img class=\"module-icon\" src=\"".concat(iconPath.replace(/\\/g, "/"), "\"  />");
                        break;
                    }
                    default: {
                        console.log("Unsupported icon for ".concat(moduleID, ": ") + iconPath);
                        button.textContent = getAbbreviation();
                        break;
                    }
                }
            }
            button.addEventListener("click", function () {
                handleButtonClick(moduleID, button);
            });
            var builtIns = ["built_ins.Home", "built_ins.Settings"];
            if (builtIns.includes(moduleID)) {
                button.draggable = false;
                document.getElementById('built-ins').insertAdjacentElement("beforeend", button);
            }
            else {
                moduleIconsHTML.insertAdjacentElement("beforeend", button);
            }
        };
        for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
            var obj = data_1[_i];
            var moduleName = obj.moduleName, moduleID = obj.moduleID, htmlPath = obj.htmlPath, iconPath = obj.iconPath, url = obj.url;
            if (htmlPath === undefined && url === undefined) { // internal module, ignore
                continue;
            }
            createAndInsertIFrame(moduleID, htmlPath, url);
            createAndInsertButton(moduleName, moduleID, iconPath);
        }
    }
    var dragList = document.getElementById('drag-list');
    var importedModulesList = document.getElementById('header');
    var draggedItem = null;
    var lastLine = null;
    // Add event listeners for drag and drop events
    dragList.addEventListener('dragstart', handleDragStart);
    dragList.addEventListener('dragover', handleDragOver);
    dragList.addEventListener('drop', handleDrop);
    dragList.addEventListener("dragend", handleDragEnd);
    // Drag start event handler
    function handleDragStart(event) {
        draggedItem = event.target;
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/html', draggedItem.innerHTML);
    }
    // Drag over event handler
    function handleDragOver(event) {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
        var targetItem = event.target;
        if (targetItem.id === "header") {
            return;
        }
        else if (!targetItem.classList.contains('drag-item')
            || targetItem === draggedItem) {
            removeOldLineAndCreateLine();
            return;
        }
        ;
        var rect = targetItem.getBoundingClientRect();
        var isBelow = event.clientY > rect.top + (rect.height / 2);
        if (targetItem.parentElement.id === "built-ins") {
            return;
        }
        importedModulesList.insertBefore(removeOldLineAndCreateLine(), isBelow ? targetItem.nextSibling : targetItem);
    }
    function handleDrop(event) {
        event.preventDefault();
        if (lastLine) {
            try {
                importedModulesList.insertBefore(draggedItem, lastLine);
            }
            catch (_) { }
        }
        draggedItem = null;
    }
    function handleDragEnd(event) {
        event.preventDefault();
        removeOldLineAndCreateLine();
        var order = Array.from(importedModulesList.childNodes)
            .filter(function (node) { return node.nodeName === "BUTTON"; })
            .map(function (node) { return node.id.replace("-header-button", ''); });
        sendToProcess("module-order", order);
    }
    function removeOldLineAndCreateLine() {
        if (lastLine !== null) {
            lastLine.remove();
            lastLine = null;
        }
        var line = document.createElement("div");
        line.style.outline = "1px dashed var(--accent-color)";
        lastLine = line;
        return line;
    }
})();
//# sourceMappingURL=renderer.js.map