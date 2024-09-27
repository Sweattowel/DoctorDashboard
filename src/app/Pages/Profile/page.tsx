'use client'

import { userContext } from "@/app/Context/ContextProvider";
import NavBar from "@/app/GlobalComponents/Nav/Navigation";
import Tail from "@/app/GlobalComponents/Tail/Tail";
import API from "@/app/Interceptor";
import { useEffect } from "react";

export default function Profile(){
    const { userData, setUserData, isUser, setIsUser } = userContext();

    async function getAppointments(){
        try {
            const response = await API.get(`/api/Profile/getUserAppointments/${userData.UserID}`);

            if (response.status === 200) {
                console.log(response.data.appointments);
            } else {
                console.log("Failed to collect appointments")
            }
        } catch (error) {
            console.log(error); 
        }
    }

    useEffect(() => {
        if (isUser){
            getAppointments();
        }
    },[])
    return (
        <main className="bg-gray-200">
            <NavBar />
            <div>
                {Object.entries(userData).map(([key, value] : any, index: number) => (
                    <div key={index}>
                        {key}: {value}
                    </div>
                ))}
            </div>
            <Tail />
        </main>
    )
}