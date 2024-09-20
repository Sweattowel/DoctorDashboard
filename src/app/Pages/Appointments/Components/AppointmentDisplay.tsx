'use client'

import API from "@/app/Interceptor"
import { useEffect, useState } from "react"

interface importProps {
  DoctorID: number,
  DoctorName: string,
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

const titles : string[] = [
  "Date",
  "Name",
  "Purpose",
  "Doctor",
]

export default function AppointmentDisplay({ DoctorID, DoctorName }: importProps) {
  const [appointments, setAppointments] = useState<Appointment[] | null>(null);
  const [searchParam, setSearchParam] = useState<string>("")

  const [glow, setGlow] = useState<boolean>(false);

  async function handleGetAppointments() {
    if (DoctorID !== -1 && DoctorName != "") {
      try {
        const response = await API.get((`/api/getAppointments/${DoctorID}`));

        if (response.status == 200) {
          console.log(response);
          let newData = response.data.results.sort((a : any, b : any) => new Date(b.AppointmentDate).getTime() - new Date(a.AppointmentDate).getTime())
          console.log(newData.data.results)
          setAppointments(response.data.results);
        }
      } catch (error) {
        console.error("Failed to fetch appointments:", error);
        setAppointments(null);
      }
    }
  }

  useEffect(() => {
    handleGetAppointments();
    setGlow(true);
    setTimeout(() => setGlow(false), 500)
  }, [DoctorID]);

  return (
    <main className={`${glow && "bg-blue-400 text-white"} rounded-2xl transition-all ease-in-out duration-500  bg-white w-[95%] h-[70vh] bg-white p-5 mt-5 m-auto flex flex-col items-center justify-center shadow-2xl`}>
      {appointments && DoctorID !== -1 ? (
        <section className="h-full w-full flex flex-col">
          <h2 className="h-[50px] w-full flex items-center text-xl p-5 font-bold font-serif">
            Appointments for {DoctorName}
          </h2>
          <ul className="h-full bg-white mt-5 p-5 rounded-2xl divide-y overflow-auto">
            <ul className="flex justify-evenly items-center w-full h-[5vh] p-5 ">
              {titles.map((title: string, index: number) => (
                <li key={index} className="flex justify-center items-center w-full h-full">
                  {title}
                </li>
              ))}
              <input onChange={(e) => setSearchParam(e.target.value)} type="search" name="ClientFilter" className="border" placeholder="Search Client" />
            </ul>
            <ul className="h-full w-full flex flex-col bg-blue-600">
              {appointments.map((appointment, index) => (
                <li className="bg-blue-800 h-[50px] w-full"
                  key={index}
                >
                  {appointment.ClientName}
                </li>
              ))}
            </ul>

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
/* <AppointmentList appointmentParam={searchParam} data={appointments}/>
interface AppointmentListProps {
  appointmentParam: AppointMentStruc
}

const AppointmentList = ({ appointmentParam }: AppointmentListProps) => {
  const [expandedAppointment, setExpandedAppointment] = useState<number | null>(null);
  const [displayData, setDisplayData] = useState<Appointment[]>([]);

  useEffect(() => {
    setDisplayData(appointmentParam.Clients)
  },[appointmentParam])

  useEffect(() => {
    if (!displayData) return

    const filteredAppointments = appointmentParam.Clients.filter((client) =>
      client.ClientName.toLowerCase().includes(appointmentParam.Clients..toLowerCase())
    );

    setDisplayData(filteredAppointments)
  },[appointmentParam])

  return (
    <ul className="divide-y overflow-auto overflow-hidden">
      {displayData && displayData.map((client: Appointment, index: number) => (
        <li
          key={index}
          className="transition-all ease-in-out duration-500"
        >
          <div className="flex flex-col md:flex-row justify-between items-center w-full h-[150px] p-5">
            <p className="flex justify-center items-center w-full h-full text-center">{client.Appointment.Date.replace("T", " ")}</p>
            <p className="flex justify-center items-center w-full h-full text-center">{client.ClientName}</p>
            <p className="flex justify-center items-center w-full h-full text-center">{client.Appointment.Issue}</p>
            <p className="flex justify-center items-center w-full h-full text-center">{client.Appointment.Doctor}</p>
            <button
              className="flex justify-center items-center w-full h-full text-center border hover:opacity-60 hover:bg-blue-400 hover:text-white"
              onClick={() =>
                setExpandedAppointment(expandedAppointment === index ? null : index)
              }
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
  )
}

interface expansionProps {
  data: Appointment
}

const Expansion = ({data} : expansionProps) => {
  const [AppointmentData, setAppointmentData] = useState<Appointment>()

  useEffect(() => {
    setAppointmentData(data)
  },[data])
  return (
    <section className="p-5 border rounded-2xl overflow-hidden transition-all duration-500 ease-in-out flex flex-col justify-evenly">
      <h2 className="text-lg font-bold font-serif">{data.Title} {data.ClientName}</h2>
      <input placeholder={`${data.Appointment.Issue} With ${data.Appointment.Doctor}`} />
      <input placeholder={`LEVEL: ${data.Appointment.LOA} Access`} />
      <input placeholder={`${data.Appointment.ClientStatus}`} />
      
      <p className={`${data.Appointment.Result === "Pending" ? "animate-pulse" : "line-through"} bg-blue-400 border rounded p-2 w-[100px] text-center m-auto`}>{data.Appointment.Result}</p>
    </section>
  )
}
interface dropDownProps{
  options:string[]
}
const dropDown = ({options} : dropDownProps) => {

  return (
    <ul>
      {options.map((option: string, index: number) => (
        <button>
          {option}
        </button>
      ))}
    </ul>
  )
}
*/
