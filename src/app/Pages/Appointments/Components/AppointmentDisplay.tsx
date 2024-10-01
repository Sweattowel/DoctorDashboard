'use client'

import API from "@/app/Interceptor"
import { useEffect, useState } from "react"

// Types for Appointments
interface Appointment {
  Address: string,
  AppointmentDate: string,
  ClientName: string,
  ClientStatus: string,
  DoctorID:  string,
  Email: string,
  FurtherAction: string,
  Issue: string,
  LOA:  number,
  Occupation: string,
  Phone: string,
  Result: string,
  Title: string,
  id: number,
}

const titles: string[] = ["Date", "Name", "Purpose" ];

interface AppointmentDisplayProps {
  selectedDoctor: { DoctorName: string; DoctorID: number };
  getAppointments: boolean;
}

export default function AppointmentDisplay({ selectedDoctor, getAppointments }: AppointmentDisplayProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [searchParam, setSearchParam] = useState<string>("")
  const [glow, setGlow] = useState<boolean>(false);

  // Fetch Appointments from API
  async function handleGetAppointments() {
    if (selectedDoctor.DoctorID !== -1) {
      try {
        const response = await API.get(`/api/getAppointments/${selectedDoctor.DoctorID}`);
        if (response.status === 200) {
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
                <li key={index} className="flex justify-center items-center w-[25%] h-full">
                  {title}
                </li>
              ))}
              <input
                onChange={(e) => setSearchParam(e.target.value)}
                type="search"
                className="border"
                placeholder="Search Client"
              />
            </ul>
            <AppointmentList appointmentParam={searchParam} data={appointments} />
          </ul>
        </section>
      ) : (
        <section>Please Select Doctor</section>
      )}
    </main>
  );
}

// Appointment List Component
interface AppointmentListProps {
  appointmentParam: string;
  data: Appointment[];
}

const AppointmentList = ({ appointmentParam, data }: AppointmentListProps) => {
  const [expandedAppointment, setExpandedAppointment] = useState<number | null>(null);
  const [displayData, setDisplayData] = useState<Appointment[]>(data);

  useEffect(() => {
    const filteredAppointments = data.filter((client) =>
      client.ClientName.toLowerCase().includes(appointmentParam.toLowerCase())
    );
    setDisplayData(filteredAppointments);
  }, [appointmentParam, data]);

  return (
    <ul className="divide-y overflow-auto">
      {displayData.map((client: Appointment, index: number) => (
        <li key={index} className="transition-all ease-in-out duration-500">
          <div className="flex flex-col items-center md:flex-row w-full h-full p-5">
            <p className="w-full md:w-[25%]">{client.AppointmentDate}</p>
            <p className="w-full md:w-[25%]">{client.ClientName}</p>
            <p className="w-full md:w-[25%]">{client.Issue}</p>
            <button
              className="w-full md:w-[25%] p-2 rounded hover:opacity-60 bg-blue-600 text-white hover:opacity-60 hover:shadow-md hover:shadow-black transition-all duration-500 ease-in-out"
              onClick={() => setExpandedAppointment(expandedAppointment === index ? null : index)}
            >
              {expandedAppointment === index ? "COLLAPSE" : "EXPAND"}
            </button>
          </div>
          <div className={`overflow-hidden transition-all duration-500 ease-in-out ${expandedAppointment === index ? 'h-[200px]' : 'h-0'}`}>
            {expandedAppointment === index && <Expansion data={client} />}
          </div>
        </li>
      ))}
    </ul>
  );
};

// Expansion Component for appointment details
interface ExpansionProps {
  data: Appointment;
}

const Expansion = ({ data }: ExpansionProps) => {
  return (
    <section className="p-5 border rounded-2xl overflow-hidden transition-all duration-500 ease-in-out flex flex-col justify-evenly">
      <h2 className="text-lg font-bold">{data.Title} - {data.ClientName}</h2>
      <input placeholder={`${data.Issue}`} />
      <input placeholder={`LEVEL: ${data.LOA} Access`} />
      <input placeholder={data.ClientStatus} />
      <p className={`${data.Result === "Pending" ? "animate-pulse" : "line-through"} bg-blue-400 border rounded p-2 w-[100px] text-center`}>
        {data.Result}
      </p>
    </section>
  );
};
