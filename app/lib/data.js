import { sql } from "@vercel/postgres";

export async function getPostsByContent(searchText) {
    try {
        const result = await sql`
            SELECT 
                p.post_id,
                p.content,
                p.url,
                p.created_at,
                u.username,
                u.picture,
                COUNT(DISTINCT l.like_id) as num_likes,
                COUNT(DISTINCT c.comment_id) as num_comments
            FROM posts p
            LEFT JOIN users u ON p.user_id = u.user_id
            LEFT JOIN likes l ON p.post_id = l.post_id
            LEFT JOIN comments c ON p.post_id = c.post_id
            WHERE LOWER(p.content) LIKE LOWER(${'%' + searchText + '%'})
            GROUP BY p.post_id, p.content, p.url, p.created_at, u.username, u.picture
            ORDER BY p.created_at DESC
        `;
        return result.rows;
    } catch (error) {
        console.error('Error fetching posts by content:', error);
        throw new Error('Failed to fetch posts');
    }
}

export async function getUserById(user_id) {
    if (!user_id) {
        console.error('No user_id provided to getUserById');
        return null;
    }

    try {
        const result = await sql`
            SELECT user_id, username, email, picture,
                   (SELECT COUNT(*) FROM POSTS WHERE user_id = USERS.user_id) as post_count,
                   (SELECT COUNT(*) FROM LIKES WHERE user_id = USERS.user_id) as like_count
            FROM USERS
            WHERE user_id = ${user_id}
        `;

        if (!result || !result.rows || result.rows.length === 0) {
            console.log('No user found with id:', user_id);
            return null;
        }

        return result.rows[0];
    } catch (error) {
        console.error('Database error in getUserById:', error);
        throw new Error('Failed to fetch user data');
    }
}

export async function getUserLogged(email) {
    if (!email) {
        console.error('No email provided to getUserLogged');
        return null;
    }

    try {
        const result = await sql`
            SELECT user_id, username, email, picture,
                   (SELECT COUNT(*) FROM POSTS WHERE user_id = USERS.user_id) as post_count,
                   (SELECT COUNT(*) FROM LIKES WHERE user_id = USERS.user_id) as like_count
            FROM USERS
            WHERE email = ${email}
        `;

        if (!result || !result.rows || result.rows.length === 0) {
            console.log('No user found with email:', email);
            return null;
        }

        return result.rows[0];
    } catch (error) {
        console.error('Database error in getUserLogged:', error);
        throw new Error('Failed to fetch user data');
    }
}

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
    ORDER BY 
        POSTS.created_at DESC
    `).rows;
}

export async function getUserPosts(username) {
    if (!username) {
        console.error('No username provided to getUserPosts');
        return [];
    }

    try {
        return (await sql`SELECT 
            POSTS.post_id, 
            POSTS.content, 
            url, 
            POSTS.user_id, 
            USERS.picture,
            USERS.username, 
            POSTS.created_at,
            count(DISTINCT LIKES.user_id) as num_likes,
            count(DISTINCT CASE WHEN COMMENTS.parent_id IS NULL THEN COMMENTS.comment_id END) as num_comments
        FROM 
            POSTS 
            JOIN USERS USING(user_id) 
            LEFT JOIN LIKES USING(post_id)
            LEFT JOIN COMMENTS USING(post_id)
        WHERE 
            USERS.username = ${username}
        GROUP BY 
            POSTS.post_id, 
            POSTS.content, 
            url, 
            USERS.picture,
            POSTS.user_id, 
            USERS.username
        ORDER BY 
            POSTS.created_at DESC
        `).rows;
    } catch (error) {
        console.error('Error fetching user posts:', error);
        return [];
    }
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
            u.picture,
            u.username,
            POSTS.created_at,
            count(DISTINCT LIKES.user_id) as num_likes,
            count(DISTINCT CASE WHEN COMMENTS.parent_id IS NULL THEN COMMENTS.comment_id END) as num_comments
        FROM 
            POSTS 
            JOIN USERS u ON POSTS.user_id = u.user_id
            LEFT JOIN LIKES USING(post_id)
            LEFT JOIN COMMENTS USING(post_id)
        WHERE 
            post_id=${post_id}
        GROUP BY 
            POSTS.post_id, 
            POSTS.content, 
            url,
            u.picture,
            POSTS.user_id, 
            u.username 
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
export async function getUserLikedPosts(username) {
    if (!username) {
        console.error('No username provided to getUserLikedPosts');
        return [];
    }

    try {
        return (await sql`SELECT 
            POSTS.post_id, 
            POSTS.content, 
            url, 
            POSTS.user_id, 
            u.picture,
            u.username, 
            POSTS.created_at,
            count(DISTINCT l.user_id) as num_likes,
            count(DISTINCT CASE WHEN COMMENTS.parent_id IS NULL THEN COMMENTS.comment_id END) as num_comments
        FROM 
            POSTS 
            JOIN USERS u ON POSTS.user_id = u.user_id
            LEFT JOIN LIKES l ON POSTS.post_id = l.post_id
            LEFT JOIN COMMENTS ON POSTS.post_id = COMMENTS.post_id
            JOIN USERS liker ON l.user_id = liker.user_id
        WHERE 
            liker.username = ${username}
        GROUP BY 
            POSTS.post_id, 
            POSTS.content, 
            url, 
            u.picture,
            POSTS.user_id, 
            u.username
        ORDER BY 
            POSTS.created_at DESC
        `).rows;
    } catch (error) {
        console.error('Error fetching user liked posts:', error);
        return [];
    }
}

export async function getUser(username) {
    try {
        const user = (await sql`
            SELECT user_id, username, email, picture,
                   (SELECT COUNT(*) FROM POSTS WHERE user_id = USERS.user_id) as post_count,
                   (SELECT COUNT(*) FROM LIKES WHERE user_id = USERS.user_id) as like_count
            FROM USERS
            WHERE username = ${username}
        `).rows[0];
        return user || null;
    } catch (error) {
        console.error('Error fetching user:', error);
        return null;
    }
}