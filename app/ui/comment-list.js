'use client'

import { useState } from 'react'
import Image from 'next/image'
import CommentInput from './comment-input'

const Comment = ({ comment, onReply }) => {
    const [showReplyInput, setShowReplyInput] = useState(false)

    return (
        <div className="ml-4 mt-2">
            <div className="flex items-start gap-2">
                <Image 
                    src={comment.user_picture || '/default-avatar.png'}
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
                        <span className="text-xs text-gray-500">{comment.created_at}</span>
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