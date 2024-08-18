import { NextResponse } from 'next/server';
import { getIronSession, IronSession } from 'iron-session';
import { SessionData, sessionOptions } from '../../../lib';
import { getSession } from '@/actions';


export async function POST(req: Request) {
    try {
        const session = await getSession();

        if (!session.logged_in) {
            return new NextResponse(JSON.stringify({ error: 'User not logged in' }), { status: 401 });
        }

        const { session: updatedSession } = await req.json();

        // Update session data
        session.noteSessions = updatedSession.noteSessions || session.noteSessions;
        session.userId = updatedSession.userId || session.userId;
        session.email = updatedSession.email || session.email;

        await session.save();
        console.log(session)
        return new NextResponse(JSON.stringify({ message: 'Session updated successfully' }), { status: 200 });
    } catch (error) {
        console.error('Error updating session:', error);
        return new NextResponse(JSON.stringify({ error: 'An unexpected error occurred' }), { status: 500 });
    }
}