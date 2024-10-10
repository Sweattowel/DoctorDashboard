'use client'

import { userContext } from "@/app/Context/ContextProvider";
import API from "@/app/Interceptor";
import { useEffect, useState } from "react";

export default async function Admin(){
    const { userData, setUserData, isUser, setIsUser, isAdmin, setIsAdmin, doctorData, setDoctorData, isDoctor, setIsDoctor, wantLogOut, setWantLogOut } = userContext();

    const [Verified, setVerified ] = useState<boolean>(false);

    const VerifyADMIN = async () => {
        try {
            const response = await API.get("/api/Authorization/Verify")

            if (response.status === 200){
                setVerified(true);
            }
        } catch (error) {
            console.error(error);
            setVerified(false);        
        }
    }
    
    useEffect(() => {
        if (isAdmin && !isUser && isDoctor){
            VerifyADMIN()
        }

        setInterval(() => VerifyADMIN, 5000);
    })

    return (
        <main>
            {Verified ? (
                <main>
                    VERIFIED
                </main>) : 
                (
                <p>
                    NOT SO VERIFIED
                </p>
            )}            
        </main>
    )

}