'use client'

import { userContext } from "@/app/Context/ContextProvider";
import API from "@/app/Interceptor";
import { useState, useEffect } from "react";
import { Appointment } from "../AppointmentDisplay";

export default function CreateAppointMent ({ DoctorName, DoctorID, QuickSetTime } : { DoctorName : string, DoctorID: number, QuickSetTime : string }) {
    const { userData, setUserData, isUser, setIsUser, isAdmin, setIsAdmin, doctorData, setDoctorData, isDoctor, setIsDoctor, wantLogOut, setWantLogOut } = userContext();
    const [ loading, setLoading ] = useState<boolean>(false);
    const [ error, setError ] = useState<string>("");

    const [formData, setFormData] = useState<Appointment>({
        id : -1,
        Address: "",
        AppointmentDate: "",
        ClientName: "",
        ClientStatus: "",
        DoctorID:  DoctorID,
        Email: "",
        FurtherAction: false,
        Issue: "",
        LOA:  -1,
        Occupation: "",
        Phone: "",
        Result: "N/A",
        Title: "",
    })

    useEffect(() => {
        if (QuickSetTime !== ''){
        setFormData((prevData) => ({ ...prevData, AppointmentDate: QuickSetTime }));
        };
        
    },[QuickSetTime]);

    useEffect(() => {
        console.log(formData.AppointmentDate);
    },[formData]);

    async function HandleSubmit(e: React.FormEvent) {
        e.preventDefault();
        try {
        setLoading(true);
        setError("");
        if (DoctorID == -1 || formData.Title == ""){
            setError("Missing Parameters");
            return
        }
        setFormData((prevData) => ({...prevData, DoctorID: DoctorID}));
        
        //const utcDate = new Date(new Date(formData.AppointmentDate).getTime() + (new Date().getTimezoneOffset() * 60000));
        //formData.AppointmentDate = utcDate.toISOString().slice(0, 19);

        const response = await API.post("/api/Appointments/Create", formData);

        switch (response.status){
            case 200:
            setError("Success");
            setFormData({
                id : -1,
                Address: "",
                AppointmentDate: "",
                ClientName: "",
                ClientStatus: "",
                DoctorID:  DoctorID,
                Email: "",
                FurtherAction: false,
                Issue: "",
                LOA:  -1,
                Occupation: "",
                Phone: "",
                Result: "N/A",
                Title: "",
            });
            break;
            case 401:
                setError("Unauthorized");
            break;
            default:
            setError("Unknown Error, Please Refresh");
            break;
        }
        } catch (error) {
        console.error(error);
        setError("Failed to create appointment, please refresh");
        } finally {
        setLoading(false)
        }
    }

    return (
        <section className="pt-10">
        <h2 className="border-b font-bold font-serif">
            Create new Appointment for {DoctorName}
        </h2>
        <form onSubmit={(e) => HandleSubmit(e)} className="flex flex-col p-2">
            <label className="font-bold">Client Name:</label>
            <input className="border p-1" value={formData.ClientName}
            onChange={(e) => setFormData((prevData) => ({...prevData, ClientName: e.target.value}))} type="text" required
            />
            <h2>Client Title</h2>
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
            <label className="font-bold">Client Status:</label>
            <input className="border p-1" value={formData.ClientStatus}
            onChange={(e) => setFormData((prevData) => ({...prevData, ClientStatus: e.target.value}))} type="text" required 
            />
            <label className="font-bold">Session purpose:</label>
            <input className="border p-1" value={formData.Issue}
            onChange={(e) => setFormData((prevData) => ({...prevData, Issue: e.target.value}))} type="text" required 
            />
            <label className="font-bold">Appointment Time & Date:</label>
            <input
            className="border p-1"
            value={formData.AppointmentDate}
            onChange={(e) => setFormData((prevData) => ({
                ...prevData,
                AppointmentDate: new Date(e.target.value).toISOString().slice(0, 16), // Ensure ISO but strip seconds
            }))}
            type="datetime-local"
            required
            />
            <label className={`${formData.LOA == 0 ? "bg-white" : formData.LOA == 1 ? "bg-blue-400" : formData.LOA == 2 ? "bg-blue-600" : formData.LOA == 3 ? "bg-red-400" : "" } font-bold p-2 mt-2 mb-2 rounded transition-all duration-500 ease-in-out`}> 
                Level Of Access: {formData.LOA === 3 && "If issue is life threatening please notify emergency services"}
            </label>
            <input 
                type="range"
                min={0}
                max={3}
                step={1}
                value={formData.LOA}
                onChange={(e) => setFormData({ ...formData, LOA: parseInt(e.target.value)})}
                required
            />
            <h2 className="font-bold text-serif text-lg border-b">
            Communication 
            </h2>
            <label className="font-bold">Email:</label>
            <input className="border p-1" value={formData.Email}
            onChange={(e) => setFormData((prevData) => ({...prevData, Email: e.target.value}))} type="text" required 
            />
            <label className="font-bold">Phone:</label>
            <input className="border p-1" value={formData.Phone}
            onChange={(e) => setFormData((prevData) => ({...prevData, Phone: e.target.value}))} type="text" required 
            />
            <label className="font-bold">Address:</label>
            <input className="border p-1" value={formData.Address}
            onChange={(e) => setFormData((prevData) => ({...prevData, Address: e.target.value}))} type="text" required 
            />
            <div className="flex p-1">
            <label className="font-bold">Further Action Needed?</label>
            <input className="border p-1 ml-5" value={formData.FurtherAction ? "true" : "false"}
                onChange={(e) => setFormData((prevData) => ({...prevData, FurtherAction: e.target.checked}))} type="checkbox"  
            />          
            </div>

            {loading ? (
            <p className="bg-blue-600 text-white w-[60%] m-auto mt-2 p-2 rounded shadow animate-pulse text-center">
                Loading...
            </p>
            ) : (
            <button type="submit" className="bg-blue-600 text-white w-[60%] m-auto mt-2 p-2 rounded shadow hover:opacity-60">
                Create Appointment
            </button>
            )}
            {error != "" && 
            <p className="p-2 text-red-600 animate-pulse text-center">
                {error}    
            </p>
            }

        </form>
        </section>
    )
}