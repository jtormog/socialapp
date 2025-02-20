'use client'
import { HeartIcon } from "@heroicons/react/20/solid";
import { insertLike, removeLike } from "../lib/actions";
import clsx from "clsx";
import { useState } from "react";

export default ({ post_id, user_id, isLikedInitial, onLikeChange }) => {
    const [isLiked, setIsLiked] = useState(isLikedInitial);

    function toggleLike(){
        const newLikedState = !isLiked;
        if (newLikedState){
            insertLike(user_id, post_id);
        }else{
            removeLike(user_id, post_id);
        }
        setIsLiked(newLikedState);
        onLikeChange?.(newLikedState)
    }

    return (
        <HeartIcon onClick={toggleLike} className={clsx('w-8', {'text-red-500' : isLiked})}/>
    )
}