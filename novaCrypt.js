self.addEventListener('message', async (event) => {
    const { type, key, encryptedData } = event.data;

    if (type === 'decrypt') {
        try {
            const iv = new Uint8Array(encryptedData.iv);
            const data = new Uint8Array(encryptedData.data);

            const decrypted = await self.crypto.subtle.decrypt(
                { name: "AES-GCM", iv },
                key,
                data
            );

            let result;
            try {
                const decoder = new TextDecoder();
                result = decoder.decode(decrypted);
            } catch {
                result = decrypted;
            }

            event.source.postMessage({
                type: 'decrypted',
                result
            });
        } catch (error) {
            console.error("Error in decryption:", error);
            event.source.postMessage({
                type: 'error',
                error: 'Incorrect password or corrupted data'
            });
        }
    }
});