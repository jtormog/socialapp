import { sql } from "@vercel/postgres";


export async function getPosts() {
    return (await sql`SELECT 
        POSTS.post_id, 
        POSTS.content, 
        url, 
        POSTS.user_id, 
        picture,
        username, 
        POSTS.created_at,
        count(DISTINCT LIKES.user_id) as num_likes,
        count(DISTINCT CASE WHEN COMMENTS.parent_id IS NULL THEN COMMENTS.comment_id END) as num_comments
    FROM 
        POSTS 
        JOIN USERS USING(user_id) 
        LEFT JOIN LIKES USING(post_id)
        LEFT JOIN COMMENTS USING(post_id)
    GROUP BY 
        POSTS.post_id, 
        POSTS.content, 
        url, 
        picture,
        POSTS.user_id, 
        username
`).rows
}

export async function getPost(post_id) {
    if (!post_id) {
        console.error('Invalid post_id provided to getPost');
        return null;
    }

    try {
        const post = (await sql`SELECT 
            POSTS.post_id, 
            POSTS.content, 
            url, 
            POSTS.user_id,
            picture,
            username,
            POSTS.created_at,
            count(DISTINCT LIKES.user_id) as num_likes,
            count(DISTINCT CASE WHEN COMMENTS.parent_id IS NULL THEN COMMENTS.comment_id END) as num_comments
        FROM 
            POSTS 
            JOIN USERS USING(user_id) 
            LEFT JOIN LIKES USING(post_id)
            LEFT JOIN COMMENTS USING(post_id)
        WHERE 
            post_id=${post_id}
        GROUP BY 
            POSTS.post_id, 
            POSTS.content, 
            url,
            picture,
            POSTS.user_id, 
            username 
        `).rows[0];

        if (!post) {
            console.error(`Post not found with id: ${post_id}`);
            return null;
        }

        const comments = await getPostComments(post_id);
        post.comments = comments?.comments || [];
        post.total_comments = comments?.total || 0;

        return post;
    } catch (error) {
        console.error('Error fetching post:', error);
        return null;
    }
}

export async function getLikes(user_id) {
    return (await sql`SELECT post_id FROM LIKES
        WHERE user_id = ${user_id}`).rows
}

export async function getLike(user_id, post_id) {
    return (await sql`SELECT post_id FROM LIKES WHERE user_id = ${user_id} AND post_id=${post_id}`).rows;
}

export async function getPostComments(post_id, limit = 5, offset = 0) {
    const total_comments = (await sql`SELECT COUNT(*) FROM COMMENTS WHERE post_id = ${post_id} AND parent_id IS NULL`).rows[0].count;

    const comments = (await sql`
        SELECT
            c.comment_id,
            c.content,
            c.created_at,
            c.user_id,
            u.username,
            u.picture as user_picture,
            (SELECT COUNT(*) FROM COMMENTS replies WHERE replies.parent_id = c.comment_id) as reply_count
        FROM COMMENTS c
        JOIN USERS u ON c.user_id = u.user_id
        WHERE c.post_id = ${post_id} AND c.parent_id IS NULL
        ORDER BY c.created_at DESC
        LIMIT ${limit} OFFSET ${offset}`).rows;

    return {
        comments,
        total: parseInt(total_comments),
        hasMore: offset + limit < total_comments
    };
}

export async function getReplies(parent_id) {
    const total = (await sql`SELECT COUNT(*) FROM COMMENTS WHERE parent_id = ${parent_id}`).rows[0].count;
    const replies = (await sql`
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

    return {
        replies,
        total: parseInt(total)
    };
}