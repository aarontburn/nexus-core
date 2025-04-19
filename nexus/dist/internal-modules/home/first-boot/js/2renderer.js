(function () {
    var FADE_OUT_DELAY = 0.25;
    document.getElementById("get-started-button").addEventListener("click", function () {
        document.querySelectorAll('.fade1, .fade3, .fade5').forEach(function (element) {
            element.classList.remove('fade1', 'fade3', 'fade5');
            element.classList.add('fade-out');
        });
        setTimeout(function () {
            window.location.href = "first-boot-2.html";
        }, FADE_OUT_DELAY * 1000);
    });
})();
//# sourceMappingURL=2renderer.js.map