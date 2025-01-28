import { sql } from "@vercel/postgres";

export async function getPosts(params) {

    return (await sql`SELECT * FROM POSTS`).rows    
}