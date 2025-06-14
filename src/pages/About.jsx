import React from 'react';
import { Container, Typography, Box, Paper, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import {
  WbSunny as SunIcon,
  Cloud as CloudIcon,
  Opacity as RainIcon,
  Air as WindIcon,
  Favorite as HeartIcon,
} from '@mui/icons-material';

const About = () => {
  const features = [
    {
      icon: <SunIcon sx={{ fontSize: 40 }} />,
      title: 'Real-time Weather',
      description: 'Get accurate, up-to-date weather information for any location around the world.',
    },
    {
      icon: <CloudIcon sx={{ fontSize: 40 }} />,
      title: 'Detailed Forecasts',
      description: 'Access hourly and daily forecasts with comprehensive weather details.',
    },
    {
      icon: <RainIcon sx={{ fontSize: 40 }} />,
      title: 'Weather Alerts',
      description: 'Stay informed with important weather alerts and notifications.',
    },
    {
      icon: <WindIcon sx={{ fontSize: 40 }} />,
      title: 'Multiple Locations',
      description: 'Save and track weather for multiple locations that matter to you.',
    },
    {
      icon: <HeartIcon sx={{ fontSize: 40 }} />,
      title: 'Favorites',
      description: 'Keep your favorite locations easily accessible for quick weather checks.',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <Typography
            variant="h2"
            component="h1"
            align="center"
            gutterBottom
            sx={{
              fontWeight: 700,
              mb: 6,
              background: 'linear-gradient(45deg, #2196f3, #f50057)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            About WeatherApp
          </Typography>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Typography
            variant="h5"
            align="center"
            color="text.secondary"
            paragraph
            sx={{ mb: 8, maxWidth: '800px', mx: 'auto' }}
          >
            Your trusted companion for accurate weather forecasts and real-time weather information.
            Built with modern technology to provide you with the most reliable weather data.
          </Typography>
        </motion.div>

        <Grid container spacing={4} sx={{ mb: 8 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <motion.div variants={itemVariants}>
                <Paper
                  elevation={3}
                  sx={{
                    p: 4,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                    },
                  }}
                >
                  <Box
                    sx={{
                      color: 'primary.main',
                      mb: 2,
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography variant="h5" component="h3" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography color="text.secondary">
                    {feature.description}
                  </Typography>
                </Paper>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        <motion.div variants={itemVariants}>
          <Paper
            elevation={3}
            sx={{
              p: 4,
              textAlign: 'center',
              background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.1), rgba(245, 0, 87, 0.1))',
            }}
          >
            <Typography variant="h4" gutterBottom>
              Built with Modern Technology
            </Typography>
            <Typography color="text.secondary" paragraph>
              WeatherApp is built using React, Material-UI, and modern web technologies
              to provide a smooth and responsive user experience. We use reliable weather
              APIs to ensure accurate and up-to-date information.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              © {new Date().getFullYear()} WeatherApp. All rights reserved.
            </Typography>
          </Paper>
        </motion.div>
      </motion.div>
    </Container>
  );
};

export default About; 