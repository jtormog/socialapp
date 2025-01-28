'use client'
import Link from "next/link";
import {BeakerIcon} from "@heroicons/react/20/solid"
import clsx from "clsx";
import { usePathname } from "next/navigation";


export default ({ href, children, icon }) => {
    const currentPath = usePathname();
    const objeto = {icon}
    return (
        <Link href={href} className={clsx('flex px-4 py-2 hover:bg-gray-500 rounded',
            {
                "font-bold pointer-events-none text-blue-500": currentPath === href
            }
        )}>
            <BeakerIcon className="w-4"/><span className="hidden lg:block">{children}</span></Link>
    )
}