import React from 'react'
import NewNoteSession from '../components/NewNoteSession'
import { getSession } from '@/actions'
import NoteDoc from '../components/NoteDoc'
import NoteDocList from '../components/NoteDocList'

const page = async () => {
    
    return (
        <div>
            <NewNoteSession/>
            <NoteDocList/>
        </div>
    )
}

export default page