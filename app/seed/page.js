import { sql } from "@vercel/postgres"

export default async () => {

    await sql`DROP TABLE IF EXISTS LIKES, USERS, POSTS`
    
    await sql`CREATE TABLE IF NOT EXISTS USERS(
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        username text,
        name text,
        picture text,
        email text UNIQUE
    )`;
    
    await sql`CREATE TABLE IF NOT EXISTS POSTS(
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    content TEXT,
    url TEXT
    )`;

    await sql`CREATE TABLE IF NOT EXISTS LIKES (
        user_id UUID REFERENCES USERS(id),
        post_id UUID REFERENCES POSTS(id),
        PRIMARY KEY (user_id, post_id)
    )`;

    return <p>Database seed the guay</p>
}
