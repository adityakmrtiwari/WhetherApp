import { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Paper, 
  IconButton,
  Box,
  CircularProgress
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { fetchWeatherData } from '../services/weatherService';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const savedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        const weatherData = await Promise.all(
          savedFavorites.map(city => fetchWeatherData(city))
        );
        setFavorites(weatherData);
      } catch (err) {
        setError('Failed to load favorite locations');
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, []);

  const handleRemoveFavorite = (cityToRemove) => {
    const updatedFavorites = favorites.filter(
      fav => fav.location.name !== cityToRemove
    );
    setFavorites(updatedFavorites);
    localStorage.setItem(
      'favorites',
      JSON.stringify(updatedFavorites.map(fav => fav.location.name))
    );
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography color="error" align="center">
          {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h4" sx={{ mb: 4, fontWeight: 600 }}>
          Favorite Locations
        </Typography>

        {favorites.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography color="text.secondary">
              No favorite locations added yet.
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {favorites.map((fav) => (
              <Grid item xs={12} sm={6} md={4} key={fav.location.name}>
                <Paper
                  sx={{
                    p: 3,
                    borderRadius: 4,
                    background: 'rgba(44, 62, 80, 0.9)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    position: 'relative',
                  }}
                >
                  <IconButton
                    onClick={() => handleRemoveFavorite(fav.location.name)}
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      color: 'error.main',
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>

                  <Typography variant="h6" sx={{ mb: 1 }}>
                    {fav.location.name}
                  </Typography>
                  
                  <Typography variant="h3" sx={{ mb: 2 }}>
                    {Math.round(fav.current.temp_c)}°C
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary">
                    {fav.current.condition.text}
                  </Typography>
                  
                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="caption" color="text.secondary">
                      Humidity: {fav.current.humidity}%
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Wind: {Math.round(fav.current.wind_kph)} km/h
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}
      </motion.div>
    </Container>
  );
};

export default Favorites; 