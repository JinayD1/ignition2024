import Link from 'next/link'
import React from 'react'

const NoteDoc = (props: {name: string, id: number}) => {
  return (
        <div style={{borderStyle: 'solid', borderColor: 'black', borderRadius: '10px', borderWidth: '4px', width: '100px', height: '200px'}}>
            <p>{props.name}</p>
        </div>
  )
}

export default NoteDoc