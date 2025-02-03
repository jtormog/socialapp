import { sql } from "@vercel/postgres"

export default async () => {
    
    await sql`CREATE TABLE IF NOT EXISTS USERS(
        user_id UUID DEFAULT uuid_generate_V4() PRIMARY KEY,
        username text,
        name text,
        picture text,
        email text UNIQUE
    )`;
    
    await sql`CREATE TABLE IF NOT EXISTS POSTS(
    post_id UUID DEFAULT uuid_generate_V4() PRIMARY KEY,
    content TEXT,
    url TEXT 
    )`;

    await sql`CREATE TABLE IF NOT EXISTS LIKES (
        user_id UUID,
        post_id UUID
    )`

    return <p>Database seed the guay</p>
}
