(() => {
    const FADE_OUT_DELAY: number = 0.25;

    document.getElementById("next-button").addEventListener("click", () => {
        document.getElementById("center").classList.add('fade-out');
    
        setTimeout(() => {
            window.location.href = "../../static/index.html";
        }, FADE_OUT_DELAY * 1000)
    })
    
})();




