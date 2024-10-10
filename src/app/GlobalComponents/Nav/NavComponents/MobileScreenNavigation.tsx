'use client'

import { useState } from "react";
import { UpdateStruc, NotificationStructure } from "../Navigation";
import NavBarLink from "./NavBarLink";


export default function MobileNavBar ({ isUser, notifications, wantUpdate }: { isUser: boolean, notifications: any, wantUpdate : UpdateStruc }) {
    const [visible, setVisible] = useState<boolean>(false);
    const [ showNotifications, setShowNotifications ] = useState<boolean>(false);

    return (
        <main className="w-full flex justify-between pr-5 pl-5 p-2 relative bg-white shadow">
            <h1 className="p-2 pl-5 h-full text-2xl font-serif font-bold">Medicite</h1>
            <button
                className={`${visible && "animate-pulse"} bg-blue-600 w-[25%] text-white rounded`}
                onClick={() => {setVisible(!visible); setShowNotifications(false)}}
            >
                &#9776;
            </button>
            <button className={`${showNotifications && "bg-blue-600 animate-pulse scale-110"} animate-all duration-1000 ease-in-out text-white p-2 pl-5 pr-5 rounded transition-all ease-in-out duration-1000`} 
                onClick={() => {setShowNotifications(!showNotifications); setVisible(false)}}
            >
                &#128276;
            </button>
            {showNotifications &&
                <ul className="z-[1] bg-white border absolute right-0 top-[8vh] pt-5 pb-5 p-1 w-[50%] text-black overflow-auto ">
                    {notifications.map((notification: NotificationStructure, index: number) => (
                            <li key={index} className="text-black h-[50px] p-2 w-full h-full flex flex-col border-b">
                                <div className=" flex flex-col font-bold ">
                                    <h3>
                                        From {notification.RequesterName} 
                                    </h3>
                                    <p>
                                        Date: {notification.Date}
                                    </p>
                                </div>
                                <p>
                                    {notification.NotificationText}
                                </p>
                            </li>
                    ))
                    }
                </ul>                
                }
            <div
            className={`absolute top-[8vh] right-0 bg-white transition-all duration-700 ease-in-out w-[50vw] ${
                visible ? "h-full" : "h-0"
            }`}
            >
                {visible &&
                <ul className="flex flex-col h-full transition-all ease-in-out duration-700">
                    <NavBarLink href="/" text="Home" handleClick={() => setVisible(false)} />
                    <NavBarLink href="/Pages/Appointments" text="Book" handleClick={() => setVisible(false)} />
                    {isUser ? (
                        <NavBarLink href="/Pages/Profile" text="Profile" handleClick={() => setVisible(false)} />
                    ) : (
                        <NavBarLink href="/Pages/Authorization/Login" text="Login" handleClick={() => setVisible(false)} />
                    )}
                    <NavBarLink href="/Pages/Injection" text="Inject" handleClick={() => setVisible(false)} />
                </ul>
                }
            </div>
        </main>
    );
};
