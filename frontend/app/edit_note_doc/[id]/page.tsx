import { getSession, get_a_note, update_notes } from '@/actions'
import React from 'react'
import ClientComponent from '@/app/components/ClientComponent'
import { markdownToHtml } from '@/actions'

const Page = async ({ params }: { params: { id: number } }) => {
    try {
        const session = await getSession();
        const noteSessions = session.noteSessions;

        const id = Number(params.id);
        const note = noteSessions.find((item) => item.id === id);

        if (!note) {
            return <p>Note not found or content is missing</p>;
        }

        // Wait for the content to be fetched and resolved
        const content = await get_a_note(id);
        const markdownContent = await markdownToHtml(content);

        return (
            <ClientComponent initialContent={markdownContent} onSave={update_notes} id={id}/>
        );
    } catch (error) {
        console.error('Error fetching session or note:', error);
        return <p>Error loading note</p>;
    }
};
export default Page