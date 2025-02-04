import { sql } from "@vercel/postgres";

export async function getPosts() {

    return (await sql`SELECT * FROM POSTS`).rows    
}

export async function getLikes(user_id) {
    return (await sql`SELECT post_id FROM LIKES
        WHERE user_id = ${user_id}`).rows
}