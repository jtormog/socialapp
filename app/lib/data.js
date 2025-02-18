import { sql } from "@vercel/postgres";

export async function getPosts() {
    return (await sql`SELECT 
        POSTS.post_id, 
        content, 
        url, 
        POSTS.user_id, 
        picture,
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
        picture,
        POSTS.user_id, 
        username
`).rows
}

export async function getPost(post_id) {
    const post = (await sql`SELECT 
        POSTS.post_id, 
        content, 
        url, 
        POSTS.user_id,
        picture,
        username,
        created_at,
        count(LIKES.user_id) as num_likes 
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
        picture,
        POSTS.user_id, 
        username 
`).rows[0];

    if (post) {
        post.comments = await getPostComments(post_id);
    }

    return post;
}

export async function getLikes(user_id) {
    return (await sql`SELECT post_id FROM LIKES
        WHERE user_id = ${user_id}`).rows
}

export async function getLike(user_id, post_id) {
    return (await sql`SELECT post_id FROM LIKES WHERE user_id = ${user_id} AND post_id=${post_id}`).rows;
}

export async function getPostComments(post_id) {
    const comments = await sql`
        SELECT 
            c.comment_id,
            c.content,
            c.created_at,
            c.user_id,
            u.username,
            u.picture as user_picture
        FROM COMMENTS c
        JOIN USERS u ON c.user_id = u.user_id
        WHERE c.post_id = ${post_id}
        AND c.parent_id IS NULL
        ORDER BY c.created_at DESC
    `;
    for (const comment of comments.rows) {
        comment.replies = await getReplies(comment.comment_id);
    }

    return comments.rows;
}

async function getReplies(parent_id) {
    return (await sql`
        SELECT 
            c.comment_id,
            c.content,
            c.created_at,
            c.user_id,
            u.username,
            u.picture as user_picture
        FROM COMMENTS c
        JOIN USERS u ON c.user_id = u.user_id
        WHERE c.parent_id = ${parent_id}
        ORDER BY c.created_at ASC
    `).rows;
}