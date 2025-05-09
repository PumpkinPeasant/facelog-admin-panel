import {defineStore} from "pinia";
import axios from "axios";

export const useAuthStore = defineStore("auth", () => {
    const router = useRouter();
    const userData = ref();


    async function login(name: String, password: String) {
        return axios.post(`proxy/Authorization/LoggOn`, {
            name: name.trim(),
            password: password.trim(),
        })
            .then(async response => {
                userData.value = response.data;
                localStorage.setItem("loginInfo", JSON.stringify(response.data));
                await router.push("/");
                return true;
            })
            .catch(async error => {
                console.error("Произошла ошибка при выполнении запроса:", error.message);
                if (error.response.status === 404) {
                } else {
                }
                return false;
            });
    }

    function logout() {
        localStorage.removeItem("loginInfo");
    }

    onMounted(() => {
        // if (!!localStorage.getItem("loginInfo")) {
        //     userData.value = JSON.parse(localStorage.getItem("loginInfo"));
        // }
    });

    return {
        login,
        logout,
        userData,
    };
});