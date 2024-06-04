// src/components/ChatToolbar.tsx
import React, { useState, useEffect } from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import TypingArea from './TypingArea';
import VoiceRecorder from './toolbar/VoiceRecorder';
import TextToSpeech from './toolbar/TextToSpeech';
import { Message } from './types';

interface ChatToolbarProps {
  onSendMessage: (message: string) => Promise<void>;
  setMessages: (messages: Message[]) => void;
  messages: Message[];
}

const ChatToolbar: React.FC<ChatToolbarProps> = ({ onSendMessage, setMessages, messages }) => {
  const [transcribedText, setTranscribedText] = useState('');

  const clearChat = () => {
    setMessages([]);
  };

  const getLatestAiMessage = () => {
    const reversedMessages = [...messages].reverse();
    const latestAiMessage = reversedMessages.find(message => message.sender === 'assistant');
    return latestAiMessage ? latestAiMessage.text : '';
  };

  return (
    <Box
      sx={{
        position: 'relative',
        bottom: 0,
        left: 0,
        right: 0,
        display: 'flex',
        flexDirection: 'column',
        padding: 1,
        backgroundColor: 'background.paper',
        borderTop: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 1 }}>
        <VoiceRecorder setTranscribedText={setTranscribedText} />
        <TextToSpeech latestAiMessage={getLatestAiMessage()} />
        <Tooltip title="Clear Chat">
          <IconButton onClick={clearChat} color="primary">
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
      <TypingArea
        onSendMessage={onSendMessage}
        transcribedText={transcribedText}
        setTranscribedText={setTranscribedText}
      />
    </Box>
  );
};

export default ChatToolbar;