'use client'

import React, { useState, useEffect } from 'react';
import PostList from '@/app/ui/postlist';

export default function SearchPage() {
    const [query, setQuery] = useState('');
    const [posts, setPosts] = useState([]);
    const [userId, setUserId] = useState(null); // Assuming you have a way to get the user ID
    const [likes, setLikes] = useState([]); // Assuming you have a way to get the likes

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (query) {
                fetch(`/api/search?q=${query}`)
                    .then(response => response.json())
                    .then(data => setPosts(data.posts))
                    .catch(error => console.error('Error fetching posts:', error));
            }
        }, 1000);

        return () => clearTimeout(delayDebounceFn);
    }, [query]);

    return (
        <div className='mx-auto'>
            <div className="flex flex-col items-center gap-8 p-4">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search posts..."
                    className="w-full max-w-lg p-3 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all"
                />
                <PostList posts={posts} user_id={userId} likes={likes} />
            </div>
        </div>

    );
}