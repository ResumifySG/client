// src/components/toolbar/TextToSpeech.tsx
import React, { useState, useEffect, useRef } from 'react';
import { IconButton, Tooltip, CircularProgress } from '@mui/material';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import StopIcon from '@mui/icons-material/Stop';

interface TextToSpeechProps {
  latestAiMessage: string;
}

const TextToSpeech: React.FC<TextToSpeechProps> = ({ latestAiMessage }) => {
  const [isReadingText, setIsReadingText] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const latestMessageRef = useRef('');

  useEffect(() => {
    if (isReadingText && latestAiMessage && latestAiMessage !== latestMessageRef.current) {
      latestMessageRef.current = latestAiMessage;
      const fetchAudio = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const response = await fetch('https://resumify-backend.onrender.com/api/speech', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: latestAiMessage }),
          });

          if (response.ok) {
            const audioBlob = await response.blob();
            const audioUrl = URL.createObjectURL(audioBlob);
            const audio = new Audio(audioUrl);
            setAudioElement(audio);
            audio.play();
          } else {
            setError('Error fetching audio. Please try again.');
          }
        } catch (error) {
          setError('Error fetching audio. Please try again.');
        }
        setIsLoading(false);
      };

      fetchAudio();
    }
  }, [isReadingText, latestAiMessage]);

  const toggleReadText = () => {
    if (isReadingText) {
      stopReading();
    }
    setIsReadingText(!isReadingText);
  };

  const stopReading = () => {
    if (audioElement) {
      audioElement.pause();
      audioElement.currentTime = 0;
      setAudioElement(null);
    }
  };

  return (
    <>
      <Tooltip title={isReadingText ? 'Reading On' : 'Reading Off'}>
        <IconButton
          onClick={toggleReadText}
          color="primary"
          disabled={isLoading}
          aria-label={isReadingText ? 'Reading Off' : 'Reading On'}
        >
          {isReadingText ? <VolumeUpIcon /> : <VolumeOffIcon />}
        </IconButton>
      </Tooltip>
      {isReadingText && (
        <Tooltip title="Stop Reading">
          <IconButton
            onClick={stopReading}
            color="primary"
            disabled={isLoading}
            aria-label="Stop Reading"
          >
            {isLoading ? <CircularProgress size={24} /> : <StopIcon />}
          </IconButton>
        </Tooltip>
      )}
      {error && <p>{error}</p>}
    </>
  );
};

export default TextToSpeech;