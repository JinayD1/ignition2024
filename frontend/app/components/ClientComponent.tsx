'use client'

import React, { useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import 'react-quill/dist/quill.snow.css'
import TurndownService from 'turndown'
import { marked } from 'marked'


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
const markdownToHtml = (markdown: string): string => {
    const result = marked(markdown)
    console.log(result)
    return result
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
    }, [editContent, onSave])

    const handleChange = (value: string) => {
        setEditContent(value)
    }

    return (
        <div>
            {isEditing ? (
                <div>
                    <ReactQuill
                        value={editContent}
                        onChange={handleChange}
                        modules={editorModules}
                        theme="snow"
                    />
                    <button onClick={handleSave}>Save</button>
                    <button onClick={() => {
                        setEditContent(content)
                        setIsEditing(false)
                        }}>Cancel</button>
                    <button onClick={() => markdownToHtml(editContent)}>M to H</button>
                    <button onClick={() => htmlToMarkdown(editContent)}>H to M</button>
                </div>
            ) : (
                <div>
                    <div dangerouslySetInnerHTML={{ __html: content }} />
                    <button onClick={() => setIsEditing(true)}>Edit</button>
                </div>
            )}
        </div>
    )
}

const editorModules = {
    toolbar: [
        [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        ['bold', 'italic', 'underline'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'align': [] }],
        ['link', 'image'],
        ['clean']
    ]
}

export default MarkdownEditor