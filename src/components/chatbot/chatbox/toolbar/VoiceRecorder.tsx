import React, { useState, useEffect } from 'react';
import { IconButton, Tooltip, CircularProgress, Box, Typography } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';
import { styled, keyframes } from '@mui/system';

const pulseAnimation = keyframes`
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
`;

const RecordingText = styled(Typography)`
  color: #f44336;
  animation: ${pulseAnimation} 1s infinite;
`;

const TranscribingText = styled(Typography)`
  color: #2196f3;
`;

interface VoiceRecorderProps {
  setTranscribedText: (text: string) => void;
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ setTranscribedText }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [isTranscribing, setIsTranscribing] = useState(false);

  useEffect(() => {
    if (isRecording) {
      startSpeechRecognition();
    } else {
      stopSpeechRecognition();
    }
  }, [isRecording]);

  useEffect(() => {
    return () => {
      if (mediaRecorder) {
        mediaRecorder.stop();
        mediaRecorder.stream.getTracks().forEach(track => track.stop()); // ensure all tracks are stopped
      }
    };
  }, [mediaRecorder]);

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

  const startSpeechRecognition = () => {
    navigator.mediaDevices.getUserMedia({ audio: true })
    .then((stream) => {
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);
      recorder.start();
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          transcribeAudio(event.data);
        }
      };
    })
    .catch((error) => {
      console.log('Error accessing microphone:', error);
    });
  };

  const stopSpeechRecognition = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setMediaRecorder(null);
    }
  };

  const transcribeAudio = async (audioBlob: Blob) => {
    setIsTranscribing(true);
    const formData = new FormData();
    formData.append('file', audioBlob, 'recording.wav');
    try {
    //   const response = await fetch('https://resumify-backend.onrender.com/api/transcribe', {
      const response = await fetch('https://resumify-backend.onrender.com/api/transcribe', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      setTranscribedText(data.transcription);
    } catch (error) {
      console.log('Error transcribing audio:', error);
    }
    setIsTranscribing(false);
  };

  return (
    <Box display="flex" alignItems="center">
      <Tooltip title={isRecording ? 'Stop Recording' : 'Start Recording'}>
        <IconButton
          onClick={toggleRecording}
          color="primary"
          disabled={isTranscribing}
        >
          {isTranscribing ? (
            <CircularProgress size={24} />
          ) : isRecording ? (
            <StopIcon />
          ) : (
            <MicIcon />
          )}
        </IconButton>
      </Tooltip>
      <Box ml={1}>
        {isRecording && (
          <RecordingText variant="body2">
            Recording...
          </RecordingText>
        )}
        {isTranscribing && (
          <TranscribingText variant="body2">
            Transcribing...
          </TranscribingText>
        )}
      </Box>
    </Box>
  );
};

export default VoiceRecorder;
