import React from 'react'
import NoteDoc from './NoteDoc'
import { getSession } from '@/actions'

const NoteDocList = async () => {
    const session = await getSession()
    return (
        <div>
            {session.noteSessions && session.noteSessions.map(doc => <NoteDoc name={doc.name} id={doc.id}/>)}
        </div>
    )
}

export default NoteDocList