'use client'

import { useEffect, useState } from "react"
import { GetDoctorAppointMents } from "../../../../../Server/Server"

interface importProps {
  doctorID: number
}

interface AppointMentStruc {
  Doctor: string,
  DoctorID: number,
  Clients: Appointment[]
}

interface Appointment {
  Title: string,
  ClientName: string,
  Occupation: string,
  Address: string,
  Phone: string,
  Email: string,
  Appointment: {
    Date: string,
    Result: string,
    FurtherAction: boolean,
    LOA: number,
    ClientStatus: string,
    Issue: string,
    Doctor: string
  },
  PriorAppointments: []
}

export default function AppointmentDisplay({ doctorID }: importProps) {
  const [appointments, setAppointments] = useState<AppointMentStruc | null>(null);
  const [expandedAppointment, setExpandedAppointment] = useState<number | null>(null);

  async function handleGetAppointments() {
    if (doctorID !== -1) {
      try {
        const response = await GetDoctorAppointMents(doctorID);
        if (response) {
          console.log(response);
          setAppointments(response);
        }
      } catch (error) {
        console.error("Failed to fetch appointments:", error);
        setAppointments(null);
      }
    }
  }

  useEffect(() => {
    handleGetAppointments();
    console.log(doctorID);
  }, [doctorID]);

  return (
    <main className="w-[80%] h-[70vh] bg-white p-5 mt-5 m-auto flex flex-col items-center justify-center shadow-2xl">
      {appointments && doctorID !== -1 ? (
        <section className="h-full w-full flex flex-col">
          <h2 className="h-[50px] w-full flex items-center text-xl p-5">
            Appointments for {appointments.Doctor}
          </h2>
          <ul className="h-full bg-white mt-5 p-5 border rounded-2xl overflow-auto divide-y">
            {appointments.Clients.map((client: Appointment, index: number) => (
              <li
                key={index}
                className="transition-all ease-in-out duration-500"
              >
                <div className="flex flex-row justify-between items-center w-full h-[150px] border p-2">
                  <button
                    className="p-2 border rounded"
                    onClick={() =>
                      setExpandedAppointment(expandedAppointment === index ? null : index)
                    }
                  >
                    {expandedAppointment === index ? "COLLAPSE" : "EXPAND"}
                  </button>
                  <p>APP DATE: {client.Appointment.Date.replace("T", " ")}</p>
                  <p>NAME: {client.ClientName}</p>
                </div>
                <div
                  className={`transition-all ease-in-out duration-500 ${
                    expandedAppointment === index ? "max-h-[300px] p-2" : "max-h-0"
                  } overflow-hidden w-full border`}
                >
                  <h2 className="w-full text-center text-xl border-b">
                    Data for {client.Title} {client.ClientName}
                  </h2>
                  <p>ADDRESS: {client.Address}</p>
                  <p>OCCUPATION: {client.Occupation}</p>
                  <p>OCCUPATION: {client.Occupation}</p>
                  
                  <div>
                    CONTACT INFORMATION:
                    <p>EMAIL: {client.Email}</p>
                    <p>PH: {client.Phone}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <section>
          Please Select Doctor
        </section>
      )}
    </main>
  )
}
