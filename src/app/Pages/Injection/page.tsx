'use client'

import NavBar from "@/app/GlobalComponents/Nav/page"
import API from "@/app/Interceptor";
import { use, useState } from "react"

export default function Injector(){
    const [SQL, setSQL] = useState("");
    const [errorMargin, setErrorMargin] = useState(3);
    const [SQLResponse, setSQLResponse] = useState<any>();
    async function inject(){
        try {
            if (!SQL || SQL == "") return;

            const response = await API.post("/api/IllegalSQLInjectionTechnique", {sqlQuery: SQL})  
            if (response.status == 200) {
                console.log(response.data.message);
                if (response.data.results){
                    console.log(response.data.results);
                    setSQLResponse(response.data.results)
                }
                
            }          
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <main className="bg-gray-200 min-h-[100vh]">
            <NavBar />
            <section className="flex flex-col justify-evenly items-center bg-white w-[80%] h-[60vh] rounded p-5 mt-10 m-auto shadow-xl">
                <h1 className="text-2xl font-bold font-serif">
                    Inject DataString
                </h1>                
                <textarea onChange={(e) => setSQL(e.target.value)} className="border w-[80%] h-[40%] flex-wrap" value={SQL}/>
                <button className="bg-blue-600 text-white p-2 rounded"
                onClick={() => {
                    if (errorMargin === 0){
                        inject();
                    } else {
                        setErrorMargin(Math.max(0, errorMargin - 1))
                    }
                }}
                >
                    INJECT {errorMargin}
                </button>
            </section>
            <ul className="p-5 bg-white m-auto w-[80%] mt-10 shadow-2xl rounded divide-y">
                {SQLResponse && SQLResponse.map((result : any, index : number) => (
                    <li className="p-2 flex flex-col" key={index}>
                        {Object.entries(result).map(([key, value] : any, smallKey : number) => (
                            <h1 key={smallKey}>
                                <span className="font-bold">{key}:</span> <span className="border">{value}</span> 
                            </h1>
                        ))}
                    </li>
                ))}
            </ul>
            
        </main>
    )
}