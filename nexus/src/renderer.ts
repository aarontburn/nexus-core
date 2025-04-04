(() => {
    (window as any)["INTERNAL_ID_DO_NOT_USE"] = "built_ins.Main"
    const sendToProcess = (eventName: string, ...data: any[]): Promise<void> => {
        return window.ipc.send(window, eventName, data);
    }

    window.ipc.on(window, (eventName: string, data: any[]) => {
        handleEvent(eventName, data);
    });


    sendToProcess("renderer-init");

    const IFRAME_DEFAULT_STYLE: string = "height: 100%; width: 100%;";

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


    let selectedTab: HTMLElement = undefined;


    const handleEvent = (eventType: string, data: any[]) => {
        switch (eventType) {
            case "load-modules": {
                console.log(data[0]);
                loadModules(data[0]);
                break;
            }
            case "swap-modules": {
                swapLayout(data[0])
                break;
            }
        }
    }


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




    function swapLayout(swapToLayoutId: string): void {
        const modules: HTMLCollection = document.getElementById("modules").getElementsByTagName("*");
        for (let i = 0; i < modules.length; i++) {
            modules[i].setAttribute("style", IFRAME_DEFAULT_STYLE + "display: none;");
        }
        document.getElementById(swapToLayoutId).setAttribute("style", IFRAME_DEFAULT_STYLE);
    }



    function loadModules(data: { moduleName: string, moduleID: string, htmlPath: string, iconPath?: string }[]) {
        const builtIns: string[] = ["built_ins.Home", "built_ins.Settings"];


        const moduleFrameHTML: HTMLElement = document.getElementById("modules");
        const moduleIconsHTML: HTMLElement = document.getElementById("header");

        for (const obj of data) {
            const { moduleName, moduleID, htmlPath, iconPath }: { moduleName: string, moduleID: string, htmlPath: string, iconPath?: string } = obj;

            if (htmlPath === undefined) { // internal module, ignore
                continue;
            }
            const moduleIFrameElement: HTMLElement = document.createElement("iframe");
            moduleIFrameElement.id = moduleID;
            moduleIFrameElement.setAttribute("src", htmlPath);
            moduleIFrameElement.setAttribute("style", IFRAME_DEFAULT_STYLE);
            // moduleView.setAttribute("sandbox", SANDBOX_RESTRICTIONS)
            moduleFrameHTML.insertAdjacentElement("beforeend", moduleIFrameElement);

            const headerButtonElement: HTMLElement = document.createElement("button");
            headerButtonElement.id = moduleID + "-header-button";

            if (iconPath === undefined) {
                headerButtonElement.textContent = moduleName.split(" ").map(s => s[0]).join("");
            } else {
                switch ((iconPath.split(".").at(-1) ?? '').toLowerCase()) {
                    case "svg": {
                        headerButtonElement.innerHTML = `<div class="module-icon svg" style="mask-image: url('${iconPath.replace(/\\/g, "/")}')"></div>`;
                        break;
                    }
                    case "png":
                    case "jpeg":
                    case "jpg": {
                        headerButtonElement.innerHTML = `<img class="module-icon" src="${iconPath.replace(/\\/g, "/")}"  />`;
                        break;
                    }

                    default: {
                        console.log(`Unsupported icon for ${moduleID}: ` + iconPath);
                        headerButtonElement.textContent = moduleName.split(" ").map(s => s[0]).join("");
                        break;
                    }
                }
            }
            headerButtonElement.addEventListener("click", () => {
                handleButtonClick(moduleID, headerButtonElement);
            });

            if (builtIns.includes(moduleID)) {
                document.getElementById('built-ins').insertAdjacentElement("beforeend", headerButtonElement);
            } else {
                moduleIconsHTML.insertAdjacentElement("beforeend", headerButtonElement);

            }








        }

    }



})();







