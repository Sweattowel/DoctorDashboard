import Link from "next/link"

const links = [
    {
        title: "Home",
        ref: "/"
    },    
    {
        title: "Book",
        ref: "/Pages/Appointments"
    },    
    {
        title: "Profile",
        ref: "/Pages/Authorization/Login"
    },
    {
        title: "Inject",
        ref: "/Pages/Injection"
    },
]
export default function NavBar(){

    return (
        <main className="flex shadow justify-evenly items-center p-2 bg-white">
            <h1 className="p-2 pl-5 h-full text-2xl font-serif font-bold">
                Medicite
            </h1>
            
            <ul className="w-full flex justify-evenly items-center ">
                {links.map((link, index) => (
                        <Link className="bg-blue-600 text-white p-2 pl-5 pr-5 rounded hover:pl-10 hover:pr-10 hover:opacity-60 transition-all ease-in-out duration-500"
                            key={index}
                            href={link.ref}
                        >
                            {link.title}
                        </Link>
                ))}
            </ul>
        </main>
    )
}