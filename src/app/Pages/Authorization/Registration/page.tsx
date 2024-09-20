import NavBar from "@/app/GlobalComponents/Nav/page";
import Link from "next/link";

export default function Register(){
    return (
        <main className="bg-gray-200 min-h-[100vh]">
            <NavBar />
            <section className="flex h-[60vh] w-[80vw] m-auto bg-white mt-10 rounded-xl">
                <div className="w-[50%] h-full flex flex-col">
                    <h1 className="h-[20%] w-full flex justify-center items-center text-2xl font-bold font-serif m-auto">
                        Sign Up
                    </h1>
                    <form className="h-[60%] flex flex-col justify-center items-center" action="">
                        <h2>
                            Enter Username
                        </h2>
                        <input className="w-[40%] border rounded shadow" placeholder="Username" type="text" />
                        <h2>
                            Enter Password
                        </h2>
                        <input className="w-[40%] border rounded shadow" placeholder="Password" type="text" />
                        <button className="bg-blue-600 text-white w-[40%] m-auto shadow p-1 rounded-xl hover:opacity-60 hover:shadow hover:shadow-lg hover:shadow-black transition-all duration-500 ease-in-out">
                            Submit
                        </button>                        
                    </form>

                </div>
                <div className="w-[50%] h-full bg-blue-600 flex flex-col justify-center items-center">
                    <h1 className="text-white h-[20%] w-full flex justify-center items-center text-2xl font-bold font-serif m-auto">
                        Log in instead?
                    </h1>
                    <div className="h-[60%] w-full flex justify-center  items-center">
                        <Link href={"/Pages/Authorization/Login"} className="border text-center border-white text-white w-[40%] m-auto shadow p-1 rounded-xl hover:opacity-80 hover:shadow hover:shadow-lg hover:shadow-white transition-all duration-500 ease-in-out">
                            Login
                        </Link>                        
                    </div>
                </div>
            </section>
        </main>
    )
}