import { createPost } from "../lib/actions"
import ImageSelector from "../ui/imageSelector"

export default () => {
    return(
        <form action={createPost} className="flex flex-col gap-8 items-center justify-center w-full" >
            <input name="content" className="w-full max-w-lg"/>
            <ImageSelector />
            <input type="submit"/>
        </form>
    )
}