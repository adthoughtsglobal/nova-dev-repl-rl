
async function getKey(password) {
    const keyMaterial = await crypto.subtle.importKey(
        "raw",
        encoder.encode(password),
        { name: "PBKDF2" },
        false,
        ["deriveKey"]
    );
    return crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt: encoder.encode("salt"),
            iterations: 100000,
            hash: "SHA-256"
        },
        keyMaterial,
        { name: "AES-GCM", length: 256 },
        false,
        ["encrypt", "decrypt"]
    );
}

async function encryptData(key, data) {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    let encoded;

    if (typeof data === 'string') {
        encoded = encoder.encode(data);
    } else if (data instanceof Blob) {
        encoded = new Uint8Array(await data.arrayBuffer());
    } else if (data instanceof Uint8Array || ArrayBuffer.isView(data)) {
        encoded = data;
    } else {
        throw new Error("Unsupported data type for encryption");
    }

    const encrypted = await crypto.subtle.encrypt(
        { name: "AES-GCM", iv },
        key,
        encoded
    );

    return {
    iv: iv.buffer,
    data: encrypted
};

}

let decryptWorkerRegistered = false;
async function decryptData(key, encryptedData) {

    return new Promise(async (resolve, reject) => {
            try {
                const iv = new Uint8Array(encryptedData.iv);
                const data = new Uint8Array(encryptedData.data);
                const decrypted = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, data);

                let result;
                try {
                    result = new TextDecoder().decode(decrypted);
                } catch {
                    result = new Uint8Array(decrypted);
                }

                resolve(result);
            } catch (error) {
                reject('Incorrect password or corrupted data');
            }
    });
}


function arrayBufferToBase64(buffer) {
    const bytes = new Uint8Array(buffer);
    if (bytes.length < 10000) {
        return btoa(String.fromCharCode(...bytes));
    }
    let binary = '';
    const chunkSize = 8192;
    for (let i = 0; i < bytes.length; i += chunkSize) {
        binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunkSize));
    }
    return btoa(binary);
}

function base64ToArrayBuffer(base64) {
    const binaryString = atob(base64);
    const length = binaryString.length;
    const buffer = new ArrayBuffer(length);
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
}

function compressString(input) {
    try {
        const inputUint8Array = new TextEncoder().encode(JSON.stringify(input));
        const compressed = fflate.gzipSync(inputUint8Array);
        return arrayBufferToBase64(compressed);
    } catch (error) {
        console.error("Compression Error:", error);
        throw error;
    }
}

function decompressString(compressedBase64) {
    try {
        const compressedData = base64ToArrayBuffer(compressedBase64);
        const decompressed = fflate.gunzipSync(compressedData);
        return JSON.parse(new TextDecoder().decode(decompressed));
    } catch (error) {
        console.error("Decompression Error:", error);
        throw error;
    }
}