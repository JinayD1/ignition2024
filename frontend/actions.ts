"use server"
import { getIronSession } from "iron-session"
import { SessionData, defaultSession, sessionOptions } from "./lib"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import TurndownService from 'turndown'

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
        .then(async (res) => {
            if (res.error) {
                console.log(res.error)
            }
            else {
                let response = await fetch('http://192.168.2.66:5000/get_notes', {
                    method: "POST",
                    headers: {
                    'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ userId: res.User })})
                .then(response => response.json())
                .then((response) => {
                    if (!response.error) {
                        console.log(response)
                        const notes = response.map((doc:{ id:number | string, name:string }) => {
                            return doc.content ? { id: doc.id, name: doc.name, content: doc.content } : { id: doc.id, name: doc.name, content: 'empty document' }
                        })
                        session.noteSessions = notes
                        console.log(notes)
                    }
                })
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

const turndownService = new TurndownService()

const htmlToMarkdown = (html: string): string => {
    const result = turndownService.turndown(html)
    console.log(result)
    return result
}

export const update_notes = async (id: number, content: string) => {
    const session = await getSession()
    let res = await fetch(`http://192.168.2.66:5000/update_notes/${id}`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content: htmlToMarkdown(content) })})
        .then(res => res.json())
        .then(res => {
            if (res.error) {
                console.log(res.error)
            } else {
                console.log(res.message)
                return res.message
            }
        })

}
