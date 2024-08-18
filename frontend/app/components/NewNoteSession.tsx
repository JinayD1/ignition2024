"use client"
import React, { use, useState } from 'react'
import { getSession } from '@/actions'
import "./NewNoteSession.css"
import { useRouter } from 'next/navigation'

const NewNoteSession = () => {
    const router = useRouter()
    const [showNoteSessionForm, setShowNoteSessionForm] = useState(false)
    const [noteName, setNoteName] = useState('')
    const [message, setMessage] = useState('')
    
    const createNoteSession = async () => {
        const session = await getSession()
        const userId = session.userId
        const reqJson = await fetch('http://192.168.2.66:5000/create_note', {
            method: "POST",
            headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: noteName, userId })})
        .then(reqJson => reqJson.json())
        .then(resdata => {
            if (resdata.message) {
                setMessage(resdata.message)
            } else {
                setMessage(resdata.error)
            }
        })
        const newNote = { id: userId, name: noteName };
        session.noteSessions = [...(session.noteSessions || []), newNote];
        try {
            await fetch('/api/updateSession', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ session })
            });
    
            setMessage('Note created and session updated successfully!');
            router.refresh()
        } catch (error) {
            console.error('Error creating note session:', error);
            setMessage('An unexpected error occurred. Session was not updated');
        }
    }
    return (
        <div className="note-session-container">
            {showNoteSessionForm && 
            <>
                <form className="note-form" onSubmit={(e) => {
                    e.preventDefault()
                    createNoteSession()
                }}>
                    <input 
                        type="text" 
                        className="note-input"
                        value={noteName} 
                        onChange={e => setNoteName(e.target.value)}
                        placeholder="Enter note session name"
                    />
                    <button type='submit' className="submit-button">Create</button>
                    <button onClick={() => setShowNoteSessionForm(false)} className="cancel-button">Cancel</button>
                </form>
                {message && <p className="message">{message}</p>}
            </>
            }
            {!showNoteSessionForm &&
                <button onClick={() => setShowNoteSessionForm(true)} className="create-button">
                    Create Note Session
                </button>
            }
        </div>
    )
}

export default NewNoteSession
