import Post from "@/app/ui/post"
import { getPosts, getLikes } from "../lib/data"
import { auth0 } from "../lib/auth0";

export default async () => {

    //lanzar las dos consultas a la vez
 
    const user_id = (await auth0.getSession()).user?.user_id;    

    if (!user_id) {
        return <div>Not logged in</div>
    }
    
    const posts = await getPosts();
    const likes = await getLikes(user_id);

    return (
        <div className="flex flex-col grow items-center gap-16 mt-28">
            {
                posts.map(post => <Post 
                    key={post.post_id}
                    post_id={post.post_id}
                    user_id={user_id} 
                    isLikedInitial={likes.find(like => like.post_id === post.post_id)}
                    content={post.content}
                    url={post.url}
                    username={post.username}/>)
                    
            }
        </div>
    )
}