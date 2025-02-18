import { auth0 } from "@/app/lib/auth0";
import { getLikes, getPost } from "@/app/lib/data"
import Post from "@/app/ui/post"

export default async ({ params }) => {
    const post_id = (await params).post_id;
    const user_id = (await auth0.getSession()).user.user_id;

    const post = (await getPost(post_id))[0];
    const likes = await getLikes(user_id);

    return (
        <div className="flex flex-col grow items-center gap-16 mt-28">
            <Post
                key={post.post_id}
                post={post}
                user_id={user_id}
                isLikedInitial={likes.find(like => like.post_id === post.post_id)}
            />
        </div>
    );
}