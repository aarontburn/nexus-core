interface ModuleData {
    moduleName: string;
    moduleID: string;
    htmlPath: string;
    iconPath: string;
}
(() => {
    const sendToProcess = (eventName: string, ...data: any[]): Promise<void> => {
        return window.ipc.sendToProcess(eventName, data);
    }

    let isCollapsed: boolean = false;
    document.querySelector('body').addEventListener('mouseenter', () => {
        if (isCollapsed) {
            sendToProcess('expand', true)
            document.getElementById('drag-list').style.backgroundColor = '';
            document.getElementById('header').style.display = 'block';
        }
    });

    document.querySelector('body').addEventListener('mouseleave', () => {
        if (isCollapsed) {
            sendToProcess('expand', false)
            document.getElementById('drag-list').style.backgroundColor = 'var(--accent-color)';
            document.getElementById('header').style.display = 'none';
        }
    });

    window.ipc.onProcessEvent((eventName: string, data: any[]) => {
        switch (eventName) {
            case "load-modules": {
                const { order, modules }: { order: string, modules: ModuleData[] } = data[0];
                const reorderedModules = reorderModules(order, modules);
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

                } else {
                    document.getElementById('drag-list').style.backgroundColor = '';
                    document.getElementById('header').style.display = 'block';
                }



                break;
            }

        }
    });

    function reorderModules(idOrderUnparsed: string, moduleList: ModuleData[]): ModuleData[] {
        if (idOrderUnparsed === '') { // no order set, return the original list
            return moduleList;
        }

        const idOrder: string[] = idOrderUnparsed.split("|");
        const reorderedModules: ModuleData[] = [];
        const moduleMap = moduleList.reduce((map: Map<string, ModuleData>, module: ModuleData) => {
            if (map.has(module.moduleID)) { // duplicate module found, ignore both of them
                console.error("WARNING: Modules with duplicate IDs have been found.");
                console.error(`ID: ${module.moduleID} | Registered Module: ${map.get(module.moduleID).moduleName} | New Module: ${module.moduleName}`);
                map.delete(module.moduleID);

            } else {
                map.set(module.moduleID, module);
            }

            return map;
        }, new Map<string, ModuleData>());

        for (const moduleID of idOrder) {
            if (moduleMap.has(moduleID)) {
                reorderedModules.push(moduleMap.get(moduleID));
                moduleMap.delete(moduleID)
            }
        }

        for (const leftoverModule of Array.from(moduleMap.values())) {
            reorderedModules.push(leftoverModule);
        }

        return reorderedModules;
    }

    sendToProcess("renderer-init");

    let selectedTab: HTMLElement = undefined;

    const handleButtonClick = (moduleID: string, buttonElement: HTMLElement) => {
        setSelectedTab(buttonElement);
        sendToProcess("swap-modules", moduleID);
    }

    const setSelectedTab = (buttonElement: HTMLElement) => {
        if (selectedTab !== undefined) {
            selectedTab.style.color = "";
            selectedTab.style.outlineColor = "";
            selectedTab.style.outlineWidth = "";
        }
        selectedTab = buttonElement;
        selectedTab.setAttribute("style", "color: var(--accent-color); outline-color: var(--accent-color); outline-width: 3px;");
    }



    function loadModules(data: ModuleData[]) {
        const moduleIconsHTML: HTMLElement = document.getElementById("header");

        const getAbbreviation = (moduleName: string) => {
            const ABBREVIATION_LENGTH: number = 3;
            const abbreviation: string[] = moduleName.split(" ").map(s => s[0]);
            const out: string[] = [];

            for (let i = 0; i < ABBREVIATION_LENGTH; i++) {
                if (i >= abbreviation.length) {
                    break;
                }
                out.push(abbreviation[i]);
            }
            return out.join("");
        }


        for (const obj of data) {
            const { moduleName, moduleID, htmlPath, iconPath, url }: { moduleName: string, moduleID: string, htmlPath: string, iconPath?: string, url?: string } = obj;

            if (htmlPath === undefined && url === undefined) { // internal module, ignore
                continue;
            }

            const button: HTMLElement = document.createElement("button");
            button.id = moduleID;
            button.className = "header-button drag-item";
            button.draggable = true;
            button.title = moduleName

            if (iconPath === undefined) {
                button.textContent = getAbbreviation(moduleName);
            } else {
                switch ((iconPath.split(".").at(-1) ?? '').toLowerCase()) {
                    case "svg": {
                        button.innerHTML = `<div class="module-icon svg" style="mask-image: url('${iconPath.replace(/\\/g, "/")}')"></div>`;
                        break;
                    }
                    case "png":
                    case "jpeg":
                    case "jpg": {
                        button.innerHTML = `<img class="module-icon" src="${iconPath.replace(/\\/g, "/")}"  />`;
                        break;
                    }

                    default: {
                        console.log(`Unsupported icon for ${moduleID}: ` + iconPath);
                        button.textContent = getAbbreviation(moduleName);
                        break;
                    }
                }
            }
            button.addEventListener("click", () => {
                handleButtonClick(moduleID, button);
            });

            const builtIns: string[] = ["nexus.Home", "nexus.Settings"];
            if (builtIns.includes(moduleID)) {
                button.draggable = false;

                document.getElementById('built-ins').insertAdjacentElement("beforeend", button);
            } else {
                moduleIconsHTML.insertAdjacentElement("beforeend", button);
            }
        }
    }





    const dragList = document.getElementById('drag-list');
    const importedModulesList = document.getElementById('header');

    let draggedItem: HTMLElement | null = null;
    let lastLine: HTMLElement | null = null;


    // Add event listeners for drag and drop events
    dragList.addEventListener('dragstart', handleDragStart);
    dragList.addEventListener('dragover', handleDragOver);
    dragList.addEventListener('drop', handleDrop);
    dragList.addEventListener("dragend", handleDragEnd)


    // Drag start event handler
    function handleDragStart(event: DragEvent) {
        draggedItem = event.target as HTMLElement;
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/html', draggedItem.innerHTML);
    }

    // Drag over event handler
    function handleDragOver(event: DragEvent) {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';

        const targetItem = event.target as HTMLElement;

        if (targetItem.id === "header") {
            return
        } else if (!targetItem.classList.contains('drag-item')
            || targetItem === draggedItem) {
            removeOldLineAndCreateLine();
            return;
        };

        const rect = targetItem.getBoundingClientRect();
        const isBelow = event.clientY > rect.top + (rect.height / 2);

        if (targetItem.parentElement.id === "built-ins") {
            return
        }

        importedModulesList.insertBefore(removeOldLineAndCreateLine(), isBelow ? targetItem.nextSibling : targetItem);

    }

    function handleDrop(event: DragEvent) {
        event.preventDefault();

        if (lastLine) {
            try {
                importedModulesList.insertBefore(draggedItem, lastLine);
            } catch (_) { }
        }

        draggedItem = null;
    }

    function handleDragEnd(event: DragEvent) {
        event.preventDefault();
        removeOldLineAndCreateLine();

        const order = Array.from(importedModulesList.childNodes)
            .filter(node => node.nodeName === "BUTTON")
            .map(node => (node as HTMLElement).id);

        sendToProcess("module-order", order);

    }

    function removeOldLineAndCreateLine() {
        if (lastLine !== null) {
            lastLine.remove()
            lastLine = null;
        }
        const line = document.createElement("div");
        line.style.outline = "1px dashed var(--accent-color)";

        lastLine = line;
        return line;
    }




})();







