'use server'

import { put } from "@vercel/blob"
import { sql } from "@vercel/postgres"
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth0 } from "@/app/lib/auth0";


export async function createPost(formData) {
    const user_id = (await auth0.getSession()).user.user_id;

    const {url} = await put('media',formData.get('media'),{ access: 'public'});

    const content = formData.get('content');
    await sql`INSERT INTO POSTS(content, url, user_id) VALUES(${formData.get('content')}, ${url}, ${user_id})`

    revalidatePath('/');
    redirect('/');
}

export async function insertLike(user_id, post_id) {
    sql `INSERT INTO LIKES (user_id, post_id) VALUES ( 
        ${user_id},
        ${post_id}
    )`
}

export async function removeLike(user_id, post_id) {
    sql `DELETE FROM LIKES
    WHERE post_id = ${post_id} AND user_id = ${user_id}`
}

export async function createComment(post_id, content) {
    const user_id = (await auth0.getSession()).user.user_id;
    await sql`INSERT INTO COMMENTS (content, user_id, post_id) 
    VALUES (${content}, ${user_id}, ${post_id})`;
    revalidatePath(`/post/${post_id}`);
}

export async function createReply(post_id, parent_id, content) {
    const user_id = (await auth0.getSession()).user.user_id;
    await sql`INSERT INTO COMMENTS (content, user_id, post_id, parent_id) 
    VALUES (${content}, ${user_id}, ${post_id}, ${parent_id})`;
    revalidatePath(`/post/${post_id}`);
}