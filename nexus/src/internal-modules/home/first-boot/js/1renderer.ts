(() => {
    const FADE_OUT_DELAY: number = 0.5;

    document.getElementById("get-started-button").addEventListener("click", () => {
        document.querySelectorAll('.fade1, .fade3, .fade5').forEach(element => {
            element.classList.remove('fade1', 'fade3', 'fade5');
            element.classList.add('fade-out');
        });
    
        setTimeout(() => {
            window.location.href = "2.html";
        }, FADE_OUT_DELAY * 1000)
    })
})();


