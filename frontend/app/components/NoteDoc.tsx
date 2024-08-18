import Link from 'next/link'
import React from 'react'
import './NoteDoc.css' 

const NoteDoc = (props: {name: string, id: number}) => {
  return (
    <div className="note-doc-container">
      <Link href={`/edit_note_doc/${props.id}`} className="note-doc-link">
        <div className="note-doc">
          <p className="note-doc-name">{props.name}</p>
        </div>
      </Link>
    </div>
  )
}

export default NoteDoc
