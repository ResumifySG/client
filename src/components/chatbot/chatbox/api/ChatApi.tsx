// src/api/chatApi.ts

import { Message } from '../types';

export const chatApi = async (messages: Message[], fields: any, callback: (message: Message) => void): Promise<void> => {
  try {
    const formattedMessages = messages.map(message => ({
      role: message.sender,
      content: message.text,
    }));

    const response = await fetch('https://resumify-backend.onrender.com/api/chat', {
    // const response = await fetch('http://localhost:10000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages: formattedMessages, fields }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.messages && data.messages.length > 0) {
        const assistantMessage = data.messages[data.messages.length - 1];
		console.log("Replied:", assistantMessage.content)
        callback({ id: Date.now(), text: assistantMessage.content, sender: 'assistant' });
      } else {
        console.error('Unexpected response format:', data);
      }
    } else {
      console.error('Error:', response.statusText);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};