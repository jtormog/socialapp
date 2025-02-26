'use client'
import { useState } from "react";
import { ChatBubbleLeftIcon } from "@heroicons/react/24/outline"
import CommentInput from "./comment-input"
import Image from "next/image"
import LikeButton from "./like-button";
import Comment from "./comment";
import { createComment, createReply } from "../lib/actions";
import { useRouter } from "next/navigation";


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

export default function PostDetail({user_id, post, isLikedInitial, comments}) {
    const timeAgo = getTimeAgo(post.created_at);
    const [likeCount, setLikeCount] = useState(post.num_likes || 0);
    const [displayedComments, setDisplayedComments] = useState(comments?.comments || []);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(comments?.total > displayedComments.length);

    const handleAddComment = async (content) => {
        const tempId = `temp-${Date.now()}`;
        const newComment = {
            comment_id: tempId,
            content,
            username: post.username,
            user_picture: post.picture,
            created_at: new Date().toISOString(),
            replies: [],
            isOptimistic: true
        };
        setDisplayedComments(prev => [newComment, ...prev]);
        
        try {
            await createComment(post.post_id, content);
            // Refresh comments to get the real comment ID
            const response = await fetch(`/api/comments?postId=${post.post_id}&page=1&limit=5`);
            const newComments = await response.json();
            
            if (!response.ok) throw new Error('Failed to fetch comments');
            
            setDisplayedComments(newComments.comments);
            setPage(1);
            setHasMore(newComments.hasMore);
        } catch (error) {
            console.error('Error creating comment:', error);
            setDisplayedComments(prev => prev.filter(comment => comment.comment_id !== tempId));
        }
    };

    const handleReply = async (commentId, content) => {
        // Skip reply if the parent comment is an optimistic update
        const parentComment = displayedComments.find(c => c.comment_id === commentId);
        if (parentComment?.isOptimistic) {
            console.warn('Cannot reply to an optimistic comment');
            return;
        }

        const tempId = `temp-reply-${Date.now()}`;
        const newReply = {
            comment_id: tempId,
            content,
            username: post.username,
            user_picture: post.picture,
            created_at: new Date().toISOString(),
            isOptimistic: true
        };

        // Add optimistic reply
        setDisplayedComments(prev => prev.map(comment => {
            if (comment.comment_id === commentId) {
                return {
                    ...comment,
                    replies: [...(comment.replies || []), newReply]
                };
            }
            return comment;
        }));

        try {
            await createReply(post.post_id, commentId, content);
            
            // Refresh the comments to get the new reply
            const response = await fetch(`/api/comments?postId=${post.post_id}&page=1&limit=5`);
            const newComments = await response.json();
            
            if (!response.ok) throw new Error('Failed to fetch comments');
            
            setDisplayedComments(newComments.comments);
            setPage(1);
            setHasMore(newComments.hasMore);
        } catch (error) {
            console.error('Error creating reply:', error);
            // Remove optimistic reply on error
            setDisplayedComments(prev => prev.map(comment => {
                if (comment.comment_id === commentId) {
                    return {
                        ...comment,
                        replies: (comment.replies || []).filter(reply => reply.comment_id !== tempId)
                    };
                }
                return comment;
            }));
        }
    };

    const router = useRouter();

    const loadMoreComments = async () => {
        try {
            const url = new URL('/api/comments', window.location.origin);
            url.searchParams.append('postId', post.post_id);
            url.searchParams.append('page', (page + 1).toString());
            url.searchParams.append('limit', '5');

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const newComments = await response.json();
            setDisplayedComments(prev => [...prev, ...newComments.comments]);
            setPage(page + 1);
            setHasMore(newComments.hasMore);
        } catch (error) {
            console.error('Error loading comments:', error);
        }
    };

    return (
        <div className="flex flex-col gap-4 w-[600px] bg-white dark:bg-neutral-900 p-4 rounded-lg shadow-md">
            <div className="flex gap-2">
                <Image src={post.picture}
                    className="rounded-full"
                    width={24}
                    height={24} alt="partirUnBesoYUnaFlor"/>
                <span className="dark:text-gray-200">{post.username}</span>
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
                <ChatBubbleLeftIcon className="w-8"/>
            </div>
            <span className="dark:text-gray-200">{likeCount} Me gusta</span>

            <div>
                <p><span className="mr-2 dark:text-gray-200">{post.username}</span><span className="dark:text-gray-300">{post.content}</span></p>
            </div>

            <CommentInput onSubmit={handleAddComment} placeholder="Añade un comentario..." />

            {displayedComments.length > 0 && (
                <hr className="border-gray-200 dark:border-gray-700 my-4" />
            )}

            <div>
                {displayedComments.map((comment) => (
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
                {hasMore && (
                    <button 
                        onClick={loadMoreComments}
                        className="mt-4 text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-semibold"
                    >
                        Cargar más comentarios
                    </button>
                )}
            </div>
        </div>
    )
}