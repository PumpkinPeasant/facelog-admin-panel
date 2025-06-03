import {defineStore} from "pinia";
import axios from "axios";
import {useAlertStore} from "~/stores/useAlert";

export const useAuthStore = defineStore("auth", () => {
    const router = useRouter();
    const userData = ref();

    const alertStore = useAlertStore();


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
                if (error.status === 401)
                    await alertStore.addAlert({
                        message: "Неправильный логин или пароль",
                        status: "Код ошибки: " + error.response.status,
                        type: "error"
                    });
                else
                    await alertStore.addAlert({
                        message: "Не удалось войти в систему",
                        status: "Код ошибки: " + error.response.status,
                        type: "error"
                    });
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