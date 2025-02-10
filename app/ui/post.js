import { ChatBubbleLeftIcon, HeartIcon } from "@heroicons/react/20/solid"
import Link from "next/link";
import Image from "next/image"
import LikeButton from "./like-button";

export default ({post_id, user_id, content, url, isLikedInitial, username}) => {
    return (
        <div className="flex flex-col gap-4 max-w-lg">
            <div className="flex gap-2">

                <Image src="/images.jpeg"
                    className=" rounded-full w-4"
                    width={24}
                    height={24} alt="partirUnBesoYUnaFlor"/>
                <span>{username}</span>
                <span>88 días</span>

            </div>

            <div>
            <Link href={`/post/${post_id}`}>
                <Image src={url} 
                    alt="test"
                    className=""
                    width={384}
                    height={384}
                />
                </Link>
            </div>

            <div className="flex gap-2">
                <LikeButton post_id={post_id} user_id={user_id} isLikedInitial={isLikedInitial}/>
                <ChatBubbleLeftIcon className="w-8"></ChatBubbleLeftIcon>
            </div>

            <div>
                <p><span className="me-2">{username}</span>{content}</p>
            </div>

            <div>
                <Link href="#">Ver los 88 comentarios</Link>
            </div>
            <div>
                <input className="dark:bg-neutral-950 w-full outline-none" placeholder="Añade un comentario"></input>
            </div>
        </div>
    )
}