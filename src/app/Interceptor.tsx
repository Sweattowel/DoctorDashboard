import axios from "axios"

const API = axios.create({
    baseURL: process.env.NEXT_PUBLIC_SERVER_ADDRESS
})

API.interceptors.request.use((config) => {
    try {
        console.log("Intercepted");
        //console.log(`${process.env.NEXT_PUBLIC_SERVER_ADDRESS}/api/getDoctorNames`)
        config.headers['Authorization'] = process.env.NEXT_PUBLIC_ACCESS_TOKEN;
        
        //console.log(config.headers);

        return config;

    } catch (error) {
        return Promise.reject(error);        
    }
})

export default API; 
