console.log("Hello from service worker")

const CACHE_NAME = "static-cache-v2"
const DATA_CACHE_NAME = "data-cache-v1"

const iconSizes = ["192", "512"]
const iconFiles = icon.Sizes.map(
    (size) => `/assets/images/icons/icon-${size}x${size}.png`
)

const staticFilesToPreCache = [
    "/",
    "/index.js",
    "db.js",
    "styles.css",
    "manifest.webmanifest"
].concat(iconFiles)

self.addEventListener("install", function(evt) {
    evt.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log("Your files were successfully pre-cached!")
            return cache.addAll(staticFilesToPreCache)
        })
    )
    self.skipWaiting()
})

self.addEventListener("activate", function(evt) {
    evt.waitUntil(
        caches.keys().then(keyList => {
            return Promise.all(
                keyList.map(key => {
                    if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
                        console.log("Removing old cache data", key)
                        return caches.delete(key)
                    }
                })
            )
        })
    )
    self.clients.claim()
})