'use client'

import { userContext } from "@/app/Context/ContextProvider";
import API from "@/app/Interceptor"
import { AwaitedReactNode, JSXElementConstructor, ReactElement, ReactNode, ReactPortal, useEffect, useState } from "react"

// Types for Appointments
interface Appointment {
  Address: string,
  AppointmentDate: string,
  ClientName: string,
  ClientStatus: string,
  DoctorID:  number,
  Email: string,
  FurtherAction: string,
  Issue: string,
  LOA:  number,
  Occupation: string,
  Phone: string,
  Result: string,
  Title: string,
}

const titles: string[] = ["Date", "Name", "Purpose" ];

interface DoctorImportProps
{
    DoctorID: number;
    DoctorName: string;
}

interface importProps
{
    selectedDoctor: DoctorImportProps;
    getAppointments: boolean;
}
export default function AppointmentDisplay({ selectedDoctor, getAppointments }: importProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [searchParam, setSearchParam] = useState<string>("")
  const [glow, setGlow] = useState<boolean>(false);

  // Fetch Appointments from API
  async function handleGetAppointments() {
    if (selectedDoctor.DoctorID !== -1) {
      try {
        const response = await API.get(`/api/getAppointments/${selectedDoctor.DoctorID}`);
        if (response.status === 200) {
          console.log(response.data.results)
          setAppointments(response.data.results);
        }
      } catch (error) {
        console.error("Failed to fetch appointments:", error);
        setAppointments([]);
      }
    }
  }

  useEffect(() => {
    if (getAppointments) {
      handleGetAppointments();
      setGlow(true);
      setTimeout(() => setGlow(false), 500);
    } 
    if (!getAppointments){
      setAppointments([])
    }
  }, [getAppointments]);

  return (
    <main className={`${glow ? "bg-blue-400 text-white" : "bg-white"} transition-all ease-in-out duration-500 rounded-2xl w-[85%] h-full p-5 mt-5 m-auto flex flex-col items-center justify-center shadow-2xl`}>
      {selectedDoctor.DoctorID !== -1 ? (
        <section className="h-full w-full flex flex-col">
          <h2 className="h-[50px] w-full flex items-center text-xl p-5 font-bold font-serif">
            Appointments for {selectedDoctor.DoctorName}
          </h2>
          <ul className="h-full bg-white mt-5 p-5 rounded-2xl divide-y overflow-auto">
            <ul className="hidden md:flex justify-evenly items-center w-full h-[5vh] p-5">
              {titles.map((title: string, index: number) => (
                <li key={index} className="flex justify-center items-center w-full md:w-[25%] h-full">
                  {title}
                </li>
              ))}
              <input
                onChange={(e) => setSearchParam(e.target.value)}
                type="search"
                className="border p-1"
                placeholder="Search Client"
              />
            </ul>
            <AppointmentList appointmentParam={searchParam} data={appointments} />
            <CreateAppointMent DoctorName={selectedDoctor.DoctorName}/>
          </ul>
        </section>
      ) : (
        <section>Please Select Doctor</section>
      )}
    </main>
  );
}

// Appointment List Component
interface AppointmentListProps {
  appointmentParam: string;
  data: Appointment[];
}

