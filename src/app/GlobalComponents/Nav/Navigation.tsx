'use client'

import { userContext } from "@/app/Context/ContextProvider";
import API from "@/app/Interceptor";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function NavBar() {
    const { userData, setUserData, isUser, setIsUser, isAdmin, setIsAdmin, isDoctor, setIsDoctor } = userContext();
    const [wantedScreen, setWantedScreen] = useState<string>("Wide");

    async function existingSessionCheck() {
        try {
            console.log("Checking for previous Session");

            const response = await API.get("/api/Authorize/PreviousSession");

            if (response.status === 200) {
                setIsUser(true);
                console.log(response.data.userData);
                setUserData(response.data.userData);
            } else {
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
    }

    useEffect(() => {
        if (sessionStorage.getItem("PreviousSessionChecked") !== "True") {
            existingSessionCheck();
        }
        setTimeout(() => refreshToken(), 240000);
        
        // Set Nav for screen size
        if (window.innerWidth < 750) {
            setWantedScreen("Mobile");
        } else {
            setWantedScreen("Wide");
        }
    }, []);

    return (
        <>
            {wantedScreen === "Mobile" ? <MobileNavBar isUser={isUser} /> : <WideScreenNavBar isUser={isUser} />}
        </>
    );
}

const WideScreenNavBar = ({ isUser }: { isUser: boolean }) => {
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
            </ul>
        </main>
    );
};

const MobileNavBar = ({ isUser }: { isUser: boolean }) => {
    const [visible, setVisible] = useState<boolean>(false);

    return (
        <main className="w-full flex justify-between pr-5 pl-5 p-2 border-b border-black relative">
            <h1 className="p-2 pl-5 h-full text-2xl font-serif font-bold">Medicite</h1>
            <button
                className={`bg-blue-600 w-[25%] text-white rounded`}
                onClick={() => setVisible(!visible)}
            >
                /// 
            </button>
            <div
                className={`absolute top-[8vh] right-0 w-[50vw] bg-white border border-black transform transition-transform duration-700 ease-in-out ${
                    visible ? "translate-x-0" : "translate-x-full"
                }`}
            >
                <ul className="flex flex-col h-auto">
                    <NavBarLink href="/" text="Home" handleClick={() => setVisible(false)} />
                    <NavBarLink href="/Pages/Appointments" text="Book" handleClick={() => setVisible(false)} />
                    {isUser ? (
                        <NavBarLink href="/Pages/Profile" text="Profile" handleClick={() => setVisible(false)} />
                    ) : (
                        <NavBarLink href="/Pages/Authorization/Login" text="Login" handleClick={() => setVisible(false)} />
                    )}
                    <NavBarLink href="/Pages/Injection" text="Inject" handleClick={() => setVisible(false)} />
                </ul>
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
