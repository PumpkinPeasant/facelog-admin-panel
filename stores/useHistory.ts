import {defineStore} from "pinia";
import axios from "axios";
import {useAlertStore} from "~/stores/useAlert";
import {ref} from "vue";

export const useHistoryStore = defineStore("history", () => {

    const alertStore = useAlertStore();

    const history = ref([]);

    const historyCount = ref(0);

    const tableOptions = ref({page: 1, itemsPerPage: 10});

    async function getHistory(obj: any) {
        try {
            await axios
                .post(`proxy/history/getPaged`,
                    {
                        page: obj.page,
                        size: obj.itemsPerPage,
                    })
                .then(response => history.value = response.data)
        } catch (error) {
            await alertStore.addAlert({
                message: "Ошибка получения истории",
                status: "Код ошибки: " + error.response.status,
                type: "error"
            });
        }
    }

    async function deleteFace(id: string) {
        try {
            await axios.post(`proxy/history/delete`,
                {id})
                .then(async () => {
                    await loadItems();
                })
        } catch (error) {
            await alertStore.addAlert({
                message: "Ошибка удаления истории",
                status: "Код ошибки: " + error.response.status,
                type: "error"
            });
        }
    }

    async function getPhoto(id: string): Promise<string> {
        let photo = '';
        try {
            const response = await axios.post('proxy/history/photo', {id});
            photo = response.data.photoBase64;
        } catch (error) {
            await alertStore.addAlert({
                message: "Ошибка получения фото",
                status: "Код ошибки: " + error.response.status,
                type: "error"
            });
            console.error('Error fetching photo:', error);
        }
        return photo;
    }

    async function loadItems() {
        await getHistoryCount();
        await getHistory(tableOptions.value).then(async () => {
            for (const record of history.value) {
                if (!record.photo) {
                    record.photo = await getPhoto(record.id);
                }
            }
        })
    }

    async function getHistoryCount() {
        await axios.get(`proxy/history/count`)
            .then((response) => {
                historyCount.value = response.data.count;
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