'use client'

import React, { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import PostList from '@/app/ui/postlist';

export default function SearchPage() {
    const searchParams = useSearchParams();
    const query = searchParams.get('q') || '';
    const [posts, setPosts] = React.useState([]);
    const userId = null;
    const likes = [];

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (query) {
                fetch(`/api/search?q=${query}`)
                    .then(response => response.json())
                    .then(data => setPosts(data.posts))
                    .catch(error => console.error('Error fetching posts:', error));
            } else {
                setPosts([]);
            }
        }, 1000);

        return () => clearTimeout(delayDebounceFn);
    }, [query]);

    const handleSearch = (e) => {
        const newQuery = e.target.value;
        const params = new URLSearchParams(window.location.search);
        if (newQuery) {
            params.set('q', newQuery);
        } else {
            params.delete('q');
        }
        window.history.pushState(null, '', `?${params.toString()}`);
    };

    return (
        <div className='mx-auto'>
            <div className="flex flex-col items-center gap-8 p-4">
                <div className="w-[600px]">
                    <input
                        type="text"
                        defaultValue={query}
                        onChange={handleSearch}
                        placeholder="Search posts..."
                        className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all"
                    />
                </div>
                <PostList posts={posts} user_id={userId} likes={likes} />
            </div>
        </div>
    );
}