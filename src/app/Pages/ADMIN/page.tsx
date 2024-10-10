'use client'

import { userContext } from "@/app/Context/ContextProvider";
import NavBar, { NotificationStructure } from "@/app/GlobalComponents/Nav/Navigation";
import Tail from "@/app/GlobalComponents/Tail/Tail";
import API from "@/app/Interceptor";
import { useEffect, useState } from "react";

export default function Admin(){
    const { userData, setUserData, isUser, setIsUser, isAdmin, setIsAdmin, doctorData, setDoctorData, isDoctor, setIsDoctor, wantLogOut, setWantLogOut } = userContext();
    const [ notifications, setNotifications ] = useState<NotificationStructure[]>([]);
    const [Verified, setVerified ] = useState<boolean>(false);

    const VerifyADMIN = async () => {
        try {
            console.log("Authorizing");

            const response = await API.get("/api/Authorization/Verify")

            if (response.status === 200){
                console.log("Success");
                const notificationResponse = await API.get(`/api/SYSTEM/SYSTEMNOTIFICATIONS/COLLECT`);
            
                if (notificationResponse.status == 200){
                    setNotifications(notificationResponse.data.results)
                }
                setVerified(true);
            } else {
                console.log("FAIL")
                setVerified(false);
            }
        } catch (error) {
            console.error(error);
            setVerified(false);        
        }
    }
    
    useEffect(() => {
        if (isAdmin && !isUser && !isDoctor) {
            VerifyADMIN();
            //const interval = setInterval(() => VerifyADMIN(), 5000);

            //return () => clearInterval(interval); // Clear interval on component unmount
        }
    }, []);

    return (
        <main>
            {Verified ? (
                <main className='bg-gray-200 pb-5 min-h-[100vh]'>
                    <NavBar />
                    <p className="bg-white text-red-600 animate-pulse mt-10 p-5 m-auto rounded text-center text-2xl font-bold">
                        VERIFIED                     
                    </p>
                    <Notifications SYSTEMNOTIFICATIONS={notifications}/>
                    <Tail />
                </main>
                ) : 
                (
                <main className='bg-gray-200 pb-5 min-h-[100vh]'>
                    <NavBar />
                    <p className="bg-white text-red-600 animate-pulse mt-10 p-5 m-auto rounded text-center text-2xl font-bold">
                        FAILED TO VERIFY                        
                    </p>
                    <Tail />
                </main>
            )}            
        </main>
    )
};

const Notifications = ({SYSTEMNOTIFICATIONS} : {SYSTEMNOTIFICATIONS : NotificationStructure[]}) => {
    
    
    return (
        <section className="mt-10 bg-white p-5 overflow-auto">
            <h2 className="text-2xl font-serif text-bold border-b">
                Notifications
            </h2>
            {SYSTEMNOTIFICATIONS && SYSTEMNOTIFICATIONS.map((NOTIFICATION : NotificationStructure, index : number) => (
                <li key={index} className={`${NOTIFICATION.CompletedStatus && "bg-gray-200 opacity-60"} rounded text-black h-[50px] p-2 w-full h-full flex flex-col border-b`}>
                    <h3 className=" flex flex-col font-bold ">
                        {NOTIFICATION.RequestType} From {NOTIFICATION.RequesterName} 
                    </h3>
                    <div>
                        {NOTIFICATION.NotificationText.split("%:").map((Text: string, TextIndex: number) => (
                            <p key={TextIndex}>
                                {Text}
                            </p>
                        ))}
                    </div>                                    
                    <p className="text-sm text-gray-400">
                        On {NOTIFICATION.Date.split("T")[0]}
                    </p>
                    {NOTIFICATION.RequesterName !== "SYSTEM" && <button className="bg-blue-600 text-white rounded shadow p-1 m-2">
                        {NOTIFICATION.CompletedStatus ? "Mark Incomplete" : "Mark Complete"}
                    </button>}
                </li>
            ))}
        </section>
    )
}