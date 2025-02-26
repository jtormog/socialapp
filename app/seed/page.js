import { sql } from "@vercel/postgres"

export default async () => {

    await sql`SET timezone = 'UTC'`;
    
    await sql`DROP TABLE IF EXISTS COMMENTS, LIKES, USERS, POSTS`
    
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
    user_id UUID REFERENCES USERS(user_id),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    )`;

    await sql`CREATE TABLE IF NOT EXISTS LIKES (
        user_id UUID REFERENCES USERS(user_id),
        post_id UUID REFERENCES POSTS(post_id),
        PRIMARY KEY (user_id, post_id)
    )`;

    await sql`CREATE TABLE IF NOT EXISTS COMMENTS (
        comment_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        content TEXT,
        user_id UUID REFERENCES USERS(user_id),
        post_id UUID REFERENCES POSTS(post_id),
        parent_id UUID REFERENCES COMMENTS(comment_id) NULL,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    )`;

    return <p>Database seed the guay</p>
}
