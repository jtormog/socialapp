import { sql } from '@vercel/postgres';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get('q');

        if (!query) {
            return new Response(JSON.stringify({ posts: [] }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const searchQuery = `%${query}%`;
        const result = await sql`
            SELECT 
                p.post_id,
                p.content,
                p.url,
                p.created_at,
                u.username,
                u.picture,
                count(DISTINCT l.user_id) as num_likes,
                count(DISTINCT CASE WHEN c.parent_id IS NULL THEN c.comment_id END) as num_comments
            FROM posts p
            JOIN users u ON p.user_id = u.user_id
            LEFT JOIN likes l ON p.post_id = l.post_id
            LEFT JOIN comments c ON p.post_id = c.post_id
            WHERE p.content ILIKE ${searchQuery}
            GROUP BY p.post_id, p.content, p.url, p.created_at, u.username, u.picture
            ORDER BY p.created_at DESC
            LIMIT 20
        `;

        return new Response(JSON.stringify({ posts: result.rows }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Search error:', error);
        return new Response(JSON.stringify({ error: 'Failed to search posts' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}