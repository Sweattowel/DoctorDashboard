'use client'
// Import useContext from React
import { userContext } from "@/app/Context/ContextProvider"; // Adjusted import for clarity
import NavBar from "@/app/GlobalComponents/Nav/Navigation";
import Tail from "@/app/GlobalComponents/Tail/Tail";
import API from "@/app/Interceptor";
import Link from "next/link";
import { FormEvent, useState } from "react";

// Define formData and userData interfaces
interface formDataStruc {
    UserName: string;
    Password: string;
}

interface userDataStruc {
    UserID: number;
    UserName: string;
    EmailAddress: string;
    Address: string;
    PhoneNumber: string;
    Title: string;
}

export default function Login() {
    const { userData, setUserData, isUser, setIsUser } = userContext(); // Use custom hook for context

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const [formData, setFormData] = useState<formDataStruc>({
        UserName: "",
        Password: "",
    });

    async function handleLogin(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        try {
            setLoading(true);
            setError("");

            // Check if any fields are missing
            const missingFields = Object.entries(formData).filter(([_, value]) => value === "");
            if (missingFields.length > 0) {
                const missingFieldNames = missingFields.map(([key]) => key).join(", ");
                setError("Please fill in the following: " + missingFieldNames);
                setLoading(false);
                return;
            }

            // Call the login API
            const response = await API.post("/api/Authorization/Login", formData, {
                withCredentials: true,
            });

            if (response.status === 200) {
                setError("Logged in");

                // Get user data from response
                const newUserData: userDataStruc = response.data.userData;

                // Update context with new user data
                setUserData(newUserData);
                setIsUser(true);
                console.log("User data after login:", newUserData); // Log the new user data directly
            } else {
                setError("Login failed: " + response.data.message || "Unknown error");
            }
        } catch (error: any) {
            console.error("Failed to login", error);
            setError("Failed to login, please refresh");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="bg-gray-200 min-h-[100vh]">
            <NavBar />
            {isUser ? 
                <section className="flex flex-col md:flex-row md:h-[60vh] h-[90vh] w-[80vw] m-auto bg-white mt-10 rounded-xl">
                    <div className="w-full h-full flex flex-col">
                        <h1 className="h-[20%] w-full flex justify-center items-center text-2xl font-bold font-serif m-auto">
                            Sign in
                        </h1>
                        <form onSubmit={handleLogin} className="h-[60%] flex flex-col justify-center items-center">
                            <h2>Enter Username</h2>
                            <input
                                className="w-[40%] border rounded shadow"
                                placeholder="Username"
                                type="text"
                                onChange={(e) => setFormData((prevData) => ({
                                    ...prevData,
                                    UserName: e.target.value,
                                }))}
                            />
                            <h2>Enter Password</h2>
                            <input
                                className="w-[40%] border rounded shadow"
                                placeholder="Password"
                                type="password" // Changed to 'password' for security
                                onChange={(e) => setFormData((prevData) => ({
                                    ...prevData,
                                    Password: e.target.value,
                                }))}
                            />
                            <p className="text-red-800 text-center max-w-[60%] min-h-[80px]">{error}</p>
                            {loading ? (
                                <p className="text-center bg-blue-600 text-white w-[40%] m-auto shadow p-1 rounded-xl animate-pulse transition-all duration-500 ease-in-out">
                                    Loading...
                                </p>
                            ) : (
                                <button type="submit" className="bg-blue-600 text-white w-[40%] m-auto shadow p-1 rounded-xl hover:opacity-60 hover:shadow-lg transition-all duration-500 ease-in-out">
                                    Submit
                                </button>
                            )}
                        </form>
                    </div>
                    <div className="w-full h-full bg-blue-600 flex flex-col justify-center items-center">
                        <h1 className="text-white h-[20%] w-full flex justify-center items-center text-2xl font-bold font-serif m-auto">
                            Want to sign up?
                        </h1>
                        <div className="h-[60%] w-full flex justify-center items-center">
                            <Link href="/Pages/Authorization/Registration" className="border text-center border-white text-white w-[40%] m-auto shadow p-1 rounded-xl hover:opacity-80 transition-all duration-500 ease-in-out">
                                Register
                            </Link>
                        </div>
                    </div>
                </section> 
                :
                <section className="bg-white w-[90%] h-[20vh] p-5 rounded shadow m-auto mt-10 flex flex-col justify-evenly items-center">
                    <Link className="bg-blue-600 p-2 rounded text-white hover:opacity-60" href={"/Pages/Profile"}>
                        Check out your Profile
                    </Link>
                    <Link className="bg-blue-600 p-2 rounded text-white hover:opacity-60" href={"/Pages/Appointments"}>
                        Book your next visit!
                    </Link>
                    <button>
                        Log Out
                    </button>
                </section>
                }
            <Tail />
        </main>
    );
}
