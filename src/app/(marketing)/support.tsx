import React from 'react';
import { Box, Typography, Grid, Paper, List, ListItem, ListItemText } from '@mui/material';
import GradientText from '@/components/marketing/text/gradient';

export default function SupportSection() {
    return (
		<div>
            <Typography variant="h2" component="h1" sx={{ textAlign: 'center', fontWeight: 'bold', mb: 2, mt: 10 }}>
                We Support You
            </Typography>
            <Typography variant="subtitle1" sx={{ textAlign: 'center', mb: 4, height: '20%' }}>
                Our features are designed with the user in mind
            </Typography>
            <Grid container spacing={5} sx={{ height: '80%', mb: 10 }}>
                <Grid item xs={12} md={6}>
                    <Box sx={{ textAlign: 'center', mb: 2 }}>
                        <img src={"/static/assets/hazel.svg"} alt="Virtual Companion" style={{ background: 'none', maxWidth: '70%', marginBottom: 20 }} />
                        <Typography variant="h5" component="h3">
                            Ask <GradientText>Chloe</GradientText>
						</Typography>
						Don't know where to start? Consult your virtual friend.
                    </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                    <List sx={{ bgcolor: 'transparent', mt: 10 }}>
                        {features.map((feature, index) => (
                            <ListItem key={index} sx={{ pb: 2, mb: 2 }}>
                                <Box component="img" src={feature.icon} alt={`${feature.title} icon`} sx={{ width: '50px', height: 'auto', mr: 2 }} />
                                <ListItemText 
                                    primary={feature.title} 
                                    secondary={feature.description} 
                                    primaryTypographyProps={{ fontSize: 'h6.fontSize', fontWeight: 'medium' }}
                                    secondaryTypographyProps={{ fontSize: 'body2.fontSize' }}
                                />
                            </ListItem>
                        ))}
                    </List>
                </Grid>
            </Grid>
		</div>
    );
}

const features = [
    { title: 'Rephrase with AI', description: 'Enhance your resume with AI-driven suggestions.', icon: '/static/assets/ai.png' },
    { title: 'Resume score', description: 'Get an instant evaluation of your resume\'s impact.', icon: '/static/assets/score-icon.png' },
    { title: 'Live preview', description: 'See changes as you make them with our live preview feature.', icon: '/static/assets/preview-icon.png' },
    { title: 'Choose templates', description: 'Select from a variety of professional templates.', icon: '/static/assets/template-icon.png' },
];