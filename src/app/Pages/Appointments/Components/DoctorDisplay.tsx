'use client'

import API from "@/app/Interceptor";
import { useEffect, useState } from "react";
//import { GetDoctorData } from "../../../../../Server/Old/OldServer";

interface DoctorImportProps {
  
}
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
interface importProps {
    handleSeeAppointments: (doctorID: number) => void;
    selectedDoctor: string | null;
}
export default function DoctorDisplay({ selectedDoctor, handleSeeAppointments } : importProps) {
    const [glow, setGlow] = useState<boolean>(false);
    const [doctor, setDoctor] = useState<Doctor>({
        id: -1,
        name: "",
        Speciality: "",
        phone: "",
        email: "",
        address: "",
        yearsOfExperience: -1,
        hospitalAffiliation: ""
    })

    async function collectDoctorData(DoctorID : number, DoctorName : string){
        if (selectedDoctor !== ''){
            const response = await API.get("/api/getDoctorData", {
                DoctorID : DoctorID,
                DoctorName : DoctorName
            })
            if (response.st){
                //console.log(response)
                setDoctor(response)
            }
        }
    }
    useEffect(() => {
        //collectDoctorData(selectedDoctor);
        setGlow(true);
        setTimeout(() => setGlow(false), 500)
    },[selectedDoctor])


    return (
        <section className={`${glow ? "bg-blue-400 text-white" : "bg-white"} shadow-2xl h-full w-[45%] flex justify-center items-center rounded-2xl duration-500 transition-all ease-in-out`}>
            {doctor.id !== -1 ? (
                <div className="border rounded-2xl h-full w-full flex flex-col items-center justify-evenly">
                    <h2 className="text-2xl font-bold font-serif">
                        {doctor.name}
                    </h2>
                    <p>
                        Speciality: {doctor.Speciality} {doctor.yearsOfExperience} YRS
                    </p>
                    <p>
                        Relation: {doctor.hospitalAffiliation}
                    </p>
                    <div>
                        CONTACT DETAILS:
                            <p>Email: {doctor.email}</p>
                            <p>PH: {doctor.phone}</p>
                    </div>
                    <button className="border p-2 rounded-2xl bg-blue-400 text-white hover:opacity-60"
                        onClick={() => handleSeeAppointments(doctor.id)}
                    >
                        See Appointments
                    </button>
                </div>
            ) : (
                <p>
                No Data
                </p>
            )}
        </section>
    )
}