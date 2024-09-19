'use client'

import { useEffect, useState } from "react";
import axios, { Axios } from "axios";
interface DoctorSearchProps {
  handleSetDoctor: (doctorName: string) => void;
}

export default function DoctorSearch({ handleSetDoctor } : DoctorSearchProps) {
    const [recentDoctor, setRecentDoctor] = useState<string>("")
    const [searchParam, setSearchParam] = useState<string>('');
    const [doctors, setDoctors] = useState<string[]>([]);
    const [displayData, setDisplayData] = useState<string[]>([]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
      const query = e.target.value.toLowerCase();
      setSearchParam(query);
  
      const filteredDoctors = displayData.filter((doctor) =>
        doctor.toLowerCase().includes(query)
      );
      setDoctors(filteredDoctors);
    };
  
    const handleGetDoctors = async () => {
      try {
          console.log("try get DoctorNames")
          // Use axios for the request
          const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_ADDRESS}/api/getDoctorNames`);
  
          // Check if response data exists and handle it
          if (response.data) {
              console.log(response.data);  

          }
      } catch (error) {
          console.error('Error fetching doctor names:', error);
      }
  };
  
    useEffect(() => {
      handleGetDoctors();
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
          {doctors.map((doctor, index) => (
            <button
              className={`${recentDoctor == doctor ? "bg-blue-400 text-white" : ""} hover:opacity-60`}
              onClick={() => {handleSetDoctor(doctor); setRecentDoctor(doctor)}}
              key={index}
            >
              {doctor}
            </button>
          ))}
        </ul>
      </section>
    );
  };