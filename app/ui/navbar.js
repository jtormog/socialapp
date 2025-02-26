'use client'
import { useEffect, useState } from 'react'
import NavLink from "./navlink"
import { ArrowRightStartOnRectangleIcon, HomeIcon, MagnifyingGlassIcon, PlusCircleIcon, UserIcon } 
from '@heroicons/react/24/solid'
import { getUserLogged } from '../lib/data'

export default () =>{
    const [username, setUsername] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchUser() {
            try {
                const response = await fetch('/api/auth/session');
                if (!response.ok) {
                    throw new Error('Failed to fetch authentication data');
                }
                
                const userData = await response.json();
                if (userData.error) {
                    setError(userData.error);
                    return;
                }

                if (userData.username) {
                    setUsername(userData.username);
                } else {
                    setError('User profile not found');
                }
            } catch (err) {
                console.error('Error fetching user:', err);
                setError(err.message);
            }
        }

        fetchUser();
    }, []);

    return(
        <nav className="flex flex-col border-e h-dvh gap-2 p-4 fixed">
            <p className="hidden sm:block">Social App</p>
            {username && <p className="hidden sm:block text-sm text-gray-500">@{username}</p>}
            <NavLink href="/" icon={ HomeIcon }>Home</NavLink>
            <NavLink href="/search" icon={MagnifyingGlassIcon}>Search</NavLink>
            <NavLink href="/create" icon={PlusCircleIcon}>Create</NavLink>
            <NavLink href={`/profile/${username}`} icon={UserIcon}>Profile</NavLink>
            <a href="/auth/logout" className='flex gap-2 mt-8'><ArrowRightStartOnRectangleIcon className='w-4'/>Sign out</a>
        </nav>
    ); 
}
