import { getPostComments } from "@/app/lib/data";

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const postId = searchParams.get('postId');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '5');
        const offset = (page - 1) * limit;

        if (!postId) {
            return new Response(JSON.stringify({ error: 'Post ID is required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const comments = await getPostComments(postId, limit, offset);
        
        return new Response(JSON.stringify(comments), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error fetching comments:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}