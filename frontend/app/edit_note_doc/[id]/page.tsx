import { getSession, get_a_note, update_notes } from '@/actions'
import React from 'react'
import ClientComponent from '@/app/components/ClientComponent'
import { marked } from 'marked'

const markdownToHtml = (markdown: string): string => {
    const result = marked(markdown)
    console.log(result)
    return result
}

const Page = async ({ params }: { params: { id: number } }) => {
    try {
        const session = await getSession()
        const noteSessions = session.noteSessions

        const id = Number(params.id)
        const note = noteSessions.find((item) => item.id === id)

        if (!note) {
            return <p>Note not found or content is missing</p>
        }
        const content = await get_a_note(id)

        return (
            <ClientComponent initialContent={markdownToHtml(content)} onSave={update_notes} id={id}/>
        )
    } catch (error) {
        console.error('Error fetching session or note:', error)
        return <p>Error loading note</p>
    }
}

export default Page