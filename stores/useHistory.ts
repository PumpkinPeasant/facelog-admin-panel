import {defineStore} from "pinia";
import axios from "axios";
import {useAlertStore} from "~/stores/useAlert";
import {ref} from "vue";

export interface HistorySearchRequest {
    page: number;
    pageSize: number;
    searchParams?: {
        name?: string;
        dateFrom?: string;
        dateTo?: string;
    }
}

export const useHistoryStore = defineStore("history", () => {

    const alertStore = useAlertStore();

    const history = ref([]);
    const historyCount = ref(0);
    const loading = ref(false);

    const searchParams = ref<HistorySearchRequest>({
        page: 1,
        pageSize: 5,
        searchParams: {
            name: undefined,
            dateFrom: undefined,
            dateTo: undefined,
        }
    });

    async function getHistory(params: HistorySearchRequest) {
        loading.value = true;
        try {
            const searchParams = {
                ...(params.searchParams?.name && {name: params.searchParams.name}),
                ...(params.searchParams?.dateFrom && {dateFrom: params.searchParams.dateFrom}),
                ...(params.searchParams?.dateTo && {dateTo: params.searchParams.dateTo}),
            };

            const requestData = {
                page: params.page,
                pageSize: params.pageSize,
                ...(Object.keys(searchParams).length > 0 && {searchParams}),
            };

            const response = await axios.post(`proxy/history/getPaged`, requestData);

            history.value = response.data.result;

            historyCount.value = response.data.count;

            if (response.data.count) {
                for (const record of history.value) {
                    if (!record.photo) {
                        record.photo = await getPhoto(record.id);
                    }
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
            await alertStore.addAlert({
                message: `Запись удалена`,
                type: "success"
            });
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
        history,
        historyCount,
        loading,
        searchParams,
        updateSearchParams,
        loadItems,
        resetSearch
    }
})