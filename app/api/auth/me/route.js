import { auth0 } from "@/app/lib/auth0.js";

export async function GET() {
    try {
        const session = await auth0.getSession();
        
        if (!session || !session.user) {
            return new Response(JSON.stringify({ error: 'Not authenticated' }), {
                status: 401,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        // Return only necessary user information
        return new Response(JSON.stringify({
            email: session.user.email,
            name: session.user.name,
            picture: session.user.picture
        }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.error('Session error:', error);
        return new Response(JSON.stringify({ error: 'Internal server error' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}