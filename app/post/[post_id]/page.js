import { auth0 } from "@/app/lib/auth0";
import { getLikes, getPost, getPostComments} from "@/app/lib/data"
import PostDetail from "@/app/ui/post-detail"

export default async ({ params }) => {
    const post_id = (await params).post_id;
    const user_id = (await auth0.getSession()).user.user_id;

    const post = await getPost(post_id);
    const likes = await getLikes(user_id);

    if (!post) {
        return <div>Post not found</div>;
    }

    return (
        <div className="flex flex-col grow items-center gap-16 mt-28">
            <PostDetail
                key={post.post_id}
                post={post}
                comments={await getPostComments(post_id)}
                user_id={user_id}
                isLikedInitial={likes?.find(like => like.post_id === post.post_id)}
            />
        </div>
    );
}