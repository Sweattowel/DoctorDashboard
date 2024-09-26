'use client'

import { FormEvent, useState } from "react";

interface formDataStruc {
    UserName : String
    PassWord : string
    Discipline : string
    Experience : number
};

export default function DoctorRegister(){
    const [ loading, setLoading ] = useState<boolean>(false);
    const [ error, setError ] = useState<string>("Please enter details");

    const [ formData, setFormData ] = useState<formDataStruc>({
        UserName : "",
        PassWord : "",
        Discipline : "",
        Experience : 0,
    });

    async function RegisterDoctorHandle(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        try {
            setLoading(true);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="w-[50%] p-1">
            <h2 className="font-serif font-bold">
                Register
            </h2>
            <form onSubmit={(e) => RegisterDoctorHandle(e)} className="flex flex-col">
                <label>
                    Enter Username: 
                </label>
                <input onChange={(e) => setFormData((prevData) => ({ ...prevData, UserName : e.target.value }))} className="border" type="text" name="UserName" id="DoctorRegisterUserName" required/>
                <label>
                    Enter PassWord: 
                </label>
                <input onChange={(e) => setFormData((prevData) => ({ ...prevData, PassWord : e.target.value }))} className="border" type="password" name="PassWord" id="DoctorRegisterPassWord" required/>
                <label>
                    ReEnter PassWord: 
                </label>
                <input onChange={(e) => {
                    if (e.target.value !== formData.PassWord) {
                        setError((prevError) => prevError + ", Password does not match");
                    }
                }} className="border" type="password" name="ReEnter" id="DoctorRegisterReEnter" required/>
                <label>
                    Enter Discipline: 
                </label>
                <input onChange={(e) => setFormData((prevData) => ({ ...prevData, Discipline : e.target.value }))} className="border" type="text" name="Discipline" id="DoctorRegisterDiscipline" required/>
                <label>
                    Enter Experience: 
                </label>
                <input onChange={(e) => setFormData((prevData) => ({ ...prevData, Experience : Math.max(0, (parseInt(e.target.value) ? parseInt(e.target.value) : 0))}))} value={formData.Experience} className="border" type="number" name="Experience" id="Experience" required/>
                <p className="text-red-600 animate-pulse">{error}</p>
                {!loading ? (
                    <button className="bg-blue-600 hover:opacity-60 w-[50%] m-auto mt-2 p-2 text-white rounded" type="submit">
                        Register
                    </button>                    
                ) : (
                    <p className="bg-blue-600 w-[50%] m-auto mt-2 p-2 text-white rounded animate-pulse text-center">Loading...</p>
                )}

            </form>
        </main>
    )
}