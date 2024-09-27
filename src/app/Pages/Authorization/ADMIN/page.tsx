import NavBar from "@/app/GlobalComponents/Nav/Navigation";
import ADMINLogin from "./Components/ADMINLogin";
import Tail from "@/app/GlobalComponents/Tail/Tail";


export default function ADMIN(){
    return (
        <main>
            <NavBar />
                <ADMINLogin />         
            <Tail />
        </main>
        
    )
}