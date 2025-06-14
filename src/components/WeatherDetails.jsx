import { Paper, Typography, Grid, Box } from '@mui/material';
import { motion } from 'framer-motion';
import {
  WaterDrop as HumidityIcon,
  Air as WindIcon,
  Compress as PressureIcon,
  Visibility as VisibilityIcon,
  WbSunny as UVIcon,
  Cloud as CloudIcon,
} from '@mui/icons-material';

const WeatherDetails = ({ data }) => {
  const details = [
    {
      icon: <HumidityIcon />,
      label: 'Humidity',
      value: `${data.humidity}%`,
    },
    {
      icon: <WindIcon />,
      label: 'Wind Speed',
      value: `${Math.round(data.wind_kph)} km/h`,
    },
    {
      icon: <PressureIcon />,
      label: 'Pressure',
      value: `${data.pressure_mb} mb`,
    },
    {
      icon: <VisibilityIcon />,
      label: 'Visibility',
      value: `${data.vis_km} km`,
    },
    {
      icon: <UVIcon />,
      label: 'UV Index',
      value: data.uv,
    },
    {
      icon: <CloudIcon />,
      label: 'Cloud Cover',
      value: `${data.cloud}%`,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Paper
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 4,
          background: 'rgba(44, 62, 80, 0.9)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Weather Details
        </Typography>

        <Grid container spacing={2}>
          {details.map((detail, index) => (
            <Grid item xs={6} sm={4} key={index}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  background: 'rgba(255, 255, 255, 0.05)',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    background: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    mb: 1,
                  }}
                >
                  {detail.icon}
                  <Typography variant="subtitle2" color="text.secondary">
                    {detail.label}
                  </Typography>
                </Box>
                <Typography variant="h6">{detail.value}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </motion.div>
  );
};

export default WeatherDetails; 