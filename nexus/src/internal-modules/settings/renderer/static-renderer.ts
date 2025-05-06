(() => {
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
    dragElement(document.getElementById("separator"));


})()