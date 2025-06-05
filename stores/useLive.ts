export const useLive = defineStore('live', () => {
    const socket = ref<WebSocket | null>(null);
    const frameUrl = ref('');
    const liveStatus = ref(false);

    const connect = () => {
        if (socket.value) return;

        socket.value = new WebSocket('ws://localhost:8000/ws/video');

        socket.value.onopen = () => {
            liveStatus.value = true;
        };

        socket.value.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data);

                if (message.type === 'frame' && typeof message.data === 'string') {
                    frameUrl.value = message.data; // Уже готовая строка base64
                } else {
                    console.warn('Неизвестный формат сообщения:', message);
                }
            } catch (error) {
                console.error('Ошибка при разборе JSON:', error, event.data);
            }
        };

        socket.value.onerror = () => stop();
        socket.value.onclose = () => stop();
    };

    const stop = () => {
        if (socket.value) {
            socket.value.close();
            socket.value = null;
        }

        frameUrl.value = '';
        liveStatus.value = false;
    };

    return { connect, stop, liveStatus, frameUrl };
});
