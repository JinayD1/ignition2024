import { SessionOptions } from "iron-session"

export const envSite = process.env.SITE_URL
export interface SessionData {
    userId?:number,
    email?: string
    logged_in?: boolean,
    noteSessions?: { id:number, name:string}[],
}

export const defaultSession:SessionData = {
    logged_in: false
}

export const sessionOptions: SessionOptions = {
    password: process.env.SECRET_KEY!,
    cookieName: "upnotes-ai-session",
    cookieOptions: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
    }
}
