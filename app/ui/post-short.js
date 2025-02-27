'use client'
import { useState } from "react";
import { ChatBubbleLeftIcon} from "@heroicons/react/24/outline"
import CommentInput from "./comment-input"
import Link from "next/link";
import Image from "next/image"
import LikeButton from "./like-button";
import Comment from "./comment";
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

export default function PostShort({user_id, post, isLikedInitial}) {
    const timeAgo = getTimeAgo(post.created_at);
    const [likeCount, setLikeCount] = useState(post.num_likes || 0);
    const [localComments, setLocalComments] = useState([]);
    const [commentCount, setCommentCount] = useState(post.num_comments || 0);

    const handleAddComment = async (content) => {
        // Get current user's data from session
        const sessionResponse = await fetch('/api/auth/session');
        const userData = await sessionResponse.json();

        const newComment = {
            comment_id: Date.now(),
            content,
            username: userData.username,
            user_picture: userData.picture,
            created_at: new Date().toISOString(),
            replies: []
        };
        setLocalComments(prev => [newComment, ...prev]);
        await createComment(post.post_id, content);
        setCommentCount(prev => +prev + 1);
    };

    const handleReply = async (commentId, content) => {
        // Get current user's data from session
        const sessionResponse = await fetch('/api/auth/session');
        const userData = await sessionResponse.json();

        const newReply = {
            comment_id: Date.now(),
            content,
            username: userData.username,
            user_picture: userData.picture,
            created_at: new Date().toISOString()
        };

        const updateComments = prev => prev.map(comment => {
            if (comment.comment_id === commentId) {
                return {
                    ...comment,
                    replies: [...(comment.replies || []), newReply]
                };
            }
            return comment;
        });

        setLocalComments(updateComments);
        await createReply(post.post_id, commentId, content);
        setCommentCount(prev => +prev + 1);
    };

    return (
        <div className="flex flex-col gap-4 w-[600px] bg-white dark:bg-neutral-900 p-4 rounded-lg shadow-md">
            <div className="flex gap-2">
                <Image src={post.picture}
                    className="rounded-full"
                    width={24}
                    height={24} alt="partirUnBesoYUnaFlor"/>
                <Link href={`/profile/${post.username}`} className="hover:underline">
                    <span className="dark:text-gray-200">{post.username}</span>
                </Link>
                <span className="dark:text-gray-400">{"Hace "+timeAgo}</span>
            </div>

            <div className="w-full flex justify-center">
                <Image src={post.url} 
                    alt="test"
                    className="max-w-full h-auto object-contain max-h-[600px]"
                    width={600}
                    height={600}
                />
            </div>

            <div className="flex gap-2">
                <LikeButton 
                    post_id={post.post_id} 
                    user_id={user_id} 
                    isLikedInitial={isLikedInitial}
                    onLikeChange={(isLiked) => {
                        setLikeCount(prevCount => isLiked ? +prevCount + 1 : prevCount - 1);
                    }}
                />
                <Link href={`/post/${post.post_id}`}>
                    <ChatBubbleLeftIcon className="w-8"/>
                </Link>
            </div>
            <span className="dark:text-gray-200">{likeCount} Me gusta</span>

            <div>
                <p><Link href={`/profile/${post.username}`} className="hover:underline"><span className="mr-2 dark:text-gray-200">{post.username}</span></Link><span className="dark:text-gray-300">{post.content}</span></p>
            </div>

            <CommentInput onSubmit={handleAddComment} placeholder="Añade un comentario..." />

            {localComments.length > 0 && (
                <div className="mt-4">
                    {localComments.map((comment) => (
                        <Comment
                            key={comment.comment_id}
                            comment={comment}
                            onReply={handleReply}
                            user={{
                                picture: post.picture,
                                name: post.username
                            }}
                        />
                    ))}
                </div>
            )}
            {commentCount > 0 && (
                <div>
                    <Link href={`/post/${post.post_id}`} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                        <p>Ver {commentCount} {commentCount == 1 ? 'comentario' : 'comentarios'}</p>
                    </Link>
                </div>
            )}
        </div>
    )
}