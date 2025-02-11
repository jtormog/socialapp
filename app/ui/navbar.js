'use client'
import NavLink from "./navlink"
import { ArrowRightStartOnRectangleIcon, HomeIcon, MagnifyingGlassIcon, PlusCircleIcon, UserIcon } 
from '@heroicons/react/24/solid'
export default () =>{
    return(
        <nav className="flex flex-col border-e h-dvh gap-2 p-4 fixed">
            <p className="hidden sm:block">Social App</p>
            <NavLink href="/" icon={ HomeIcon }>Home</NavLink>
            <NavLink href="/search" icon={MagnifyingGlassIcon}>Search</NavLink>
            <NavLink href="/create" icon={PlusCircleIcon}>Create</NavLink>
            <NavLink href="/profile" icon={UserIcon}>Profile</NavLink>
            <a href="/auth/logout" className='flex gap-2 mt-8'><ArrowRightStartOnRectangleIcon className='w-4'/>Sign out</a>
        </nav>
    ); 
}
