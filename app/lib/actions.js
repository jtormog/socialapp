'use server'

import { put } from "@vercel/blob"
import { sql } from "@vercel/postgres"

export async function createPost(formData) {
    const {url} = await put('media',formData.get('media'),{ access: 'public'});

    sql`INSERT INTO POSTS(content, url) VALUES(${formData.get('content')}, ${url})`
}