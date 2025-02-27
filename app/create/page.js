'use client'
import { createPost } from "../lib/actions"
import ImageSelector from "../ui/imageSelector"
import { useState } from "react"

export default () => {
    const [isSend, setIsSend] = useState(false)
    
    async function handleSend(e) {
        e.preventDefault()
        if (isSend) return;
        try {
            setIsSend(true)
            const formData = new FormData(e.target)
            await createPost(formData)
        } catch (error) {
            console.error('Error creating post:', error)
            setIsSend(false)
        }
    }
    
    return(
        <form onSubmit={handleSend} className="flex flex-col gap-8 items-center justify-center w-full">
            <input 
                name="content" 
                required 
                disabled={isSend}
                className="w-full max-w-lg dark:bg-neutral-950 outline-none disabled:opacity-50 disabled:cursor-not-allowed" 
                placeholder="¿Que estás pensando?"
            />
            <ImageSelector/>
            <input 
                disabled={isSend} 
                type="submit" 
                value='Enviar imagen'
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:bg-gray-400"
            />
        </form>
    )
}
