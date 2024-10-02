'use client';

import { useEffect, useState } from 'react';
import DoctorSearch from './Components/Search';
import DoctorDisplay from './Components/DoctorDisplay';
import AppointmentDisplay from './Components/AppointmentDisplay';
import NavBar from '@/app/GlobalComponents/Nav/Navigation';
import { userContext } from '@/app/Context/ContextProvider';
import UserBook from './Components/UserBook';
import Tail from '@/app/GlobalComponents/Tail/Tail';

export default function Appointment() {
  const [selectedDoctor, setSelectedDoctor] = useState<any>({
    DoctorID: -1,
    DoctorName: ""
  });
  const { userData, setUserData, isUser, isDoctor, isAdmin } = userContext();
  const [ message, setMessage ] = useState("Please Log in");

  const [getAppointments, setDoctorAppointments] = useState<boolean>(false);

  useEffect(() => {
    setDoctorAppointments(true);
  },[getAppointments])

  // Create a function to match the expected type
  const handleSetDoctor = (doctorID: number, doctorName: string) => {
    setSelectedDoctor({ DoctorID: doctorID, DoctorName: doctorName});
  };

  useEffect(() => {
    // Determine Error messaging based on userStatus and Doctor selection
    switch (true) {
      case isUser && selectedDoctor.DoctorID == -1:
        setMessage("Please Select Doctor");
        break;
      case !isUser && !isAdmin && !isDoctor:
        setMessage("Please Log in");
        break;
      case isAdmin:
        setMessage("ADMIN");
        break;
      default:
        setMessage("Error: please refresh");
        break;
    }
  },[ selectedDoctor, isUser, isDoctor, isAdmin ])

  return (
    <main className='bg-gray-200 pb-5 min-h-[100vh]'>
      <NavBar />
      <div className='flex flex-col md:flex-row w-[95%] md:h-[40vh] h-[70vh] justify-evenly items-center m-auto p-5'>
        <DoctorSearch handleSetDoctor={handleSetDoctor} />
        <DoctorDisplay selectedDoctor={selectedDoctor} handleSeeAppointments={setDoctorAppointments} />
      </div>
      {(isUser && selectedDoctor.DoctorID != -1 && !isAdmin) ? (
        <UserBook selectedDoctor={selectedDoctor}/>
      ) : (
        <p className='w-[80%] bg-white mt-10 m-auto p-5 rounded-2xl shadow-2xl text-center animate-pulse'>
          {message}
        </p>
      )}
      {isDoctor || isAdmin && <AppointmentDisplay selectedDoctor={selectedDoctor} getAppointments={getAppointments}/>}
      <Tail />
    </main>
  );
}
