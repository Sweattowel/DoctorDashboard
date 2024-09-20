import axios from "axios"

const API = axios.create({
    baseURL: process.env.NEXT_PUBLIC_SERVER_ADDRESS
})

API.interceptors.request.use((config) => {
    try {
        console.log("Intercepted");
        //console.log(`${process.env.NEXT_PUBLIC_SERVER_ADDRESS}/api/getDoctorNames`)
        config.headers['Authorization'] = process.env.NEXT_PUBLIC_REQUEST_TOKEN;
        config.headers['testCookie'] = findCookie("Test");
        
        //console.log(config.headers);

        return config;

    } catch (error) {
        return Promise.reject(error);        
    }
})
/* HATED this from the get go, wasnt using it properly and it was unnecessarily centralised, found a better method using common sense...
export const getDoctorNames = async () => {
    return API.get('/api/getDoctorNames');
}

export const CreateAllData = async () => {
    return API.get('/api/CREATEDATA');
}
export const GetDoctorData = async (DoctorID: number) => {
    console.log(DoctorID)
    return API.get(`/api/getDoctorData/${DoctorID}`);
}
export const GetDoctorAppointMents = async (DoctorID : number) => {
    return API.get(`/api/getAppointments/${DoctorID}`)
}
*/
export default API; 

// HIRED HELP

function findCookie(cookieTitle: string){
    // Collect Cookies from browser
    let cookies = document.cookie.split(";");
    // Filter Cookies and return match
    for (const cookie of cookies){
        let cookieMemory = cookie.split("=");
        
        if (cookieMemory[0] === cookieTitle){
            return cookieMemory[1] || "1";
        }
    }
    // On Failure gracefully return empty string 
    return "";
}