self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);
    if (/wlf/.test(url.pathname)) {
        event.respondWith(getFile(url.pathname.slice(5)));
    }
});

async function getFile(fileName) {
    const db = await getDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction('files', 'readonly');
        const request = tx.objectStore('files').get(fileName);
        request.onsuccess = () => {
            if (request.result) {
                resolve(new Response(request.result.file));
            } else {
                reject('File not found');
            }
        };
        request.onerror = () => reject('Failed to fetch file');
    });
}

function getDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('webLocalFileDB');
        request.onsuccess = event => resolve(event.target.result);
        request.onerror = () => reject('Failed to open DB');
    });
}
