export const useLive = defineStore('live', () => {

    const socket = ref<WebSocket | null>(null);
    const frameUrl = ref('');
    const status = ref(null);


    const connect = () => {
        if (socket.value) return;

        socket.value = new WebSocket('ws://192.168.0.131:8000/');
        socket.value.binaryType = 'arraybuffer';

    };

    const stop = () => {

    };

    return {connect}
})