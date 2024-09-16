'use client'

import { useEffect, useState } from "react";
import { GetDoctorData } from "../../../../../Server/Server";

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

    async function collectDoctorData(){
        if (selectedDoctor !== ''){
            const response = await GetDoctorData(selectedDoctor!)
            if (response){
                //console.log(response)
                setDoctor(response)
            }
        }
    }
    useEffect(() => {
        collectDoctorData();
    },[selectedDoctor])


    return (
        <section className='h-full w-[50%] flex justify-center items-center'>
            {doctor.id !== -1 ? (
                <div className="border rounded-2xl h-full w-full flex flex-col items-center justify-evenly">
                    <h2>
                        Name: {doctor.name}
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
                    <button className="border p-2 rounded-2xl bg-blue-200 hover:opacity-60"
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