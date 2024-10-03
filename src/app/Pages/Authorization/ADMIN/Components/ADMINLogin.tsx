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
    const { userData, setUserData, isUser, setIsUser, isAdmin, setIsAdmin, doctorData, setDoctorData, isDoctor, setIsDoctor, wantLogOut, setWantLogOut } = userContext();
    const [ formData, setFormData ] = useState<formData>({
        UserName: "",
        PassWord: ""
    });

    async function AdminLogin(e: { preventDefault: () => void; }){
        e.preventDefault();

        try {
            setWantLogOut(true);
            
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
                case 401: 
                    setError("Unauthorized");
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
            {!isAdmin ?
                <section className="bg-white w-[80%] mt-10 m-auto p-5 shadow-2xl rounded-2xl">
                    <h1 className="text-xl font-bold border-b">
                        Administration Login
                    </h1>
                    <form onSubmit={(e) => AdminLogin(e)} className="flex flex-col">
                        <label>Enter Name: </label>
                        <input onChange={(e) => setFormData((prevData) => ({...prevData, UserName: e.target.value}))} className="border p-1" type="text" id="Name" required/>
                        <label>Enter PassWord: </label>
                        <input onChange={(e) => setFormData((prevData) => ({...prevData, PassWord: e.target.value}))} className="border p-1" type="password" id="PassWord" required/>
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
            :
                <p className="bg-white w-[80%] m-auto p-1 text-center font-serif mt-10 rounded shadow">
                    Welcome Admin
                </p>
            }
        </main>
    )
}