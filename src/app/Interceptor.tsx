import axios from "axios"



axios.interceptors.request.use((config) => {
    try {
        console.log("Intercepted");
        
        config.headers['Authorization'] = process.env.REACT_APP_REQUEST_TOKEN;
        config.headers['testCookie'] = findCookie("Test");
        
        return config
    } catch (error) {
        return Promise.reject(error)        
    }
})


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