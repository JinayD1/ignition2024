// import React from 'react'

// const page = () => {
//     async function generateQuiz() {
//         const notes = document.getElementById('notesInput').value;
//         const response = await fetch('/generate_quiz', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({ notes }),
//         });
//         const data = await response.json();

//             if (data.quiz) {
//                 const quizContainer = document.getElementById('quizContainer');
//                 quizContainer.style.display = 'block';
//                 quizContainer.innerHTML = '';
//                 data.quiz.forEach((q, index) => {
//                     const questionDiv = document.createElement('div');
//                     questionDiv.className = 'question';
//                     questionDiv.textContent = `Q${index + 1}: ${q.question}`;

//                     const optionsDiv = document.createElement('div');
//                     optionsDiv.className = 'options';

//                     q.options.forEach(option => {
//                         const optionDiv = document.createElement('div');
//                         optionDiv.className = 'option';
//                         optionDiv.textContent = option;
//                         optionsDiv.appendChild(optionDiv);
//                     });

//                     quizContainer.appendChild(questionDiv);
//                     quizContainer.appendChild(optionsDiv);
//                 });
//             } else if (data.error) {
//                 alert('Error: ' + data.error);
//             }
//         }

//     return (
//         <div>
//             <h1>Prep Quiz Generator</h1>
//             <textarea id="notesInput" placeholder="Enter your notes here..."></textarea>
//             <br/>
//             <button onClick={generateQuiz}>Generate Quiz</button>

//             <div id="quizContainer" className="quiz-container" style={{display: 'none'}}></div>
//         </div>
//     )
// }

// export default page
"use client"
import React, { useState } from 'react';

const Page: React.FC = () => {
    const [notes, setNotes] = useState<string>('');
    const [quiz, setQuiz] = useState<{ question: string, options: string[] }[]>([]);
    const [error, setError] = useState<string | null>(null);

    async function generateQuiz() {
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
            <textarea
                id="notesInput"
                placeholder="Enter your notes here..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
            />
            <br />
            <button onClick={generateQuiz}>Generate Quiz</button>

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