import React from 'react';
import {
  Paper,
  Typography,
  Box,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { motion } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import { getWeatherIcon } from '../services/weatherService';

const HourlyForecast = ({ data, timezone }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isDark = theme.palette.mode === 'dark';

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

  const filteredData = data.filter((_, index) => index % 3 === 0);

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        height: '100%',
        borderRadius: 3,
        background: isDark
          ? 'linear-gradient(135deg, rgba(44, 62, 80, 0.95) 0%, rgba(0, 0, 0, 0.9) 100%)'
          : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(240, 248, 255, 0.9) 100%)',
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
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
        Hourly Forecast
      </Typography>

      <Box
        sx={{
          display: 'flex',
          overflowX: 'auto',
          gap: 2,
          py: 2,
          px: 1,
          '&::-webkit-scrollbar': {
            height: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: isDark
              ? 'rgba(255, 255, 255, 0.1)'
              : 'rgba(0, 0, 0, 0.05)',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: isDark
              ? 'rgba(255, 255, 255, 0.2)'
              : 'rgba(0, 0, 0, 0.1)',
            borderRadius: '4px',
            '&:hover': {
              background: isDark
                ? 'rgba(255, 255, 255, 0.3)'
                : 'rgba(0, 0, 0, 0.2)',
            },
          },
        }}
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{ display: 'flex', gap: '16px' }}
        >
          {filteredData.map((hour) => {
            const time = parseISO(hour.time);
            const weatherIcon = getWeatherIcon(hour.condition.code);

            return (
              <motion.div
                key={hour.time}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                style={{
                  minWidth: isMobile ? '80px' : '100px',
                }}
              >
                <Paper
                  elevation={2}
                  sx={{
                    p: 2,
                    textAlign: 'center',
                    background: isDark
                      ? 'rgba(255, 255, 255, 0.05)'
                      : 'rgba(0, 0, 0, 0.04)',
                    border: isDark
                      ? '1px solid rgba(255, 255, 255, 0.1)'
                      : '1px solid rgba(0, 0, 0, 0.1)',
                    backdropFilter: 'blur(5px)',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 1,
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="subtitle2" color="text.secondary">
                    {format(time, 'h:mm a')}
                  </Typography>

                  <Box
                    component="img"
                    src={`/icons/${weatherIcon}.svg`}
                    alt={hour.condition.text}
                    sx={{
                      width: 40,
                      height: 40,
                      filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.2))',
                    }}
                  />

                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {Math.round(hour.temp_c)}°C
                  </Typography>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {hour.condition.text}
                  </Typography>

                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                      mt: 0.5,
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      {Math.round(hour.wind_kph)} km/h
                    </Typography>
                  </Box>
                </Paper>
              </motion.div>
            );
          })}
        </motion.div>
      </Box>
    </Paper>
  );
};

export default HourlyForecast;
