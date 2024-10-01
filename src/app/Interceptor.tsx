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
        const { deAuthorize } = useDeAuthorize();

        console.log("Response Intercepted");
        console.log(config.headers)
        if (config.headers["Removal-Request"] == "true"){
            console.log("Removing access");
            deAuthorize();
        }

        return config;

    } catch (error) {
        return Promise.reject(error);        
    }
})
export default API; 
