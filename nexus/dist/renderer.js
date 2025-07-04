(function () {
    var sendToProcess = function (eventName) {
        var data = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            data[_i - 1] = arguments[_i];
        }
        return window.ipc.sendToProcess(eventName, data);
    };
    var isCollapsed = false;
    document.querySelector('body').addEventListener('mouseenter', function () {
        if (isCollapsed) {
            sendToProcess('expand', true);
            document.getElementById('drag-list').style.backgroundColor = '';
            document.getElementById('header').style.display = '';
        }
    });
    document.querySelector('body').addEventListener('mouseleave', function () {
        if (isCollapsed) {
            sendToProcess('expand', false);
            document.getElementById('drag-list').style.backgroundColor = 'var(--accent-color)';
            document.getElementById('header').style.display = 'none';
        }
    });
    window.ipc.onProcessEvent(function (eventName, data) {
        switch (eventName) {
            case "load-modules": {
                var _a = data[0], order = _a.order, modules = _a.modules;
                var reorderedModules = reorderModules(order, modules);
                loadModules(reorderedModules);
                break;
            }
            case "swapped-modules-to": {
                setSelectedTab(document.getElementById(data[0]));
                break;
            }
            case "collapsed": {
                isCollapsed = data[0];
                if (isCollapsed) {
                    document.getElementById('drag-list').style.backgroundColor = 'var(--accent-color)';
                    document.getElementById('header').style.display = 'none';
                }
                else {
                    document.getElementById('drag-list').style.backgroundColor = '';
                    document.getElementById('header').style.display = '';
                }
                break;
            }
        }
    });
    function reorderModules(idOrderUnparsed, moduleList) {
        if (idOrderUnparsed === '') { // no order set, return the original list
            return moduleList;
        }
        var idOrder = idOrderUnparsed.split("|");
        var reorderedModules = [];
        var moduleMap = moduleList.reduce(function (map, module) {
            if (map.has(module.moduleID)) { // duplicate module found, ignore both of them
                console.error("WARNING: Modules with duplicate IDs have been found.");
                console.error("ID: ".concat(module.moduleID, " | Registered Module: ").concat(map.get(module.moduleID).moduleName, " | New Module: ").concat(module.moduleName));
                map["delete"](module.moduleID);
            }
            else {
                map.set(module.moduleID, module);
            }
            return map;
        }, new Map());
        for (var _i = 0, idOrder_1 = idOrder; _i < idOrder_1.length; _i++) {
            var moduleID = idOrder_1[_i];
            if (moduleMap.has(moduleID)) {
                reorderedModules.push(moduleMap.get(moduleID));
                moduleMap["delete"](moduleID);
            }
        }
        for (var _a = 0, _b = Array.from(moduleMap.values()); _a < _b.length; _a++) {
            var leftoverModule = _b[_a];
            reorderedModules.push(leftoverModule);
        }
        return reorderedModules;
    }
    sendToProcess("renderer-init");
    var selectedTab = undefined;
    var handleButtonClick = function (moduleID, buttonElement) {
        setSelectedTab(buttonElement);
        sendToProcess("swap-modules", moduleID);
    };
    var setSelectedTab = function (buttonElement) {
        if (selectedTab !== undefined) {
            selectedTab.style.color = "";
            selectedTab.style.outlineColor = "";
            selectedTab.style.outlineWidth = "";
        }
        selectedTab = buttonElement;
        selectedTab.setAttribute("style", "color: var(--accent-color); outline-color: var(--accent-color); outline-width: 3px;");
    };
    function loadModules(data) {
        var _a;
        var moduleIconsHTML = document.getElementById("header");
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
        var _loop_1 = function (obj) {
            var moduleName = obj.moduleName, moduleID = obj.moduleID, htmlPath = obj.htmlPath, iconPath = obj.iconPath, url = obj.url;
            if (htmlPath === undefined && url === undefined) { // internal module, ignore
                return "continue";
            }
            var button = document.createElement("button");
            button.id = moduleID;
            button.className = "header-button drag-item";
            button.draggable = true;
            button.title = moduleName;
            if (iconPath === undefined) {
                button.textContent = getAbbreviation(moduleName);
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
                        button.textContent = getAbbreviation(moduleName);
                        break;
                    }
                }
            }
            button.addEventListener("click", function () {
                handleButtonClick(moduleID, button);
            });
            var builtIns = ["nexus.Home", "nexus.Settings"];
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
            _loop_1(obj);
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
            .map(function (node) { return node.id; });
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