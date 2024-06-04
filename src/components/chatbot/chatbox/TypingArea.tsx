// src/components/TypingArea.tsx

import React, { useState, useEffect } from 'react';
import { Box, TextField, IconButton, CircularProgress } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

interface TypingAreaProps {
  onSendMessage: (message: string) => Promise<void>;
  transcribedText: string;
  setTranscribedText: (text: string) => void;
  isRecording: boolean;
}

const TypingArea: React.FC<TypingAreaProps> = ({ 
  onSendMessage,
  transcribedText,
  setTranscribedText,
  isRecording
}) => {
  const [input, setInput] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);

  useEffect(() => {
    setInput(prevInput => prevInput + transcribedText);
    setTranscribedText('');
  }, [transcribedText, setTranscribedText]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (input.trim() === '') return; // Prevent sending empty messages

    setIsSending(true); // Start sending process
    await onSendMessage(input);
    setInput(''); // Clear input after sending
    setIsSending(false); // Reset sending state
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 1 }}>
      <TextField
        variant="outlined"
		multiline
        maxRows={3}
        placeholder="Good Morning Chloe!"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        disabled={isSending || isRecording}
		sx={{
			width: '100%'
		}}
      />
      <IconButton type="submit" color="primary" aria-label="send" disabled={isSending || input.trim() === '' || isRecording}>
        {isSending ? <CircularProgress size={24} /> : <SendIcon />}
      </IconButton>
    </Box>
  );
};

export default TypingArea;