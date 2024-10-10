'use client'

import API from "@/app/Interceptor"
import { useEffect, useState } from "react"
import AppointmentList from "./AppointmentComponents/AppointmentList";
import CreateAppointMent from "./AppointmentComponents/CreateAppointment";

// Types for Appointments
export interface Appointment {
  id : number
  Address: string,
  AppointmentDate: string,
  ClientName: string,
  ClientStatus: string,
  DoctorID:  number,
  Email: string,
  FurtherAction: boolean,
  Issue: string,
  LOA:  number,
  Occupation: string,
  Phone: string,
  Result: string,
  Title: string,
}
// TODO CHECK FOR REDUNDANCY HERE
const titles: string[] = ["Date", "Name", "Purpose" ];

export interface DoctorImportProps
{
    DoctorID: number;
    DoctorName: string;
}

export interface importProps
{
    selectedDoctor: DoctorImportProps;
    getAppointments: boolean;
}
export default function AppointmentDisplay({ selectedDoctor, getAppointments }: importProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [searchParam, setSearchParam] = useState<string>("")
  const [glow, setGlow] = useState<boolean>(false);
  const [ newQuickSetTime, setNewQuickSetTime ] = useState("") 
  
  function HandleQuickChangeTime(newTime: string){
    setNewQuickSetTime(newTime);
  }
  
  // Fetch Appointments from API
  async function handleGetAppointments() {
    if (selectedDoctor.DoctorID !== -1) {
      try {
        const response = await API.get(`/api/getAppointments/${selectedDoctor.DoctorID}`);
        if (response.status === 200) {
          console.log(response.data.results)
          setAppointments(response.data.results);
        }
      } catch (error) {
        console.error("Failed to fetch appointments:", error);
        setAppointments([]);
      }
    }
  }

  useEffect(() => {
    if (getAppointments) {
      handleGetAppointments();
      setGlow(true);
      setTimeout(() => setGlow(false), 500);
    } 
    if (!getAppointments){
      setAppointments([])
    }
  }, [getAppointments]);

  return (
    <main className={`${glow ? "bg-blue-400 text-white" : "bg-white"} transition-all ease-in-out duration-500 rounded-2xl w-[85%] h-full p-5 mt-5 m-auto flex flex-col items-center justify-center shadow-2xl`}>
      {selectedDoctor.DoctorID !== -1 ? (
        <section className="h-full w-full flex flex-col">
          <h2 className="h-[50px] w-full flex items-center text-xl p-5 font-bold font-serif">
            Appointments for {selectedDoctor.DoctorName}
          </h2>
          <ul className="h-full bg-white mt-5 p-5 rounded-2xl divide-y overflow-auto">
            <ul className="hidden md:flex justify-evenly items-center w-full h-[5vh] p-5">
              {titles.map((title: string, index: number) => (
                <li key={index} className="flex justify-center items-center w-full md:w-[25%] h-full">
                  {title}
                </li>
              ))}
              <input
                onChange={(e) => setSearchParam(e.target.value)}
                type="search"
                className="border p-1"
                placeholder="Search Client"
              />
            </ul>
            <AppointmentList appointmentParam={searchParam} data={appointments} changeQuickSetTime={HandleQuickChangeTime}/>
            <CreateAppointMent DoctorName={selectedDoctor.DoctorName} DoctorID={selectedDoctor.DoctorID} QuickSetTime={newQuickSetTime}/>
          </ul>
        </section>
      ) : (
        <section>Please Select Doctor</section>
      )}
    </main>
  );
}