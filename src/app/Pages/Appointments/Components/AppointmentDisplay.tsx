'use client'

import { userContext } from "@/app/Context/ContextProvider";
import API from "@/app/Interceptor"
import { AwaitedReactNode, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useEffect, useState } from "react"

// Types for Appointments
interface Appointment {
  Address: string,
  AppointmentDate: string,
  ClientName: string,
  ClientStatus: string,
  DoctorID:  number,
  Email: string,
  FurtherAction: boolean,
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
  const [ newQuickSetTime, setNewQuickSetTime ] = useState("") 
  
  function HandleQuickChangeTime(newTime: string){
    setNewQuickSetTime(newTime);
  }
  
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
            <AppointmentList appointmentParam={searchParam} data={appointments} changeQuickSetTime={HandleQuickChangeTime}/>
            <CreateAppointMent DoctorName={selectedDoctor.DoctorName} DoctorID={selectedDoctor.DoctorID} QuickSetTime={newQuickSetTime}/>
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
  changeQuickSetTime: (newQuickSetTime: string) => void;
}

const AppointmentList = ({ appointmentParam, data, changeQuickSetTime }: AppointmentListProps) => {
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

  let calendar : Appointment[][] = new Array(7).fill(null).map(() => new Array(25).fill(null));
  /*
  for (let i = 0; i < data.length; i++){
    let currentAppointment = data[i];

    const appointmentYear = parseInt(currentAppointment.AppointmentDate.split('T')[0].split("-")[0]);
    const appointmentMonth = parseInt(currentAppointment.AppointmentDate.split('T')[0].split("-")[1]);
    const appointmentDay = parseInt(currentAppointment.AppointmentDate.split('T')[0].split("-")[2]);
    const appointmentHour = parseInt(currentAppointment.AppointmentDate.split('T')[1].split(":")[0]);
    
    if (appointmentYear !== currentYear){continue};
    if (appointmentMonth !== currentMonth){continue};
    if (appointmentDay < currentDay || appointmentDay >= currentDay + 7){ continue };
     
    const dayIndex = appointmentDay - currentDay;
    calendar[dayIndex][appointmentHour] = currentAppointment;
    
  }
  /*/

  return (
    <div className="p-5 w-full h-full flex flex-col justify-evenly items-center">
      <div className="font-bold text-2xl p-2 flex justify-evenly w-full">
        <button className="bg-blue-600 text-white flex justify-center items-center w-[50px] rounded shadow hover:opacity-60"
          onClick={() => {
            const newTime = new Date(currentYear, currentMonth - 1, currentDay - 7)
            if (newTime.getMonth() !== (currentMonth - 1)) {
              const lastDayOfPrevMonth = new Date(currentYear, currentMonth - 1, 0).getDate();
              setCurrentDay(lastDayOfPrevMonth);
            } else {
              setCurrentDay(newTime.getDate()); 
            }
            setCurrentTime(newTime.toISOString().split("T")[0])
            setCurrentYear(newTime.getFullYear());
            setCurrentMonth(newTime.getMonth() + 1);
            
          }}
        >
          -
        </button>
        <input
            type="date"
            value={new Date(currentTime).toISOString().slice(5,16)}
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
            if (newTime.getMonth() > (currentMonth - 1)) {
              setCurrentDay(1);
            } else {
              setCurrentDay(newTime.getDate());
            }
            setCurrentTime(newTime.toISOString().split("T")[0])
            setCurrentYear(newTime.getFullYear());
            setCurrentMonth(newTime.getMonth() + 1);
            
          }}
        >
          +
        </button>
      </div>
      {appointmentParam == "" ? (
        <ul className="flex flex-row justify-evenly items-center min-w-[100%]">
          {calendar.map((Day, DayIndex) => new Date(currentYear, currentMonth - 1, currentDay + DayIndex, 0, 0,0).getMonth() == currentMonth - 1 && (
            <div className="flex  flex-col h-full w-full" key={DayIndex}>
              <p className="w-full text-center">
                {new Date(currentYear, currentMonth - 1, currentDay + DayIndex, 0, 0,0).toISOString()} 
              </p>
              <ul className="flex flex-col w-full h-full">
                  {Day.map((Day : Appointment, HourIndex: number) => (
                    <div className="border text-center flex flex-col items-center justify-center rounded" key={HourIndex}>
                    {
                      (() => {
                        const FoundAppointment = data.filter(function (appointment) {
                          return new Date(appointment.AppointmentDate).toISOString() === new Date(currentYear, currentMonth - 1, currentDay + DayIndex - 1, HourIndex + 10, 0,0).toISOString();
                        });

                        return (
                          <>
                            {FoundAppointment.length > 0
                              ? FoundAppointment.map((appt, index) => (
                                <button className={`${appt.Result == 'Completed' && "bg-gray-400"} hover:opacity-60 hover:bg-blue-800 bg-blue-600 text-white h-16  w-full p-2 rounded`}
                                  key={index}  
                                  onClick={() => setExpandedData(appt)}
                                >
                                  {appt.ClientName}
                                </button>
                                ))
                              : 
                              <button className="hover:opacity-60 h-16 min-w-full p-2 rounded flex items-center justify-center"
                              onClick={() => 
                                changeQuickSetTime(new Date(currentYear, currentMonth - 1, currentDay + DayIndex - 1, HourIndex, 0,0).toISOString().slice(0, 16))} 
                              >
                                No appointments
                              </button>
                              }
                          </>
                        );
                      })()
                    }

                    </div>
                  ))}                  


                 
                {/*                      
                {Day ? (
                        <button className={`${Day.Result == 'Completed' && "bg-gray-400"} hover:opacity-60 hover:bg-blue-800 bg-blue-600 text-white h-16  w-full p-2 rounded`}
                          onClick={() => setExpandedData(Day)}
                        >
                          {Day.ClientName}
                        </button>
                      ) : (
                        <button className="hover:opacity-60 h-16 min-w-full p-2 rounded flex items-center justify-center"
                          onClick={() => changeQuickSetTime(new Date(currentYear, currentMonth - 1, currentDay + DayIndex - 1, HourIndex + 10, 0,0).toISOString())} 
                        >
                          {new Date(currentYear, currentMonth - 1, currentDay + DayIndex, HourIndex + 10, 0,0).toISOString().slice(11,16)}
                        </button>
                      )}                
                  */}
             
              </ul>

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
          {expandedData !== null ? <Expansion data={expandedData}/> : <p className="font-bold text-center border-t border-b mt-10">Please Select an appointment</p>}
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
      <h2 className="text-lg font-bold">{data.Title} - {data.ClientName} - {data.AppointmentDate}</h2>
      <input placeholder={`${data.Issue}`} />
      <input placeholder={`LEVEL: ${data.LOA} Access`} />
      <input placeholder={data.ClientStatus} />
      <p className={`${data.Result === "Pending" ? "animate-pulse" : "line-through"} bg-blue-400 border rounded p-2 w-[100px] text-center`}>
        {data.Result}
      </p>
    </section>
  );
};


const CreateAppointMent = ({ DoctorName, DoctorID, QuickSetTime } : { DoctorName : string, DoctorID: number, QuickSetTime : string }) => {
  const { userData, setUserData, isUser, setIsUser, isAdmin, setIsAdmin, doctorData, setDoctorData, isDoctor, setIsDoctor, wantLogOut, setWantLogOut } = userContext();
  const [ loading, setLoading ] = useState<boolean>(false);
  const [ error, setError ] = useState<string>("");

  const [formData, setFormData] = useState<Appointment>({
    Address: "",
    AppointmentDate: "",
    ClientName: "",
    ClientStatus: "",
    DoctorID:  DoctorID,
    Email: "",
    FurtherAction: false,
    Issue: "",
    LOA:  -1,
    Occupation: "",
    Phone: "",
    Result: "N/A",
    Title: "",
  })
  
  useEffect(() => {
    if (QuickSetTime !== ''){
      setFormData((prevData) => ({ ...prevData, AppointmentDate: QuickSetTime }));
      console.log(formData)
    };
    
  },[QuickSetTime]);

  useEffect(() => {
    console.log(formData.AppointmentDate);
  },[formData]);

  async function HandleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      if (DoctorID == -1 || formData.Title == ""){
        setError("Missing Parameters");
        return
      }
      setFormData((prevData) => ({...prevData, DoctorID: DoctorID}));
      
      //const utcDate = new Date(new Date(formData.AppointmentDate).getTime() + (new Date().getTimezoneOffset() * 60000));
      //formData.AppointmentDate = utcDate.toISOString().slice(0, 19);

      const response = await API.post("/api/Appointments/Create", formData);

      switch (response.status){
        case 200:
          setError("Success");
          setFormData({
            Address: "",
            AppointmentDate: "",
            ClientName: "",
            ClientStatus: "",
            DoctorID:  DoctorID,
            Email: "",
            FurtherAction: false,
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
          onChange={(e) => setFormData((prevData) => ({...prevData, AppointmentDate: new Date(e.target.value).toISOString().slice(0,16) }))} type="datetime-local" required 
        />
        <label className={`${formData.LOA == 0 ? "bg-white" : formData.LOA == 1 ? "bg-blue-400" : formData.LOA == 2 ? "bg-blue-600" : formData.LOA == 3 ? "bg-red-400" : "" } font-bold p-2 mt-2 mb-2 rounded transition-all duration-500 ease-in-out`}> 
            Level Of Access: {formData.LOA === 3 && "If issue is life threatening please notify emergency services"}
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
        <div className="flex p-1">
          <label className="font-bold">Further Action Needed?</label>
          <input className="border p-1 ml-5" value={formData.FurtherAction ? "true" : "false"}
            onChange={(e) => setFormData((prevData) => ({...prevData, FurtherAction: e.target.checked}))} type="checkbox"  
          />          
        </div>

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