const AppointmentList = ({ appointmentParam, data }: AppointmentListProps) => {
  const [expandedData, setExpandedData] = useState<Appointment | null>(null);
  const [expandedAppointment, setExpandedAppointment] = useState<number | null>(null);

  const [displayData, setDisplayData] = useState<Appointment[]>(data);

  const [currentTime, setCurrentTime ] = useState(new Date().toISOString().split("T")[0]);
  const [ currentYear, setCurrentYear ] = useState<number>(parseInt(currentTime.split("T")[0].split("-")[0]));
  const [ currentMonth, setCurrentMonth ] = useState<number>(parseInt(currentTime.split("T")[0].split("-")[1]));
  const [ currentDay, setCurrentDay ] = useState<number>(parseInt(currentTime.split("T")[0].split("-")[2]));

  useEffect(() => {
    const filteredAppointments = data.filter((client) =>
      client.ClientName.toLowerCase().includes(appointmentParam.toLowerCase())
    );
    setDisplayData(filteredAppointments);
    console.log(filteredAppointments)
  }, [appointmentParam, data]);

  let calendar : Appointment[][] = new Array(24).fill(null).map(() => new Array(7).fill(null));

  for (let i = 0; i < data.length; i++){
    let currentAppointment = data[i];

    const appointmentYear = parseInt(currentAppointment.AppointmentDate.split('T')[0].split("-")[0]);
    if (appointmentYear !== currentYear){
      //console.log(appointmentYear, currentYear, "FAILED TO MATCH YEAR")
      continue;
    }
    const appointmentMonth = parseInt(currentAppointment.AppointmentDate.split('T')[0].split("-")[1]);
    if (appointmentMonth !== currentMonth){
      console.log(appointmentMonth, currentMonth)
      continue;
    }
    const appointmentDay = parseInt(currentAppointment.AppointmentDate.split('T')[0].split("-")[2]);  
    if (appointmentDay < currentDay || appointmentDay >= currentDay + 7){
      //console.log(appointmentDay, currentDay, "FAILED TO MATCH DAYS")
      continue;
    }
    const appointmentHour = parseInt(currentAppointment.AppointmentDate.split('T')[1].split(":")[0]); 
    //console.log(appointmentYear, appointmentHour, appointmentDay)
    const dayIndex = appointmentDay - currentDay;
    calendar[appointmentHour][dayIndex] = currentAppointment;
    
  }
  //console.log(calendar);

  return (
    <div className="p-5 w-full h-full flex flex-col justify-evenly items-center">
      <div className="font-bold text-2xl p-2 flex justify-evenly w-full">
        <button className="bg-blue-600 text-white flex justify-center items-center w-[50px] rounded shadow hover:opacity-60"
          onClick={() => {
            const newTime = new Date(currentYear, currentMonth - 1, currentDay - 7)
            setCurrentTime(newTime.toISOString().split("T")[0])
            setCurrentYear(newTime.getFullYear());
            setCurrentMonth(newTime.getMonth() + 1);
            setCurrentDay(newTime.getDate());
          }}
        >
          -
        </button>
        <input
            type="date"
            value={currentTime}
            onChange={(e) => {
              setCurrentTime(e.target.value.split("T")[0]);
              const selectedDate = new Date(e.target.value);
              setCurrentYear(selectedDate.getFullYear());
              setCurrentMonth(selectedDate.getMonth() + 1);
              setCurrentDay(selectedDate.getDate());
            }}
          />
        <button className="bg-blue-600 text-white flex justify-center items-center w-[50px] rounded shadow hover:opacity-60"
          onClick={() => {
            const newTime = new Date(currentYear, currentMonth - 1, currentDay + 7)
            setCurrentTime(newTime.toISOString().split("T")[0])
            setCurrentYear(newTime.getFullYear());
            setCurrentMonth(newTime.getMonth() + 1);
            setCurrentDay(newTime.getDate());
          }}
        >
          +
        </button>
      </div>
      {appointmentParam == "" ? (
        <ul className="flex flex-col justify-evenly items-center min-w-[100%]">
          {calendar.map((Hour, HourIndex) => (
            <div className="flex min-w-full h-full" key={HourIndex}>
              <p className="w-[60px] text-cetner">
                {HourIndex < 12 ? `${HourIndex}:AM` : `${HourIndex}:PM`}: 
              </p>
              
              {Hour.map((Day : Appointment, dayIndex) => (
                <div className="border text-center w-[14%] h-[8%] flex items-center justify-center rounded" key={dayIndex}>
                  {Day ? (
                    <button className={`${Day.Result == 'Completed' && "bg-gray-400"} hover:opacity-60 hover:bg-blue-800 bg-blue-600 text-white h-16  w-full p-2 rounded`}
                      onClick={() => setExpandedData(Day)}
                    >
                      {Day.ClientName}
                    </button>
                  ) : (
                    <p className="h-16 min-w-full p-2 rounded flex items-center justify-center">
                      FREE
                    </p>
                  )}
                </div>
              ))}
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
                {expandedAppointment === index && <Expansion data={client} />}
              </div>
            </li>
          ))}
        </ul>
      )}
        <div className="w-[80%]">
          {expandedData !== null ? <Expansion data={expandedData}/> : <>Please</>}
        </div>
        
    </div>
  );
};

// Expansion Component for appointment details
interface ExpansionProps {
  data: Appointment;
}

const Expansion = ({ data }: ExpansionProps) => {
  return (
    <section className="p-5 border rounded-2xl overflow-hidden transition-all duration-500 ease-in-out flex flex-col justify-evenly w-full mt-10">
      <h2 className="text-lg font-bold">{data.Title} - {data.ClientName}</h2>
      <input placeholder={`${data.Issue}`} />
      <input placeholder={`LEVEL: ${data.LOA} Access`} />
      <input placeholder={data.ClientStatus} />
      <p className={`${data.Result === "Pending" ? "animate-pulse" : "line-through"} bg-blue-400 border rounded p-2 w-[100px] text-center`}>
        {data.Result}
      </p>
    </section>
  );
};


