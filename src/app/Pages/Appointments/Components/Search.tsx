'use client'

import { useEffect, useRef, useState } from "react";
import axios, { Axios } from "axios";
import API from "../../../Interceptor"

interface DoctorSearchProps {
  handleSetDoctor: (doctorName: string) => void;
}
interface DoctorNameDisplayStruc {
  name: string
}
export default function DoctorSearch({ handleSetDoctor } : DoctorSearchProps) {
    const [recentDoctor, setRecentDoctor] = useState<string>("")
    const [searchParam, setSearchParam] = useState<string>('');
    const [doctors, setDoctors] = useState<DoctorNameDisplayStruc[]>([]);
    const [displayData, setDisplayData] = useState<DoctorNameDisplayStruc[]>([]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
      const query = e.target.value.toLowerCase();
      setSearchParam(query);
  
      const filteredDoctors = displayData.filter((doctor) =>
        doctor.name.toLowerCase().includes(query)
      );
      setDoctors(filteredDoctors);
    };
  
    const handleGetDoctors = async () => {
      try {
          console.log("try get DoctorNames")
          // Use axios for the request
          // Try using axios instead of API to attempt a regular call that gets intercepted? worth a test 
          const response = await API.get('/api/getDoctorNames');
  
          // Check if response data exists and handle it
          if (response.status === 200) {
              //setDoctors(response.data);
              console.log(response.data)
          }
      } catch (error) {
          console.error('Error fetching doctor names:', error);
      }
  };
  
  const hasFetched = useRef(false);

  useEffect(() => {
    if (!hasFetched.current) {
      handleGetDoctors();
      hasFetched.current = true; // Set to true after the first call
    }
  }, []);
  
    return (
      <section className='flex flex-col justify-evenly w-[45%] h-full border rounded-2xl shadow-2xl p-5 bg-white'>
        <input
          className='border text-center rounded w-full'
          type="text"
          onChange={handleSearch}
          value={searchParam}
          placeholder='Search Doctors'
        />
        <ul className='flex flex-col h-[80%] text-center divide-y overflow-auto border-l'>
          {doctors.map((doctor : DoctorNameDisplayStruc, index) => (
            <button
              className={`${recentDoctor == doctor.name ? "bg-blue-400 text-white" : ""} hover:opacity-60`}
              onClick={() => {handleSetDoctor(doctor.name); setRecentDoctor(doctor.name)}}
              key={index}
            >
              {doctor.name}
            </button>
          ))}
        </ul>
      </section>
    );
  };