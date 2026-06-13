var port = undefined;
function sendToMain(eventType) {
    var data = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        data[_i - 1] = arguments[_i];
    }
    port === null || port === void 0 ? void 0 : port.postMessage({ eventType: eventType, data: data });
}
var idMap = {
    windowTitle: "window-title",
    content: "content",
    rejectButton: "reject-button",
    resolveButton: "resolve-button"
};
window.onmessage = function (event) {
    if (event.source === window && event.data === 'main-world-port') {
        port = event.ports[0];
        port.onmessage = function (event) {
            if (event.data.initialData) {
                var modalParams = event.data.initialData;
                document.getElementById(idMap.windowTitle).textContent = "".concat(modalParams.windowTitle, " (").concat(modalParams.moduleID, ")");
                document.getElementById(idMap.resolveButton).textContent = modalParams.resolveText;
                document.getElementById(idMap.content).innerHTML = modalParams.htmlContentString;
                if (modalParams.rejectText) {
                    document.getElementById(idMap.rejectButton).textContent = modalParams.rejectText;
                }
                else {
                    document.getElementById(idMap.rejectButton).style.display = "none";
                }
            }
        };
    }
};
document.getElementById(idMap.rejectButton).addEventListener('click', function () {
    sendToMain("reject");
    window.close();
});
document.getElementById(idMap.resolveButton).addEventListener('click', function () {
    sendToMain("resolve");
    window.close();
});
Array.from(document.getElementsByClassName("close-button")).forEach(function (e) {
    e.addEventListener('click', function () {
        sendToMain("closed");
        window.close();
    });
});
//# sourceMappingURL=modal.js.map