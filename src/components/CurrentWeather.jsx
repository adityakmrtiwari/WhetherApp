import React from 'react';
import { Paper, Typography, Box, Chip } from '@mui/material';
import { motion } from 'framer-motion';
import { getWeatherIcon } from '../services/weatherService';
import { format } from 'date-fns';
import { useTheme } from '@mui/material/styles';
import {
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
  WbSunny as SunIcon,
  WaterDrop as HumidityIcon,
  Air as WindIcon,
  Thermostat as FeelsLikeIcon
} from '@mui/icons-material';

const CurrentWeather = ({ data, location }) => {
  const weatherIcon = getWeatherIcon(data.condition.code);
  const currentTime = new Date();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Paper
        sx={{
          p: 4,
          mb: 3,
          borderRadius: 4,
          background: isDark
            ? 'linear-gradient(135deg, rgba(44, 62, 80, 0.95) 0%, rgba(0, 0, 0, 0.9) 100%)'
            : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(240, 248, 255, 0.9) 100%)',
          backdropFilter: 'blur(10px)',
          border: isDark
            ? '1px solid rgba(255, 255, 255, 0.1)'
            : '1px solid rgba(0, 0, 0, 0.1)',
          boxShadow: isDark
            ? '0 8px 32px rgba(0, 0, 0, 0.5)'
            : '0 4px 20px rgba(0, 0, 0, 0.1)',
          color: isDark ? '#ffffff' : '#111111',
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <motion.div variants={itemVariants}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 1 }}>
              <LocationIcon color="primary" />
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                {location.name}, {location.country}
              </Typography>
            </Box>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 3 }}>
              <TimeIcon color="primary" />
              <Typography variant="subtitle1" color="text.secondary">
                {format(currentTime, 'EEEE, MMMM d, yyyy • h:mm a')}
              </Typography>
            </Box>
          </motion.div>

          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
          >
            <Box
              component="img"
              src={`/icons/${weatherIcon}.svg`}
              alt={data.condition.text}
              sx={{
                width: 150,
                height: 150,
                mb: 2,
                filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.2))',
              }}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <Typography variant="h1" sx={{ mb: 1, fontWeight: 700, fontSize: { xs: '3rem', md: '4rem' } }}>
              {Math.round(data.temp_c)}°C
            </Typography>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Chip
              label={data.condition.text}
              color="primary"
              sx={{
                mb: 3,
                px: 2,
                py: 3,
                fontSize: '1.1rem',
                fontWeight: 500,
              }}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <Box sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
              gap: 3,
              mt: 3,
              p: 2,
              borderRadius: 2,
              background: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
            }}>
              <Box sx={{ textAlign: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 1 }}>
                  <FeelsLikeIcon color="primary" />
                  <Typography variant="subtitle2" color="text.secondary">
                    Feels Like
                  </Typography>
                </Box>
                <Typography variant="h6">
                  {Math.round(data.feelslike_c)}°C
                </Typography>
              </Box>

              <Box sx={{ textAlign: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 1 }}>
                  <HumidityIcon color="primary" />
                  <Typography variant="subtitle2" color="text.secondary">
                    Humidity
                  </Typography>
                </Box>
                <Typography variant="h6">
                  {data.humidity}%
                </Typography>
              </Box>

              <Box sx={{ textAlign: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 1 }}>
                  <WindIcon color="primary" />
                  <Typography variant="subtitle2" color="text.secondary">
                    Wind
                  </Typography>
                </Box>
                <Typography variant="h6">
                  {Math.round(data.wind_kph)} km/h
                </Typography>
              </Box>
            </Box>
          </motion.div>
        </Box>
      </Paper>
    </motion.div>
  );
};

export default CurrentWeather;
