import NavBar from "@/app/GlobalComponents/Nav/Navigation";
import DoctorLogin from "./Components/DoctorLogin";
import Tail from "@/app/GlobalComponents/Tail/Tail";
import DoctorRegister from "./Components/DoctorRegister";


export default function Doctor(){
    return (
        <main className="bg-gray-200">
            <NavBar />
                <DoctorLogin />   
                <DoctorRegister />      
            <Tail />
        </main>
        
    )
}