'use client'

import { useState } from "react"
import API from "../Interceptor";

export default function CreateAll(){
    const [remainingPresses, setRemainingPresses] = useState<number>(3);

    async function CreateAllData(){
        if (remainingPresses > 0) return;

        try {
            console.log("Attempting to create Data");
            const response = await API.get(`/api/CREATEDATA`);
            
            if (response.status == 200) {
                console.log("Data created");
            }
        } catch (error) {
            console.error("Failed to create Data", error);
        }
    }

    return (
        <button className="animate-pulse bg-gray-800 text-white rounded-xl p-2"
            onClick={() => {
                setRemainingPresses(Math.max(0, remainingPresses - 1));
                CreateAllData();
            }}
        >
            EMERGENCY : {remainingPresses}
        </button>
    )
}