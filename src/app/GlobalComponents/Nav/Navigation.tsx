'use client'

import { userContext } from "@/app/Context/ContextProvider";
import API from "@/app/Interceptor";
import Link from "next/link"
import { useEffect } from "react";

export default function NavBar(){
    const { userData, setUserData, isUser, setIsUser } = userContext();

    async function existingSessionCheck() {
        try {
            console.log("Checking for previous Session");

            const response = await API.get("/api/Authorize/PreviousSession");

            if (response.status == 200) {
                setIsUser(true);
                console.log(response.data.userData)
                setUserData(response.data.userData);
            } else {
                console.log("no previous session");
            }
        } catch (error) {
            console.error(error);
        } finally {
            sessionStorage.setItem("PreviousSessionChecked", "True")
        }
    }

    async function refreshToken() {
        try {
            const response = await API.post("/api/Authorization/RefreshToken")

            if (response.status == 200){
                setTimeout(() => refreshToken(), 240000);
                console.log("Token Refreshed");
            }
        } catch (error) {
            console.error(error);
        }
    }
    useEffect(() => {
        if (sessionStorage.getItem("PreviousSessionChecked") !== "True"){
            existingSessionCheck();
        }
        setTimeout(() => refreshToken(), 240000)
    },[])


    return (
        <main className="flex shadow justify-evenly items-center p-2 bg-white">
            <h1 className="p-2 pl-5 h-full text-2xl font-serif font-bold">
                Medicite
            </h1>
            
            <ul className="w-full flex justify-evenly items-center ">
                <Link className="bg-blue-600 text-white p-2 pl-5 pr-5 rounded hover:pl-10 hover:pr-10 hover:opacity-60 transition-all ease-in-out duration-500"
                    href={"/"}
                >
                    Home
                </Link>
                <Link className="bg-blue-600 text-white p-2 pl-5 pr-5 rounded hover:pl-10 hover:pr-10 hover:opacity-60 transition-all ease-in-out duration-500"
                    href={"/Pages/Appointments"}
                >
                    Book
                </Link>
                {isUser ? (
                    <Link className="bg-blue-600 text-white p-2 pl-5 pr-5 rounded hover:pl-10 hover:pr-10 hover:opacity-60 transition-all ease-in-out duration-500"
                    href={"/Pages/Profile"}
                    >
                        Profile
                    </Link>   
                ) : (
                    <Link className="bg-blue-600 text-white p-2 pl-5 pr-5 rounded hover:pl-10 hover:pr-10 hover:opacity-60 transition-all ease-in-out duration-500"
                        href={"/Pages/Authorization/Login"}
                    >
                        Login
                    </Link>                    
                )}

                <Link className="bg-blue-600 text-white p-2 pl-5 pr-5 rounded hover:pl-10 hover:pr-10 hover:opacity-60 transition-all ease-in-out duration-500"
                    href={"/Pages/Injection"}
                >
                    Inject
                </Link>
            </ul>
        </main>
    )
}