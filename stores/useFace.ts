import {defineStore} from "pinia";
import axios from "axios";

export const useFaceStore = defineStore("face", () => {

    const faces = ref([]);

    const tableOptions = ref({page: 1, itemsPerPage: 10});

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
            .then(async response => {
                faces.value = response.data.faces;
                await loadItems();
            })
            .catch(error => {
                console.log(error);
            });
    }

    async function updateFace(id: string, name: string, base64Photo: string) {
        await axios
            .post(`proxy/face/update`,
                {
                    id: id,
                    name: name,
                    base64Photo: base64Photo,
                })
            .then(async response => {
                faces.value = response.data.faces;
                await loadItems();
            })
            .catch(error => {
                console.log(error);
            });
    }

    async function deleteFace(id: string) {
        await axios.post(`proxy/face/delete`,
            {id})
            .then(async () => {
                await loadItems();
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

    async function loadItems() {
        await getFaces(tableOptions.value).then(async () => {
            for (const face of faces.value) {
                if (!face.photo) {
                    face.photo = await getPhoto(face.id);
                }
            }
        })
    }

    return {
        faces,
        createFace,
        updateFace,
        deleteFace,
        getPhoto,
        tableOptions,
        loadItems
    };
});