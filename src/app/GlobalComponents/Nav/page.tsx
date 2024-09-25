'use client'

import { userContext } from "@/app/Context/ContextProvider";
import Link from "next/link"

const links = [
    {
        title: "Home",
        ref: "/"
    },    
    {
        title: "Book",
        ref: "/Pages/Appointments"
    },    
    {
        title: "Profile",
        ref: "/Pages/Authorization/Login"
    },
    {
        title: "Inject",
        ref: "/Pages/Injection"
    },
]
export default function NavBar(){
    const { userData, setUserData, isUser, setIsUser } = userContext();

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