// webLocalFile.js

/* Feature detection */
if (!('indexedDB' in window)) {
    throw new Error('IndexedDB not supported in your browser. webLocalFile.js is unavailable.');
} else if (!('serviceWorker' in navigator)) {
    throw new Error('Service Worker not supported in your browser. webLocalFile.js is unavailable.');
}

let instanced = false;

export class wlf {
    constructor() {
        this.dbName = 'webLocalFileDB2023';
        this.tableName = 'files';
        this.keyPath = 'name';
        this.path = 'wlf'

        if (!instanced) {
            instanced = true;

            /* Initialize IndexedDB
             * Repeatedly creating indexedDB will fail silently, no need to check if it's already created */
            const request = indexedDB.open(this.dbName);
            request.onupgradeneeded = event => {
                const db = event.target.result;
                db.createObjectStore(this.tableName, {keyPath: this.keyPath});
            };

            /* Register Service Worker
             * It won't be installed or activated repeatedly. If the Service Worker file isn't updated, registering it again has no side effects */
            navigator.serviceWorker.register('serviceWorker.js');
        }
    }

    async save(file, fileName) {
        const db = await this._getDB();
        const tx = db.transaction('files', 'readwrite');

        if (fileName === undefined) {
            fileName = Math.random().toString(36).slice(2);
        }

        try {
            return await new Promise((resolve, reject) => {
                const putRequest = tx.objectStore('files').put({name: fileName, file});

                putRequest.onerror = () => reject(putRequest.error);
                putRequest.onsuccess = () => resolve(`wlf/${fileName}`);
            });
        } catch (error) {
            throw new Error(`Saving file failed: ${error.message}`);
        }
    }

    async delete(fileName) {
        const db = await this._getDB();
        const tx = db.transaction('files', 'readwrite');

        try {
            await new Promise((resolve, reject) => {
                const deleteRequest = tx.objectStore('files').delete(fileName);

                deleteRequest.onerror = () => reject(deleteRequest.error);
                deleteRequest.onsuccess = () => resolve();
            });
        } catch (error) {
            throw new Error(`Deleting file failed: ${error.message}`);
        }
    }

    async read(fileName) {
        const db = await this._getDB();
        const tx = db.transaction('files', 'readonly');

        try {
            return await new Promise((resolve, reject) => {
                const getRequest = tx.objectStore('files').get(fileName);

                getRequest.onerror = () => reject(getRequest.error);
                getRequest.onsuccess = () => resolve(getRequest.result.file);
            });
        } catch (error) {
            throw new Error(`Reading file failed: ${error.message}`);
        }
    }

    async estimate() {
        if (navigator.storage && navigator.storage.estimate) {
            return navigator.storage.estimate();
        } else {
            throw new Error('StorageManager API is not available in your browser.');
        }
    }

    _getDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName);
            request.onsuccess = event => resolve(event.target.result);
            request.onerror = () => reject('Failed to open DB');
        });
    }
}
