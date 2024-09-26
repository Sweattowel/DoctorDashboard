import NavBar from "./GlobalComponents/Nav/Navigation";
import "./Interceptor";
import Link from "next/link";

export default function Home() {

  return (
    <main className="bg-gray-200 min-h-[100vh] h-full pb-10">
      <NavBar />
      <section className=" w-[90%] h-full shadow-lg m-auto mt-10 rounded-xl flex md:flex-col justify-center items-center">
        <div className="h-[50%] w-full flex flex-row p-5">
          <h2 className="flex justify-center items-center text-center text-3xl text-white font-bold font-serif w-full md:w-[50%] bg-gradient-to-br from-blue-600 via-blue-600 to-white md:rounded-tl-xl md:rounded-bl rounded-tr-xl rounded-tl-xl p-2">
            Medicite, trust you can afford
          </h2>
          <img className="h-full w-full md:w-[50%] flex justify-center items-center md:rounded-tr-xl md:rounded-br-xl rounded-bl-xl rounded-br-xl" 
            src={"https://img.freepik.com/free-photo/beautiful-young-female-doctor-looking-camera-office_1301-7807.jpg?size=626&ext=jpg&ga=GA1.1.2008272138.1726790400&semt=ais_hybrid"}
          />
        </div>
        <div className=" w-full flex p-5 h-[50vh]">
          <section className="h-full w-[50%]"
            style={{
              backgroundImage: `url("https://media.licdn.com/dms/image/v2/C4D12AQGdZAIAcFNlzw/article-inline_image-shrink_1000_1488/article-inline_image-shrink_1000_1488/0/1627922583458?e=1731542400&v=beta&t=GrCI8TRHQl6pu8SmHDk8X4QfUMmiv97fK2uPFPoUs8w")`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}>
              <div className="w-full h-full bg-blue-800 text-white bg-opacity-60 flex flex-col justify-center items-center">
                <h2 className="text-2xl font-bold font-serif w-full bg-blue-600 text-center p-2">
                  Book a meeting with our personable staff
                </h2>
                <Link className="bg-white text-blue-600 p-2 pl-5 pr-5 shadow-lg rounded hover:opacity-60 transition-all duration-500 ease-in-out ml-[15%]"
                  href={"/Pages/Appointments"}
                >
                  BOOK NOW
                </Link>
              </div>
          </section>
          <section className="h-full w-[50%]"
            style={{
              backgroundImage: `url("https://www.datocms-assets.com/71768/1671497622-medical-receptionist.jpg")`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}>
              <div className="w-full h-full bg-blue-800 text-white bg-opacity-60 flex flex-col justify-center items-center">
                <h2 className="text-2xl font-bold font-serif w-[100%] bg-blue-600 text-center p-2">
                  Contact our 5 Star Staff
                </h2>
                <Link className="bg-white text-blue-600 p-2 pl-5 pr-5 shadow-lg rounded  ml-[55%] hover:opacity-60 transition-all duration-500 ease-in-out"
                  href={"/Pages/Contact"}
                >
                  Speak with us
                </Link>
              </div>
          </section>          
        </div>


      </section>


    </main>
  );
}
