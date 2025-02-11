import Link from "next/link"

export default ({children}) => {
    return(
        <>
        <div className="flex gap-4 w-full items-center justify-center">
            <Link href="/profile">Perfil</Link>
            <Link href="/profile/likes">Me gusta</Link>
            <Link href="/profile/comments">Comentarios</Link>
        </div>
        {children}
        </>
    )


}