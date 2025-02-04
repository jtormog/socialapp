import Post from "@/app/ui/post"
import { getPosts, getLikes } from "../lib/data"
import { auth0 } from "../lib/auth0";

export default async () => {

    //lanzar las dos consultas a la vez
    const posts = await getPosts();
    const user_id  = (await auth0.getSession()).user.id;

    const likes = await getLikes(user_id);

    function inLikes(likes,post_id){
        for(const like of likes){
            
            let isLiked = like.post_id === post_id
            
            return isLiked; 
        }
    }

    return (
        <div className="flex flex-col grow items-center gap-16 mt-28">
            {
                posts.map(post => <Post 
                    key={post.id}
                    post_id={post.id}
                    user_id={user_id} 
                    isLike={inLikes(likes, post.id)}
                    content={post.content}
                    url={post.url}/>)
            }
        </div>
    )
}