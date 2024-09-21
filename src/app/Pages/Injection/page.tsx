'use client'

import NavBar from "@/app/GlobalComponents/Nav/page"
import API from "@/app/Interceptor";
import { useState } from "react"

export default function Injector(){
    const [SQL, setSQL] = useState("");
    const [errorMargin, setErrorMargin] = useState(3);

    async function inject(){
        try {
            if (!SQL || SQL == "") return;

            const response = await API.post("/api/IllegalSQLInjectionTechnique", {sqlQuery: SQL})  
            if (response.status == 200) {
                console.log(response.data.message);
                setSQL("");
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

            
        </main>
    )
}