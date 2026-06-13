(function () {
    var FADE_OUT_DELAY = 0.25;
    document.getElementById("next-button").addEventListener("click", function () {
        document.getElementById("center").classList.add('fade-out');
        setTimeout(function () {
            window.location.href = "../../static/index.html";
        }, FADE_OUT_DELAY * 1000);
    });
})();
//# sourceMappingURL=2renderer.js.map