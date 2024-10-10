'use client'

import Link from "next/link";
import { useState, useEffect } from "react";

export default function NavBarLink ({ href, text, handleClick }: { href: string; text: string; handleClick?: () => void }) {
    const [mobile, setMobile] = useState(false);

    useEffect(() => {
        // Set Nav for screen size
        if (window.innerWidth < 750) {
            setMobile(true);
        } else {
            setMobile(false);
        }
    }, []);

    return (
        <Link
            className={`animate-all duration-1000 ease-in-out bg-blue-600 text-white p-2 pl-5 pr-5 rounded hover:pl-10 hover:pr-10 hover:opacity-60 transition-all ease-in-out duration-1000 ${
                !mobile ? "max-w-[25%]" : "border border-white"
            }`}
            href={href}
            onClick={handleClick}
        >
            {text}
        </Link>
    );
};
