import { ChatBubbleLeftIcon} from "@heroicons/react/20/solid"
import Link from "next/link";
import Image from "next/image"
import LikeButton from "./like-button";

const getTimeAgo = (created_at) => {
    const postDate = new Date(created_at);
    const now = new Date();
    const diffInMillis = now - postDate;
    console.log(postDate, now);
    const seconds = Math.floor(diffInMillis / 1000);
    const MINUTES = 60;
    const HOURS = 60 * MINUTES;
    const DAYS = 24 * HOURS;
    const WEEKS = 7 * DAYS;
    const MONTHS = 4 * WEEKS;
    const YEARS = 12 * MONTHS;

    if (seconds < MINUTES) {
        return `unos instantes`;
    } else if (seconds < HOURS) {
        const minutes = Math.floor(seconds / MINUTES);
        return `${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`;
    } else if (seconds < DAYS) {
        const hours = Math.floor(seconds / HOURS);
        return `${hours} ${hours === 1 ? 'hora' : 'horas'}`;
    } else if (seconds < WEEKS) {
        const days = Math.floor(seconds / DAYS);
        return `${days} ${days === 1 ? 'día' : 'días'}`;
    } else if (seconds < MONTHS) {
        const weeks = Math.floor(seconds / WEEKS);
        return `${weeks} ${weeks === 1 ? 'semana' : 'semanas'}`;
    } else if (seconds < YEARS) {
        const months = Math.floor(seconds / MONTHS);
        return `${months} ${months === 1 ? 'mes' : 'meses'}`;
    } else {
        const years = Math.floor(seconds / YEARS);
        return `${years} ${years === 1 ? 'año' : 'años'}`;
    }
};

export default ({user_id, post, isLikedInitial}) => {
    const timeAgo = getTimeAgo(post.created_at);

    return (
        <div className="flex flex-col gap-4 max-w-lg">
            <div className="flex gap-2">
                <Image src={post.picture}
                    className=" rounded-full w-4"
                    width={24}
                    height={24} alt="partirUnBesoYUnaFlor"/>
                <span>{post.username}</span>
                <span>{"Hace "+timeAgo}</span>
            </div>

            <div>
            <Link href={`/post/${post.post_id}`}>
                <Image src={post.url} 
                    alt="test"
                    className=""
                    width={284}
                    height={284}
                />
                </Link>
            </div>

            <div className="flex gap-2">
                <LikeButton post_id={post.post_id} user_id={user_id} isLikedInitial={isLikedInitial}/>
                <ChatBubbleLeftIcon className="w-8"/>
            </div>
            <span>{post.num_likes} Me gusta</span>

            <div>
                <p><span className="me-2">{post.username}</span>{post.content}</p>
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