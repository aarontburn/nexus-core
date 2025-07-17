(function () {
    function dragElement(element) {
        var md;
        var left = document.getElementById("left");
        var right = document.getElementById("right");
        var container = document.getElementById("splitter");
        element.onmousedown = function (e) {
            md = {
                e: e,
                leftWidth: left.offsetWidth,
                rightWidth: right.offsetWidth,
                containerWidth: container.offsetWidth
            };
            document.onmousemove = function (e) {
                var deltaX = e.clientX - md.e.clientX;
                var newLeftWidth = md.leftWidth + deltaX;
                var newRightWidth = md.rightWidth - deltaX;
                if (newLeftWidth < 0) {
                    newLeftWidth = 0;
                }
                if (newRightWidth < 0) {
                    newRightWidth = 0;
                }
                var leftPercent = (newLeftWidth / md.containerWidth) * 100;
                var rightPercent = (newRightWidth / md.containerWidth) * 100;
                left.style.width = leftPercent + "%";
                right.style.width = rightPercent + "%";
            };
            document.onmouseup = function () {
                document.onmousemove = document.onmouseup = null;
            };
        };
    }
    dragElement(document.getElementById("separator"));
})();
//# sourceMappingURL=static-renderer.js.map