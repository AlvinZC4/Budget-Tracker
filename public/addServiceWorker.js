if ("ServiceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("service-worker.js")
        .then(reg => {
            console.log("We have located you service worker file", reg)
        })
    })
}