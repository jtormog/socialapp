import { ChatBubbleLeftIcon, HeartIcon } from "@heroicons/react/20/solid"
import Link from "next/link";
import Image from "next/image"
import LikeButton from "./like-button";

export default ({post_id, user_id, content, url}) => {
    const nombreUsuario = "Elon Musk Fascista";
    return (
        <div className="flex flex-col gap-4 max-w-lg">
            <div className="flex gap-2">

                <Image src="/images.jpeg"
                    className=" rounded-full w-4"
                    width={24}
                    height={24} alt="partirUnBesoYUnaFlor"/>
                <span>{nombreUsuario}</span>
                <span>88 días</span>

            </div>

            <div>

                <Image
                    src={url}
                    width={640}
                    height={640} />
                
            </div>

            <div className="flex gap-2">
                <LikeButton post_id={post_id} user_id={user_id}/>
                <ChatBubbleLeftIcon className="w-8"></ChatBubbleLeftIcon>
            </div>

            <div>
                <p><span className="me-2">{nombreUsuario}</span>{content}</p>
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