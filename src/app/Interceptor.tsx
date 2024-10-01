import axios from "axios"
import useDeAuthorize from "./Pages/Authorization/DeAuthorize/DeAuthorize";


const API = axios.create({
    baseURL: process.env.NEXT_PUBLIC_SERVER_ADDRESS
})

API.interceptors.request.use((config) => {
    try {
        console.log("Request Intercepted");
        
        config.withCredentials = true;
        //config.headers["UserInformation"] = use
        return config;

    } catch (error) {
        return Promise.reject(error);        
    }
})
API.interceptors.response.use((config) => {
    try {

        console.log("Useless");
        console.log(config.headers)

        return config;

    } catch (error) {
        return Promise.reject(error);        
    }
})
export default API; 
