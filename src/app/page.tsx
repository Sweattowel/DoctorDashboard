import Appointment from "./Pages/Appointments/page";
import NavBar from "./Pages/Nav/page";
import "./Interceptor";

export default function Home() {

  return (
    <main>
      <NavBar />
      <Appointment />
    </main>
  );
}
