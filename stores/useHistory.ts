import {defineStore} from "pinia";
import axios from "axios";

export const useHistoryStore = defineStore("history", () => {

    const history = ref([]);

    const tableOptions = ref({page: 1, itemsPerPage: 10});

    async function getHistory(obj: any) {
        await axios
            .post(`proxy/history/getPaged`,
                {
                    page: obj.page,
                    size: obj.itemsPerPage,
                })
            .then(response => history.value = response.data)
            .catch(error => {
                console.log(error);
            });
    }

    async function deleteFace(id: string) {
        await axios.post(`proxy/history/delete`,
            {id})
            .then(async () => {
                await loadItems();
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

    async function loadItems() {
        await getHistory(tableOptions.value).then(async () => {
            for (const record of history.value) {
                if (!record.photo) {
                    record.photo = await getPhoto(record.id);
                }
            }
        })
    }

    return {
        deleteFace,
        getPhoto,
        history,
        tableOptions,
        loadItems
    }
})