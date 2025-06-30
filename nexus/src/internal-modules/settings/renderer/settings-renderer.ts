(() => {
    interface ModuleInfo {
        name: string;
        id: string;
        version: string;
        author?: string;
        description?: string;
        platforms?: string[];
        link?: string;
        "git-latest"?: {
            "git-username": string;
            "git-repo-name": string;
        };
        build: {
            'build-version': number;
            process: string;
            excluded?: string[];
            included?: string[];
            replace?: {
                from: string;
                to: string;
                at: string[];
            }[];
        };
    }

    interface InputElement {
        id: string;
        inputType: string;
        returnValue?: any;
    }

    interface ChangeEvent {
        id: string;
        attribute: string;
        value: any;
    }

    interface TabInfo {
        moduleName: string;
        moduleID: string;
        moduleInfo: ModuleInfo;
        settings: any[];
    }


    const sendToProcess = (eventName: string, ...data: any[]): Promise<any> => {
        return window.ipc.sendToProcess(eventName, data);
    }


    let isDeveloperMode: boolean = false;

    let selectedTabElement: HTMLElement = undefined;
    const moduleList: HTMLElement = document.getElementById("left-list");
    const settingsList: HTMLElement = document.getElementById("right");


    const manageButton: HTMLElement = document.getElementById('manage-button');
    manageButton.addEventListener('click', () => {
        swapTabs('manage');
        onTabButtonPressed(undefined);
    });


    window.ipc.onProcessEvent((eventType: string, data: any[]) => {
        switch (eventType) {
            case 'is-dev': {
                isDeveloperMode = data[0] as boolean;

                Array.from(document.getElementsByClassName("hidden-unless-dev")).forEach(e => {
                    if (isDeveloperMode) {
                        e.classList.remove('hidden');
                    } else {
                        e.classList.add('hidden');
                    }
                })

                break;
            }
            case "populate-settings-list": {
                populateSettings(data[0]);
                break;
            }
            case "swap-tabs": {
                const tabInfo: TabInfo = data[0];
                swapTabs(tabInfo);
                onTabButtonPressed(document.getElementById(`${tabInfo.moduleID}-tab-button`))
                break;
            }

            case "setting-modified": {
                const event: ChangeEvent[] = data[0];

                for (const group of event) {
                    const element: any = document.getElementById(group.id);
                    element[group.attribute] = group.value;
                }
                break;
            }


        }
    });
    sendToProcess("settings-init");


    function onTabButtonPressed(pressedTabButton?: HTMLElement) {
        if (selectedTabElement !== undefined) {
            selectedTabElement.style.color = "";
        }

        selectedTabElement = pressedTabButton;
        selectedTabElement?.setAttribute("style", "color: var(--accent-color);");

    }

    function populateSettings(data: { moduleSettingsName: string, moduleID: string, moduleInfo: ModuleInfo }[]): void {
        let firstModule: HTMLElement = undefined;

        const priority: { [id: string]: number } = {
            "nexus.Settings": 0,
            "nexus.Home": 1
        };

        data = data.sort((a, b) => {
            const aPriority: number = priority[a.moduleID] !== undefined ? priority[a.moduleID] : 2;
            const bPriority: number = priority[b.moduleID] !== undefined ? priority[b.moduleID] : 2;

            if (aPriority !== bPriority) {
                return aPriority - bPriority;
            }

            return a.moduleSettingsName.localeCompare(b.moduleSettingsName);
        });

        data.forEach((obj: { moduleSettingsName: string, moduleID: string, moduleInfo: ModuleInfo }) => {
            // Setting group click button
            const tabButton: HTMLElement = document.createElement("p");
            tabButton.className = 'setting-group';
            tabButton.innerText = obj.moduleSettingsName;
            tabButton.id = `${obj.moduleID}-tab-button`;
            tabButton.addEventListener("click", () => {
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

    const inputTypeToStateMap: Map<string, string> = new Map([
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



    function swapTabs(tab: TabInfo | string): void {
        // Clear existing settings
        const removeNodes: Node[] = [];
        settingsList.childNodes.forEach((node: HTMLElement) => {
            if (node.id !== 'manage-module') {
                removeNodes.push(node);
            } else {
                node.hidden = true;
            }
        });

        removeNodes.forEach(node => settingsList.removeChild(node));

        if (tab === 'manage') {
            return;
        }

        const tabInfo: TabInfo = tab as TabInfo;


        function getModuleInfoHTML(moduleInfo: ModuleInfo): string {
            return `
                <p id='open-folder' class='setting-group'>🗀</p>
                <div class="header">
                    <p class="module-name">${moduleInfo.name || tabInfo.moduleName}</p>
                    <p class="module-id hidden-unless-dev ${!isDeveloperMode ? 'hidden' : ''}" id="moduleID">${tabInfo.moduleID} (v${moduleInfo.version})</p>
                </div>
                ${moduleInfo.description ? `<p class="module-desc">${moduleInfo.description}</p>` : ''}

                ${moduleInfo.author ? `<p><span>Author: </span> ${moduleInfo.author}</p>` : ''}
                ${moduleInfo.link ? `<p><span>Link: </span><a href=${moduleInfo.link}>${moduleInfo.link}</a><p/>` : ''}
            `
        }


        const moduleInfo: ModuleInfo = tabInfo.moduleInfo;

        if (moduleInfo !== undefined) {
            const moduleInfoHTML: string = `
                <div class='module-info'>
                    ${getModuleInfoHTML(moduleInfo).replace(/  /g, '').replace(/\n/g, '').trim()}
                </div>
            `
            settingsList.insertAdjacentHTML("beforeend", moduleInfoHTML);
            document.getElementById('open-folder').addEventListener('click', () => {
                sendToProcess('open-module-folder', tabInfo.moduleID);
            })
        }

        tabInfo.settings.forEach(settingInfo => {
            if (typeof settingInfo === 'string') {
                const headerHTML: string = `
                    <div class='section'>
                        <p>—    ${settingInfo}    —</p>
                    </div>

                `
                settingsList.insertAdjacentHTML('beforeend', headerHTML);
                return;
            }

            const settingId: string = settingInfo.settingId;
            const inputTypeAndId: InputElement[] = settingInfo.inputTypeAndId;
            const uiHTML: string = settingInfo.ui;
            const [sourceObject, style]: string[] = settingInfo.style;


            settingsList.insertAdjacentHTML("beforeend", uiHTML);

            // Attach events to reset button
            const resetButton: HTMLElement = document.getElementById(`reset-button_${settingId}`);
            resetButton?.addEventListener("click", () => {
                sendToProcess("setting-reset", inputTypeAndId[0].id);
            });

            // Add custom setting css to setting
            if (style !== "") {
                const styleId = sourceObject;
                if (document.getElementById(styleId) === null) {
                    const styleSheet: HTMLElement = document.createElement('style')
                    styleSheet.id = sourceObject;
                    styleSheet.innerHTML = style
                    settingsList.appendChild(styleSheet);
                }
            }

            inputTypeAndId.forEach((group: InputElement) => {
                const id: string = group.id;
                const inputType: string = group.inputType;
                const returnValue: string | undefined = group.returnValue;
                let attribute: string = inputTypeToStateMap.get(inputType);

                if (attribute === undefined) {
                    console.error('Invalid input type found: ' + inputType);
                    console.error('Attempting to assign it "value"');
                    attribute = 'value';
                }



                const element: HTMLElement = document.getElementById(id);

                switch (inputType) {
                    case 'click': {
                        element.addEventListener('click', () => {
                            sendToProcess("setting-modified", id, returnValue ? returnValue : (element as any)[attribute]);
                        })
                        break;
                    }
                    case "file": {
                        element.addEventListener('change', () => {
                            console.log(Array.from((element as any)[attribute]))
                            sendToProcess("setting-modified", id, returnValue ? returnValue : Array.from((element as any)[attribute]).map((file: File) => window.webUtils.getPathForFile(file) ));
                        })
                        break;
                    }

                    case 'number':
                    case 'text': {
                        element.addEventListener('keyup', (event: KeyboardEvent) => {
                            if (event.key === "Enter") {
                                sendToProcess("setting-modified", id, returnValue ? returnValue : (element as any)[attribute]);
                                element.blur();
                            }
                        });

                        element.addEventListener('blur',
                            () => sendToProcess("setting-modified", id, returnValue ? returnValue : (element as any)[attribute]));

                        break;
                    }
                    case 'color':
                    case 'range': {
                        let debounceTimer: NodeJS.Timeout;

                        element.addEventListener('input', () => {
                            clearTimeout(debounceTimer);
                            debounceTimer = setTimeout(() => {
                                sendToProcess('setting-modified', id, returnValue ? returnValue : (element as any)[attribute]);
                            }, 100);
                        });
                        break;
                    }
                    case "checkbox":
                    case 'select':
                    case 'radio': {
                        element.addEventListener('change', () => {
                            sendToProcess('setting-modified', id, returnValue ? returnValue : (element as any)[attribute])
                        })
                        break;
                    }
                    // TODO: Add additional options
                }


            });

        });

        // Add spacers to the bottom
        settingsList.insertAdjacentHTML("beforeend", `<br/><br/>`);
    }
})();



