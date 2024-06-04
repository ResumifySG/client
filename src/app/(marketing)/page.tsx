'use client'
import React from 'react';
import { Box, Container, Typography, Button, Divider, Grid } from '@mui/material';
import GradientText from '@/components/marketing/text/gradient';
import { MainNav } from '@/components/marketing/layout/main-nav';
import FeatureSection from './templates';
import SupportSection from './support';

// Create a custom theme
const GrayedOutLogos = () => {
  const logos = [
    "/static/assets/nyc.png",
    "/static/assets/sp.png"
  ];

  return (
    <Box sx={{ width: '100%', my: 2 }}>
      <Grid container spacing={4} alignItems="center" justifyContent="center">
        {logos.map((logo, index) => (
          <React.Fragment key={logo}>
            <Grid item>
              <img width="90" src={logo} alt={`Logo ${index + 1}`} style={{ opacity: 0.5, filter: 'grayscale(100%)', maxWidth: '100%' }} />
            </Grid>
          </React.Fragment>
        ))}
      </Grid>
    </Box>
  );
};

const FullScreenSection = ({ backgroundColor, title, height, children }) => (
  <Box sx={{
    minHeight: height || '90vh',
    backgroundColor,
    display: 'flex',
    flexDirection: 'column', // Change to column for better stacking
    alignItems: 'center',
    justifyContent: 'center'
  }}>
    <Container>
      {title && <Typography variant="h3" sx={{ textAlign: 'center' }}>{title}</Typography>}
      {children}
    </Container>
  </Box>
);

export default function LandingPage() {
  return (
    <div>
	  <MainNav />
      <FullScreenSection backgroundColor="#EFF2F9" height="80vh">
        <Container sx={{ textAlign: 'center', maxWidth: '50%' }}>
					<Typography variant="h2" component="h1" sx={{
						textAlign: 'center', // Ensures text is always centered
						fontWeight: 'bold',
						mt: 10,
						mx: 'auto', // Ensures the margin on the sides is auto, helping in alignment
						width: '100%', // Ensures the Typography component takes full width
						}}>
						Empowering <GradientText style={{ background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)'}}>your</GradientText> journey
					</Typography>
          <Typography variant="subtitle1" sx={{ 
              my: 2, 
              fontWeight: 400, 
              mx: 'auto', 
			  fontSize: '1rem',
              maxWidth: { xs: '100%', sm: '80%', md: '60%' }
          }}>
            Join our platform designed to support your adventure back into the workforce. We'll help you tell the world who you are!
          </Typography>
          <Button variant="contained" color='primary' size='large' href="/create" sx={{ mt: 1,  color: "#FFFFFF", backgroundColor: "#1273EB" }} >
            Create My Resume
          </Button>
        </Container>
        <Box sx={{ maxWidth: '50%', display: 'flex', justifyContent: 'center', mx: 'auto', mt: 5 }}>
          <img src="/static/assets/landing1.svg" alt="Resume" width="500" height="500" priority />
        </Box>
      </FullScreenSection>
      <GrayedOutLogos />
      <Divider />
      <FullScreenSection backgroundColor="#FFFFFF">
				<FeatureSection />
      </FullScreenSection>
      <FullScreenSection backgroundColor="#EFF2F9" height='80vh'>
				<SupportSection />
      </FullScreenSection>
      <FullScreenSection backgroundColor="#0a1635" height='10vh'>
      </FullScreenSection>
    </div>
  );
}