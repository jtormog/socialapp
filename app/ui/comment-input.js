'use client'

import { useState } from 'react'

export default function CommentInput({ onSubmit, placeholder, parentComment }) {
    const [content, setContent] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        if (content.trim()) {
            // If there's a parent comment, we'll keep its parent_id (if any) or use its own comment_id
            const finalContent = parentComment ? `@${parentComment.username} ${content}` : content;
            onSubmit(finalContent)
            setContent('')
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex gap-2">
            <input
                type="text"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={placeholder}
                className="flex-1 dark:bg-neutral-900 outline-none"
            />
            <button
                type="submit"
                disabled={!content.trim()}
                className="text-sm text-blue-500 font-semibold disabled:hidden"
            >
                Publicar
            </button>
        </form>
    )
}