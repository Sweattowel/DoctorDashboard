'use client'

import { useState, useEffect } from "react";
import { Appointment } from "../AppointmentDisplay";
import Expansion from "./ExpandAndAdjust";

// Appointment List Component
interface AppointmentListProps {
    appointmentParam: string;
    data: Appointment[];
    changeQuickSetTime: (newQuickSetTime: string) => void;
  }
  
export default function AppointmentList ({ appointmentParam, data, changeQuickSetTime }: AppointmentListProps) {
    const [expandedData, setExpandedData] = useState<Appointment | null>(null);
    const [expandedAppointment, setExpandedAppointment] = useState<number | null>(null);

    const [displayData, setDisplayData] = useState<Appointment[]>(data);

    const [currentTime, setCurrentTime ] = useState("");

    const currentDate = new Date();
    const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());
    const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth() + 1);
    const [currentDay, setCurrentDay] = useState(currentDate.getDate());

    const [QuickSetTime ,setQuickSetTime] = useState<string>("");

    useEffect(() => {
        changeQuickSetTime(QuickSetTime)
    },[QuickSetTime]);

    useEffect(() => {
        setCurrentTime(currentDate.toISOString().slice(0, 16));
    }, []);

    useEffect(() => {
        const filteredAppointments = data.filter((client) =>
        client.ClientName.toLowerCase().includes(appointmentParam.toLowerCase())
        );
        setDisplayData(filteredAppointments);
        console.log(filteredAppointments)
    }, [appointmentParam, data]);

    let calendar : Appointment[][] = new Array(7).fill(null).map(() => new Array(25).fill(null));

    for (let i = 0; i < data.length; i++) {
        let currentAppointment = data[i];

        const appointmentDate = new Date(currentAppointment.AppointmentDate);
        const appointmentYear = appointmentDate.getFullYear();
        const appointmentMonth = appointmentDate.getMonth() + 1;
        const appointmentDay = appointmentDate.getDate();
        const appointmentHour = appointmentDate.getHours();

        // Ensure the appointment falls within the current week view
        if (appointmentYear !== currentYear) continue;
        if (appointmentMonth !== currentMonth) continue;
        if (appointmentDay < currentDay || appointmentDay >= currentDay + 7) continue;

        const dayIndex = appointmentDay - currentDay;
        calendar[dayIndex][appointmentHour] = currentAppointment;
    }

    return (
        <div className="p-5 w-full h-full flex flex-col justify-evenly items-center">
        <div className="font-bold text-2xl p-2 flex justify-evenly w-full">
        <button
            onClick={() => {
            const newTime = new Date(currentYear, currentMonth - 1, currentDay - 7);
            setCurrentTime(newTime.toISOString().slice(0, 16));
            setCurrentYear(newTime.getFullYear());
            setCurrentMonth(newTime.getMonth() + 1);
            setCurrentDay(newTime.getDate());
            }}
        >
            -
        </button>
        <input
            type="datetime-local"
            value={currentTime} // Ensure input uses local time format
            onChange={(e) => {
            const selectedDate = new Date(e.target.value);
            setCurrentYear(selectedDate.getFullYear());
            setCurrentMonth(selectedDate.getMonth() + 1);
            setCurrentDay(selectedDate.getDate());
            setCurrentTime(e.target.value); // Retain the local datetime in the input
            }}
        />
        <button
            onClick={() => {
            const newTime = new Date(currentYear, currentMonth - 1, currentDay + 7);
            setCurrentTime(newTime.toISOString().slice(0, 16));
            setCurrentYear(newTime.getFullYear());
            setCurrentMonth(newTime.getMonth() + 1);
            setCurrentDay(newTime.getDate());
            }}
        >
            +
        </button>
        </div>
        {appointmentParam == "" ? (
            <ul className="flex flex-row justify-evenly items-center min-w-[100%]">
            {calendar.map((Day, DayIndex) => new Date(currentYear, currentMonth - 1, currentDay + DayIndex, 0, 0,0).getMonth() == currentMonth - 1 && (
                <div className="flex  flex-col h-full w-full" key={DayIndex}>
                <p className="w-full text-center">
                    {new Date(currentYear, currentMonth - 1, currentDay + DayIndex + 1).toISOString().slice(0, 10)} 
                </p>
                <ul className="flex flex-col w-full h-full">
                    {Day.map((Day : Appointment, HourIndex: number) => (
                        <div className="border text-center flex flex-col items-center justify-center rounded" key={HourIndex}>
                        {Day ? (
                            <button className={`${Day.Result == 'Completed' && "bg-gray-400"} hover:opacity-60 hover:bg-blue-800 bg-blue-600 text-white h-16  w-full p-2 rounded`}
                            onClick={() => setExpandedData(Day)}
                            >
                            {Day.ClientName}
                            </button>
                        ) : (
                            <button className="hover:opacity-60 h-16 min-w-full p-2 rounded flex items-center justify-center"
                            onClick={() => setQuickSetTime(new Date(currentYear, currentMonth - 1, currentDay + DayIndex, HourIndex + 10).toISOString().slice(0, 16))} 
                            >
                            {new Date(currentYear, currentMonth - 1, currentDay + DayIndex, HourIndex + 10).toISOString().slice(0,16)}
                            </button>
                        )} 

                        </div>
                    ))}                  
                </ul>
                </div>
            ))}         
            </ul>        
        ) : (
            <ul className="divide-y overflow-auto w-[80%]">
            {displayData.map((client: Appointment, index: number) => (
                <li key={index} className="transition-all ease-in-out duration-500">
                <div className="flex flex-col items-center md:flex-row w-full h-full p-5">
                    <p className="w-full md:w-[25%]">{client.AppointmentDate.replace("T", " ")}</p>
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
                    {expandedAppointment === index && <Expansion QuickSetTime={QuickSetTime} data={client} />}
                </div>
                </li>
            ))}
            </ul>
        )}
            <div className="w-[80%]">
            {expandedData !== null ? <Expansion data={expandedData} QuickSetTime={QuickSetTime}/> : <p className="font-bold text-center border-t border-b mt-10">Please Select an appointment</p>}
            </div>
            
        </div>
    );
};