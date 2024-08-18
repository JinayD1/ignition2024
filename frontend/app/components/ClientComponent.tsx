'use client'

import React, { useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import 'react-quill/dist/quill.snow.css'
import TurndownService from 'turndown'
import { marked } from 'marked'
import "./ClientComponent.css"

// Turndown (HTML --> Markdown)
const turndownService = new TurndownService()

const htmlToMarkdown = (html: string): string => {
    const result = turndownService.turndown(html)
    console.log(result)
    return result
}

// const html = '<p style="color: red;"><strong>Hello</strong> <em>World</em></p>'
// const markdown = htmlToMarkdown(html)
// console.log(markdown) 

// marked (Markdown --> HTML)
const markdownToHtml = async (markdown: string): Promise<string> => {
    const result = await marked(markdown);
    console.log(result);
    return result;
}

// const markdown2 = '**Hello** *World*'
// const html2 = markdownToHtml(markdown)
// console.log(html) // Outputs: <strong>Hello</strong> <em>World</em>

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })

const MarkdownEditor: React.FC<{ id: number, initialContent: string, onSave: (id: number, content: string) => void }> = ({ id, initialContent, onSave }) => {
    const [content, setContent] = useState<string>(initialContent)
    const [editContent, setEditContent] = useState<string>(content)
    const [isEditing, setIsEditing] = useState<boolean>(false)
    
    const handleSave = useCallback(() => {
        setContent(editContent)
        console.log(editContent)
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
        [{ 'font': [] }],
        [{ 'size': ['small', false, 'large', 'huge'] }], // Custom font size option
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'align': [] }],
        ['link', 'image'],
        ['clean']
    ]
}

export default MarkdownEditor
