import Post from "@/app/ui/post"
import { getPostComments } from "@/app/lib/data";

export default async ({ posts, user_id, likes }) => {
    const postsWithComments = await Promise.all(posts.map(async post => {
        const comments = await getPostComments(post.post_id);
        return {
            ...post,
            comments
        };
    }));

    return (
        <div className="flex flex-col grow items-center gap-16 mt-28">
            {postsWithComments.map(post => (
                <Post
                    key={post.post_id}
                    post={post}
                    comments={post.comments}
                    user_id={user_id}
                    isLikedInitial={likes.find(like => like.post_id === post.post_id)}
                />
            ))}
        </div>
    );
}