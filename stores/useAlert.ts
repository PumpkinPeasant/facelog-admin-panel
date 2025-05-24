import {defineStore} from "pinia";
import {ref} from "vue";

export const useAlertStore = defineStore("alert", () => {

    const alerts = ref([]);

    const addAlert = async (alertData) => {
        if (alerts.value.length > 2) {
            removeAlert(alerts.value[0].id)
        }
        alerts.value.push({id: Date.now(), ...alertData});
        await startCountdown(alerts.value[alerts.value.length - 1].id);
    }

    const removeAlert = (alertId) => {
        alerts.value = alerts.value.filter(alert => alert.id !== alertId);
    }

    async function startCountdown(alertId) {
        let timeLeft = 5;
        const interval = 100;
        const timer = setInterval(() => {
            timeLeft -= interval / 1000;
            if (!alerts.value.find(n => n.id === alertId)) {
                clearInterval(timer);
                return;
            }
            if (timeLeft <= 0) {
                clearInterval(timer);
                removeAlert(alertId);
            }
        }, interval);
    }


    return {alerts, addAlert, removeAlert}
})