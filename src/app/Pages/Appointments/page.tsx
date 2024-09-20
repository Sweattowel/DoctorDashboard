'use client';

import { useEffect, useState } from 'react';

import DoctorSearch from './Components/Search';
import DoctorDisplay from './Components/DoctorDisplay';
import AppointmentDisplay from './Components/AppointmentDisplay';

interface selectedDoctor {
  DoctorName : string,
  DoctorID: number
}

export default function Appointment() {
  const [selectedDoctor, setSelectedDoctor] = useState<any>();
  const [doctorAppointments, setDoctorAppointments] = useState(-1);
  
  return (
    <main className='bg-gray-200 pb-5'>
      <div className='flex w-[95%] h-[40vh] justify-evenly items-center m-auto  p-5 mt-5'>
        <DoctorSearch handleSetDoctor={setSelectedDoctor} />
        <DoctorDisplay selectedDoctor={selectedDoctor} handleSeeAppointments={setDoctorAppointments}/>
      </div>
      <AppointmentDisplay doctorID={doctorAppointments}/>
    </main>
  );
}
