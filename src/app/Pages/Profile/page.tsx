'use client'

import { userContext } from "@/app/Context/ContextProvider";
import NavBar from "@/app/GlobalComponents/Nav/page";
import axios from "axios";

export default function Profile(){
    const { userData, setUserData, isUser, setIsUser } = userContext();

    async function getAppointments(){
        try {
            const response = await axios.get(`/api/Profile/getUserAppointments/${userData.UserID}`);

            if (response.status === 200) {
                console.log(response.data.appointments);
            } else {
                console.log("Failed to collect appointments")
            }
        } catch (error) {
            console.log(error); 
        }
    }

    return (
        <main className="bg-gray-200">
            <NavBar />
            <div>
                {Object.entries(userData).map(([key, value] : any, index: number) => (
                    <div>
                        {key}: {value}
                    </div>
                ))}
            </div>
        </main>
    )
}