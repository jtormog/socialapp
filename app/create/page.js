import { createPost } from "../lib/actions"
import ImageSelector from "../ui/imageSelector"

export default () =>{
    return(
        <form action={createPost} className="flex flex-col gap-8">
            <input name="content"/>
            <ImageSelector />
            <input type="submit"/>
        </form>
    )
}