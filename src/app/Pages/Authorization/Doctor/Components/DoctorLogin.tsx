'use client'

import { FormEvent, useState } from "react";

interface formDataStruc {
    UserName: string
    PassWord: string
}

export default function DoctorLogin(){
    const [ loading, setLoading ] = useState<boolean>(false);
    const [ error, setError ] = useState<string>("Please enter details");
    
    const [ formData, setFormData ] = useState<formDataStruc>({
        UserName : "",
        PassWord: ""
    })

    async function RegisterDoctorHandle(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        try {
            setLoading(true);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="w-[50%] p-1">
            <h2 className="font-serif font-bold">
                Login
            </h2>
            <form className="flex flex-col" onSubmit={(e) => RegisterDoctorHandle(e)}>
                <label>
                    Enter Username: 
                </label>
                <input onChange={(e) => setFormData((prevData) => ({...prevData, UserName: e.target.value}))} className="border" type="text" name="UserName" id="DoctorLoginUserName" required/>
                <label>
                    Enter PassWord: 
                </label>
                <input onChange={(e) => setFormData((prevData) => ({...prevData, PassWord: e.target.value}))} className="border" type="password" name="PassWord" id="LoginPassWord" required/>
                <p className="text-red-600 animate-pulse">{error}</p>
                {!loading ? (
                    <button className="bg-blue-600 hover:opacity-60 w-[50%] m-auto mt-2 p-2 text-white rounded" type="submit">
                        Login
                    </button>                    
                ) : (
                    <p className="bg-blue-600 w-[50%] m-auto mt-2 p-2 text-white rounded animate-pulse text-center">Loading...</p>
                )}
            </form>
        </main>
    )
}