import Link from "next/link";

export default function Tail(){
    return (
        <main className="bg-white w-full h-[70vh] mt-10 p-5 flex flex-col justify-evenly items-center">
            <p className="font-serif text-sm">
                Personnal Website for educational purposes, all rights reserved
            </p>
            <Link className="font-bold"
                href={"/Pages/Authorization/ADMIN"}
            >
                Admin Login
            </Link>        
        </main>
    )

}