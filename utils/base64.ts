export function toBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            if (typeof reader.result === 'string') {
                const base64 = reader.result.split(',')[1];
                resolve(base64);
            } else {
                reject(new Error('Unexpected reader.result type'));
            }
        };

        reader.onerror = () => {
            reject(new Error('File reading error'));
        };

        reader.readAsDataURL(file);
    });
}