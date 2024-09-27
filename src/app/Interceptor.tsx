import axios from "axios"

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
        console.log("Response Intercepted");
        
        console.log(config.statusText);

        return config;

    } catch (error) {
        return Promise.reject(error);        
    }
})
export default API; 
