'use client'

import { userContext } from "@/app/Context/ContextProvider";
import Tail from "@/app/GlobalComponents/Tail/Tail";
import API from "@/app/Interceptor";
import { useState } from "react";

interface formData {
    UserName: string
    PassWord: string
}

export default function ADMINLogin(){
    const [ loading, setLoading ] = useState<boolean>(false);
    const [ error, setError ] = useState<string>("Please Enter Details") 
    const { isAdmin, setIsAdmin } = userContext();
    const [ formData, setFormData ] = useState<formData>({
        UserName: "",
        PassWord: ""
    });

    async function AdminLogin(e: { preventDefault: () => void; }){
        e.preventDefault();

        try {
            setLoading(true);
            const missingFields = Object.entries(formData).filter(([key, value]) => value === "");
            if (missingFields.length > 0){
                setError(`Missing fields: ${missingFields.map(([key, value]) => `${key} `)}`)
            }            
            const response = await API.post("/api/Authorization/AdminLogin", formData)
            
            switch(response.status){
                case 200:
                    setIsAdmin(true);
                break;
                case 404:
                    setError("No User found");
                break;
                default:
                    setError("Failed to Authorize");
                    break;
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="h-full w-full">
            {isAdmin ? (
                <section >

                </section>
            ) : (
                <section className="bg-white w-[80%] mt-10 m-auto p-5 shadow-2xl rounded-2xl">
                    <h1 className="text-xl font-bold border-b">
                        Login
                    </h1>
                    <form onSubmit={(e) => AdminLogin(e)} className="flex flex-col">
                        <label>Enter Name: </label>
                        <input onChange={(e) => setFormData((prevData) => ({...prevData, UserName: e.target.value}))} className="border" type="text" id="Name" />
                        <label>Enter PassWord: </label>
                        <input onChange={(e) => setFormData((prevData) => ({...prevData, PassWord: e.target.value}))} className="border" type="password" id="PassWord" />
                        <p className="animate-pulse text-red-600">{error}</p>
                        {!loading ? (
                            <button className="bg-blue-600 text-white w-[50%] p-2 mt-2 m-auto rounded hover:opacity-60">
                                Submit
                            </button>
                        ) : (
                            <p className="bg-blue-600 text-white w-[50%] p-2 mt-2 m-auto rounded animate-pulse">
                                Loading...
                            </p>
                        )}
                    </form>
                </section>
            )}

            <Tail />
        </main>
    )
}