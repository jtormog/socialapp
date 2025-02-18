'use client'

import { useState } from 'react'

export default function CommentInput({ onSubmit, placeholder }) {
    const [content, setContent] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        if (content.trim()) {
            onSubmit(content)
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
                className="flex-1 dark:bg-neutral-950 outline-none"
            />
            <button
                type="submit"
                disabled={!content.trim()}
                className="text-sm text-blue-500 font-semibold disabled:opacity-50"
            >
                Publicar
            </button>
        </form>
    )
}