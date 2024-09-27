import axios from "axios"
import DeAuthorize from "./Pages/Authorization/Helper Functions/DeAuthorize";


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
        console.log(config.headers)
        if (config.headers["Removal-Request"] == "true"){
            DeAuthorize();
        }

        return config;

    } catch (error) {
        return Promise.reject(error);        
    }
})
export default API; 
