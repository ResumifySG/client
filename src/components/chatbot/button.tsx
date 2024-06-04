import React, { useState } from 'react';
import { Box, Button, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ChatBox from './chatbox/ChatBox';

export default function ChatbotButton({ fields, setValue }) {
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState("");

    const toggleChat = () => setIsOpen(!isOpen);

    return (
		<Box sx={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1000 }}>
			{!isOpen && (
				<Button variant="contained" color="primary" onClick={toggleChat} sx={{fontSize: '1.2rem', p: 2}}>
					Ask Chloe 👧
				</Button>
			)}

			{isOpen && (
				<Box sx={{
					position: 'fixed', 
					width: '100%', 
					height: '100%', 
					top: 0, 
					left: 0, 
					backgroundColor: 'rgba(0, 0, 0, 0.5)',
					display: 'flex', 
					alignItems: 'center', 
					justifyContent: 'center'
				}}>
					<Box sx={{
						width: 800,
						minHeight: 600,
						bgcolor: 'background.paper',
						borderRadius: 1,
						p: 4,
						position: 'relative'
					}}>
						<IconButton 
							sx={{ position: 'absolute', top: 8, right: 8 }}
							onClick={toggleChat}
						>
							<CloseIcon />
						</IconButton>
						<ChatBox fields = {{ fields }} setValue={setValue} />
					</Box>
				</Box>
			)}
		</Box>
    );
}