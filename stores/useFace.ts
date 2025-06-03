import {defineStore} from "pinia";
import axios from "axios";
import {ref} from "vue";
import {useAlertStore} from "~/stores/useAlert";

export interface FaceSearchRequest {
    page: number;
    pageSize: number;
    searchParams?: {
        name?: string;
        dateFrom?: string;
        dateTo?: string;
    }
}

export const useFaceStore = defineStore("face", () => {

    const alertStore = useAlertStore();

    const faces = ref([]);
    const facesCount = ref(0);
    const loading = ref(false);

    const searchParams = ref<FaceSearchRequest>({
        page: 1,
        pageSize: 5,
        searchParams: {
            name: undefined,
            dateFrom: undefined,
            dateTo: undefined,
        }
    });

    async function getFaces(params: FaceSearchRequest) {
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

            const response = await axios.post(`proxy/face/getPaged`, requestData);

            faces.value = response.data.result;

            facesCount.value = response.data.count;

            if(response.data.count){
                for (const record of faces.value) {
                    if (!record.photo) {
                        record.photo = await getPhoto(record.id);
                    }
                }
            }
        } catch (error) {
            if (error.status === 527)
                await alertStore.addAlert({
                    message: "Лицо не распознано",
                    status: "Код ошибки: " + error.response.status,
                    type: "error"
                });
            else
                await alertStore.addAlert({
                    message: "Ошибка получения пользователей",
                    status: "Код ошибки: " + error.response.status,
                    type: "error"
                });
        } finally {
            loading.value = false;
        }
    }

    async function createFace(name: string, base64Photo: string) {
        try {
            await axios
                .post(`proxy/face/update`,
                    {
                        name: name,
                        base64Photo: base64Photo,
                    })
            await loadItems();
        } catch (error) {
            if (error.status === 527)
                await alertStore.addAlert({
                    message: "Лицо не распознано",
                    status: "Код ошибки: " + error.response.status,
                    type: "error"
                });
            else
                await alertStore.addAlert({
                    message: "Ошибка создания пользователя",
                    status: "Код ошибки: " + error.response.status,
                    type: "error"
                });
        }
    }

    async function updateFace(id: string, name: string, base64Photo: string) {
        try {
            await axios
                .post(`proxy/face/update`,
                    {
                        id: id,
                        name: name,
                        base64Photo: base64Photo,
                    })
            await loadItems();
        } catch (error) {
            await alertStore.addAlert({
                message: "Ошибка изменения пользователя",
                status: "Код ошибки: " + error.response.status,
                type: "error"
            });
        }
    }

    async function deleteFace(id: string) {
        try {
            await axios.post(`proxy/face/delete`,
                {id})
            await loadItems();
        } catch (error) {
            await alertStore.addAlert({
                message: "Ошибка удаления пользователя",
                status: "Код ошибки: " + error.response.status,
                type: "error"
            });
        }
    }

    async function getPhoto(id: string): Promise<string> {
        let photo = '';
        try {
            const response = await axios.post('proxy/face/photo', {id});
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
        await getFaces(searchParams.value);
    }

    function updateSearchParams(params: Partial<FaceSearchRequest>) {
        searchParams.value = {...searchParams.value, ...params};
    }

    return {
        faces,
        createFace,
        updateFace,
        deleteFace,
        getPhoto,
        searchParams,
        loadItems,
        updateSearchParams,
        facesCount
    };
});