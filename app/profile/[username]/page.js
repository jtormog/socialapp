import { getUserPosts, getUser } from "@/app/lib/data";
import Image from "next/image";
import Link from "next/link";

export default async function UserProfile({ params }) {
    const username = (await params).username;
    const posts = await getUserPosts(username);
    const userData = await getUser(username);

    if (!userData) {
        return (
            <div className="flex justify-center items-center h-screen">
                <h1 className="text-2xl font-semibold dark:text-gray-200">Usuario no encontrado</h1>
            </div>
        );
    }

    return (
        <div className="container py-8 relative ml-auto"> 
            <div className="flex flex-col items-center gap-8">
                <div className="flex flex-col md:flex-row items-center gap-8 w-full max-w-2xl">
                    <Image
                        src={userData.picture}
                        width={150}
                        height={150}
                        alt={`${username}'s profile picture`}
                        className="rounded-full"
                    />
                    <div className="flex flex-col gap-4 text-center md:text-left">
                        <h1 className="text-3xl font-semibold dark:text-gray-200">{username}</h1>
                        <div className="flex flex-wrap gap-8 justify-center md:justify-start">
                            <span className="dark:text-gray-300">
                                <strong className="dark:text-gray-200">{userData.post_count}</strong> posts
                            </span>
                            <span className="dark:text-gray-300">
                                <strong className="dark:text-gray-200">{userData.like_count}</strong> likes
                            </span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-6xl">
                    {posts.map((post) => (
                        <Link key={post.post_id} href={`/post/${post.post_id}`} 
                              className="aspect-square relative group hover:opacity-90 transition-opacity">
                            <Image
                                src={post.url}
                                alt={post.content}
                                fill
                                className="object-cover rounded-lg"
                            />
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}