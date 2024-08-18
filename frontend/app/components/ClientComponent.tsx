'use client'

import React, { useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import 'react-quill/dist/quill.snow.css'
import TurndownService from 'turndown'
import { marked } from 'marked'
import "./ClientComponent.css"
import { htmlToMarkdown, markdownToHtml } from '@/actions'

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })

const MarkdownEditor: React.FC<{ id: number, initialContent: string, onSave: (id: number, content: string) => void }> = ({ id, initialContent, onSave }) => {
    const [content, setContent] = useState<string>(initialContent)
    const [editContent, setEditContent] = useState<string>(content)
    const [isEditing, setIsEditing] = useState<boolean>(false)
    
    const handleSave = useCallback(() => {
        setContent(editContent)
        onSave(id, editContent)
        setIsEditing(false)
    }, [editContent, onSave, id])

    const handleChange = (value: string) => {
        setEditContent(value)
    }

    return (
        <div className="markdown-editor">
            {isEditing ? (
                <div className="editor-container">
                    <div className="toolbar">
                        <button className="toolbar-button" onClick={handleSave}>Save</button>
                        <button className="toolbar-button" onClick={() => {
                            setEditContent(content)
                            setIsEditing(false)
                        }}>Cancel</button>
                        <button className="toolbar-button" onClick={() => markdownToHtml(editContent)}>M to H</button>
                        <button className="toolbar-button" onClick={() => htmlToMarkdown(editContent)}>H to M</button>
                    </div>
                    <ReactQuill
                        value={editContent}
                        onChange={handleChange}
                        modules={editorModules}
                        theme="snow"
                        className="quill-editor"
                    />
                </div>
            ) : (
                <div className="preview-container">
                    <div className="content-preview" dangerouslySetInnerHTML={{ __html: content }} />
                    <button className="edit-button" onClick={() => setIsEditing(true)}>Edit</button>
                </div>
            )}
        </div>
    )
}

const editorModules = {
    toolbar: [
        [{ 'header': [1, 2, 3, false] }],
        [{ 'size': ['small', false, 'large', 'huge'] }], // Custom font size option
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'align': [] }],
        ['link', 'image'],
        ['clean']
    ]
}

export default MarkdownEditor