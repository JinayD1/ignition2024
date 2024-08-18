"use client";
import React, { useState, useEffect } from 'react';
import NoteDocListButtonated from '../components/NoteDocListButtons';
import { getSession, get_a_note } from '@/actions';
import "./quizzes.css";

const Page: React.FC = () => {
    const [notes, setNotes] = useState<string>('');
    const [quiz, setQuiz] = useState<{ question: string, options: string[] }[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [docSelector, setDocSelector] = useState<boolean>(false);
    const [selectedDoc, setSelectedDoc] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        console.log("docSelector state:", docSelector);
    }, [docSelector]);

    async function generateQuiz(id: number) {
        setIsLoading(true);
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
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="quiz-generator">
            <h1 className="quiz-generator__title">Prep Quiz Generator</h1>
            <form className="quiz-generator__form" onSubmit={(e) => {
                e.preventDefault();
                setDocSelector(true);
            }}>
                <button className="quiz-generator__button" type="submit">Select Note Document</button>
            </form>
            <div className={`quiz-generator__dropdown-container ${docSelector ? 'active' : ''}`}>
                {docSelector &&
                    <form className="quiz-generator__form" onSubmit={(e) => {
                        e.preventDefault()
                        generateQuiz(parseInt(selectedDoc))
                    }}>
                        <div className="quiz-generator__dropdown">
                            <NoteDocListButtonated handleChange={setSelectedDoc} State={selectedDoc}/>
                        </div>
                        <button className="quiz-generator__button" type='submit' disabled={isLoading}>
                            {isLoading ? 'Generating...' : 'Generate Quiz'}
                        </button>
                    </form>
                }
            </div>

            {isLoading && <div className="quiz-generator__loader"></div>}

            {error && <div className="quiz-generator__error">Error: {error}</div>}

            <div id="quizContainer" className="quiz-generator__container" style={{ display: quiz.length > 0 ? 'block' : 'none' }}>
                {quiz.map((q, index) => (
                    <div key={index} className="quiz-generator__item">
                        <div className="quiz-generator__question">
                            Q{index + 1}: {q.question}
                        </div>
                        <div className="quiz-generator__options">
                            {q.options.map((option, optionIndex) => (
                                <div key={optionIndex} className="quiz-generator__option">
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
