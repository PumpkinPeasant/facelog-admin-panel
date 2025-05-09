import {defineStore} from "pinia";
import axios from "axios";

export const useFaceStore = defineStore("face", () => {

    const faces = ref([]);

    async function getFaces(obj) {
        await axios
            .post(`proxy/face/getPaged`,
                {
                    limit: obj.itemsPerPage,
                    skip: obj.page,
                })
            .then(response => faces.value = response.data.faces)
            .catch(error => {
                console.log(error);
            });
    }
    return {
        faces,
        getFaces
    };
});