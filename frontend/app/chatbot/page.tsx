// "use client"
// import React, { useState } from 'react';
// import './chatbot.css';
// import { chat_bot } from '@/actions';

// const Chatbot = async () => {
//   const [messages, setMessages] = useState([
//     { text: 'Hello! How can I assist you today?', sender: 'bot' }
//   ]);
//   const [input, setInput] = useState('');

//   const handleSend = async () => {
//     if (input.trim() === '') return;

//     const userMessage = { text: input, sender: 'user' };
//     setMessages([...messages, userMessage]);

//     // Simulate a bot response
//     const bot_response = await chat_bot(userMessage.text)
//     const botMessage = { text: bot_response, sender: 'bot' };
//     setMessages(prevMessages => [...prevMessages, botMessage]);

//     setInput('');
//   };

//   const handleInputChange = (e) => {
//     setInput(e.target.value);
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter') {
//       handleSend();
//     }
//   };

//   return (
//     <div className="chatbot-container">
//       <div className="chatbot-header">
//         <h2>Chatbot</h2>
//       </div>
//       <div className="chatbot-messages">
//         {messages.map((msg, index) => (
//           <div key={index} className={`chatbot-message ${msg.sender}`}>
//             {msg.text}
//           </div>
//         ))}
//       </div>
//       <div className="chatbot-input">
//         <input
//           type="text"
//           value={input}
//           onChange={handleInputChange}
//           onKeyPress={handleKeyPress}
//           placeholder="Type a message..."
//         />
//         <button onClick={handleSend}>Send</button>
//       </div>
//     </div>
//   );
// };

// export default Chatbot;

"use client";
import React, { useState } from 'react';
import './chatbot.css';
import { chat_bot } from '@/actions';

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState([
    { text: 'Hello! How can I assist you today?', sender: 'bot' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = async () => {
    if (input.trim() === '') return;

    const userMessage = { text: input, sender: 'user' };
    setMessages([...messages, userMessage]);

    try {
      // Simulate a bot response
      const bot_response = await chat_bot(userMessage.text);
      const botMessage = { text: bot_response, sender: 'bot' };
      setMessages(prevMessages => [...prevMessages, botMessage]);
    } catch (error) {
      console.error('Error fetching bot response:', error);
      const errorMessage = { text: 'Sorry, there was an error.', sender: 'bot' };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    }

    setInput('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <h2>Chatbot</h2>
      </div>
      <div className="chatbot-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`chatbot-message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
      </div>
      <div className="chatbot-input">
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default Chatbot;