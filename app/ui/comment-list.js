'use client'

import { useState } from 'react'
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

const Comment = ({ comment, onReply }) => {
    const [showReplyInput, setShowReplyInput] = useState(false)

    return (
        <div className="ml-4 mt-2">
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
                        <span className="font-semibold text-sm">{comment.username}</span>
                        <p className="text-sm">{comment.content}</p>
                    </div>
                    <div className="flex gap-4 mt-1">
                        <button 
                            className="text-xs text-gray-500 hover:text-gray-700"
                            onClick={() => setShowReplyInput(!showReplyInput)}
                        >
                            Responder
                        </button>
                        <span className="text-xs text-gray-500">Hace {getTimeAgo(comment.created_at)}</span>
                    </div>
                    {showReplyInput && (
                        <div className="mt-2">
                            <CommentInput 
                                onSubmit={(content) => {
                                    onReply(comment.comment_id, content)
                                    setShowReplyInput(false)
                                }}
                                placeholder="Escribe una respuesta..."
                            />
                        </div>
                    )}
                </div>
            </div>
            {comment.replies && comment.replies.length > 0 && (
                <div className="ml-8 mt-2">
                    {comment.replies.map((reply) => (
                        <Comment key={reply.comment_id} comment={reply} onReply={onReply} />
                    ))}
                </div>
            )}
        </div>
    )
}

export default function CommentList({ comments = [], onAddComment, onReply }) {
    return (
        <div className="mt-4">
            <CommentInput onSubmit={onAddComment} placeholder="Añade un comentario..." />
            <div className="mt-4">
                {comments.map((comment) => (
                    <Comment 
                        key={comment.comment_id} 
                        comment={comment} 
                        onReply={onReply}
                    />
                ))}
            </div>
        </div>
    )
}