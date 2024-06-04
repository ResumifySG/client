import React, { useState, useEffect } from 'react';
import { Box, Typography, Avatar, keyframes } from '@mui/material';
import { deepPurple, grey } from '@mui/material/colors';
import TypingArea from './TypingArea';
import ChatToolbar from './ChatToolbar';
import { chatApi } from './api/ChatApi';
import { Message } from './types';
import DOMPurify from 'dompurify';

const typing = keyframes`
  0% {
    transform: translateY(0);
  }
  33.3% {
    transform: translateY(-4px);
  }
  66.6% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(0);
  }
`;

const TypingIndicator: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
      <Box sx={{ flexShrink: 0, mr: 2 }}>
        <img src="/static/assets/headshotchloe.PNG" alt="AI" style={{ width: 40, height: 40, borderRadius: '50%' }} />
      </Box>
      <Box sx={{ display: 'flex' }}>
        <Box sx={{ width: 8, height: 8, backgroundColor: 'text.primary', opacity: 0.7, borderRadius: '50%', mr: 0.5, animation: `${typing} 1s infinite` }} />
        <Box sx={{ width: 8, height: 8, backgroundColor: 'text.primary', opacity: 0.7, borderRadius: '50%', mr: 0.5, animation: `${typing} 1s infinite 0.2s` }} />
        <Box sx={{ width: 8, height: 8, backgroundColor: 'text.primary', opacity: 0.7, borderRadius: '50%', animation: `${typing} 1s infinite 0.4s` }} />
      </Box>
    </Box>
  );
};

const ChatBox: React.FC<{ fields: any, setValue: any }> = ({ fields, setValue }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [isAiTyping, setIsAiTyping] = useState(false);

  useEffect(() => {
    const loadedMessages = localStorage.getItem('chatMessages');
    if (loadedMessages) {
      setMessages(JSON.parse(loadedMessages));
      setLoaded(true);
    } else {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (loaded) {
        localStorage.setItem('chatMessages', JSON.stringify(messages));
      }
    };
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    if (content.trim() === '') return;
    const userMessage: Message = { id: Date.now(), text: content, sender: 'user' };
    setMessages((prev) => [...prev, userMessage]);
    setIsAiTyping(true);

    await chatApi([...messages, userMessage], fields, (response: Message) => {
      // Extract the update content from the response text
      const updateMatch = response.text.match(/<update>([\s\S]*?)<\/update>/);
      if (updateMatch) {
        const updateContent = updateMatch[1];
        const parsedUpdate = JSON.parse(updateContent);

        // Update the fields with the parsedUpdate content
        for (const key in parsedUpdate) {
          if (parsedUpdate.hasOwnProperty(key)) {
            setValue(key, parsedUpdate[key]);
          }
        }

        // Remove the <update> tag from the response text and add a notification about the update
        const updatedText = response.text.replace(/<update>[\s\S]*<\/update>/, '<code>[Information has been updated]</code>');
        response = { ...response, text: updatedText };
      }

      setMessages((prev) => [...prev, response]);
      setIsAiTyping(false);
    });
  };

  return (
    <div style={{ height: 600, width: '100%', position: 'relative', display: 'flex', flexDirection: 'column', paddingTop: 20 }}>
      <Box sx={{
        flexGrow: 1,
        maxHeight: '100%',
        overflowY: 'auto',
        backgroundColor: grey[100],
        borderRadius: '10px',
        padding: 2,
        ...(messages.length === 0 && {
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }),
      }}>
        {messages.length > 0 ? (
          <>
            {messages.map((message) => (
              <Box
                key={message.id}
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  mb: 2,
                }}
              >
                <Box sx={{ flexShrink: 0, mr: 2 }}>
                  {message.sender === 'user' ? (
                    <Avatar sx={{
                      bgcolor: deepPurple[500],
                      width: 40,
                      height: 40,
                    }}>
                      U
                    </Avatar>
                  ) : (
                    <img src="/static/assets/headshotchloe.PNG" alt="AI" style={{ width: 40, height: 40, borderRadius: '50%' }} />
                  )}
                </Box>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                    <span dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(message.text) }} />
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {new Date(message.id).toLocaleString()}
                  </Typography>
                </Box>
              </Box>
            ))}
            {isAiTyping && <TypingIndicator />}
          </>
        ) : (
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
            <Avatar sx={{
              width: 120,
              height: 120,
              mb: 2,
            }}>
              <img src="/static/assets/headshotchloe.PNG" alt="Welcome" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </Avatar>
            <Typography variant="h6" sx={{ color: 'black' }}>
              Stuck? Ask Chloe for help!
            </Typography>
          </Box>
        )}
      </Box>
      <ChatToolbar
        onSendMessage={handleSendMessage}
        setMessages={setMessages}
        messages={messages}
      />
    </div>
  );
};

export default ChatBox;
