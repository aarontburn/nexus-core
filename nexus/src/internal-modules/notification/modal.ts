let port: MessagePort | undefined = undefined;

function sendToMain(eventType: string, ...data: any[]) {
    port?.postMessage({ eventType, data });
}

interface ModalParams {
    windowTitle: string;
    htmlContentString: string;
    rejectText?: string | undefined; // cancel/close, if undefined will not show up
    resolveText: string; // confirm etc,
    moduleID: string;
}

const idMap = {
    windowTitle: "window-title",
    content: "content",
    rejectButton: "reject-button",
    resolveButton: "resolve-button",
}





window.onmessage = (event) => {
    if (event.source === window && event.data === 'main-world-port') {
        port = event.ports[0];
        port.onmessage = (event) => {
            if (event.data.initialData) {
                const modalParams: ModalParams = event.data.initialData;
                document.getElementById(idMap.windowTitle).textContent = `${modalParams.windowTitle} (${modalParams.moduleID})`;
                document.getElementById(idMap.resolveButton).textContent = modalParams.resolveText;

                document.getElementById(idMap.content).innerHTML = modalParams.htmlContentString

                if (modalParams.rejectText) {
                    document.getElementById(idMap.rejectButton).textContent = modalParams.rejectText;
                } else {
                    document.getElementById(idMap.rejectButton).style.display = "none";

                }

            }
        }
    }
}

document.getElementById(idMap.rejectButton).addEventListener('click', () => {
    sendToMain("reject")
    window.close()
});

document.getElementById(idMap.resolveButton).addEventListener('click', () => {
    sendToMain("resolve")
    window.close()
});


Array.from(document.getElementsByClassName("close-button")).forEach((e: HTMLElement) => {
    e.addEventListener('click', () => {
        sendToMain("closed")
        window.close()
    })
})