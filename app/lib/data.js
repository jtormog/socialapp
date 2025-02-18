import { sql } from "@vercel/postgres";

export async function getPosts() {

    return (await sql`SELECT 
        POSTS.post_id, 
        content, 
        url, 
        POSTS.user_id, 
        username, 
        created_at,
        count(LIKES.user_id) as num_likes 
    FROM 
        POSTS 
        JOIN USERS USING(user_id) 
        LEFT JOIN LIKES USING(post_id)
    GROUP BY 
        POSTS.post_id, 
        content, 
        url, 
        POSTS.user_id, 
        username
`).rows
}

export async function getPost(post_id) {
    return (await sql`SELECT 
        POSTS.post_id, 
        content, 
        url, 
        POSTS.user_id, 
        username, 
        created_at,
        count(*) as num_likes 
    FROM 
        POSTS 
        JOIN USERS USING(user_id) 
        LEFT JOIN LIKES USING(post_id)
    WHERE 
        post_id=${post_id}
    GROUP BY 
        POSTS.post_id, 
        content, 
        url, 
        POSTS.user_id, 
        username 
`).rows;
}



export async function getLikes(user_id) {
    return (await sql`SELECT post_id FROM LIKES
        WHERE user_id = ${user_id}`).rows
}

export async function getLike(user_id, post_id) {
    return (await sql`SELECT post_id FROM LIKES WHERE user_id = ${user_id} AND post_id=${post_id}`).rows;
}