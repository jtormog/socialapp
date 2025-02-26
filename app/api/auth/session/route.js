import { auth0 } from '@/app/lib/auth0';
import { getUserLogged } from '@/app/lib/data';

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

        // Get user data from database
        const userData = await getUserLogged(session.user.email);
        
        if (!userData) {
            return new Response(JSON.stringify({ error: 'User not found in database' }), {
                status: 404,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        // Return combined session and database user data
        return new Response(JSON.stringify({
            ...userData,
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