const CreateAppointMent = ({ DoctorName } : { DoctorName : string }) => {
  const { userData, setUserData, isUser, isDoctor, isAdmin } = userContext();
  const [ loading, setLoading ] = useState<boolean>(false);
  const [ error, setError ] = useState<string>("");

  const [formData, setFormData] = useState<Appointment>({
    Address: "",
    AppointmentDate: "",
    ClientName: "",
    ClientStatus: "",
    DoctorID:  userData.UserID,
    Email: "",
    FurtherAction: "N/A",
    Issue: "",
    LOA:  -1,
    Occupation: "",
    Phone: "",
    Result: "N/A",
    Title: "",
  })
  
  async function HandleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");

      const response = await API.post("/api/Appointments/Create", formData);

      switch (response.status){
        case 200:
          setError("Success");
          setFormData({
            Address: "",
            AppointmentDate: "",
            ClientName: "",
            ClientStatus: "",
            DoctorID:  userData.UserID,
            Email: "",
            FurtherAction: "N/A",
            Issue: "",
            LOA:  -1,
            Occupation: "",
            Phone: "",
            Result: "N/A",
            Title: "",
          });
        break;
          case 401:
            setError("Unauthorized");
          break;
        default:
          setError("Unknown Error, Please Refresh");
        break;
      }
    } catch (error) {
      console.error(error);
      setError("Failed to create appointment, please refresh");
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="pt-10">
      <h2 className="border-b font-bold font-serif">
        Create new Appointment for {DoctorName}
      </h2>
      <form onSubmit={(e) => HandleSubmit(e)} className="flex flex-col p-2">
        <label className="font-bold">Client Name:</label>
        <input className="border p-1" value={formData.ClientName}
          onChange={(e) => setFormData((prevData) => ({...prevData, ClientName: e.target.value}))} type="text" required
        />
        <h2>Client Title</h2>
        <div className="flex flex-row justify-between items-center w-[40%]">
            <label className="flex justify-evenly w-full">
                <input
                    type="radio"
                    name="title"
                    value="Mr"
                    onChange={(e) => {
                        setFormData((prevData) => ({
                            ...prevData,
                            Title: e.target.value
                        }));
                    }}
                />
                Mr
            </label>
            <label className="flex justify-evenly w-full">
                <input
                    type="radio"
                    name="title"
                    value="Mrs"
                    onChange={(e) => {
                        setFormData((prevData) => ({
                            ...prevData,
                            Title: e.target.value
                        }));
                    }}
                />
                Mrs
            </label>
            <label className="flex justify-evenly w-full">
                <input
                    type="radio"
                    name="title"
                    value="Mrs"
                    onChange={(e) => {
                        setFormData((prevData) => ({
                            ...prevData,
                            Title: e.target.value
                        }));
                    }}
                />
                Else
            </label>
        </div>
        <label className="font-bold">Client Status:</label>
        <input className="border p-1" value={formData.ClientStatus}
          onChange={(e) => setFormData((prevData) => ({...prevData, ClientStatus: e.target.value}))} type="text" required 
        />
        <label className="font-bold">Session purpose:</label>
        <input className="border p-1" value={formData.Issue}
          onChange={(e) => setFormData((prevData) => ({...prevData, Issue: e.target.value}))} type="text" required 
        />
        <label className="font-bold">Appointment Time & Date:</label>
        <input className="border p-1" value={formData.AppointmentDate}
          onChange={(e) => setFormData((prevData) => ({...prevData, AppointmentDate: e.target.value}))} type="datetime-local" required 
        />
        <label className={`${formData.LOA == 0 ? "bg-white" : formData.LOA == 1 ? "bg-blue-400" : formData.LOA == 2 ? "bg-blue-600" : formData.LOA == 3 ? "bg-red-400" : "" } font-bold p-2 mt-2 mb-2 rounded transition-all duration-500 ease-in-out`}> 
            Level Of Access:
        </label>
        <input 
            type="range"
            min={0}
            max={3}
            step={1}
            value={formData.LOA}
            onChange={(e) => setFormData({ ...formData, LOA: parseInt(e.target.value)})}
            required
        />
        <h2 className="font-bold text-serif text-lg border-b">
          Communication 
        </h2>
        <label className="font-bold">Email:</label>
        <input className="border p-1" value={formData.Email}
          onChange={(e) => setFormData((prevData) => ({...prevData, Email: e.target.value}))} type="text" required 
        />
        <label className="font-bold">Phone:</label>
        <input className="border p-1" value={formData.Phone}
          onChange={(e) => setFormData((prevData) => ({...prevData, Phone: e.target.value}))} type="text" required 
        />
        <label className="font-bold">Address:</label>
        <input className="border p-1" value={formData.Address}
          onChange={(e) => setFormData((prevData) => ({...prevData, Address: e.target.value}))} type="text" required 
        />
        {loading ? (
          <p className="bg-blue-600 text-white w-[60%] m-auto mt-2 p-2 rounded shadow animate-pulse text-center">
            Loading...
          </p>
          ) : (
          <button type="submit" className="bg-blue-600 text-white w-[60%] m-auto mt-2 p-2 rounded shadow hover:opacity-60">
            Create Appointment
          </button>
        )}
        {error != "" && 
          <p className="p-2 text-red-600 animate-pulse text-center">
            {error}    
          </p>
        }

      </form>
    </section>
  )
}