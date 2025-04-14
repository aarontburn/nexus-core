(() => {
    (window as any)["INTERNAL_ID_DO_NOT_USE"] = "built_ins.Main";
    const sendToProcess = (eventName: string, ...data: any[]): Promise<void> => {
        return window.ipc.send(window, eventName, data);
    }

    window.ipc.on(window, (eventName: string, data: any[]) => {
        switch (eventName) {
            case "load-modules": {
                loadModules(data[0]);
                break;
            }
            case "swap-modules": {
                swapVisibleModule(data[0])
                break;
            }
        }
    });

    sendToProcess("renderer-init");
    const IFRAME_DEFAULT_STYLE: string = "height: 100%; width: 100%;";

    let selectedTab: HTMLElement = undefined;



    const handleButtonClick = (moduleID: string, buttonElement: HTMLElement) => {
        if (selectedTab !== undefined) {
            selectedTab.style.color = "";
            selectedTab.style.outlineColor = "";
            selectedTab.style.outlineWidth = "";
        }
        selectedTab = buttonElement;
        selectedTab.setAttribute("style", "color: var(--accent-color); outline-color: var(--accent-color); outline-width: 3px;");

        Array.from(document.getElementsByClassName("svg")).forEach((e: HTMLElement) => {
            e.style.backgroundColor = e.parentElement.id === (moduleID + "-header-button") ? 'var(--accent-color)' : 'var(--off-white)';
        });

        sendToProcess("swap-modules", moduleID);
    }



    function swapVisibleModule(moduleIDToSwapTo: string): void {
        const modules: HTMLCollection = document.getElementById("modules").getElementsByClassName("window");
        for (let i = 0; i < modules.length; i++) {
            modules[i].setAttribute("style", IFRAME_DEFAULT_STYLE + "display: none;");
        }
        document.getElementById(moduleIDToSwapTo).setAttribute("style", IFRAME_DEFAULT_STYLE);
    }



    function loadModules(data: { moduleName: string, moduleID: string, htmlPath: string, iconPath?: string }[]) {

        const moduleFrameHTML: HTMLElement = document.getElementById("modules");
        const moduleIconsHTML: HTMLElement = document.getElementById("header");


        const createAndInsertIFrame = (moduleID: string, htmlPath: string, url?: string) => {
            if (url !== undefined && htmlPath !== undefined) { // has both
                const html: string = `
                    <div class="embedded window" id="${moduleID}">
                        <webview 
                            src="${url}" 
                            partition="persist:${moduleID}" 
                        
                        >
                        </webview>

                        <iframe 
                            src="${htmlPath}" 
                            id="${moduleID}"
                        
                        >
                        </iframe>
                    </div>
                `
                moduleFrameHTML.insertAdjacentHTML('beforeend', html)

            } else if (url !== undefined) { // has url but no html path, use webview but will not need an overlay iframe
                const webView: any = document.createElement("webview");
                webView.setAttribute("src", url);
                webView.className = 'window';
                webView.setAttribute("style", IFRAME_DEFAULT_STYLE);
                webView.setAttribute("partition", `persist:${moduleID}`);
                webView.id = moduleID
                moduleFrameHTML.insertAdjacentElement("beforeend", webView);
            } else if (htmlPath !== undefined) { // has html path but no url, embed in iframe as usual
                const iframe: HTMLElement = document.createElement("iframe");
                iframe.id = moduleID;
                iframe.className = "window"
                iframe.setAttribute("src", htmlPath);
                iframe.setAttribute("style", IFRAME_DEFAULT_STYLE);
                moduleFrameHTML.insertAdjacentElement("beforeend", iframe);
            }





        }

        const createAndInsertButton = (moduleName: string, moduleID: string, iconPath: string | undefined) => {
            const getAbbreviation = () => {
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

            const button: HTMLElement = document.createElement("button");
            button.id = moduleID + "-header-button";
            button.className = "header-button drag-item";
            button.draggable = true;

            if (iconPath === undefined) {
                button.textContent = getAbbreviation();
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
                        button.textContent = getAbbreviation();
                        break;
                    }
                }
            }
            button.addEventListener("click", () => {
                handleButtonClick(moduleID, button);
            });



            const builtIns: string[] = ["built_ins.Home", "built_ins.Settings"];
            if (builtIns.includes(moduleID)) {
                button.draggable = false;

                document.getElementById('built-ins').insertAdjacentElement("beforeend", button);
            } else {
                moduleIconsHTML.insertAdjacentElement("beforeend", button);

            }

        }


        for (const obj of data) {
            const { moduleName, moduleID, htmlPath, iconPath, url }: { moduleName: string, moduleID: string, htmlPath: string, iconPath?: string, url?: string } = obj;

            if (htmlPath === undefined && url === undefined) { // internal module, ignore
                continue;
            }

            createAndInsertIFrame(moduleID, htmlPath, url);
            createAndInsertButton(moduleName, moduleID, iconPath);
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
            .map(node => (node as HTMLElement).id.replace("-header-button", ''));

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







