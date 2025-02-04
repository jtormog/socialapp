import { Auth0Client } from "@auth0/nextjs-auth0/server"
import { sql } from "@vercel/postgres";

export const auth0 = new Auth0Client({
    async beforeSessionSaved(session, idToken) {
        const { nickname, name, picture, email } = session.user;
    

        try {
            await sql`INSERT INTO USERS (USERNAME, NAME, PICTURE, EMAIL) 
            VALUES(${nickname}, ${name}, ${picture}, ${email} )`;
        } catch (e) {
            console.log(e);
        }

        const user_id = (await sql`SELECT id FROM USERS WHERE email=${email}`).rows[0].id

        return {
            ...session,
            user :{
                ...session.user,
                id: user_id,
            },
        }

    }

})