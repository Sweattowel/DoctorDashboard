import NavBar from "@/app/GlobalComponents/Nav/Navigation";
import Tail from "@/app/GlobalComponents/Tail/Tail";
import DoctorLogin from "./Components/DoctorLogin";
import DoctorRegister from "./Components/DoctorRegister";

export default function Doctor(){
    return (
        <main className="bg-gray-200 w-full h-full">
            <NavBar />

            <section className="bg-white shadow-2xl rounded-2xl w-[80%] mt-10 m-auto p-5 flex justify-evenly items-center">
                <DoctorLogin />
                <DoctorRegister />
            </section>

            <Tail />
        </main>
    )
}