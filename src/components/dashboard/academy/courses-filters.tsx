'use client'
import React from 'react';
import { Box, Button, Grid, Typography, Card, CardMedia, CardContent, createTheme, ThemeProvider } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

// Custom theme setup for modern aesthetics
const theme = createTheme({
  palette: {
    primary: {
      main: '#5c67f2',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#f4f5f7',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h4: {
      fontWeight: 600,
    },
    body1: {
      fontSize: '1.1rem',
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          transition: '0.3s',
          boxShadow: '0 8px 16px 0 rgba(0,0,0,0.2)',
          '&:hover': {
            boxShadow: '0 16px 32px 0 rgba(0,0,0,0.3)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          padding: '10px 24px',
        },
      },
    },
  },
});

const resumes = [
    { id: 1, title: 'Software Engineer Resume', name: 'John Doe', lastEdited: 'April 10, 2024', imageUrl: '/static/assets/resume1.png' },
    { id: 2, title: 'Marketing Specialist Resume', name: 'Jane Smith', lastEdited: 'March 15, 2024', imageUrl: '/static/assets/resume2.png' },
    // Add more resumes here
];

const Page = () => {
	const [resumes, setResumes] = useState([]);

	useEffect(() => {
		fetch('https://resumify-backend.onrender.com/api/resumes')
		.then(response => response.json())
		.then(data => {
			setResumes(data);  // Assuming the API returns an array of resumes
		})
		.catch(error => console.error('Error loading resumes:', error));
	}, []);

    return (
		<ThemeProvider theme={theme}>
			<Box sx={{ flexGrow: 1, m: 3, backgroundColor: theme.palette.background.default, p: 4, borderRadius: 2, fontFamily: theme.typography.fontFamily }}>
				<Typography variant="body2" component="body2" gutterBottom align="center" sx={{ fontFamily: theme.typography.fontFamily }}>
					Take a look at your resumes.
				</Typography>
				<Box display="flex" justifyContent="center" my={4}>
					<Button variant="contained" size="large" startIcon={<AddCircleOutlineIcon />} color="primary">
						Create New Resume
					</Button>
				</Box>
				<Grid container spacing={4} px={'200px'}>
					{resumes.map((resume) => (
						<Grid item key={resume.id} xs={12} sm={6} md={4}>
							<Card>
								<CardMedia
									component="img"
									height="140"
									image={resume.imageUrl}
									alt="Resume Preview"
								/>
								<CardContent>
									<Typography gutterBottom variant="h5" component="div">
										{resume.title}
									</Typography>
									<Typography variant="body2" color="text.secondary">
										{resume.name}
									</Typography>
									<Typography variant="body2" color="text.secondary">
										Last edited: {resume.lastEdited}
									</Typography>
								</CardContent>
							</Card>
						</Grid>
					))}
				</Grid>
			</Box>
		</ThemeProvider>
    );
};

export default Page;