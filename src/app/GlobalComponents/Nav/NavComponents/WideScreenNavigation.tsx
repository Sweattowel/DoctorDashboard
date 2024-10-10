'use client'

import { useState } from "react";
import NavBarLink from "./NavBarLink";
import { NotificationStructure, UpdateStruc } from "../Navigation";

export default function WideScreenNavBar({ isUser, isAdmin, notifications, wantUpdate }: { isUser: boolean, isAdmin: boolean, notifications: NotificationStructure[], wantUpdate : UpdateStruc }) {
    const [ showNotifications, setShowNotifications ] = useState<boolean>(false);

    return (
        <main className="flex shadow justify-evenly items-center p-2 bg-white max-w-[100vw]">
            <h1 className="p-2 pl-5 h-full text-2xl font-serif font-bold">Medicite</h1>
            <ul className="w-full flex justify-evenly items-center">
                <NavBarLink href="/" text="Home" />
                <NavBarLink href="/Pages/Appointments" text="Book" />
                {isUser ? (
                    <NavBarLink href="/Pages/Profile" text="Profile" />
                ) : (
                    <NavBarLink href="/Pages/Authorization/Login" text="Login" />
                )}
                {isAdmin && <NavBarLink href="/Pages/ADMIN" text="ADMIN" />}
                
                <NavBarLink href="/Pages/Injection" text="Inject" />
                <button className={`${showNotifications && "bg-blue-600 animate-pulse scale-110"} animate-all duration-1000 ease-in-out text-white p-2 pl-5 pr-5 rounded transition-all ease-in-out duration-1000`} 
                    onClick={() => setShowNotifications(!showNotifications)}
                >
                    &#128276;
                </button>
                {showNotifications &&
                    <ul className="z-[1] bg-white border absolute right-0 top-[5vh] pt-5 pb-5 p-1 w-[50%] text-black overflow-auto ">
                        {notifications.map((notification: NotificationStructure, index: number) => (
                                <li key={index} className={`${notification.CompletedStatus && "bg-gray-200 opacity-60"} rounded text-black h-[50px] p-2 w-full h-full flex flex-col border-b`}>
                                    <h3 className=" flex flex-col font-bold ">
                                        {notification.RequestType} From {notification.RequesterName} 
                                    </h3>
                                    <div>
                                        {notification.NotificationText.split("%:").map((Text: string, TextIndex: number) => (
                                            <p key={TextIndex}>
                                                {Text}
                                            </p>
                                        ))}
                                    </div>                                    
                                    <p className="text-sm text-gray-400">
                                        On {notification.Date.split("T")[0]}
                                    </p>
                                    {notification.RequesterName !== "SYSTEM" && <button onClick={() => wantUpdate(notification.NotificationID, notification.CompletedStatus)} className="bg-blue-600 text-white rounded shadow p-1 m-2">
                                        {notification.CompletedStatus ? "Mark Incomplete" : "Mark Complete"}
                                    </button>}
                                </li>
                        ))
                        }
                    </ul>                
                }
            </ul>
        </main>
    );
};