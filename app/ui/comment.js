'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import CommentInput from './comment-input'

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

export default function Comment({ comment, onReply, user }) {
    const [replyingTo, setReplyingTo] = useState(null)
    const [optimisticReplies, setOptimisticReplies] = useState([])
    const [replies, setReplies] = useState([])
    const [showReplies, setShowReplies] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        async function fetchReplies() {
            if (!comment.comment_id) return;
            
            try {
                const response = await fetch(`/api/replies?parentId=${comment.comment_id}`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch replies: ${response.status}`);
                }
                
                const data = await response.json();
                if (data && Array.isArray(data.replies)) {
                    setReplies(data.replies);
                    setError(null);
                } else {
                    setReplies([]);
                    setError('No replies available');
                }
            } catch (error) {
                console.error('Error fetching replies:', error);
                setError('Failed to load replies');
                setReplies([]);
            }
        }

        if (showReplies) {
            fetchReplies();
        }
    }, [comment.comment_id, showReplies]);

    const handleReply = async (commentId, content, parentComment) => {
        const tempReply = {
            comment_id: `temp-${Date.now()}`,
            content,
            created_at: new Date().toISOString(),
            user_picture: user?.picture,
            username: user?.name,
            isOptimistic: true
        }

        setOptimisticReplies(prev => [...prev, tempReply])
        setShowReplies(true)

        try {
            await onReply(comment.comment_id, content)
            // Keep the optimistic reply visible until page refresh
        } catch (error) {
            setOptimisticReplies(prev => prev.filter(reply => reply.comment_id !== tempReply.comment_id))
            console.error('Error creating reply:', error)
        }
    }

    const allReplies = [...replies, ...optimisticReplies]

    return (
        <div className="mt-4">
            <div className="flex items-start gap-2">
                <Image 
                    src={comment.user_picture}
                    width={24}
                    height={24}
                    className="rounded-full"
                    alt={`${comment.username}'s avatar`}
                />
                <div className="flex-1">
                    <div className="flex gap-2 items-baseline">
                        <span className="font-semibold text-sm dark:text-gray-200">{comment.username}</span>
                        <p className="text-sm dark:text-gray-300">{comment.content}</p>
                    </div>
                    <div className="flex gap-4 mt-1">
                        <button 
                            className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            onClick={() => setReplyingTo(replyingTo === 'main' ? null : 'main')}
                        >
                            Responder
                        </button>
                        <span className="text-xs text-gray-500 dark:text-gray-400">Hace {getTimeAgo(comment.created_at)}</span>
                    </div>
                    {replyingTo === 'main' && (
                        <div className="mt-2">
                            <CommentInput 
                                onSubmit={(content) => {
                                    handleReply(comment.comment_id, content, comment)
                                    setReplyingTo(null)
                                }}
                                placeholder="Escribe una respuesta..."
                                parentComment={comment}
                            />
                        </div>
                    )}
                </div>
            </div>
            {(allReplies.length > 0 || comment.reply_count > 0) && (
                <div className="ml-8 mt-2">
                    {error && !showReplies ? null : (
                        showReplies && (
                            <div className="border-l-2 border-gray-200 dark:border-gray-700 pl-4">
                                {allReplies.map((reply) => (
                                    <div key={reply.comment_id} className="mt-2">
                                        <div className="flex items-start gap-2">
                                            <Image 
                                                src={reply.user_picture}
                                                width={20}
                                                height={20}
                                                className="rounded-full"
                                                alt={`${reply.username}'s avatar`}
                                            />
                                            <div className="flex-1">
                                                <div className="flex gap-2 items-baseline">
                                                    <span className="font-semibold text-sm dark:text-gray-200">{reply.username}</span>
                                                    <p className="text-sm dark:text-gray-300">{reply.content}</p>
                                                </div>
                                                <div className="flex gap-4 mt-1">
                                                    <button 
                                                        className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                                        onClick={() => setReplyingTo(replyingTo === reply.comment_id ? null : reply.comment_id)}
                                                    >
                                                        Responder
                                                    </button>
                                                    <span className="text-xs text-gray-500 dark:text-gray-400">Hace {getTimeAgo(reply.created_at)}</span>
                                                </div>
                                                {replyingTo === reply.comment_id && (
                                                    <div className="mt-2">
                                                        <CommentInput 
                                                            onSubmit={(content) => {
                                                                handleReply(comment.comment_id, content, reply)
                                                                setReplyingTo(null)
                                                            }}
                                                            placeholder="Escribe una respuesta..."
                                                            parentComment={reply}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )
                    )}
                    <button
                        onClick={() => setShowReplies(!showReplies)}
                        className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 flex items-center gap-1 mt-2"
                    >
                        {showReplies ? (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                                Ocultar respuestas
                            </>
                        ) : (
                            <>
                                {comment.reply_count > 0 ? `Ver ${comment.reply_count} ${comment.reply_count === 1 ? 'respuesta' : 'respuestas'}` : 'Responder'}
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </>
                        )}
                    </button>
                </div>
            )}
        </div>
    )
}