import { userContext } from "@/app/Context/ContextProvider";
import API from "@/app/Interceptor";
import { useState, useEffect } from "react";


interface Doctor {
    id: number;
    UserName: string;
    Speciality: string;
    PhoneNumber: string;
    EmailAddress: string;
    address: string;
    yearsOfExperience: number;
    hospitalAffiliation: string;
  }
  
  interface DoctorImportProps {
    DoctorID: number;
    DoctorName: string;
  }
  
  interface importProps {
    handleSeeAppointments: (getAppointments : boolean) => void;
    selectedDoctor: DoctorImportProps;
  }


export default function DoctorDisplay({ selectedDoctor, handleSeeAppointments }: importProps) {
  const {isDoctor} = userContext();
  const [glow, setGlow] = useState<boolean>(false);
    const [doctor, setDoctor] = useState<Doctor>({
      id: -1,
      UserName: "",
      Speciality: "",
      PhoneNumber: "",
      EmailAddress: "",
      address: "",
      yearsOfExperience: -1,
      hospitalAffiliation: ""
    });
  
    async function collectDoctorData(selectedDoctor: DoctorImportProps) {
      if (selectedDoctor.DoctorID !== -1) {  // Check for valid ID
        const response = await API.get(`/api/getDoctorData/${selectedDoctor.DoctorID}`);
        
        if (response.status === 200) {
          //console.log(response);
          setDoctor(response.data.results[0]); // Assuming results is an array
        }
      }
    }
  
    useEffect(() => {
      if (selectedDoctor.DoctorID !== -1) {
        collectDoctorData(selectedDoctor);
        setGlow(true);
        setTimeout(() => setGlow(false), 500);
      } 
      handleSeeAppointments(false);
    }, [selectedDoctor]);
  
    return (
      <section className={`${glow ? "bg-blue-600 text-white" : "bg-white"} shadow-2xl h-full w-full md:w-[45%] flex justify-center items-center rounded-2xl duration-500 transition-all ease-in-out`}>
        {doctor.id !== -1 ? (
          <div className="border rounded-2xl h-full w-full flex flex-col items-center justify-evenly text-center text-[0.6rem] md:text-[1rem]">
            <h2 className="text-[1.5rem] font-bold font-serif">
              {doctor.UserName}
            </h2>
            <p>
              Speciality: {doctor.Speciality} {doctor.yearsOfExperience} YRS
            </p>
            <p>
              Relation: {doctor.hospitalAffiliation}
            </p>
            <div>
              CONTACT DETAILS:
              <p>Email: {doctor.EmailAddress}</p>
              <p>PH: {doctor.PhoneNumber}</p>
            </div>
            {isDoctor && <button className="border p-2 rounded-2xl bg-blue-600 text-white hover:opacity-60"
              onClick={() => {handleSeeAppointments(true); console.log("clicked")}}
            >
              See Appointments
            </button>}
          </div>
        ) : (
          <p>No Data</p>
        )}
      </section>
    );
  }
  