'use server'

import { put } from "@vercel/blob"
import { sql } from "@vercel/postgres"

export async function createPost(formData) {
    const {url} = await put('media',formData.get('media'),{ access: 'public'});

    sql`INSERT INTO POSTS(content, url) VALUES(${formData.get('content')}, ${url})`
}

export async function insertLike(user_id, post_id) {
    sql `INSERT INTO LIKES (user_id, post_id) VALUES ( 
        ${user_id},
        ${post_id}
    )`
}

export async function removeLike(user_id, post_id) {
    sql `REMOVE FROM LIKE
    WHERE post_id = ${post_id} AND user_id = ${user_id}`
}