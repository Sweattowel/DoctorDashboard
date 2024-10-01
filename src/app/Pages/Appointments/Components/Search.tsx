'use client';

import { useEffect, useRef, useState } from "react";
import API from "@/app/Interceptor";

interface DoctorSearchProps {
  handleSetDoctor: (DoctorID: number, DoctorName: string) => void;
}

interface DoctorDisplayStruc {
  DoctorID: number;  
  DoctorName: string;
 
}

export default function DoctorSearch({ handleSetDoctor }: DoctorSearchProps) {
  // CONSTANTS
  const [recentDoctor, setRecentDoctor] = useState<string>("");
  const [searchParam, setSearchParam] = useState<string>('');
  const [doctors, setDoctors] = useState<DoctorDisplayStruc[]>([]);
  const [displayData, setDisplayData] = useState<DoctorDisplayStruc[]>([]);

  // FILTERING OF DOCTORS TO SEARCH PARAMETERS
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    if (query === "") {
      setDisplayData(doctors);
      setSearchParam("");
      return;
    }
    setSearchParam(query);

    const filteredDoctors = displayData.filter((doctor) =>
      doctor.DoctorName.toLowerCase().includes(query)
    );
    setDisplayData(filteredDoctors);
  };

  // INITIAL COLLECTION OF DOCTOR NAMES
  const handleGetDoctors = async () => {
    try {
      console.log("Trying to get doctor names");

      const response = await API.get('/api/getDoctorNames', { timeout: 2000 });

      // Check if response data exists and handle it
      if (response.status === 200) {
        const newData: DoctorDisplayStruc[] = response.data.results.map(
          (doctor: { name: string; id: number }) => ({
            DoctorName: doctor.name,
            DoctorID: doctor.id,
          })
        );
        setDoctors(newData);
        setDisplayData(newData);
      }
    } catch (error) {
      console.error('Error fetching doctor names:', error);
    }
  };

  // DEFINE AND USE REFERENCE TO CALL HANDLEGETDOCTORS ON COMPONENT MOUNT
  const hasFetched = useRef(false);

  useEffect(() => {
    if (!hasFetched.current) {
      handleGetDoctors();
      hasFetched.current = true;
    }
  }, []);

  return (
    <section className='flex flex-col justify-evenly w-full md:mb-0 mb-2 md:w-[45%] h-full border rounded-2xl shadow-2xl p-5 bg-white duration-500 transition-all ease-in-out'>
      <input
        className='border border-blue-600 text-center rounded w-full rounded-2xl '
        type="text"
        onChange={handleSearch}
        value={searchParam}
        placeholder='Search Doctors'
      />
      <ul className='flex flex-col h-[80%] text-center divide-y overflow-auto'>
        {displayData.map((doctor: DoctorDisplayStruc, index: number) => (
          <button
            className={`${recentDoctor === doctor.DoctorName ? "bg-blue-600 text-white" : ""} hover:opacity-60 rounded-2xl border shadow-md shadow mt-1 mb-1`}
            onClick={() => { handleSetDoctor( doctor.DoctorID, doctor.DoctorName ); setRecentDoctor(doctor.DoctorName); }}
            key={index}
          >
            {doctor.DoctorName}
          </button>
        ))}
      </ul>
    </section>
  );
}
