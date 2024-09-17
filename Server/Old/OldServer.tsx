'use server'

const AppointmentData = import("./ClientData/ClientData.json")
const Doctors = import("./DoctorData/DoctorData.json")

interface Doctor {
    id: number;
    name: string;
    Speciality: string;
    phone: string;
    email: string;
    address: string;
    yearsOfExperience: number;
    hospitalAffiliation: string;
}
interface AppointMentStruc {
    Doctor: string,
    DoctorID: number,
    Clients: Appointment[]
}
interface Appointment {
        Title: string,
        ClientName: string,
        Occupation: string,
        Address: string,
        Phone: string,
        Email: string,
        Appointment: {
          Date: string,
          Result: string,
          FurtherAction: boolean,
          LOA: number,
          ClientStatus: string,
          Issue: string,
          Doctor: string
        },
        PriorAppointments: []    
}
import express from "express";
const app = express()
export async function GetAppointmentData() {
    try {
        console.log("Request received");
        const data = await AppointmentData;
        console.log(data);
        return JSON.parse(JSON.stringify(data))
    } catch (error) {
        console.error(error);
        return 'Failed to collect Appointments';
    }
} 
export async function GetDoctorNames() {
    try {
        console.log("Request received");
        const data : Doctor[] = await Doctors;
        let payload = [];

        for (let i = 0; i < data.length; i++){
            payload.push(data[i].name)
        }
        //console.log(payload)
        return JSON.parse(JSON.stringify(payload))
    } catch (error) {
        console.log(error);
        return 'Failed to collect Doctor names';
    }
}
export async function GetDoctorData(doctorName: string){
    try {
        console.log("Request received");
        const data : Doctor[] = await Doctors;
        let payload = {}
        for (let i = 0; i < data.length; i++){
            if (data[i].name == doctorName){
                payload = data[i]
                break;
            }
        }
        return JSON.parse(JSON.stringify(payload))
    } catch (error) {
        console.log(error);
        return 'Failed to collect Doctor data';
    }
}
export async function GetDoctorAppointMents(DoctorID : number){
    try {
        console.log("Request received");
        const data : AppointMentStruc[] = await AppointmentData; 
        let payload = {};
        for (let i = 0; i < data.length; i++){
            if (data[i].DoctorID == DoctorID){
                payload = data[i];
                break;
            }
        }
        return JSON.parse(JSON.stringify(payload))
    } catch (error) {
        console.error(error);
        return [];
    }
}