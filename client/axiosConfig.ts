import axios from "axios";

const API = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    // Другие настройки, если необходимо,
    headers:{
        'ngrok-skip-browser-warning': 'true',
    }
});

export default API;