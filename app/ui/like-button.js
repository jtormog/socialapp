import { HeartIcon } from "@heroicons/react/20/solid";
import { insertLike } from "../lib/actions";

export default async ({post_id, user_id}) => {

    
    const insertLikeWithPostAndUser = insertLike.bind(null, user_id, post_id)

    return (
        <HeartIcon onClick={insertLikeWithPostAndUser} className="w-8"/>
    )
}