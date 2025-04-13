(() => {
    (window as any)["INTERNAL_ID_DO_NOT_USE"] = "built_ins.Home";

    const sendToProcess = (eventName: string, ...data: any[]): Promise<any> => {
        return window.ipc.send(window, eventName, data);
    }


    window.ipc.on(window, (eventName: string, data: any[]) => {
        handleEvent(eventName, data);
    });





    sendToProcess("init");


    const displayContainer: HTMLElement = document.getElementById('center');

    const fullDate: HTMLElement = document.getElementById("full-date");
    const abbreviatedDate: HTMLElement = document.getElementById("abbreviated-date");
    const standardTime: HTMLElement = document.getElementById("standard-time");
    const militaryTime: HTMLElement = document.getElementById("military-time");

    let currentOrder: string = undefined;
    
    const handleEvent = (eventType: string, data: any[]) => {
        switch (eventType) {
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
            case 'display-order': {
                const order: string = data[0];

                if (currentOrder === undefined || currentOrder !== order) {
                    changeDisplayOrder(order);
                }
                break;
            }
        }
    }

    function changeDisplayOrder(newOrder: string): void {
        currentOrder = newOrder;

        while (displayContainer.firstChild) {
            displayContainer.removeChild(displayContainer.lastChild);
        }


        for (const char of newOrder.split('')) {
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



