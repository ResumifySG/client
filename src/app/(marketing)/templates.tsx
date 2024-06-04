import React from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

export default function FeatureSection() {
  return (
    <Box sx={{ flexGrow: 1, overflow: 'hidden', px: 3 }}>
      <Grid container spacing={5} alignItems="center" justifyContent="center">
        <Grid item xs={12} md={6}>
          <Box sx={{ textAlign: 'left', mb: 4 }}>
            <img src="/static/assets/findfit.svg" alt="Decorative Illustration" style={{ maxWidth: '40%' }} />
          </Box>
          <Typography variant="h4" fontWeight="bold">
            Find Your Fit
          </Typography>
          <Typography variant="subtitle1" sx={{ mt: 2 }}>
            Choose from a variety of templates, find the one that best expresses you.
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{
              padding: 0,
              position: 'relative', 
              overflow: 'hidden', 
              minHeight: 300, 
              display: 'flex', 
              alignItems: 'center'
            }}>
            <Swiper
              modules={[ Autoplay ]}
              spaceBetween={50}
              slidesPerView={1}
              centeredSlides={false}
              loop={true}
              autoplay={{
                  delay: 2500,
                  disableOnInteraction: false
              }}
              pagination={{ clickable: true }}
              scrollbar={{ draggable: true }}
              onSlideChange={() => console.log('slide change')}
              onSwiper={(swiper) => console.log(swiper)}
              style={{width: '75%'}}
            >
              <SwiperSlide><img src="/static/assets/resume-1.PNG" alt="Resume Template 1" style={{ width: '100%' }} /></SwiperSlide>
              <SwiperSlide><img src="/static/assets/resume-2.PNG" alt="Resume Template 2" style={{ width: '100%' }} /></SwiperSlide>
              <SwiperSlide><img src="/static/assets/resume-3.PNG" alt="Resume Template 3" style={{ width: '100%' }} /></SwiperSlide>
              <SwiperSlide><img src="/static/assets/resume-4.PNG" alt="Resume Template 4" style={{ width: '100%' }} /></SwiperSlide>
              <SwiperSlide><img src="/static/assets/resume-5.PNG" alt="Resume Template 5" style={{ width: '100%' }} /></SwiperSlide>
              {/* Add more SwiperSlides as needed */}
            </Swiper>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}