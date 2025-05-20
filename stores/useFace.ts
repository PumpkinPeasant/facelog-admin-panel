import {defineStore} from "pinia";
import axios from "axios";

export const useFaceStore = defineStore("face", () => {

    const faces = ref([]);

    async function getFaces(obj: any) {
        await axios
            .post(`proxy/face/getPaged`,
                {
                    page: obj.page,
                    size: obj.itemsPerPage,
                })
            .then(response => faces.value = response.data)
            .catch(error => {
                console.log(error);
            });
    }

    async function createFace(name: string, base64Photo: string) {
        await axios
            .post(`proxy/face/update`,
                {
                    name: name,
                    base64Photo: base64Photo,
                })
            .then(response => {
                faces.value = response.data.faces;
            })
            .catch(error => {
                console.log(error);
            });
    }

    async function updateFace(id:string, name: string, base64Photo: string) {
        await axios
            .post(`proxy/face/update`,
                {
                    id: id,
                    name: name,
                    base64Photo: base64Photo,
                })
            .then(response => {
                faces.value = response.data.faces;
            })
            .catch(error => {
                console.log(error);
            });
    }

    async function deleteFace(id: string) {
        await axios.post(`proxy/face/delete`,
            {id})
            .then(response => {
            })
    }

    async function getPhoto(id: string): Promise<string> {
        let photo = '';
        try {
            const response = await axios.post('proxy/face/photo', {id});
            photo = response.data.photoBase64;
        } catch (error) {
            console.error('Error fetching photo:', error);
        }
        return photo;
    }

    return {
        faces,
        getFaces,
        createFace,
        updateFace,
        deleteFace,
        getPhoto
    };
});