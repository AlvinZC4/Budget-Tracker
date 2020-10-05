let db

const request = indexedDB.open("budget", 1)

request.onupgradeneeded = function ({ target }) {
    const db = target.result
    db.createObjectStore("pending", { autoIncrement: true })
}

request.onsuccess = function({ target }) {
    db = target.result

    if (navigator.onLine) {
        checkDatabase()
    }
    
}


request.onerror = function({ target }) {
    console.log("Error: " + target.errorCode)
}

function saveRecord(record) {
    const transaction = db.transaction(["pending"], "readwrite")

    const store = transaction.objectStore("pending")

    store.add(record)
}

function checkDatabase() {
    console.log("db", db)
    const transaction = db.transaction(["pending"], "readwrite")

    const store = transaction.objectStore("pending")

    const getAll = store.getAll()

    getAll.onsuccess = function() {
        if (getAll.result.length > 0) {
            fetch("/api/transaction/bulk", {
                method: "POST",
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json"
                }
            })
            .then(response => response.json())
            .then(() => {
                const transaction = db.transaction(["pending"], "readwrite")

                const store = transaction.objectStore("pending")

                store.clear()
            })
        }
    }
}

window.addEventListener("online", checkDatabase)