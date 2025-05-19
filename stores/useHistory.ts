import {defineStore} from "pinia";
import axios from "axios";

export const useHistoryStore = defineStore("history", () => {

    const history = ref([]);

    async function getHistory(obj: any) {
        await axios.post("/proxy/history/getPaged", {
            page: obj.page,
            size: obj.itemsPerPage,
        }).then(
            (response) => {
                history.value = response.data;
            })
    }

    async function deleteFace(id: string) {
        await axios.post(`proxy/history/delete`,
            {id})
            .then(response => {
            })
    }

    async function getPhoto(id: string): Promise<string> {
        let photo = '';
        try {
            const response = await axios.post('proxy/history/photo', {id});
            photo = response.data.photoBase64;
        } catch (error) {
            console.error('Error fetching photo:', error);
        }
        return photo;
    }

    return {
        getHistory,
        deleteFace,
        getPhoto,
        history
    }
})