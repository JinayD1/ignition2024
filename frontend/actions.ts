"use server"
import { getIronSession } from "iron-session"
import { SessionData, defaultSession, sessionOptions } from "./lib"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export const getSession = async () => {
    const session = await getIronSession<SessionData>(cookies(), sessionOptions)


    if (!session.logged_in) {
        session.logged_in = defaultSession.logged_in;
    }
    return session;
}


export const login = async (email: string, password: string) => {
    const session = await getSession()
    let userLoginResponse = await fetch('http://192.168.2.66:5000/login', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email, password: password })})
        .then(res => res.json())
        .then((res) => {
            if (res.error) {
                console.log(res.error)
            }
            else {
                session.userId=res.User
                session.email=email
                session.logged_in=true
                session.save()
                console.log(session)
                redirect('/')
            }
        })
    } 


// export const signUpAutoLogin = async (email: string, password: string) => {
//     const session = await getSession()
    
//     const FormEmail = email;
//     const formPassword = password
//     const user = await sql`SELECT * FROM users WHERE email = ${FormEmail} AND password = ${formPassword} and verified = TRUE;`
//     if (user.rows.length === 0) {
//         return {error: 'Wrong credentials!'}
//     } else {
//         session.userId=user.rows[0].id
//         session.email=user.rows[0].email
//         session.logged_in=true
//         await session.save()
//         redirect('/')
//     }
// }

export const logout = async () => {
    const session = await getSession();
    session.destroy()
    redirect('/')
}