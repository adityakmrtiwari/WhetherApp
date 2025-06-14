import React from 'react';
import {
  Paper,
  Typography,
  Box,
  useTheme,
  useMediaQuery,
  Divider,
  Grid,
  Tooltip,
} from '@mui/material';
import { motion } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import { getWeatherIcon } from '../services/weatherService';
import {
  WbSunny as SunIcon,
  NightsStay as MoonIcon,
  Air as WindIcon,
  WaterDrop as RainIcon,
  WbTwilight as SunsetIcon,
} from '@mui/icons-material';

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
      duration: 0.4,
    },
  },
};

const formatDay = (dateString, fmt) => {
  try {
    return format(parseISO(dateString), fmt);
  } catch (error) {
    return dateString;
  }
};

const DailyForecast = ({ data }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  if (!data?.forecast?.forecastday) return null;

  return (
    <Box sx={{ mt: isMobile ? 2 : 4, px: isMobile ? 1 : 0 }}>
      <Typography
        variant={isMobile ? 'h6' : 'h5'}
        sx={{ mb: 2, fontWeight: 'bold', textAlign: 'center' }}
      >
        Next 3 - Day's Forecast
      </Typography>

      <motion.div variants={containerVariants} initial="hidden" animate="visible">
        <Grid container spacing={isMobile ? 1 : 2}>
          {data.forecast.forecastday.map((day, index) => {
            const iconCode = getWeatherIcon(day.day.condition.code);
            return (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <motion.div variants={itemVariants}>
                  <Paper
                    elevation={3}
                    sx={{
                      p: isMobile ? 1.5 : 2,
                      height: '100%',
                      background:
                        theme.palette.mode === 'dark'
                          ? 'rgba(40, 40, 40, 0.85)'
                          : 'rgba(255, 255, 255, 0.85)',
                      backdropFilter: 'blur(12px)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: 3,
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: theme.shadows[6],
                      },
                    }}
                  >
                    {/* Day & Icon */}
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mb: 1.5,
                        gap: 2,
                      }}
                    >
                      <Box
                        component="img"
                        src={`/icons/${iconCode}.svg`}
                        alt={day.day.condition.text}
                        sx={{
                          width: isMobile ? 36 : 42,
                          height: isMobile ? 36 : 42,
                          filter: 'drop-shadow(0 0 6px rgba(0,0,0,0.3))',
                        }}
                      />
                      <Box>
                        <Typography variant="h6" fontWeight={600}>
                          {formatDay(day.date, 'EEEE')}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {formatDay(day.date, 'MMM d')}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Temps */}
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        mb: 1,
                      }}
                    >
                      <Tooltip title="High Temp">
                        <Typography variant="body2" color="text.secondary">
                          High
                        </Typography>
                      </Tooltip>
                      <Typography variant="body2" fontWeight={600}>
                        {Math.round(day.day.maxtemp_c)}°C
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        mb: 1,
                      }}
                    >
                      <Tooltip title="Low Temp">
                        <Typography variant="body2" color="text.secondary">
                          Low
                        </Typography>
                      </Tooltip>
                      <Typography variant="body2" fontWeight={600}>
                        {Math.round(day.day.mintemp_c)}°C
                      </Typography>
                    </Box>

                    {/* Rain */}
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        mb: 1,
                      }}
                    >
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <RainIcon fontSize="small" sx={{ color: 'skyblue' }} />
                        <Typography variant="body2" color="text.secondary">
                          Rain
                        </Typography>
                      </Box>
                      <Typography variant="body2" fontWeight={600}>
                        {day.day.daily_chance_of_rain}%
                      </Typography>
                    </Box>

                    {/* Wind */}
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        mb: 1,
                      }}
                    >
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <WindIcon fontSize="small" />
                        <Typography variant="body2" color="text.secondary">
                          Wind
                        </Typography>
                      </Box>
                      <Typography variant="body2" fontWeight={600}>
                        {Math.round(day.day.maxwind_kph)} km/h
                      </Typography>
                    </Box>

                    <Divider sx={{ my: 1.5, opacity: 0.2 }} />

                    {/* Sunrise / Sunset */}
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Box display="flex" gap={1} alignItems="center">
                        <SunIcon fontSize="small" color="warning" />
                        <Typography variant="body2" fontWeight={600}>
                          {day.astro.sunrise}
                        </Typography>
                      </Box>
                      <Box display="flex" gap={1} alignItems="center">
                        <SunsetIcon fontSize="small" color="error" />
                        <Typography variant="body2" fontWeight={600}>
                          {day.astro.sunset}
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                </motion.div>
              </Grid>
            );
          })}
        </Grid>
      </motion.div>
    </Box>
  );
};

export default DailyForecast;
