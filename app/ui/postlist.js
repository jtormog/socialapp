import PostShort from "@/app/ui/post-short"

export default async ({ posts, user_id, likes }) => {
    return (
        <div className="flex flex-col grow items-center gap-16 mt-28">
            {posts.map(post => (
                <PostShort
                    key={post.post_id}
                    post={post}
                    user_id={user_id}
                    isLikedInitial={likes.find(like => like.post_id === post.post_id)}
                />
            ))}
        </div>
    );
}