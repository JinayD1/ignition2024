"use client";
import React, { useState, useEffect } from 'react';
import NoteDocListButtonated from '../components/NoteDocListButtons';
import { getSession, get_a_note } from '@/actions';

const Page: React.FC = () => {
    const [notes, setNotes] = useState<string>('');
    const [quiz, setQuiz] = useState<{ question: string, options: string[] }[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [docSelector, setDocSelector] = useState<boolean>(false);
    const [selectedDoc, setSelectedDoc] = useState<string>('')

    useEffect(() => {
        console.log("docSelector state:", docSelector);
    }, [docSelector]);

    async function generateQuiz(id: number) {
        const session = await getSession()
        const notes = await get_a_note(id)
        try {
            const response = await fetch('http://192.168.2.66:5000/generate_quiz', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ notes }),
            });

            const data: { quiz?: { question: string, options: string[] }[], error?: string } = await response.json();

            if (data.quiz) {
                setQuiz(data.quiz);
                setError(null);
            } else if (data.error) {
                setError(data.error);
                setQuiz([]);
            }
        } catch (err) {
            setError('An unexpected error occurred');
            setQuiz([]);
        }
    }

    return (
        <div>
            <h1>Prep Quiz Generator</h1>
            <form onSubmit={(e) => {
                e.preventDefault();
                setDocSelector(true);
            }}>
                <button type="submit">Select Note Document</button>
            </form>
            {docSelector &&
                <form onSubmit={(e) => {
                    e.preventDefault()
                    generateQuiz(parseInt(selectedDoc))
                    }}>
                    <NoteDocListButtonated handleChange={setSelectedDoc} State={selectedDoc}/>
                    <button type='submit'>Generate Quiz</button>
                </form>
            }

            {error && <div className="error">Error: {error}</div>}

            <div id="quizContainer" className="quiz-container" style={{ display: quiz.length > 0 ? 'block' : 'none' }}>
                {quiz.map((q, index) => (
                    <div key={index} className="quiz-item">
                        <div className="question">
                            Q{index + 1}: {q.question}
                        </div>
                        <div className="options">
                            {q.options.map((option, optionIndex) => (
                                <div key={optionIndex} className="option">
                                    {option}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Page;