import Post from "@/app/ui/post"
import { getPosts } from "../lib/data"
import { auth0 } from "../lib/auth0";

export default async () => {

    const posts = await getPosts();
    const user_id  = (await auth0.getSession()).user
    console.log('user_id: '+user_id)

    return (
        <div className="flex flex-col grow items-center gap-16 mt-28">
            {
                posts.map(post => <Post key={post.post_id} post_id={post.post_id} user_id={user_id} content={post.content} url={post.url}/>)
            }
        </div>
    )
}