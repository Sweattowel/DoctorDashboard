'use client'

import API from "@/app/Interceptor";
import { useEffect, useState } from "react"

interface Doctor {
    id: number;
    name: string;
    Speciality: string;
    phone: string;
    email: string;
    address: string;
    yearsOfExperience: number;
    hospitalAffiliation: string;
}
  
interface DoctorImportProps {
    DoctorID: number;
    DoctorName: string;
  }
  
  interface importProps {
    handleSeeAppointments: (getAppointments : boolean) => void;
    selectedDoctor: DoctorImportProps;
  }

export default function UserBook({selectedDoctor}: importProps) {
    const [doctor, setDoctor] = useState<Doctor | null>(null); // Set doctor as null initially
    const [loading, setLoading] = useState<boolean>(true); // Add loading state
    const [error, setError] = useState<string | null>(null); // Error state for better handling

    const [formData, setFormData] = useState({
        Date: "",
        Issue: ""
    })

    async function collectDoctorData() {
        if (selectedDoctor.DoctorID !== -1) {  // Check for valid ID
            setLoading(true); // Start loading
            setError(null); // Reset error

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

    useEffect(() => {
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
                    Create Appointment with {doctor.name}
                </h2>
                        
                <form onSubmit={() => console.log(formData)}>
                    <label>Date</label>
                    <input 
                        type="date" 
                        value={formData.Date} 
                        onChange={(e) => setFormData({ ...formData, Date: e.target.value })} 
                        required
                    />
                    
                    <label>Issue</label>
                    <input 
                        type="text" 
                        value={formData.Issue} 
                        onChange={(e) => setFormData({ ...formData, Issue: e.target.value })} 
                        required
                    />
                    
                    <button type="submit">
                        Submit
                    </button>
                </form>
            </>
            }
        </main>
    )
}
