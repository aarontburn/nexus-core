(() => {
    interface ModuleInfo {
        moduleName: string,
        author: string,
        version: string,
        description: string,
        buildVersion: number,
        platforms: string[]
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
        module: string,
        moduleID: string,
        moduleInfo: ModuleInfo,
        settings: any[]
    }

    const MODULE_ID: string = "built_ins.Settings";
    const sendToProcess = (eventType: string, ...data: any[]): Promise<any> => {
        return window.parent.ipc.send(MODULE_ID, eventType, ...data);
    }

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

    window.parent.ipc.on(MODULE_ID, (_, eventType: string, ...data: any[]) => {
        switch (eventType) {
            case 'is-dev': {
                isDeveloperMode = data[0] as boolean;

                const element: HTMLElement = document.getElementById('moduleID');
                if (element) {
                    element.hidden = !isDeveloperMode;
                }
                break;
            }
            case "populate-settings-list": {
                populateSettings(data[0]);
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
            case "refresh-settings": {
                const newAccentColor: string = data[0];
                const root: any = window.parent.document.querySelector(':root');

                root.style.setProperty('--accent-color', newAccentColor);
                const contentChildren: HTMLCollection = window.parent.document.body.querySelector(".content").children;

                for (let i = 0; i < contentChildren.length; i++) {
                    const child: any = contentChildren.item(i);
                    if (contentChildren.item(i).tagName.toLowerCase() === "iframe") {
                        child.contentWindow
                            .document.querySelector(":root")
                            .style.setProperty('--accent-color', newAccentColor)
                    }
                }

                break;
            }

        }
    });

    function populateSettings(data: { module: string, moduleInfo: any }[]): void {
        let firstModule: HTMLElement;

        data.forEach((obj: { module: string, moduleInfo: any }) => {
            const moduleName: string = obj.module;

            // Setting group click button
            const groupElement: HTMLElement = document.createElement("p");
            groupElement.className = 'setting-group';
            groupElement.innerText = moduleName;
            groupElement.addEventListener("click", () => {
                if (selectedTabElement !== undefined) {
                    selectedTabElement.style.color = "";
                }

                selectedTabElement = groupElement;
                selectedTabElement.setAttribute("style", "color: var(--accent-color);");

                sendToProcess('swap-settings-tab', moduleName).then(swapTabs);
            });

            if (firstModule === undefined) {
                firstModule = groupElement;
            }

            moduleList.insertAdjacentElement("beforeend", groupElement);
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

    const keyBlacklist: string[] = [
        'moduleName', 'module_name',
        'buildVersion', 'build_version',
    ];

    const nonDevWhitelist: string[] = [
        'moduleName', 'module_name',
        'description',
        'link',
        'author',
    ];




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


        function getModuleInfoHTML(moduleInfo: any): string {
            const toSentenceCase = (key: string) => key.charAt(0).toUpperCase() + key.slice(1);
            const inner: string[] = [];


            inner.push(`<p id='open-folder' class='setting-group' style='float: right; font-size: 25px; margin-top: -12px;'>🗀</p>`)
            inner.push(`<p style="font-size: 27px; color: var(--accent-color);">${moduleInfo.moduleName || tabInfo.module}</p>`);
            inner.push(`<p id='moduleID' ${!isDeveloperMode ? 'hidden' : ''}><span>Module ID: </span>${tabInfo.moduleID}<p/>`);

            for (const key in moduleInfo) {
                if (keyBlacklist.includes(key)) {
                    continue;
                }

                const value: any = moduleInfo[key];
                if (!value || value.length === 0) {
                    continue;
                }

                if (!isDeveloperMode) {
                    if (key.toLowerCase() === "link") {
                        inner.push(`<p><span>${toSentenceCase(key)}: </span><a href=${value}>${value}</a><p/>`);
                    } else if (nonDevWhitelist.includes(key)) {
                        inner.push(`<p><span>${toSentenceCase(key)}:</span> ${value}</p>`);
                    }

                } else {
                    if (key.toLowerCase() === "link") {
                        inner.push(`<p><span>${toSentenceCase(key)}: </span><a href=${value}>${value}</a><p/>`);
                        continue;
                    }
                    inner.push(`<p><span>${toSentenceCase(key)}:</span> ${value}</p>`);
                }


            }
            return inner.reduce((acc, html) => acc += html + "\n", '');
        }


        const moduleInfo: ModuleInfo = tabInfo.moduleInfo;

        if (moduleInfo !== undefined) {
            const moduleInfoHTML: string = `
                <div class='module-info'>
                    ${getModuleInfoHTML(moduleInfo)}
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
                        <p>${settingInfo}</p>
                    </div>

                `
                settingsList.insertAdjacentHTML('beforeend', headerHTML);
                return;
            }

            const settingId: string = settingInfo.settingId;
            const inputTypeAndId: InputElement[] = settingInfo.inputTypeAndId;
            const html: string = settingInfo.ui;
            const [sourceObject, style]: string[] = settingInfo.style;


            settingsList.insertAdjacentHTML("beforeend", html);

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
                        element.addEventListener('input',
                            () => sendToProcess('setting-modified', id, returnValue ? returnValue : (element as any)[attribute]))
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


    const screen: HTMLElement = document.getElementById("manage-module");
    const list: HTMLElement = document.getElementById('installed-modules-list');

    function openManageScreen(data: { name: string, deleted: boolean }[]): void {
        screen.hidden = false;

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


        data.forEach(({ name, deleted }) => {
            const div: HTMLDivElement = document.createElement('div');
            div.className = 'installed-module';
            div.innerHTML = `
                ${!deleted
                    ? `<p>${name}</p>`
                    : `<p style="font-style: italic; color: grey;"}>${name}</p>`}

                <div style="margin-right: auto;"></div>

                ${!deleted
                    ? `<p class='remove-module-button' style="color: red; margin-right: 15px">Remove</p>`
                    : `<p style="margin-right: 15px; font-style: italic;">Restart Required</p>`}
            `;


            div.querySelector('.remove-module-button')?.addEventListener('click', async () => {
                const proceed: boolean = await openConfirmModuleDeletionPopup();
                if (proceed) {
                    sendToProcess('remove-module', name).then(successful => {
                        if (successful) {
                            console.log('Removed ' + name);
                            openDeletedPopup()
                        } else {
                            console.log('Failed to remove ' + name);
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



    dragElement(document.getElementById("separator"));
    function dragElement(element: HTMLElement) {
        let md: any;
        const left: HTMLElement = document.getElementById("left");
        const right: HTMLElement = document.getElementById("right");
        const container: HTMLElement = document.getElementById("splitter");

        element.onmousedown = (e: MouseEvent) => {
            md = {
                e,
                leftWidth: left.offsetWidth,
                rightWidth: right.offsetWidth,
                containerWidth: container.offsetWidth
            };

            document.onmousemove = (e: MouseEvent) => {
                const deltaX: number = e.clientX - md.e.clientX

                let newLeftWidth: number = md.leftWidth + deltaX;
                let newRightWidth: number = md.rightWidth - deltaX;

                if (newLeftWidth < 0) {
                    newLeftWidth = 0;
                }

                if (newRightWidth < 0) {
                    newRightWidth = 0;
                }

                const leftPercent: number = (newLeftWidth / md.containerWidth) * 100;
                const rightPercent: number = (newRightWidth / md.containerWidth) * 100;

                left.style.width = leftPercent + "%";
                right.style.width = rightPercent + "%";
            };

            document.onmouseup = () => {
                document.onmousemove = document.onmouseup = null;
            };
        };
    }

    document.body.addEventListener('click', event => {
        if ((event.target as HTMLElement).tagName.toLowerCase() === 'a') {
            event.preventDefault();
            openLinkPopup((event.target as HTMLAnchorElement).href)
        }
    });
})();



