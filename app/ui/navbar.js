import NavLink from "./navlink"
import { HomeIcon, MagnifyingGlassIcon, PlusCircleIcon, UserCircleIcon } from "@heroicons/react/20/solid";

export default () =>{
    return(
        <nav className="flex flex-col border-e h-dvh gap-2 p-4">
            <p className="hidden sm:block">Social App</p>
            <NavLink href="/">Home</NavLink>
            <NavLink href="/search">Search</NavLink>
            <NavLink href="/create">Create</NavLink>
            <NavLink href="/profile">Profile</NavLink>
        </nav>
    ); 
}
