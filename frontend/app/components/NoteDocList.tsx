import React from 'react'
import NoteDoc from './NoteDoc'
import { getSession } from '@/actions'
import Link from 'next/link'
import "./NoteDocList.css"

const NoteDocList = async () => {
    const session = await getSession()
    return (
        <div className="note-doc-list-container">
            <header className="note-doc-list-header">
                <h1 className="note-doc-list-title">My Note Sessions</h1>
            </header>
            <div className="note-doc-grid">
                {session.noteSessions && session.noteSessions.length > 0 ? (
                    session.noteSessions.map(doc => <NoteDoc key={doc.id} name={doc.name} id={doc.id} />)
                ) : (
                    <p className="no-docs-message">No note sessions found. Create one to get started!</p>
                )}
            </div>
        </div>
    )
}

export default NoteDocList
