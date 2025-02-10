import { sql } from "@vercel/postgres"

export default async () => {

    await sql`DROP TABLE IF EXISTS LIKES, USERS, POSTS`
    
    await sql`CREATE TABLE IF NOT EXISTS USERS(
        user_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        username text,
        name text,
        picture text,
        email text UNIQUE
    )`;
    
    await sql`CREATE TABLE IF NOT EXISTS POSTS(
    post_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    content TEXT,
    url TEXT,
    user_id UUID REFERENCES USERS(user_id)
    )`;

    await sql`CREATE TABLE IF NOT EXISTS LIKES (
        user_id UUID REFERENCES USERS(user_id),
        post_id UUID REFERENCES POSTS(post_id),
        PRIMARY KEY (user_id, post_id)
    )`;

    return <p>Database seed the guay</p>
}
