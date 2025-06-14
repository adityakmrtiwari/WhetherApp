import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box, Container } from '@mui/material';
import { getTheme } from './theme';
import Navbar from './components/Navbar';
import WeatherDashboard from './components/WeatherDashboard';
import About from './pages/About';
import FavoritesModal from './components/FavoritesModal';
import { getCurrentLocation } from './services/weatherService';

function App() {
  // Always default to dark mode
  const [isDarkMode, setIsDarkMode] = useState(true);

  const [favorites, setFavorites] = useState(() => {
    const savedFavorites = localStorage.getItem('favorites');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  const [currentLocation, setCurrentLocation] = useState(null);
  const [showFavorites, setShowFavorites] = useState(false);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const location = await getCurrentLocation();
        setCurrentLocation(location);
      } catch (error) {
        console.error('Error fetching location:', error);
      }
    };
    fetchLocation();
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const handleToggleFavorite = (location) => {
    setFavorites(prev => {
      const isFavorite = prev.some(
        fav => fav.name === location.name && fav.country === location.country
      );
      if (isFavorite) {
        return prev.filter(
          fav => !(fav.name === location.name && fav.country === location.country)
        );
      }
      return [...prev, location];
    });
  };

  const handleRemoveFavorite = (fav) => {
    setFavorites(prev => prev.filter(
      f => !(f.name === fav.name && f.country === fav.country)
    ));
  };

  const handleSelectFavorite = (fav) => {
    setCurrentLocation(fav);
    setShowFavorites(false);
  };

  return (
    <ThemeProvider theme={getTheme(isDarkMode)}>
      <CssBaseline />
      <Router>
        <Box
          sx={{
            minHeight: '100vh',
            minWidth: '100vw',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: isDarkMode
              ? 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)'
              : 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            transition: 'background 0.3s ease-in-out',
          }}
        >
          <Navbar
            toggleTheme={toggleTheme}
            isDarkMode={isDarkMode}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            currentLocation={currentLocation}
            onShowFavorites={() => setShowFavorites(true)}
          />
          <Container 
            maxWidth="xl" 
            sx={{ 
              flexGrow: 1,
              py: 3,
              px: { xs: 2, sm: 3 },
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              maxWidth: '1400px !important',
              mx: 'auto',
            }}
          >
            <Routes>
              <Route
                path="/"
                element={
                  <WeatherDashboard
                    currentLocation={currentLocation}
                    setCurrentLocation={setCurrentLocation}
                    favorites={favorites}
                    onToggleFavorite={handleToggleFavorite}
                  />
                }
              />
              <Route path="/about" element={<About />} />
            </Routes>
          </Container>
          <FavoritesModal
            open={showFavorites}
            onClose={() => setShowFavorites(false)}
            favorites={favorites}
            onRemove={handleRemoveFavorite}
            onSelect={handleSelectFavorite}
          />
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App; 