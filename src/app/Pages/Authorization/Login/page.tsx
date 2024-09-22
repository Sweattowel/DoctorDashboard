'use client'

import NavBar from "@/app/GlobalComponents/Nav/page";
import API from "@/app/Interceptor";
import Link from "next/link";
import { FormEvent, useState } from "react";

interface formDataStruc {
    UserName : string
    Password: string
}

export default function Login(){
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    
    const [formData, setFormData] = useState<formDataStruc>({
        UserName: "",
        Password: ""
    })

    async function handleLogin(e: FormEvent<HTMLFormElement>) {
        try {
            e.preventDefault();
            setLoading(true);
            setError("");
    
            const missingFields = Object.entries(formData).filter(([key, value]) => value === '');
    
            if (missingFields.length > 0) {
                const missingFieldNames = missingFields.map(([key, value]) => key).join(', ');
                setError("Please fill in the following: " + missingFieldNames);
                setLoading(false);
                return;
            }
    
            const response = await API.post("/api/Authorization/Login", formData, {
                withCredentials: true 
            });
    
            switch (response.status) {
                case 200:
                    setError("Logged in");
                    console.log(response.data);
                    break;
                case 401:
                    setError("Missing Data please refresh and try again");
                    break;
                default:
                    setError("System Failure");
                    break;
            }

        } catch (error) {
            console.error("Failed to Login", error);
            setError("Failed to Login, Please Refresh");
        } finally {
            setLoading(false); 
        }
    }
    
    async function callTest() {
        const response = await API.get("/api/testCookie", { withCredentials: true })
    
        if (response.status == 200) {
            console.log("Successfully verified Token");
        } else {
            console.log("Failed to verify token")
        }
    }

    return (
        <main className="bg-gray-200 min-h-[100vh]">
            <NavBar />
            <section className="flex h-[60vh] w-[80vw] m-auto bg-white mt-10 rounded-xl">
                <div  className="w-[50%] h-full flex flex-col">
                    <h1 className="h-[20%] w-full flex justify-center items-center text-2xl font-bold font-serif m-auto">
                        Sign in
                    </h1>
                    <form onSubmit={(e) => handleLogin(e)} className="h-[60%] flex flex-col justify-center items-center" action="">
                        <h2>
                            Enter Username
                        </h2>
                        <input className="w-[40%] border rounded shadow" placeholder="Username" type="text" 
                            onChange={(e) => setFormData((prevData) => ({
                                ...prevData,
                                UserName: e.target.value
                            }))} 
                        />
                        <h2>
                            Enter Password
                        </h2>
                        <input className="w-[40%] border rounded shadow" placeholder="Password" type="text" 
                            onChange={(e) => setFormData((prevData) => ({
                                ...prevData,
                                Password: e.target.value
                            }))} 
                        />
                        <p className="text-red-800 text-center max-w-[60%] text-center wrap">
                            {error}
                        </p>
                        {loading ? (
                            <p className="text-center bg-blue-600 text-white w-[40%] m-auto shadow p-1 rounded-xl animate-pulse transition-all duration-500 ease-in-out">
                                Loading..
                            </p>
                        ) : (
                            <button type="submit" className="bg-blue-600 text-white w-[40%] m-auto shadow p-1 rounded-xl hover:opacity-60 hover:shadow hover:shadow-lg hover:shadow-black transition-all duration-500 ease-in-out">
                                Submit
                            </button>                              
                        )}                    
                    </form>
                        <button onClick={() => callTest()} className="bg-blue-600 p-2 rounded-2xl text-white hover:opacity-60">
                            Test
                        </button>
                </div>
                <div className="w-[50%] h-full bg-blue-600 flex flex-col justify-center items-center">
                    <h1 className="text-white h-[20%] w-full flex justify-center items-center text-2xl font-bold font-serif m-auto">
                        Want to sign up?
                    </h1>
                    <div className="h-[60%] w-full flex justify-center  items-center">
                        <Link href={"/Pages/Authorization/Registration"} className="border text-center border-white text-white w-[40%] m-auto shadow p-1 rounded-xl hover:opacity-80 hover:shadow hover:shadow-lg hover:shadow-white transition-all duration-500 ease-in-out">
                            Register
                        </Link>                        
                    </div>
                </div>
            </section>
        </main>
    )
}