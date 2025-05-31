import {defineStore} from "pinia";
import axios from "axios";
import {useAlertStore} from "~/stores/useAlert";
import {ref} from "vue";

export interface HistorySearchRequest {
    name?: string;
    dateFrom?: string;
    dateTo?: string;
    page: number;
    pageSize: number;
}

export const useHistoryStore = defineStore("history", () => {

    const alertStore = useAlertStore();

    const history = ref([]);
    const historyCount = ref(0);
    const loading = ref(false);

    const searchParams = ref<HistorySearchRequest>({
        name: undefined,
        dateFrom: undefined,
        dateTo: undefined,
        page: 1,
        pageSize: 5
    });

    async function getHistory(params: HistorySearchRequest) {
        loading.value = true;
        try {
            const requestData = {
                ...(params.name && {name: params.name}),
                ...(params.dateFrom && {dateFrom: params.dateFrom}),
                ...(params.dateTo && {dateTo: params.dateTo}),
                page: params.page,
                pageSize: params.pageSize
            };

            const response = await axios.post(`proxy/history/getPaged`, requestData);

            history.value = response.data.result;

            historyCount.value = response.data.count;

            // Загружаем фото для записей, которые его не имеют
            for (const record of history.value) {
                if (!record.photo) {
                    record.photo = await getPhoto(record.id);
                }
            }
        } catch (error) {
            await alertStore.addAlert({
                message: "Ошибка получения истории",
                status: "Код ошибки: " + error.response?.status,
                type: "error"
            });
        } finally {
            loading.value = false;
        }
    }

    async function deleteFace(id: string) {
        try {
            await axios.post(`proxy/history/delete`, {id});
            await loadItems();
        } catch (error) {
            await alertStore.addAlert({
                message: "Ошибка удаления истории",
                status: "Код ошибки: " + error.response?.status,
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
                status: "Код ошибки: " + error.response?.status,
                type: "error"
            });
            console.error('Error fetching photo:', error);
        }
        return photo;
    }

    async function loadItems() {
        await getHistory(searchParams.value);
    }

    function updateSearchParams(params: Partial<HistorySearchRequest>) {
        searchParams.value = {...searchParams.value, ...params};
    }

    // Сброс поиска
    function resetSearch() {
        searchParams.value = {
            name: undefined,
            dateFrom: undefined,
            dateTo: undefined,
            page: 1,
            pageSize: searchParams.value.pageSize
        };
    }

    return {
        deleteFace,
        getPhoto,
        getHistory,
        history,
        historyCount,
        loading,
        searchParams,
        updateSearchParams,
        resetSearch,
        loadItems
    }
})