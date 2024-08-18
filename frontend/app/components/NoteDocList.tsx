import React from 'react'
import NoteDoc from './NoteDoc'
import { getSession } from '@/actions'
import Link from 'next/link'

const NoteDocList = async () => {
    const session = await getSession()
    return (
        <div>
            {session.noteSessions && session.noteSessions.map(doc => <Link href={`/edit_note_doc/${doc.id}`}><NoteDoc name={doc.name} id={doc.id}/></Link>)}
        </div>
    )
}

export default NoteDocList