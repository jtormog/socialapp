'use client'

import { ChatBubbleLeftIcon} from "@heroicons/react/20/solid"
import Link from "next/link";
import Image from "next/image"
import LikeButton from "./like-button";
import CommentList from "./comment-list";
import { createComment, createReply } from "../lib/actions";

const getTimeAgo = (created_at) => {
    const postDate = new Date(created_at);
    const now = new Date();
    const diffInMillis = now - postDate;
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

export default ({user_id, post, isLikedInitial, comments}) => {
    const timeAgo = getTimeAgo(post.created_at);

    const handleAddComment = async (content) => {
        await createComment(post.post_id, content);
    };

    const handleReply = async (commentId, content) => {
        await createReply(post.post_id, commentId, content);
    };

    return (
        <div className="flex flex-col gap-4 max-w-lg">
            <div className="flex gap-2">
                <Image src={post.picture}
                    className=" rounded-full"
                    width={24}
                    height={24} alt="partirUnBesoYUnaFlor"/>
                <span>{post.username}</span>
                <span>{"Hace "+timeAgo}</span>
            </div>

            <div>
            <Link href={`/post/${post.post_id}`}>
                <Image src={post.url} 
                    alt="test"
                    className="w-auto h-sm mx-auto"
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

            <CommentList 
                comments={comments || []}
                onAddComment={handleAddComment}
                onReply={handleReply}
            />
        </div>
    )
}