(function () {
    var sendToProcess = function (eventType) {
        var data = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            data[_i - 1] = arguments[_i];
        }
        return window.ipc.sendToProcess(eventType, data);
    };
    sendToProcess("init");
    var displayContainer = document.getElementById('center');
    var fullDate = document.getElementById("full-date");
    var abbreviatedDate = document.getElementById("abbreviated-date");
    var standardTime = document.getElementById("standard-time");
    var militaryTime = document.getElementById("military-time");
    var currentOrder = undefined;
    window.ipc.onProcessEvent(function (eventType, data) {
        switch (eventType) {
            case "is-first-launch": {
                window.location.href = "../first-boot/html/1welcome.html";
                break;
            }
            case "update-clock": {
                fullDate.innerHTML = data[0];
                abbreviatedDate.innerHTML = data[1];
                standardTime.innerHTML = data[2];
                militaryTime.innerHTML = data[3];
                break;
            }
            case "font-sizes": {
                fullDate.style.fontSize = data[0].fullDate + "px";
                abbreviatedDate.style.fontSize = data[0].abbrDate + "px";
                standardTime.style.fontSize = data[0].standardTime + "px";
                militaryTime.style.fontSize = data[0].militaryTime + "px";
                break;
            }
            case 'display_order': {
                var order = data[0];
                if (currentOrder === undefined || currentOrder !== order) {
                    changeDisplayOrder(order);
                }
                break;
            }
            case 'text_color': {
                document.querySelector('body').style.color = data[0];
                break;
            }
            case 'image_path': {
                document.querySelector("body").style.backgroundImage = "url(\"".concat(data[0].replace(/\\/g, '/'), "\")");
                break;
            }
            case "background_image_mode": {
                switch (data[0]) {
                    case "Cover": {
                        document.querySelector("body").style.backgroundSize = "cover";
                        break;
                    }
                    case "Contain": {
                        document.querySelector("body").style.backgroundSize = "contain";
                        break;
                    }
                }
                break;
            }
        }
    });
    function changeDisplayOrder(newOrder) {
        currentOrder = newOrder;
        while (displayContainer.firstChild) {
            displayContainer.removeChild(displayContainer.lastChild);
        }
        for (var _i = 0, _a = newOrder.split(''); _i < _a.length; _i++) {
            var char = _a[_i];
            switch (char) {
                case '1': {
                    displayContainer.insertAdjacentElement("beforeend", fullDate);
                    break;
                }
                case '2': {
                    displayContainer.insertAdjacentElement("beforeend", abbreviatedDate);
                    break;
                }
                case '3': {
                    displayContainer.insertAdjacentElement("beforeend", standardTime);
                    break;
                }
                case '4': {
                    displayContainer.insertAdjacentElement("beforeend", militaryTime);
                    break;
                }
                case ' ': {
                    displayContainer.insertAdjacentHTML("beforeend", "<br />");
                    break;
                }
                default: {
                    // changeDisplayOrder('12 34');
                    throw new Error("Invalid order: " + newOrder);
                }
            }
        }
    }
})();
//# sourceMappingURL=index-renderer.js.map