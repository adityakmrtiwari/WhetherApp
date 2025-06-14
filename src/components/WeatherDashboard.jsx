import React, { useState, useEffect } from 'react';
import { Box, Container, Grid, Paper, Typography, CircularProgress, useTheme } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import SearchBar from './SearchBar';
import CurrentWeather from './CurrentWeather';
import HourlyForecast from './HourlyForecast';
import DailyForecast from './DailyForecast';
import { fetchWeatherData } from '../services/weatherService';

const WeatherDashboard = ({ currentLocation, setCurrentLocation, favorites, onToggleFavorite }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();

  useEffect(() => {
    const loadWeatherData = async () => {
      if (!currentLocation) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const data = await fetchWeatherData(currentLocation);
        setWeatherData(data);
      } catch (err) {
        setError('Failed to fetch weather data. Please try again.');
        console.error('Error fetching weather:', err);
      } finally {
        setLoading(false);
      }
    };

    loadWeatherData();
  }, [currentLocation]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.2,
      },
    },
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
        }}
      >
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 15,
          }}
        >
          <CircularProgress size={60} />
        </motion.div>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
        }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 15,
          }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 4,
              textAlign: 'center',
              maxWidth: 400,
              mx: 'auto',
              background: theme.palette.mode === 'dark'
                ? 'rgba(255, 255, 255, 0.05)'
                : 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(10px)',
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Typography variant="h6" color="error" gutterBottom>
              {error}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Please try searching for a different location or check your internet connection.
            </Typography>
          </Paper>
        </motion.div>
      </Box>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <Container maxWidth="xl">
          <motion.div variants={itemVariants}>
            <SearchBar
              onLocationSelect={setCurrentLocation}
              currentLocation={currentLocation}
            />
          </motion.div>

          {weatherData && (
            <>
              <motion.div variants={itemVariants}>
                <CurrentWeather
                  data={weatherData.current}
                  location={currentLocation}
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <HourlyForecast
                  data={weatherData.forecast.forecastday[0].hour}
                  timezone={weatherData.location.tz_id}
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <DailyForecast
                  data={weatherData}
                  timezone={weatherData.location.tz_id}
                />
              </motion.div>

              {favorites.length > 0 && (
                <motion.div variants={itemVariants}>
                  <Paper
                    elevation={3}
                    sx={{
                      p: 3,
                      mt: 3,
                      background: theme.palette.mode === 'dark'
                        ? 'rgba(255, 255, 255, 0.05)'
                        : 'rgba(255, 255, 255, 0.8)',
                      backdropFilter: 'blur(10px)',
                      border: `1px solid ${theme.palette.divider}`,
                    }}
                  >
                    <Typography variant="h6" gutterBottom>
                      Favorite Locations
                    </Typography>
                    <Grid container spacing={2}>
                      {favorites.map((location) => (
                        <Grid item xs={12} sm={6} md={4} key={`${location.name}-${location.country}`}>
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Paper
                              elevation={2}
                              sx={{
                                p: 2,
                                cursor: 'pointer',
                                background: theme.palette.mode === 'dark'
                                  ? 'rgba(255, 255, 255, 0.05)'
                                  : 'rgba(255, 255, 255, 0.8)',
                                backdropFilter: 'blur(5px)',
                                border: `1px solid ${theme.palette.divider}`,
                                '&:hover': {
                                  boxShadow: theme.shadows[4],
                                },
                              }}
                              onClick={() => setCurrentLocation(location)}
                            >
                              <Typography variant="subtitle1">
                                {location.name}, {location.country}
                              </Typography>
                            </Paper>
                          </motion.div>
                        </Grid>
                      ))}
                    </Grid>
                  </Paper>
                </motion.div>
              )}
            </>
          )}
        </Container>
      </motion.div>
    </AnimatePresence>
  );
};

export default WeatherDashboard; 