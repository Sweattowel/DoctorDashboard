'use client'

import { userContext } from "@/app/Context/ContextProvider";
import API from "@/app/Interceptor";
import { FormEvent, useEffect, useState } from "react"

interface Doctor
{
    id: number;
    name: string;
    Speciality: string;
    phone: string;
    email: string;
    address: string;
    yearsOfExperience: number;
    hospitalAffiliation: string;
}

interface DoctorImportProps
{
    DoctorID: number;
    DoctorName: string;
}

interface importProps
{
    selectedDoctor: DoctorImportProps;
}

interface requestStructure
{
    ID: number
    Name: string
    Email: string
    PhoneNumber: string
    Issue: string
}

export default function UserBook({ selectedDoctor }: importProps)
{
    const { userData, setUserData, isUser, setIsUser, isAdmin, setIsAdmin, isDoctor, setIsDoctor, wantLogOut, setWantLogOut } = userContext();
    const [doctor, setDoctor] = useState<Doctor | null>(null); 
    const [loading, setLoading] = useState<boolean>(false); 
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        Urgency: -1,
        Issue: '',
    });

    async function collectDoctorData()
    {
        if (selectedDoctor.DoctorID !== -1) {  
            setLoading(true);
            setError(null); 

            try {
                const response = await API.get(`/api/getDoctorData/${selectedDoctor.DoctorID}`);
                if (response.status === 200 && response.data.results.length > 0) {
                    setDoctor(response.data.results[0]);
                } else {
                    setError("Doctor data not found");
                    setDoctor(null);
                }
            } catch (err) {
                console.error("Error fetching doctor data:", err);
                setError("Error fetching doctor data");
            } finally {
                setLoading(false); // End loading
            }
        }
    }

    async function RequestAppointment(e: FormEvent<HTMLFormElement>){
        try {
            e.preventDefault();
            
            const AppointmentRequest = {
                RequestType: "Appointment",
                Requester: userData,
                RequestData: formData
            };

            const response = await API.post("/api/Requests/Appointment", AppointmentRequest);

            switch (response.status) {
                case 200:
                    setError("Successfully made request");
                    break;
                case 404:
                    setError("Doctor no longer exists");
                default:
                    setError("Failed to make request, please refresh or call us directly")
                    break;
            }
        } catch (error) {
            if (error) {
                setError("Failed to make Request, please refresh");
            }
        }
    }

    useEffect(() =>
    {
        console.log(selectedDoctor.DoctorID, " HERE")
        if (selectedDoctor.DoctorID !== -1) {
            collectDoctorData();
        }
    }, [selectedDoctor.DoctorID]);

    if (loading) {
        return (
            <main className="bg-white p-5 m-auto w-[85%] mt-10 rounded shadow-2xl">
                <p>Loading...</p>
            </main>
        );
    }

    if (error) {
        return (
            <main className="bg-white p-5 m-auto w-[85%] mt-10 rounded shadow-2xl">
                <p>{error}</p>
            </main>
        );
    }

    return (
        <main className="bg-white p-5 m-auto w-[85%] mt-10 rounded shadow-2xl">
            {doctor && doctor.id !== -1 && doctor.name &&
                <>
                    <h2 className="font-serif font-bold border-b">
                        Request Appointment with {doctor.name}
                    </h2>

                    <form className="flex flex-col" onSubmit={(e) => RequestAppointment(e)}>
                        <label className="font-bold">Issue or concern:</label>
                        <input className="border"
                            type="text"
                            value={formData.Issue}
                            onChange={(e) => setFormData({ ...formData, Issue: e.target.value })}
                            required
                        />
                        <label className={`${formData.Urgency == 0 ? "bg-white" : formData.Urgency == 1 ? "bg-blue-400" : formData.Urgency == 2 ? "bg-blue-600" : formData.Urgency == 3 ? "bg-red-400" : "" } font-bold p-2 mt-2 mb-2 rounded transition-all duration-500 ease-in-out`}> Urgency:</label>
                        <input 
                            type="range"
                            min={0}
                            max={3}
                            step={1}
                            value={formData.Urgency}
                            onChange={(e) => setFormData({ ...formData, Urgency: parseInt(e.target.value)})}
                            required
                        />

                        <button type="submit" className="border bg-blue-600 text-white p-2 rounded w-[50%] m-auto mt-2 hover:opacity-60">
                            Submit Request
                        </button>
                    </form>
                </>
            }
        </main>
    )
}
