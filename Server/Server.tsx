'use server'

const AppointmentData = import("./ClientData/ClientData.json")

export default async function GetAppointmentData() {
    try {
        console.log("Request received");
        const data = await AppointmentData;
        console.log(data);
        return JSON.parse(JSON.stringify(data))
    } catch (error) {
        console.error(error);
        return 'Fail';
    }
}