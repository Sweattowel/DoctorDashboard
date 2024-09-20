'use client';

import { useEffect, useState } from 'react';
import DoctorSearch from './Components/Search';
import DoctorDisplay from './Components/DoctorDisplay';
import AppointmentDisplay from './Components/AppointmentDisplay';

interface SelectedDoctor {
  DoctorID: number;
  DoctorName: string;
}

export default function Appointment() {
  const [selectedDoctor, setSelectedDoctor] = useState<SelectedDoctor>({
    DoctorID: -1,
    DoctorName: ""
  });

  const [getAppointments, setDoctorAppointments] = useState<SelectedDoctor>({
    DoctorID: -1,
    DoctorName: ""
  });

  // Create a function to match the expected type
  const handleSetDoctor = (doctorID: number, doctorName: string) => {
    setSelectedDoctor({ DoctorID: doctorID, DoctorName: doctorName});
  };

  return (
    <main className='bg-gray-200 pb-5'>
      <div className='flex w-[95%] h-[40vh] justify-evenly items-center m-auto p-5 mt-5'>
        <DoctorSearch handleSetDoctor={handleSetDoctor} />
        <DoctorDisplay selectedDoctor={selectedDoctor} handleSeeAppointments={setDoctorAppointments} />
      </div>
      <AppointmentDisplay wantAppointMents={getAppointments} />
    </main>
  );
}
