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
        id: string,
        inputType: string,
        returnValue?: any
    }

    interface ChangeEvent {
        id: string,
        attribute: string,
        value: any
    }

    interface TabInfo {
        moduleName: string,
        moduleID: string,
        moduleInfo: ModuleInfo,
        settings: any[]
    }

    interface ImportedModuleInfo {
        moduleName: string,
        moduleID: string,
        isDeleted: boolean,
        author: string,
        version: string,
        path: string,
        iconPath?: string;

    }

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
    const sendToProcess = (eventName: string, ...data: any[]): Promise<any> => {
        return window.ipc.send(window, eventName, data);
    }

    window.ipc.on(window, (eventName: string, data: any[]) => {
        handleEvent(eventName, data);
    });

    sendToProcess("settings-init");

    let isDeveloperMode: boolean = false;

    let selectedTabElement: HTMLElement = undefined;
    const moduleList: HTMLElement = document.getElementById("left-list");
    const settingsList: HTMLElement = document.getElementById("right");

    const importButton: HTMLElement = document.getElementById('import-button');
    importButton.addEventListener('click', () => {
        sendToProcess('import-module').then(successful => {
            if (successful) {
                openRestartPopup();
            } else {
                console.log("Error importing module.");
            }

        });
    });

    const manageButton: HTMLElement = document.getElementById('manage-button');
    manageButton.addEventListener('click', () => {
        sendToProcess('manage-modules').then(data => {
            swapTabs('manage');
            openManageScreen(data);
        });
    });

    const handleEvent = (eventType: string, data: any[]) => {
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
    };

    function onTabButtonPressed(pressedTabButton: HTMLElement) {
        if (selectedTabElement !== undefined) {
            selectedTabElement.style.color = "";
        }

        selectedTabElement = pressedTabButton;
        selectedTabElement.setAttribute("style", "color: var(--accent-color);");

    }

    function populateSettings(data: { moduleSettingsName: string, moduleID: string, moduleInfo: ModuleInfo }[]): void {
        let firstModule: HTMLElement = undefined;

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
        const spacerHTML: string = `
            <br/>
            <br/>
        `

        settingsList.insertAdjacentHTML("beforeend", spacerHTML);
    }


    const list: HTMLElement = document.getElementById('installed-modules-list');

    function openManageScreen(data: ImportedModuleInfo[]): void {
        document.getElementById("manage-module").hidden = false;

        // Clear list
        while (list.firstChild) {
            list.removeChild(list.lastChild);
        }

        if (data.length === 0) { // No external modules
            const html: string = `
                <p style='margin: 0; margin-left: 15px;'>No external modules found.</p>
            `;
            list.insertAdjacentHTML('beforeend', html);
        }

        data = data.sort((a: ImportedModuleInfo, b: ImportedModuleInfo) => {
            if (a.isDeleted !== b.isDeleted) {
                return a.isDeleted ? 1 : -1;
            }

            return a.moduleName.localeCompare(b.moduleName);
        });


        data.forEach((info: ImportedModuleInfo) => {
            const div: HTMLDivElement = document.createElement('div');
            div.className = 'installed-module';
            div.innerHTML = `
                <div class="module-icon">
                ${info.iconPath ? `<img src="${info.iconPath}"></img>` : `<p>${getAbbreviation(info.moduleName)}</p>`}
                </div>

                <div ${info.isDeleted ? 'class="deleted"' : ''}>
                    <p class="module-name">${info.moduleName}${info.isDeleted ? ' (Deleted)' : ''}</p>
                    <p class="module-id">${info.moduleID} ${info.version ? `| ${info.version}` : ''}</p>
                    <p class="module-path">${info.path}</p>
                </div>

                <div style="margin-right: auto;"></div>

                ${!info.isDeleted ?
                    `<p class='remove-module-button clickable' style="color: red; margin-right: 15px">Remove</p>`
                    : `<p style="margin-right: 15px; font-style: italic; text-align: right; color: gray;">Restart Required</p>`
                }
            `;


            div.querySelector('.remove-module-button')?.addEventListener('click', async () => {
                const proceed: boolean = await openConfirmModuleDeletionPopup();
                if (proceed) {
                    sendToProcess('remove-module', info).then(successful => {
                        if (successful) {
                            console.log('Removed ' + info.moduleID);
                            openDeletedPopup()
                        } else {
                            console.log('Failed to remove ' + info.moduleID);
                        }

                        sendToProcess('manage-modules').then(openManageScreen);
                    });
                }
            });

            list.insertAdjacentElement('beforeend', div);
        });
    }

    async function openPopup(
        html: string,
        rejectID: string = 'dialog-cancel',
        resolveID: string = 'dialog-proceed'): Promise<boolean> {

        return new Promise((resolve) => {
            const div: HTMLElement = document.createElement("div");
            div.classList.add('overlay');
            div.innerHTML = html;
            document.body.prepend(div);

            div.addEventListener('click', (event) => {
                if ((event.target as HTMLElement).className.includes('overlay')) {
                    div.remove();
                    resolve(false);
                }
            });

            div.querySelector(`#${rejectID}`)?.addEventListener('click', () => {
                div.remove();
                resolve(false);
            });

            div.querySelector(`#${resolveID}`)?.addEventListener('click', () => {
                div.remove();
                resolve(true);
            });
        });
    }


    function color(text: string, color: string = 'var(--accent-color)'): string {
        return `<span style='color: ${color};'>${text}</span>`
    }

    function openConfirmModuleDeletionPopup(): Promise<boolean> {
        const html: string = `
            <div class='dialog'>
                <h3 class='disable-highlight'>Are you sure you want to ${color('delete', 'red')} this module?</h3>
                <h4>Your data will be saved.<h4/>
                <h4 style="padding-top: 10px;" class='disable-highlight'>Proceed?</h4>

                <div style="display: flex; justify-content: space-between; margin: 0px 15px; margin-top: 15px;">
                    <h3 class='disable-highlight' id='dialog-cancel'>Cancel</h3>
                    <h3 class='disable-highlight' id='dialog-proceed'>Delete</h3>
                </div>
            </div>
        `;

        return openPopup(html);
    }

    function openDeletedPopup() {
        const html: string = `
            <div class='dialog'>
                <h3 class='disable-highlight'>${color('Successfully', 'green')} deleted module.</h3>
                <h4>Restart required for the changes to take effect.<h4/>
                <h4 style="padding-top: 10px;" class='disable-highlight'>Restart now?</h4>

                <div style="display: flex; justify-content: space-between; margin: 0px 15px; margin-top: 15px;">
                    <h3 class='disable-highlight' id='dialog-cancel'>Not Now</h3>
                    <h3 class='disable-highlight' id='dialog-proceed'>Restart</h3>
                </div>
            </div>
        `;

        openPopup(html).then((proceed: boolean) => {
            if (proceed) {
                sendToProcess("restart-now");
            }
        });
    }





    function openRestartPopup(): void {
        const html: string = `
            <div class='dialog'>
                <h3 class='disable-highlight'>${color('Successfully', 'green')} imported the module.</h3>
                <h4>You need to restart to finish the setup.<h4/>
                <h4 style="padding-top: 10px;" class='disable-highlight'>Restart now?</h4>

                <div style="display: flex; justify-content: space-between; margin: 0px 15px; margin-top: 15px;">
                    <h3 class='disable-highlight' id='dialog-cancel'>Not now</h3>
                    <h3 class='disable-highlight' id='dialog-proceed'>Restart</h3>
                </div>
            </div>
        `;

        openPopup(html).then((proceed: boolean) => {
            if (proceed) {
                sendToProcess("restart-now");
            }
        });

    }

    function openLinkPopup(link: string): void {
        const html: string = `
            <div class="dialog">
                <h3 class='disable-highlight'>You are navigating to an ${color('external', 'red')} website.</h3>
                <h4 class='link'>${link}</h4>
                <h4 style="padding-top: 10px;" class='disable-highlight'>Only visit the site if you trust it.</h4>

                <div style="display: flex; justify-content: space-between; margin: 0px 15px; margin-top: 15px;">
                    <h3 class='disable-highlight' id='dialog-cancel'>Cancel</h3>
                    <h3 class='disable-highlight' id='dialog-proceed'>Proceed</h3>
                </div>
            </div>
        `

        openPopup(html).then((proceed: boolean) => {
            if (proceed) {
                sendToProcess("open-link", link);
            }
        });

    }




    document.body.addEventListener('click', event => {
        if ((event.target as HTMLElement).tagName.toLowerCase() === 'a') {
            event.preventDefault();
            openLinkPopup((event.target as HTMLAnchorElement).href)
        }
    });
})();



