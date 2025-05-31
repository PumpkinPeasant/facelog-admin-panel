import {defineStore} from "pinia";
import axios from "axios";

export const useAuthStore = defineStore("auth", () => {
    const router = useRouter();
    const userData = ref();

    const config = useRuntimeConfig()


    async function login(name: String, password: String) {
        return axios.post(`proxy/auth`, {
            login: name.trim(),
            password: password.trim(),
        })
            .then(async response => {
                userData.value = response.data;
                localStorage.setItem("loginInfo", JSON.stringify(response.data));
                await router.push("/");
                return true;
            })
            .catch(async error => {
                console.log(error);
                console.error("Произошла ошибка при выполнении запроса:", error.message);
                return false;
            });
    }

    function logout() {
        localStorage.removeItem("loginInfo");
        router.push('/login');
    }

    onMounted(() => {
        if (!!localStorage.getItem("loginInfo")) {
            userData.value = JSON.parse(localStorage.getItem("loginInfo"));
        }
    });

    return {
        login,
        logout,
        userData,
    };
});