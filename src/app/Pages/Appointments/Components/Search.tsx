'use client'

import { useEffect, useState } from "react";
import { GetDoctorNames } from "../../../../../Server/Server";

interface DoctorSearchProps {
  handleSetDoctor: (doctorName: string) => void;
}

export default function DoctorSearch({ handleSetDoctor } : DoctorSearchProps) {
  
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
      const response = await GetDoctorNames();

      if (response) {
        console.log(response)
        const memory: string[] = []; 
        for (let i = 0; i < response.length; i++) {
            memory.push(response[i]);
          }
        setDisplayData(response);
        setDoctors(response);
      }
    };
  
    useEffect(() => {
      handleGetDoctors();
    }, []);
  
    return (
      <section className='flex flex-col justify-evenly w-[50%] h-full'>
        <input
          className='border text-center rounded w-full'
          type="text"
          onChange={handleSearch}
          value={searchParam}
          placeholder='Search Doctors'
        />
        <ul className='flex flex-col border max-h-full text-center divide-y overflow-auto'>
          {doctors.map((doctor, index) => (
            <button
              className='hover:opacity-60'
              onClick={() => handleSetDoctor(doctor)}
              key={index}
            >
              {doctor}
            </button>
          ))}
        </ul>
      </section>
    );
  };