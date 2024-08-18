// import React, { useEffect, useState } from 'react'
// import NoteDoc from './NoteDoc'
// import { getSession } from '@/actions'

// const NoteDocListButtonated: React.FC = (props:{handleChange:(e:MouseEvent) => void, State: string}) => {
//     const [noteDocs, setNoteDocs] = useState<{ id: number, name: string }[]>([]);
//     const [loading, setLoading] = useState<boolean>(true);
//     const [error, setError] = useState<string | null>(null);

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const session = await getSession();
//                 if (session.noteSessions) {
//                     setNoteDocs(session.noteSessions);
//                 }
//             } catch (error) {
//                 setError('Failed to fetch documents.');
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchData();
//     }, []);

//     if (loading) {
//         return <div>Loading...</div>;
//     }

//     if (error) {
//         return <div>Error: {error}</div>;
//     }

//     return (
//         <div>
//             <select id="note_docs" onSelect={(e) => props.handleChange(e.target.value)} value={props.State}>
//                 {noteDocs.length > 0 ? (
//                     noteDocs.map(doc => (
//                         <option className={`${doc.id}`} value={doc.id}>{doc.name}</option>
//                     ))
                    
//                 ) : (
//                     <div>No documents available.</div>
//                 )}
//             </select>
//         </div>
//     );
// }

// export default NoteDocListButtonated;

import React, { useEffect, useState } from 'react';
import { getSession } from '@/actions';

interface NoteDoc {
    id: number;
    name: string;
}

interface NoteDocListButtonatedProps {
    handleChange: (value: string) => void;
    State: string;
}

const NoteDocListButtonated: React.FC<NoteDocListButtonatedProps> = ({ handleChange, State }) => {
    const [noteDocs, setNoteDocs] = useState<NoteDoc[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const session = await getSession();
                if (session.noteSessions) {
                    setNoteDocs(session.noteSessions);
                }
            } catch (error) {
                setError('Failed to fetch documents.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <select id="note_docs" onChange={(e) => handleChange(e.target.value)} value={State}>
                {noteDocs.length > 0 ? (
                    noteDocs.map(doc => (
                        <option key={doc.id} value={doc.id.toString()}>
                            {doc.name}
                        </option>
                    ))
                ) : (
                    <option>No documents available.</option>
                )}
            </select>
        </div>
    );
};

export default NoteDocListButtonated;