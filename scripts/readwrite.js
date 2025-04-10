let dbCache = null;
let cryptoKeyCache = null;
const key = 'dataStore';

async function openDB(CurrentUsername = "Admin", version) {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(CurrentUsername, version);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;

            if (!db.objectStoreNames.contains('contentpool')) {
                db.createObjectStore('contentpool', { keyPath: 'key' });
            }

            if (!db.objectStoreNames.contains('memory')) {
                db.createObjectStore('memory', { keyPath: 'key' });
            }
        };

        request.onsuccess = (event) => resolve(event.target.result);
        request.onerror = (event) => reject(event.target.error);
    });
}

async function flushDB(value) {
    if (!dbCache) dbCache = await openDB(CurrentUsername, 1);
    if (!cryptoKeyCache) cryptoKeyCache = await getKey(password);

    const transaction = dbCache.transaction('memory', 'readwrite');
    const store = transaction.objectStore('memory');
    const request = store.put({ key: 'memory', memory: value.memory });

    return new Promise((resolve, reject) => {
        request.onsuccess = resolve;
        request.onerror = () => reject(request.error);
    });
}

async function getdb() {
    if (!dbCache) dbCache = await openDB(CurrentUsername, 1);
    if (!cryptoKeyCache) cryptoKeyCache = await getKey(password);

    const transaction = dbCache.transaction('memory', 'readonly');
    const store = transaction.objectStore('memory');
    const request = store.get('memory');

    return new Promise((resolve, reject) => {
        request.onsuccess = () => {
            memory = request.result ? request.result.memory : null;
            resolve(memory);
        };
        request.onerror = () => reject(request.error);
    });
}

function setdb(x) {
    console.log("flushing... ", x);
    const value = {
        memory: { ...memory }
    };

    return flushDB(value)
        .catch(error => console.error("Error during setdb execution:", error));
}

let requestQueue = [];
let isProcessing = false;

async function processQueue() {
    if (isProcessing || requestQueue.length === 0) {
        return;
    }

    isProcessing = true;

    while (requestQueue.length > 0) {
        const { resolve, reject, action, args } = requestQueue.shift();
        try {
            const result = await action(...args);
            resolve(result);
        } catch (error) {
            reject(error);
        }
    }

    isProcessing = false;
}

async function enqueueRequest(action, args) {
    return new Promise((resolve, reject) => {
        requestQueue.push({ resolve, reject, action, args });
        processQueue();
    });
}

async function getFileContents(id) {
    if (!dbCache) dbCache = await openDB(CurrentUsername, 1);
    if (!cryptoKeyCache) cryptoKeyCache = await getKey(password);

    const transaction = dbCache.transaction('contentpool', 'readonly');
    const store = transaction.objectStore('contentpool');
    const request = store.get(id);

    return new Promise((resolve, reject) => {
        request.onsuccess = async () => {
            if (request.result) {
                const { value, encrypted } = request.result;
                try {
                    if (!encrypted) {
                        resolve(value);
                        return;
                    }

                    const decrypted = await decryptData(cryptoKeyCache, value);

                    if (typeof decrypted === 'string') {
                        try {
                            resolve(decompressString(decrypted));
                        } catch {
                            resolve(decrypted);
                        }
                    } else {
                        resolve(decrypted);
                    }
                } catch (error) {
                    reject(error);
                }
            } else {
                reject(new Error('File not found'));
            }
        };
        request.onerror = () => reject(request.error);
    });
}

async function setFileContents(id, content) {
    if (!dbCache) dbCache = await openDB(CurrentUsername, 1);
    if (!cryptoKeyCache) cryptoKeyCache = await getKey(password);

    let dataToStore, encrypted = true;

    if (content instanceof Blob) {
        dataToStore = content;
        encrypted = false;
    } else {
        dataToStore = await encryptData(cryptoKeyCache, compressString(content));
    }

    const transaction = dbCache.transaction('contentpool', 'readwrite');
    const store = transaction.objectStore('contentpool');
    const request = store.put({ key: id, value: dataToStore, encrypted });

    return new Promise((resolve, reject) => {
        request.onsuccess = resolve;
        request.onerror = () => reject(request.error);
    });
}



async function removeFileContents(id) {
    if (!dbCache) dbCache = await openDB(CurrentUsername, 1);

    const transaction = dbCache.transaction('contentpool', 'readwrite');
    const store = transaction.objectStore('contentpool');
    const request = store.delete(id);

    return new Promise((resolve, reject) => {
        request.onsuccess = resolve;
        request.onerror = () => reject(request.error);
    });
}

const ctntMgr = {
    async get(id) {
        try {
            return await enqueueRequest(getFileContents, [id]);
        } catch (error) {
            throw error;
        }
    },

    async set(id, content) {
        try {
            return await enqueueRequest(setFileContents, [id, content]);
        } catch (error) {
            throw error;
        }
    },

    async remove(id) {
        try {
            return await enqueueRequest(removeFileContents, [id]);
        } catch (error) {
            throw error;
        }
    }
};
