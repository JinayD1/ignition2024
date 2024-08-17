"use client"
import React, { use, useState } from 'react'
import { getSession } from '@/actions'

const NewNoteSession = () => {
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
    }
    return (
        <div>
            {showNoteSessionForm && 
            <>
                <form onSubmit={ (e) => {
                    e.preventDefault()
                    createNoteSession()
                }}>
                    <input type="text" value={noteName} onChange={e => setNoteName(e.target.value)}/>
                    <button type='submit'>Create</button>
                </form>
                <button onClick={() => setShowNoteSessionForm(false)}>Cancel</button>
                <p>{message}</p>
            </>
            }
            <form onSubmit={(e) => {
                e.preventDefault()
                setShowNoteSessionForm(true)
                }}>
                <button type='submit'>Create Note Session</button>
            </form>
        </div>
    )
}

export default NewNoteSession