'use client'

import { userContext } from "@/app/Context/ContextProvider";
import API from "@/app/Interceptor";
import { FormEvent, useState } from "react";

interface formData {
    UserName:string 
    Password:string 
    EmailAddress:string 
    PhoneNumber:string
    
}

export default function ADMINRegister() {
    const [ loading, setLoading ] = useState<boolean>(false);
    const [ error, setError ] = useState<string>("Please Enter Details") 
    const { isAdmin, setIsAdmin } = userContext();
    const [ formData, setFormData ] = useState<formData>({
        UserName: "",
        Password: "",
        EmailAddress: "",
        PhoneNumber: ""
    });

    async function AdminRegister(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        try {
            setLoading(true);

            const response = await API.post("/api/Authorization/AdminCreate", formData);

            switch(response.status){
                case 200:
                    setError("Success!");
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
            console.error(error)
        } finally {
            setFormData({
                UserName: "",
                Password: "",
                EmailAddress: "",
                PhoneNumber: ""
            })
            setLoading(false);
        }
    }
    return (
        <main className="h-full w-full">
            {isAdmin &&
                <section className="bg-white w-[80%] mt-10 m-auto p-5 shadow-2xl rounded-2xl">
                    <h1 className="text-xl font-bold border-b">
                        Create Admin
                    </h1>
                    <form onSubmit={(e) => AdminRegister(e)} className="flex flex-col">
                        <label>Enter Name: </label>
                        <input onChange={(e) => setFormData((prevData) => ({...prevData, UserName: e.target.value}))} className="border" type="text" id="Name" required />
                        <label>Enter Password: </label>
                        <input onChange={(e) => setFormData((prevData) => ({...prevData, Password: e.target.value}))} className="border" type="Password" id="PassWord" required/>
                        <label>Enter EmailAddress: </label>
                        <input onChange={(e) => setFormData((prevData) => ({...prevData, EmailAddress: e.target.value}))} className="border" type="text" id="EmailAddress" required/>
                        <label>Enter PhoneNumber: </label>
                        <input onChange={(e) => setFormData((prevData) => ({...prevData, PhoneNumber: e.target.value}))} className="border" type="password" id="PhoneNumber" required/>
                               
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
            }
        </main>
    )
}