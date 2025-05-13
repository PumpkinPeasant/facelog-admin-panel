import {defineStore} from "pinia";
import axios from "axios";

export const useFaceStore = defineStore("face", () => {

    const faces = ref([]);

    async function getFaces(obj: any) {
        await axios
            .post(`proxy/face/getPaged`,
                {
                    page: obj.itemsPerPage,
                    size: obj.page,
                })
            .then(response => faces.value = response.data.faces)
            .catch(error => {
                console.log(error);
            });
    }

    async function createFace(name: string, file: File) {

        let base64File = await toBase64(file);

        await axios
            .post(`proxy/face/update`,
                {
                    name: name,
                    base64Photo: base64File,
                })
            .then(response => faces.value = response.data.faces)
            .catch(error => {
                console.log(error);
            });
    }

    function toBase64(file: File): Promise<string> {
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


    function fromBase64(buffer: any) {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    }


    return {
        faces,
        getFaces,
        createFace
    };
});