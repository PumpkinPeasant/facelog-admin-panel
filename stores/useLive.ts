export const useLive = defineStore('live', () => {
    const socket = ref<WebSocket | null>(null);
    const frameUrl = ref('');
    const liveStatus = ref(false);
    const isConnecting = ref(false);
    const reconnectAttempts = ref(0);
    const maxReconnectAttempts = 5;
    const reconnectDelay = ref(1000); // Start with 1 second

    const connect = () => {
        if (socket.value || isConnecting.value) return;

        isConnecting.value = true;

        const { $config } = useNuxtApp();
        const wsUrl = $config.public.wsBase || 'ws://localhost:8000';
        socket.value = new WebSocket(`${wsUrl}/ws/video`);

        socket.value.onopen = () => {
            console.log('WebSocket connected');
            liveStatus.value = true;
            isConnecting.value = false;
            reconnectAttempts.value = 0;
            reconnectDelay.value = 1000; // Reset delay
        };

        socket.value.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data);

                if (message.type === 'frame' && typeof message.data === 'string') {
                    frameUrl.value = message.data;
                } else {
                    console.warn('Неизвестный формат сообщения:', message);
                }
            } catch (error) {
                console.error('JSON parsing error:', error, event.data);
            }
        };

        socket.value.onerror = (error) => {
            console.error('WebSocket error:', error);
            isConnecting.value = false;
        };

        socket.value.onclose = (event) => {
            console.log('WebSocket closed:', event.code, event.reason);
            isConnecting.value = false;

            // Only attempt reconnection if it wasn't a manual close
            if (event.code !== 1000 && reconnectAttempts.value < maxReconnectAttempts) {
                scheduleReconnect();
            } else {
                stop();
            }
        };
    };

    const scheduleReconnect = () => {
        reconnectAttempts.value++;
        console.log(`Attempting to reconnect (${reconnectAttempts.value}/${maxReconnectAttempts}) in ${reconnectDelay.value}ms`);

        setTimeout(() => {
            if (!socket.value || socket.value.readyState === WebSocket.CLOSED) {
                connect();
            }
        }, reconnectDelay.value);

        // Exponential backoff with max delay of 30 seconds
        reconnectDelay.value = Math.min(reconnectDelay.value * 2, 30000);
    };

    const stop = () => {
        if (socket.value) {
            socket.value.close(1000, 'Manual disconnect');
            socket.value = null;
        }

        frameUrl.value = '';
        liveStatus.value = false;
        isConnecting.value = false;
        reconnectAttempts.value = 0;
        reconnectDelay.value = 1000;
    };

    const cleanup = () => {
        stop();
    };

    return {
        connect,
        stop,
        cleanup,
        liveStatus,
        frameUrl,
        isConnecting,
        reconnectAttempts
    };
});