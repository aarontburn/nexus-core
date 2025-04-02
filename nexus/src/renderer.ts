(() => {
    (window as any)["INTERNAL_ID_DO_NOT_USE"] = "built_ins.Main"
    const sendToProcess = (eventType: string, ...data: any[]): Promise<void> => {
        return window.ipc.send(window, eventType, data);
    }

    window.ipc.on(window, (_, eventType: string, data: any[]) => {
        handleEvent(eventType, data);
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
            selectedTab.style.borderColor = "";
        }
        selectedTab = buttonElement;
        selectedTab.setAttribute("style", "color: var(--accent-color); border-color: var(--accent-color);");

        document.getElementById("logo-button").style.backgroundColor = selectedTab.id === "home-button" ? 'var(--accent-color)' : 'var(--off-white)';
        sendToProcess("swap-modules", moduleID);
    }


    function registerHome() {
        const headerHtml: HTMLElement = document.getElementById("header");

        const headerButtonElement: HTMLElement = document.createElement("button");
        headerButtonElement.innerHTML = `<div id="logo-button"></div>`;
        headerButtonElement.setAttribute("style", "color: var(--accent-color); border-color: var(--accent-color);");
        headerButtonElement.id = "home-button"
        selectedTab = headerButtonElement;

        headerButtonElement.addEventListener("click", () => {
            handleButtonClick("built_ins.Home", headerButtonElement);
        });
        headerHtml.insertAdjacentElement("beforeend", headerButtonElement);
        headerHtml.insertAdjacentHTML("beforeend", '<div style="background-color: white; height: 1px; margin: 5px 5px"></div>');
    }
    registerHome();

    function swapLayout(swapToLayoutId: string): void {
        const modules: HTMLCollection = document.getElementById("modules").getElementsByTagName("*");
        for (let i = 0; i < modules.length; i++) {
            modules[i].setAttribute("style", IFRAME_DEFAULT_STYLE + "display: none;");
        }
        document.getElementById(swapToLayoutId).setAttribute("style", IFRAME_DEFAULT_STYLE);
    }



    function loadModules(data: { moduleName: string, moduleID: string, htmlPath: string }[]) {
        const moduleHtml: HTMLElement = document.getElementById("modules");
        const headerHtml: HTMLElement = document.getElementById("header");

        for (const obj of data) {
            const { moduleName, moduleID, htmlPath }: { moduleName: string, moduleID: string, htmlPath: string } = obj;

            if (htmlPath === undefined) {
                continue;
            }
            const moduleIFrameElement: HTMLElement = document.createElement("iframe");
            moduleIFrameElement.id = moduleID;
            moduleIFrameElement.setAttribute("src", htmlPath);
            moduleIFrameElement.setAttribute("style", IFRAME_DEFAULT_STYLE);
            // moduleView.setAttribute("sandbox", SANDBOX_RESTRICTIONS)
            moduleHtml.insertAdjacentElement("beforeend", moduleIFrameElement);


            if (moduleID === "built_ins.Home") {
                continue;
            }
            const headerButtonElement: HTMLElement = document.createElement("button");
            headerButtonElement.textContent = moduleName.split(" ").map(s => s[0]).join("");

            headerButtonElement.addEventListener("click", () => {
                handleButtonClick(moduleID, headerButtonElement);
            });
            headerHtml.insertAdjacentElement("beforeend", headerButtonElement);
        }

    }



})();







