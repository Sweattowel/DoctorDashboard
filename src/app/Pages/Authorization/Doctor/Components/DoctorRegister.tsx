'use client'

import { userContext } from "@/app/Context/ContextProvider";
import API from "@/app/Interceptor";
import { FormEvent, useEffect, useState } from "react";

interface FormData {
    UserName: string;
    Password: string;
    EmailAddress: string;
    PhoneNumber: string;
}

export default function DoctorRegister() {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("Please Enter Details");
    const { isAdmin } = userContext();
    const [formData, setFormData] = useState<FormData>({
        UserName: "",
        Password: "",
        EmailAddress: "",
        PhoneNumber: ""
    });

    async function handleDoctorRegister(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(""); // Clear previous errors
        try {
            setLoading(true);
            const {UserName ,Password ,EmailAddress ,PhoneNumber} = formData

            if (!UserName || !Password || !EmailAddress || !PhoneNumber) {
                console.log("Missing Data")
                return
            }
            const response = await API.post("/api/Authorization/DoctorRegister", formData);

            switch(response.status) {
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
                    setError("Registration failed: " + (response.data.error || "Unknown error"));
                    break;
            }

        } catch (error: any) { // Use `any` for a more flexible error type
            console.error(error);
            setError("Registration failed: " + (error.response?.data?.error || "Unknown error"));
        } finally {
            setFormData({
                UserName: "",
                Password: "",
                EmailAddress: "",
                PhoneNumber: ""
            });
            setLoading(false);
        }
    }
    useEffect(() => {
        console.log(formData)
    },[formData])
    return (
        <main className="h-full w-full">
            {isAdmin && (
                <section className="bg-white w-[80%] mt-10 m-auto p-5 shadow-2xl rounded-2xl">
                    <h1 className="text-xl font-bold border-b">
                        Create Doctor
                    </h1>
                    <form onSubmit={handleDoctorRegister} className="flex flex-col">
                        <label>Enter Name: </label>
                        <input
                            onChange={(e) => setFormData((prevData) => ({ ...prevData, UserName: e.target.value }))}
                            className="border"
                            type="text"
                            id="Name"
                            value={formData.UserName}
                            required
                        />
                        <label>Enter Password: </label>
                        <input
                            onChange={(e) => setFormData((prevData) => ({ ...prevData, Password: e.target.value }))}
                            className="border"
                            type="password"
                            id="PassWord"
                            value={formData.Password}
                            required
                        />
                        <label>Enter Email Address: </label>
                        <input
                            onChange={(e) => setFormData((prevData) => ({ ...prevData, EmailAddress: e.target.value }))}
                            className="border"
                            type="text"
                            id="EmailAddress"
                            value={formData.EmailAddress}
                            required
                        />
                        <label>Enter Phone Number: </label>
                        <input
                            onChange={(e) => setFormData((prevData) => ({ ...prevData, PhoneNumber: e.target.value }))}
                            className="border"
                            type="text"
                            id="PhoneNumber"
                            value={formData.PhoneNumber}
                            required
                        />
                               
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
        </main>
    );
}
