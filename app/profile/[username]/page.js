import { getUserPosts } from "@/app/lib/data";
import Image from "next/image";
import Link from "next/link";

export default async function UserProfile({ params }) {
    const { username } = params;
    const posts = await getUserPosts(username);

    return (
        <div className="flex flex-col items-center gap-8 mt-8">
            <div className="flex items-center gap-8">
                {posts[0] && (
                    <Image
                        src={posts[0].picture}
                        width={150}
                        height={150}
                        alt={`${username}'s profile picture`}
                        className="rounded-full"
                    />
                )}
                <div className="flex flex-col gap-2">
                    <h1 className="text-2xl font-semibold dark:text-gray-200">{username}</h1>
                    <div className="flex gap-8">
                        <span className="dark:text-gray-300"><strong className="dark:text-gray-200">{posts.length}</strong> publicaciones</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-1 max-w-[900px]">
                {posts.map((post) => (
                    <Link key={post.post_id} href={`/post/${post.post_id}`} className="aspect-square relative group">
                        <Image
                            src={post.url}
                            alt={post.content}
                            fill
                            className="object-cover"
                        />
                    </Link>
                ))}
            </div>
        </div>
    );
}