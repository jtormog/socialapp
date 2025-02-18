import { auth0 } from "./lib/auth0";
import { getLikes, getPosts } from "./lib/data";
import PostList from "./ui/postlist";

export default async function Home() {
  const user_id = (await auth0.getSession()).user.user_id;
  if(user_id){
    const posts = await getPosts();
    const likes = await getLikes(user_id);
    return (
      <>
          <PostList user_id={user_id} posts={posts} likes={likes}/>
      </>
    );
  }
}
