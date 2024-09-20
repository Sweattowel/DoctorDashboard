import Link from "next/link"

const links = [
    {
        title: "Home",
        ref: "/"
    },    
    {
        title: "Profile",
        ref: "/Pages/Authorization/Login"
    },
]
export default function NavBar(){

    return (
        <main className="h-[5vh] flex shadow justify-evenly items-center p-2 bg-white">
            <h1 className="text-2xl font-serif font-bold">
                Medicite
            </h1>
            
            <ul className="h-[5vh] flex justify-evenly items-center">
                {links.map((link, index) => (
                        <Link className="bg-blue-400 text-white p-2 rounded hover:opacity-60"
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