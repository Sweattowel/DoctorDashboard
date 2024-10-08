'use client'

import { userContext } from "@/app/Context/ContextProvider";
import API from "@/app/Interceptor";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

interface NotificationStructure {
    NotificationID: number
    Urgency: number
    RequesterID: number
    RequesterName: string
    RequesteeID: number
    RequesteeName: string
    NotificationText: string
    Date: string
    RequestType: string
    CompletedStatus: boolean
}
interface UpdateStruc {
    (NotificationID: number, status: boolean): void;
}
export default function NavBar() {
    const { userData, setUserData, isUser, setIsUser, isAdmin, setIsAdmin, doctorData, setDoctorData, isDoctor, setIsDoctor, wantLogOut, setWantLogOut } = userContext();
    const [wantedScreen, setWantedScreen] = useState<string>("Wide");
    const [ notifications, setNotifications ] = useState<NotificationStructure[]>([]);
    const called = useRef(false);

    useEffect(() => {
        if (wantLogOut == true) {
            setIsUser(false);
            setIsAdmin(false);
            setIsDoctor(false);

            setUserData({
                UserID: -1,
                UserName: "",
                EmailAddress: "",
                Address: "",
                PhoneNumber: "",
                Title: ""
            });

            setWantLogOut(false);

            console.log("Logged Out")
        }
    },[wantLogOut])

    async function existingSessionCheck() {
        try {
            console.log("Checking for previous Session");

            const response = await API.get("/api/Authorize/PreviousSession");

            if (response.status === 200) {
                setIsUser(true);
                console.log(response.data.userData);
                setUserData(response.data.userData);
            } else if (response.status === 401) {
                console.log("no previous session");
            }
        } catch (error) {
            console.error(error);
        } finally {
            sessionStorage.setItem("PreviousSessionChecked", "True");
        }
    }

    async function refreshToken() {
        try {
            if (!isUser && !isAdmin && !isDoctor) {return};
            const response = await API.post("/api/Authorization/RefreshToken",{ isUser,isDoctor,isAdmin });

            if (response.status === 200) {
                setTimeout(() => refreshToken(), 240000);
                console.log("Token Refreshed");
            }
        } catch (error) {
            console.error(error);
        }
    };

    async function collectNotifications(){
        if (isDoctor) {
            console.log(`Collecting Doctor Notifications ${doctorData.id}`);
            const response = await API.get(`/api/Notifications/CollectDoctorNotifications/${doctorData.id}`);

            if (response.status == 200){
                setNotifications(response.data.results)
            } else {
                setNotifications([{
                    NotificationID: -1,
                    Date: new Date().toString(),
                    RequesteeID: -1,
                    RequesteeName: userData.UserName,
                    RequesterID: userData.UserID,
                    RequesterName: "SYSTEM",
                    Urgency: 0,
                    NotificationText: "Oops No data",
                    RequestType: "No Notifications",
                    CompletedStatus: false
                }]);
            };
            return;
        } else if (isUser) {
            console.log("Collecting User Notifications");
            const response = await API.get(`/api/Notifications/CollectUserNotifications/${userData.UserID}`);
            
            if (response.status == 200){
                setNotifications(response.data.results)
            } else {
                setNotifications([{
                    NotificationID: -1,
                    Date: new Date().toString(),
                    RequesteeID: -1,
                    RequesteeName: userData.UserName,
                    RequesterID: userData.UserID,
                    RequesterName: "SYSTEM",
                    Urgency: 0,
                    NotificationText: "Oops No data",
                    RequestType: "No Notifications",
                    CompletedStatus: false
                }]);
            };
            return;
        } else {
            setNotifications([{
                NotificationID: -1,
                Date: new Date().toString(),
                RequesteeID: -1,
                RequesteeName: userData.UserName,
                RequesterID: userData.UserID,
                RequesterName: "SYSTEM",
                Urgency: 0,
                NotificationText: "Oops No data",
                RequestType: "No Notifications",
                CompletedStatus: false
            }]);
            return;
        };
    };

    async function HandleNotificationUpdate(NotificationID : number, status : boolean){
        try {
            const choice = status == true ? "unComplete" : "complete";

            const response = await API.patch(`/Notifications/${NotificationID}/${choice}`);

            if (response.status == 200){
                collectNotifications();
            }
            
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        if (sessionStorage.getItem("PreviousSessionChecked") !== "True") {
            existingSessionCheck();
        }
        refreshToken();
        collectNotifications();
        const RefreshInterval = setTimeout(() => {
            refreshToken();
            collectNotifications();
        }, 240000); // Call refresh after 240 seconds
    
        // Set Nav for screen size
        if (window.innerWidth < 750) {
            setWantedScreen("Mobile");
        } else {
            setWantedScreen("Wide");
        }
    
        // Cleanup on unmount
        return () => {
            clearTimeout(RefreshInterval);
        };
    }, []);

    useEffect(() => {
        if (isUser || isAdmin || isDoctor){
            collectNotifications();
        }
    },[isUser, isAdmin, isDoctor]);

    return (
        <>
            {wantedScreen === "Mobile" ? 
                <MobileNavBar wantUpdate={HandleNotificationUpdate} notifications={notifications} isUser={isUser} /> 
                : 
                <WideScreenNavBar wantUpdate={HandleNotificationUpdate} notifications={notifications} isUser={isUser} />
            }
        </>
    );
}

const WideScreenNavBar = ({ isUser, notifications, wantUpdate }: { isUser: boolean, notifications: NotificationStructure[], wantUpdate : UpdateStruc }) => {
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
                <NavBarLink href="/Pages/Injection" text="Inject" />
                <button className={`${showNotifications && "bg-blue-600 animate-pulse scale-110"} animate-all duration-1000 ease-in-out text-white p-2 pl-5 pr-5 rounded transition-all ease-in-out duration-1000`} 
                    onClick={() => setShowNotifications(!showNotifications)}
                >
                    &#128276;
                </button>
                {showNotifications &&
                    <ul className="z-[1] bg-white border absolute right-0 top-[5vh] pt-5 pb-5 p-1 w-[50%] text-black overflow-auto ">
                        {notifications.map((notification: NotificationStructure, index: number) => (
                                <li key={index} className="text-black h-[50px] p-2 w-full h-full flex flex-col border-b">
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

const MobileNavBar = ({ isUser, notifications, wantUpdate }: { isUser: boolean, notifications: any, wantUpdate : UpdateStruc }) => {
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


const NavBarLink = ({ href, text, handleClick }: { href: string; text: string; handleClick?: () => void }) => {
    const [mobile, setMobile] = useState(false);

    useEffect(() => {
        // Set Nav for screen size
        if (window.innerWidth < 750) {
            setMobile(true);
        } else {
            setMobile(false);
        }
    }, []);

    return (
        <Link
            className={`animate-all duration-1000 ease-in-out bg-blue-600 text-white p-2 pl-5 pr-5 rounded hover:pl-10 hover:pr-10 hover:opacity-60 transition-all ease-in-out duration-1000 ${
                !mobile ? "max-w-[25%]" : "border border-white"
            }`}
            href={href}
            onClick={handleClick}
        >
            {text}
        </Link>
    );
};
