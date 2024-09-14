'use client'

import { useEffect, useState } from "react";
import GetAppointmentData from "../../../../Server/Server";

interface DoctorScheduleStruc {
  title: string,
  Client : ClientStruc[]
}
interface ClientStruc {
  Title: string,
  ClientName: string,
  Occupation: string,
  Address: string,
  Phone: string,
  Email: string,
  Appointment: AppointMentStruc,
  PriorAppointments: AppointMentStruc[]
}
interface AppointMentStruc {
  Date: string,
  Result: string,
  FurtherAction: boolean,
  LOA: number,
  ClientStatus: string,
  Issue: string,
  Doctor: string
}

export default function Appointment() {
  const [appointments, setAppointments] = useState<DoctorScheduleStruc[]>([
    {
        title: "...Loading",
        Client: []
    },
    {
        title: "...Loading",
        Client: []
    },
    {
        title: "...Loading",
        Client: []
    },
  ]);
  const [dateChanging, setDateChanging] = useState<string>("");
  const [newDate, setNewDate] = useState<string>("");
  const [glow, setHandleGlow] = useState<number>(-1)
  // HANDLE DRAG DROP
  function allowDrop(e: any) {
    e.preventDefault();
  }

  function drag(e: any, data: any, prevDoctorIndex: number, prevClientIndex: number) {
    let cursorData = JSON.stringify({ data, prevDoctorIndex, prevClientIndex });
    e.dataTransfer.setData("application/json", cursorData);
  }

  function handleDragStop(e: any, DoctorName: string) {
    let newData = JSON.parse(e.dataTransfer.getData("application/json"));
    let prevHolder = newData.prevDoctorIndex;
    let prevIndex = newData.prevClientIndex;

    setAppointments((prevHolders) =>
      prevHolders.map((holder) =>
        holder.title === DoctorName
          ? {
              ...holder,
              Client: [...holder.Client, newData.data],
            }
          : holder
      )
    );
    removeItem(prevHolder, prevIndex);
	// STILL BROKEN SortClients("NULL", DoctorName);
  }

  function removeItem(HolderIndex: number, DataIndex: number) {
    setAppointments(prevHolders =>
      prevHolders.map((holder, i) =>
        i === HolderIndex
          ? {
              ...holder,
              Client: holder.Client.filter((_: any, index: number) => index !== DataIndex)
            }
          : holder
      )
    );
  }

  // HANDLE COLLECT APPOINTMENTS FROM API TODO IMPLEMENT AUTH
  const collectAppointments = async () => {
    try {
      const response = await GetAppointmentData();
      if (response) {
        let memory: DoctorScheduleStruc[] = [];
        for (let i = 0; i < response.length; i++) {
          memory.push(response[i]);
        }
        setAppointments(memory);
      } else {
        console.error("Response is not valid JSON:", response);
      }
    } catch (error) {
      console.error("Failed to fetch appointments:", error);
    }
  }

  // HANDLE APPOINTMENT DATES
  function SortClients(direction :string , doctorName: string ) {
    if (appointments.length > 0) {
		let sortedAppointments

		if (direction == "ASC"){
			sortedAppointments = appointments.map(doctor => 
				doctor.title == doctorName ? {
					...doctor,
					Client: [...doctor.Client].sort((a, b) => new Date(a.Appointment.Date).getTime() - new Date(b.Appointment.Date).getTime())
				}	
				: 
				{
					...doctor
				}
			)
		} else {
			sortedAppointments = appointments.map(doctor => 
				doctor.title == doctorName ? {
					...doctor,
					Client: [...doctor.Client].sort((a, b) => new Date(b.Appointment.Date).getTime() - new Date(a.Appointment.Date).getTime())
				}	
				: 
				{
					...doctor
				}
			)
		}

      setAppointments(sortedAppointments);
    }
  }

  useEffect(() => {
    collectAppointments();
  }, []);

  const handleDateChange = (index: number, clientIndex: number, date: string) => {
    setAppointments(prevAppointments =>
      prevAppointments.map((holder, i) =>
        i === index
          ? {
              ...holder,
              Client: holder.Client.map((client, ci) =>
                ci === clientIndex
                  ? {
                      ...client,
                      Appointment: {
                        ...client.Appointment,
                        Date: date
                      }
                    }
                  : client
              )
            }
          : holder
      )
    );
    setDateChanging("");
    setNewDate("");
    // Cant sort here, probably some async issue just gonna make button
    //SortClients();
  };
  
  return (
    <main>
      <ul className="flex justify-evenly divide-x">
        {appointments.map((holder: DoctorScheduleStruc, index: number) => (
          <li className={`${holder.title == "...Loading" && "animate-pulse bg-gray-200"} ${glow == index && `animate-pulse bg-red-200`} w-[33.333%] text-center p-1`} key={index}
            onDragOver={(e) => allowDrop(e)}
            onDrop={(e) => {
				handleDragStop(e, holder.title); 
				setHandleGlow(index)
				setInterval(() => setHandleGlow(-1), 1000)
			}}
          >
			
				<h2 className="font-bold border">
				{holder.title}
				</h2>	
			<div className="flex justify-evenly items-center">
				<button className="border w-[50%] hover:opacity-60" onClick={() => SortClients("ASC", holder.title)}>ASC</button>	
				<button className="border w-[50%] hover:opacity-60" onClick={() => SortClients("DESC", holder.title)}>DESC</button>	
			</div>

            <ul>
              {holder.Client.map((Client: ClientStruc, ClientIndex: number) => (
                <li className={` h-[70px] flex flex-col items-center justify-center hover:cursor-pointer border bg-white`}
                  draggable="true"
                  id={`${index}${ClientIndex}`}
                  onDragStart={(e) => drag(e, Client, index, ClientIndex)}
                  key={ClientIndex}>
                  <h2>
                    {Client.ClientName}
                  </h2>
                  <div className="flex w-full justify-evenly">
                    {dateChanging !== `${index}${ClientIndex}` ? (
                      <>
                        <p className="w-[70%] flex items-center justify-center">
                          {Client.Appointment.Date}
                        </p>
                        <button className="w-[30%] border rounded p-1 font-bold text-sm rounded hover:opacity-60 bg-white"
                          onClick={() => {
                            setDateChanging(`${index}${ClientIndex}`);
                            setNewDate(Client.Appointment.Date);
                          }}>
                          Change?
                        </button>
                      </>
                    ) : (
                      <>
                        <input
                          type="datetime-local"
                          className="text-center w-[70%] border"
                          value={newDate}
                          onChange={(e) => setNewDate(e.target.value)}
                        />
                        <button
                          className="w-[30%] border rounded p-1 font-bold text-sm rounded hover:opacity-60 bg-white"
                          onClick={() => handleDateChange(index, ClientIndex, newDate)}
                        >
                          Save
                        </button>
                        <button className="w-[30%] border rounded p-1 font-bold text-sm rounded hover:opacity-60 bg-white"
                          onClick={() => setDateChanging(``)}>
                          Cancel?
                        </button>
                      </>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </main>
  );
}
