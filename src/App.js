import React, { useState, useEffect } from "react";
import './App.css';

function App() {
  const [message, setMessage] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:3001');
    
    ws.onopen = () => {
      console.log('WebSocket connection established.');
      setSocket(ws);
    };

    ws.onmessage = (event) => {
      const receivedMessage = JSON.parse(event.data);
      setMessage(prevMessages => [...prevMessages, receivedMessage]);
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed.');
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, []);

  const sendMessage = () => {
    if (messageInput.trim() !== '' && socket && socket.readyState === WebSocket.OPEN) {
      const message = {
        text: messageInput,
        timestamp: new Date().toISOString(),
      };
      socket.send(JSON.stringify(message));
      setMessageInput('');
    } else {
      console.log('WebSocket is not open or socket is null. Message not sent.');
    }
  };

  return (
    <div className="App">
      <div className="chat-container">
        <div className="chat-message">
          {message.map((msg, index) => (
            <div key={index} className="message">
              {msg.text}
            </div>
          ))}
        </div>
        <div className="chat-input">
          <input
            type="text"
            placeholder="Type your message..."
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default App;
