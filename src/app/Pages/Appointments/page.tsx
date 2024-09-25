'use client';

import { useEffect, useState } from 'react';
import DoctorSearch from './Components/Search';
import DoctorDisplay from './Components/DoctorDisplay';
import AppointmentDisplay from './Components/AppointmentDisplay';
import NavBar from '@/app/GlobalComponents/Nav/page';

interface SelectedDoctor {
  DoctorID: number;
  DoctorName: string;
}

export default function Appointment() {
  const [selectedDoctor, setSelectedDoctor] = useState<any>({
    DoctorID: -1,
    DoctorName: ""
  });

  const [getAppointments, setDoctorAppointments] = useState<boolean>(false);
  useEffect(() => {
    console.log(getAppointments)
  },[getAppointments])
  // Create a function to match the expected type
  const handleSetDoctor = (doctorID: number, doctorName: string) => {
    setSelectedDoctor({ DoctorID: doctorID, DoctorName: doctorName});
  };

  return (
    <main className='bg-gray-200 pb-5 min-h-[100vh]'>
      <NavBar />
      <div className='flex w-[95%] h-[40vh] justify-evenly items-center m-auto p-5'>
        <DoctorSearch handleSetDoctor={handleSetDoctor} />
        <DoctorDisplay selectedDoctor={selectedDoctor} handleSeeAppointments={setDoctorAppointments} />
      </div>
      <AppointmentDisplay selectedDoctor={selectedDoctor} getAppointments={getAppointments}/>
    </main>
  );
}
