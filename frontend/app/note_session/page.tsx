import React from 'react'
import NewNoteSession from '../components/NewNoteSession'
import { getSession } from '@/actions'
import NoteDoc from '../components/NoteDoc'

const page = async () => {
    
    const session = await getSession()
    return (
        <div>
            <NewNoteSession/>
            {session.noteSessions && session.noteSessions.map(doc => <NoteDoc name={doc.name} id={doc.id}/>)}

        </div>
    )
}

export default page