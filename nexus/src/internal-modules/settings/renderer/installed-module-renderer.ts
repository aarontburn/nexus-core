(() => {
    const sendToProcess = (eventName: string, ...data: any[]): Promise<any> => {
        return window.ipc.sendToProcess(eventName, data);
    }

    interface ImportedModuleInfo {
        moduleName: string;
        moduleID: string;
        isDeleted: boolean;
        author: string;
        version: string;
        path: string;
        iconPath?: string;
        updateAvailable?: boolean;

    }

    const getAbbreviation = (moduleName: string): string => {
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



    const manageButton: HTMLElement = document.getElementById('manage-button');
    manageButton.addEventListener('click', () => {
        sendToProcess('manage-modules').then(data => {
            openManageScreen(data);
        });
    });

    const renderIfTrue = (condition: boolean, html: string): string => condition ? html : '';


    const list: HTMLElement = document.getElementById('installed-modules-list');

    const forceReloadedModules: string[] = [];
    const updatedModules: string[] = [];


    function openManageScreen(data: ImportedModuleInfo[]): void {
        document.getElementById("manage-module").hidden = false;

        // Clear list
        while (list.firstChild) {
            list.removeChild(list.lastChild);
        }

        if (data.length === 0) { // No external modules
            list.insertAdjacentHTML('beforeend', `<p style='margin: 0; margin-left: 15px;'>No external modules found.</p>`);
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
                    <p class="module-name">${info.moduleName}${renderIfTrue(info.isDeleted, ' (Deleted)')}</p>
                    <p class="module-id">${info.moduleID} <span class="module-version">| ${info.version}${renderIfTrue(info.updateAvailable, ` (Update Available)`)}</span></p>
                    <p class="module-path">${info.path}</p>
                </div>

                <div style="margin-right: auto;"></div>

                <div class="module-controls">
                ${!info.isDeleted
                    ? ` 
                        <p class='check-update-button clickable'>${updatedModules.includes(info.moduleID) ? 'Restart Now' : info.updateAvailable ? "Update Now" : 'Check For Update'}</p>
                        <p class='force-reload-button clickable'>${forceReloadedModules.includes(info.moduleID) ? 'Reloading Next Launch' : 'Force Reload'}</p>
                        <p class='remove-module-button clickable';">Uninstall</p>
                    `

                    : `<p style="font-style: italic; text-align: right; color: gray;">Restart Required</p>`
                }
                </div>

            `;
            if (!info.isDeleted) {
                const checkUpdateButton: HTMLElement = div.querySelector('.check-update-button');
                if (updatedModules.includes(info.moduleID)) {
                    checkUpdateButton.style.pointerEvents = "none";
                    checkUpdateButton.style.color = "var(--accent-color)";
                }
                checkUpdateButton.addEventListener('click', async () => {
                    if (checkUpdateButton.textContent === "Restart Now") {
                        sendToProcess('restart-now');

                    } else if (checkUpdateButton.textContent === "Update Now") {
                        checkUpdateButton.textContent = "Updating...";
                        checkUpdateButton.style.pointerEvents = "none";
                        checkUpdateButton.style.color = "var(--accent-color)";

                        sendToProcess('update-module', info.moduleID).then(successful => {
                            if (successful) {
                                updatedModules.push(info.moduleID);
                                checkUpdateButton.textContent = "Restart Now";
                                checkUpdateButton.style.pointerEvents = "";
                            } else {
                                checkUpdateButton.textContent = "Couldn't Install Update";

                                setTimeout(() => {
                                    checkUpdateButton.textContent = "Update Now";
                                    checkUpdateButton.style.pointerEvents = "";
                                    checkUpdateButton.style.color = "";
                                }, 2000);
                            }
                        });

                    } else if (checkUpdateButton.textContent === "Check For Update") {
                        checkUpdateButton.textContent = "Checking for update...";
                        checkUpdateButton.style.pointerEvents = "none";
                        checkUpdateButton.style.color = "var(--accent-color)";

                        Promise.all([
                            sendToProcess('check-for-update', info.moduleID),
                            new Promise(resolve => setTimeout(resolve, 1000)),
                        ]).then(([isUpdateAvailable]) => {
                            if (isUpdateAvailable) {
                                checkUpdateButton.textContent = "Update Now";
                                checkUpdateButton.style.pointerEvents = "";
                                div.querySelector('.module-version').textContent = `| ${info.version} (Update Available)`;
                            } else {
                                checkUpdateButton.textContent = "No Update Found";

                                setTimeout(() => {
                                    checkUpdateButton.textContent = "Check For Update";
                                    checkUpdateButton.style.pointerEvents = "";
                                    checkUpdateButton.style.color = "";
                                }, 2000);
                            }
                        });
                    }
                });

                const forceReloadButton: HTMLElement = div.querySelector('.force-reload-button');
                if (forceReloadedModules.includes(info.moduleID)) {
                    forceReloadButton.style.pointerEvents = "none";
                    forceReloadButton.style.color = "var(--faded-color)";
                }
                forceReloadButton.addEventListener('click', async () => {
                    forceReloadedModules.push(info.moduleID);
                    forceReloadButton.textContent = 'Reloading Next Launch';
                    forceReloadButton.style.pointerEvents = "none";
                    forceReloadButton.style.color = "var(--faded-color)";


                    sendToProcess('force-reload-module', info.moduleID)
                });

                div.querySelector('.remove-module-button').addEventListener('click', async () => {
                    const proceed: boolean = await openConfirmModuleDeletionPopup();
                    if (proceed) {
                        sendToProcess('remove-module', info).then(successful => {
                            if (successful) {
                                openDeletedPopup()
                            }
                            sendToProcess('manage-modules').then(openManageScreen);
                        });
                    }
                });
            }



            list.insertAdjacentElement('beforeend', div);
        });
    }


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



    async function openPopup(html: string): Promise<boolean> {

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

            div.querySelector(`#dialog-cancel`)?.addEventListener('click', () => {
                div.remove();
                resolve(false);
            });

            div.querySelector(`#dialog-proceed`)?.addEventListener('click', () => {
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
                <h3>Are you sure you want to ${color('delete', 'red')} this module?</h3>
                <h4>Your data will be saved.<h4/>
                <h4 style="padding-top: 10px;">Proceed?</h4>

                <div id="dialog-controls-container">
                    <h3 id='dialog-cancel'>Cancel</h3>
                    <h3 id='dialog-proceed'>Delete</h3>
                </div>
            </div>
        `;

        return openPopup(html);
    }

    function openDeletedPopup() {
        const html: string = `
            <div class='dialog'>
                <h3 >${color('Successfully', 'green')} deleted module.</h3>
                <h4>Restart required for the changes to take effect.<h4/>
                <h4 style="padding-top: 10px;">Restart now?</h4>

                <div id="dialog-controls-container">
                    <h3 id='dialog-cancel'>Not Now</h3>
                    <h3 id='dialog-proceed'>Restart</h3>
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
                <h3>${color('Successfully', 'green')} imported the module.</h3>
                <h4>You need to restart to finish the setup.<h4/>
                <h4 style="padding-top: 10px;">Restart now?</h4>

                <div id="dialog-controls-container">
                    <h3 id='dialog-cancel'>Not now</h3>
                    <h3 id='dialog-proceed'>Restart</h3>
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
                <h3>You are navigating to an ${color('external', 'red')} website.</h3>
                <h4 class='link'>${link}</h4>
                <h4 style="padding-top: 10px;">Only visit the site if you trust it.</h4>

                <div id="dialog-controls-container">
                    <h3 id='dialog-cancel'>Cancel</h3>
                    <h3 id='dialog-proceed'>Proceed</h3>
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