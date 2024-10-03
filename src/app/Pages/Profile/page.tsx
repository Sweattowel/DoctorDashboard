'use client'

import { userContext } from "@/app/Context/ContextProvider";
import NavBar from "@/app/GlobalComponents/Nav/Navigation";
import Tail from "@/app/GlobalComponents/Tail/Tail";
import API from "@/app/Interceptor";
import Link from "next/link";
import { useEffect, useState } from "react";

interface appointmentStruc {
    Address: string,
    AppointmentDate: string,
    ClientName: string,
    ClientStatus: string,
    DoctorID:  string,
    Email: string,
    FurtherAction: string,
    Issue: string,
    LOA:  number,
    Occupation: string,
    Phone: string,
    Result: string,
    Title: string,
    id: number,
  }

export default function Profile(){
    const { userData, setUserData, isUser, setIsUser, isAdmin, setIsAdmin, isDoctor, setIsDoctor, wantLogOut, setWantLogOut } = userContext()
    const [ appointments, setAppointments ] = useState<appointmentStruc[]>([])

    async function getAppointments(){
        try {
            const response = await API.get(`/api/Profile/getUserAppointments/${userData.UserID}`);

            if (response.status === 200) {
                setAppointments(response.data.results);
            } else {
                console.log("Failed to collect appointments")
            }
        } catch (error) {
            console.log('FAIL'); 
        }
    }

    async function HandleLogout() {
        try {
            setWantLogOut(true);
            setAppointments([]);
        } catch (error) {
            console.log("Failed to log out");
        }
    }

    useEffect(() => {
        if (isUser){
            getAppointments();
        }
    },[])
    return (
        <main className="bg-gray-200 w-[100vw]">
            <NavBar />
            {isUser ?
                <div className="bg-white w-[80%] mt-10 m-auto p-5 rounded shadow">
                    
                        <h2 className="font-bold">
                            Profile for {userData.Title} {userData.UserName}
                        </h2>
                        <p>
                            Current Data: 
                        </p>
                        <ul>
                            <li>
                                ADDRESS: {userData.Address}
                            </li>
                            <li>
                                PH: {userData.PhoneNumber}
                            </li>
                        </ul>
                        <button className="bg-blue-600 rounded p-2 text-white hover:opacity-60"  
                            onClick={() => HandleLogout()}>
                            Log Out
                        </button>
                </div>
                :
                
                    <Link className={"w-[80%] bg-blue-600 hover:opacity-60 text-white text-2xl rounded shadow m-auto mt-10 p-5 flex justify-center"}
                        href={"/Pages/Authorization/Login"}
                    >
                        Please log in here
                    </Link>                    
               
}        
            <ul>
                {appointments.map((appointment: appointmentStruc, index: number) => (
                    <li className="bg-white p-2 rounded shadow mt-1 w-[80%] m-auto" key={index}>
                        <h2 className="font-bold">
                            Appointment on {appointment.AppointmentDate}:
                        </h2>
                        <div>
                            <div>
                                {appointment.Title} {appointment.ClientName} Has requested an appointment to discuss the topic: 
                            </div>
                            <div>
                                {appointment.Issue}                                
                            </div>
                        </div>
                        <div className="flex w-full justify-between items-center">
                            <p>
                            <span className="font-bold">Status:</span>  {appointment.ClientStatus}
                            </p>     
                            <button className="bg-blue-600 text-white pl-2 pr-2 rounded hover:opacity-60">
                                Adjust
                            </button>                       
                        </div>

                    </li>
                ))}
            </ul>
            <Tail />
        </main>
    )
}