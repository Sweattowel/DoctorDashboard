'use client'

import NavBar from "@/app/GlobalComponents/Nav/Navigation";
import Tail from "@/app/GlobalComponents/Tail/Tail";
import API from "@/app/Interceptor";
import e from "express";
import Link from "next/link";
import { FormEvent, useState } from "react";

interface formDataStruc {
    Title : string
    UserName : string
    Password : string
    EmailAddress : string
    Address : string
    PhoneNumber : string
}

export default function Register(){
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const [ formData, setFormData ] = useState<formDataStruc>({
        Title:"",
        UserName:"",
        Password:"",
        EmailAddress:"",
        Address:"",
        PhoneNumber:"",
    });


    async function handleRegistration(e: FormEvent<HTMLFormElement>){
        try {
            e.preventDefault();
            setLoading(true);
            setError("");

            const missingFields = Object.entries(formData).filter(([key, value]) => value === '')

            if (missingFields.length > 0) {
                const missingFieldNames = missingFields.map(([key, value]) => key).join(', ');
                setError("Please fill in the following: ".concat(missingFieldNames));
                setLoading(false);
            }

            const response = await API.post("/api/Authorization/Register", formData);

            switch (response.status){
                case 200:
                    setError("Successfully made account");
                    setLoading(false);
                    break;
                case 400: 
                    setError("User already exists");
                    setLoading(false);
                case 401:
                    setError("Missing Data please refresh and try again");
                    setLoading(false);
                    break;
                default:
                    setError("System Failure")
                    setLoading(false);
                    break;
            }
        } catch (error) {
            console.error("Failed to register", error)
            setError("Failed to register, Please Refresh");
        }
    }

    return (
        <main className="bg-gray-200 min-h-[100vh]">
            <NavBar />
            <section className="flex h-[60vh] w-[80vw] m-auto bg-white mt-10 rounded-xl">
                <div className="w-[50%] h-full flex flex-col">
                    <h1 className="h-[20%] w-full flex justify-center items-center text-2xl font-bold font-serif m-auto">
                        Sign Up
                    </h1>
                    <form onSubmit={(e) => handleRegistration(e)} className="h-[60%] flex flex-col justify-center items-center" action="">
                        <h2>Select Title</h2>
                        <div className="flex flex-row justify-between items-center w-[40%]">
                            <label className="flex justify-evenly w-full">
                                <input
                                    type="radio"
                                    name="title"
                                    value="Mr"
                                    onChange={(e) => {
                                        setFormData((prevData) => ({
                                            ...prevData,
                                            Title: e.target.value
                                        }));
                                    }}
                                />
                                Mr
                            </label>
                            <label className="flex justify-evenly w-full">
                                <input
                                    type="radio"
                                    name="title"
                                    value="Mrs"
                                    onChange={(e) => {
                                        setFormData((prevData) => ({
                                            ...prevData,
                                            Title: e.target.value
                                        }));
                                    }}
                                />
                                Mrs
                            </label>
                            <label className="flex justify-evenly w-full">
                                <input
                                    type="radio"
                                    name="title"
                                    value="Mrs"
                                    onChange={(e) => {
                                        setFormData((prevData) => ({
                                            ...prevData,
                                            Title: e.target.value
                                        }));
                                    }}
                                />
                                Else
                            </label>
                        </div>
                        <h2>
                            Enter new UserName
                        </h2>
                        <input className="w-[40%] border rounded shadow" placeholder="UserName" type="text" 
                            onChange={(e) => {
                                setFormData((prevData) => ({
                                    ...prevData,
                                    UserName: e.target.value
                                }))
                            }}/>
                        <h2>
                            Enter new Password
                        </h2>
                        <input className="w-[40%] border rounded shadow" placeholder="Password" type="text" 
                            onChange={(e) => {
                                setFormData((prevData) => ({
                                    ...prevData,
                                    Password: e.target.value
                                }))
                            }}
                        />
                        <h2>
                            Enter new EmailAddress
                        </h2>
                        <input className="w-[40%] border rounded shadow" placeholder="EmailAddress" type="text" 
                            onChange={(e) => {
                                setFormData((prevData) => ({
                                    ...prevData,
                                    EmailAddress: e.target.value
                                }))
                            }}
                        />
                        <h2>
                            Enter new Address
                        </h2>
                        <input className="w-[40%] border rounded shadow" placeholder="Address" type="text" 
                            onChange={(e) => {
                                setFormData((prevData) => ({
                                    ...prevData,
                                    Address: e.target.value
                                }))
                            }}
                        />
                        <h2>
                            Enter new PhoneNumber
                        </h2>
                        <input className="w-[40%] border rounded shadow" placeholder="PhoneNumber" type="tel" 
                            onChange={(e) => {
                                setFormData((prevData) => ({
                                    ...prevData,
                                    PhoneNumber: e.target.value
                                }))
                            }}
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

                </div>
                <div className="w-[50%] h-full bg-blue-600 flex flex-col justify-center items-center">
                    <h1 className="text-center text-white h-[20%] w-full flex justify-center items-center text-2xl font-bold font-serif m-auto">
                        Log in instead?
                    </h1>
                    <div className="h-[60%] w-full flex justify-center  items-center">
                        <Link href={"/Pages/Authorization/Login"} className="border text-center border-white text-white w-[40%] m-auto shadow p-1 rounded-xl hover:opacity-80 hover:shadow hover:shadow-lg hover:shadow-white transition-all duration-500 ease-in-out">
                            Login
                        </Link>                        
                    </div>
                </div>
            </section>
            <Tail />
        </main>
    )
}