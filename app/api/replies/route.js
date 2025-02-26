import { getReplies } from "@/app/lib/data";

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const parentId = searchParams.get('parentId');

    if (!parentId) {
        return Response.json({ message: 'Parent comment ID is required' }, { status: 400 });
    }

    try {
        const data = await getReplies(parentId);
        return Response.json(data);
    } catch (error) {
        console.error('Error fetching replies:', error);
        return Response.json(
            { message: 'Internal server error while fetching replies' },
            { status: 500 }
        );
    }
}