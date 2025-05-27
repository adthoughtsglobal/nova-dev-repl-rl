
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
function bufferToBase64(buffer) {
    return btoa(String.fromCharCode(...new Uint8Array(buffer)));
}
async function encryptData(key, data) {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    let encoded;

    if (typeof data === 'string') {
        encoded = new TextEncoder().encode(data);
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
async function decryptData(key, encryptedData) {
    return new Promise(async (resolve, reject) => {
        try {
            const iv = encryptedData.iv instanceof ArrayBuffer ? new Uint8Array(encryptedData.iv) : base64ToArrayBuffer(encryptedData.iv);
            const data = encryptedData.data instanceof ArrayBuffer ? encryptedData.data : base64ToArrayBuffer(encryptedData.data);

            const decrypted = await crypto.subtle.decrypt(
                { name: "AES-GCM", iv },
                key,
                data
            );

            let result;
            try {
                result = new TextDecoder().decode(decrypted);
            } catch {
                result = new Uint8Array(decrypted);
            }

            resolve(result);
        } catch (error) {
            console.log(error)
            reject('Incorrect password or corrupted data');
        }
    });
}

function arrayBufferToBase64(buffer) {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    bytes.forEach(b => binary += String.fromCharCode(b));
    return btoa(binary);
}

function base64ToArrayBuffer(base64) {
    try {
        const binary = atob(base64);
        const len = binary.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binary.charCodeAt(i);
        }
        return bytes.buffer;
    } catch (e) {
        console.error("Invalid base64 input:", base64);
        throw e;
    }
}

function compressString(input) {
    try {
        // const inputUint8Array = new TextEncoder().encode(JSON.stringify(input));
        // const compressed = fflate.gzipSync(inputUint8Array);
        // return arrayBufferToBase64(compressed);
        return input;
    } catch (error) {
        console.error("Compression Error:", error);
        throw error;
    }
}

function decompressString(compressedBase64) {
    try {
        // const compressedData = base64ToArrayBuffer(compressedBase64);
        // const decompressed = fflate.gunzipSync(compressedData);
        // return JSON.parse(new TextDecoder().decode(decompressed));
        return compressedBase64;
    } catch (error) {
        console.error("Decompression Error:", error);
        throw error;
    }
}