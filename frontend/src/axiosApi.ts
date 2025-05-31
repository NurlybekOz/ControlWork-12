import axios from "axios";
import {apiUrl} from "../globalConstants.ts";

const axiosAPI = axios.create({
    baseURL: apiUrl,
});

axiosAPI.defaults.withCredentials = true;

axiosAPI.interceptors.request.use(function (config) {
    const storeUser = localStorage.getItem('persist:store: Users') || '';
    const parsedUser = JSON.parse(storeUser)
    const token = JSON.parse(parsedUser.user)?.token
    if(token){
        config.headers.Authorization = `${token}`;
    }
    return config;
}, function (error) {
    return Promise.reject(error);
});

export default axiosAPI;