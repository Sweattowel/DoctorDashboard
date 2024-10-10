'use client'

import API from "@/app/Interceptor";
import { useState, FormEvent, useEffect } from "react";
import { Appointment } from "../AppointmentDisplay";

// Expansion Component for appointment details
interface ExpansionProps {
    data: Appointment;
    QuickSetTime : string
  }
  
export default function Expansion ({ data, QuickSetTime } : ExpansionProps ) {
const [ wantToAdjust, setWantToAdjust ] = useState<boolean>(false);
const [ error, setError ] = useState<string>("");
const [ loading, setLoading ] = useState<boolean>(false);

const [formData, setFormData] = useState<Appointment>({
    ...data
})

async function HandleAdjustAppointment(e: FormEvent<HTMLFormElement>){
    try {
    e.preventDefault();
    setLoading(true);
    setError("");

    let MissingFields = Object.entries(formData).filter(([key, value]) => key !== "FurtherAction" && (value == "" && value !== false))
    if (MissingFields.length > 0){
        setError(`Missing: ${MissingFields.map(([key]) => key).join(", ")}`);
    }

    const response = await API.patch(`/api/Appointments/Update/${formData.id}`, formData);

    if (response.status == 200) {
        setError("Successfully updated");
    } else {
        setError(`Error, ${response.status}`);
    }

    } catch (error) {
    setLoading(false);
    setError("Failed to adjust, please refresh"); 
    } finally {
    setLoading(false);
    setWantToAdjust(false);
    }
}

useEffect(() => {
    setWantToAdjust(false);
}, [data])

if (loading){
    return (
    <section className="p-5 border rounded-2xl overflow-hidden transition-all duration-500 ease-in-out flex flex-col justify-evenly w-full mt-10 animate-pulse text-red-600 text-center">
        Loading...
    </section>
    )
}
if (wantToAdjust){
    return (
    <form onSubmit={(e) => HandleAdjustAppointment(e)} className="p-5 border rounded-2xl overflow-hidden transition-all duration-500 ease-in-out flex flex-col justify-evenly w-full mt-10">
        <section className="text-lg font-bold flex">
        <div className="flex flex-row justify-between items-center w-[40%]">
            <label className="flex justify-evenly w-full">

                <input
                    type="radio"
                    name="title"
                    value={formData.Title}
                    placeholder="Mr"
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
                        value={formData.Title}
                    placeholder="Mrs"
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
                    value={formData.Title}
                    placeholder="Else"
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

        </section>
        <label className="font-bold">New Date & time:</label>
        <div className="flex  flex-col">
        <p>Previous Time: {formData.AppointmentDate.replace("T", " ")}</p>
        <p>New Time: {QuickSetTime !== "" ? QuickSetTime.replace("T", " ") : "Please select clear timeslot"}</p>
        <button className="bg-blue-600 text-white w-[50%] mt-1 mb-1 rounded shadow hover:opacity-60"
            onClick={() => setFormData((prevData) => ({ ...prevData, AppointmentDate: QuickSetTime}))}
        >
            Switch
        </button>
        </div>      
        <label className="font-bold">Client Name:</label>
        <input value={formData.ClientName} placeholder={`${formData.ClientName}`} 
        onChange={(e) => {
            setFormData((prevData) => ({
                ...prevData,
                ClientName: e.target.value
            }));
        }}
        />        
        <label className="font-bold">Client Issue:</label>
        <input value={formData.Issue} placeholder={`${formData.Issue}`} 
        onChange={(e) => {
            setFormData((prevData) => ({
                ...prevData,
                Issue: e.target.value
            }));
        }}
        />
        <label className="font-bold">Level of Access:</label>
        <input value={formData.LOA} type="number" placeholder={`${formData.LOA}`} 
        onChange={(e) => {
            setFormData((prevData) => ({
                ...prevData,
                LOA: Math.max(parseInt(e.target.value), 0)
            }));
        }}
        />
        <label className="font-bold">Client Status:</label>
        <input value={formData.ClientStatus} placeholder={formData.ClientStatus} 
        onChange={(e) => {
            setFormData((prevData) => ({
                ...prevData,
                ClientStatus: e.target.value
            }));
        }}
        />
        <label className="font-bold">New Result:</label>
        <input value={formData.Result} placeholder={formData.Result} 
        onChange={(e) => {
            setFormData((prevData) => ({
                ...prevData,
                Result: e.target.value
            }));
        }}
        />

        <label className="font-bold mt-2 mb-2 border-b">Communication:</label>
        <label className="font-bold">Email:</label>
        <input value={formData.Email} placeholder={formData.Email} 
        onChange={(e) => {
            setFormData((prevData) => ({
                ...prevData,
                Email: e.target.value
            }));
        }}
        />
        <label className="font-bold">Phone Number:</label>
        <input value={formData.Phone} placeholder={formData.Phone} 
        onChange={(e) => {
            setFormData((prevData) => ({
                ...prevData,
                Phone: e.target.value
            }));
        }}
        />
        <label className="font-bold">Address:</label>
        <input value={formData.Address} placeholder={formData.Address} 
        onChange={(e) => {
            setFormData((prevData) => ({
                ...prevData,
                Address: e.target.value
            }));
        }}
        />
        <div className="flex p-1">
        <label className="font-bold">Further Action Needed?</label>
        <input className="border p-1 ml-5" value={formData.FurtherAction ? "true" : "false"}
            onChange={(e) => setFormData((prevData) => ({...prevData, FurtherAction: e.target.checked}))} type="checkbox"  
        />          
        </div>        
        <p className="text-red-600 animate-pulse">
        {error || "waiting..."}
        </p>
        <button type="submit" className="bg-blue-600 text-white rounded shadow p-1 mt-2 hover:opacity-60">
        Submit Adjustment
        </button>
    </form>
    );    
}

return (
    <section className="p-5 border rounded-2xl overflow-hidden transition-all duration-500 ease-in-out flex flex-col justify-evenly w-full mt-10">
    <h2 className="text-lg font-bold">{data.Title} - {data.ClientName} - {data.AppointmentDate}</h2>
    <p>{data.Issue}</p>
    <p>LEVEL:{data.LOA} Access`</p>
    <p>{data.ClientStatus}</p>
    <p className={`${data.Result === "Pending" ? "animate-pulse" : "line-through"} bg-blue-400 border rounded p-2 w-[100px] text-center`}>
        {data.Result}
    </p>
    <button onClick={() => setWantToAdjust(true)} className="bg-blue-600 text-white rounded shadow p-1 mt-2 hover:opacity-60">
        Adjust Appointment?
    </button>
    </section>
)
};