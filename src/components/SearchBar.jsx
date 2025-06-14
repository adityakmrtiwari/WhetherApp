import React, { useState, useEffect, useRef } from 'react';
import {
  Paper,
  InputBase,
  IconButton,
  Box,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Typography,
  Popper,
  Grow,
  ClickAwayListener,
  useTheme,
} from '@mui/material';
import {
  Search as SearchIcon,
  MyLocation as LocationIcon,
  LocationOn as LocationOnIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { searchLocations } from '../services/weatherService';

const SearchBar = ({ onLocationSelect, currentLocation }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const searchTimeout = useRef(null);
  const inputRef = useRef(null);
  const theme = useTheme();

  useEffect(() => {
    if (currentLocation) {
      setQuery(`${currentLocation.name}, ${currentLocation.country}`);
    }
  }, [currentLocation]);

  const handleSearch = async (value) => {
    setQuery(value);
    setError(null);

    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    if (!value.trim()) {
      setResults([]);
      setAnchorEl(null);
      return;
    }

    searchTimeout.current = setTimeout(async () => {
      setLoading(true);
      try {
        const locations = await searchLocations(value);
        setResults(locations);
        if (locations.length > 0) {
          setAnchorEl(inputRef.current);
        } else {
          setAnchorEl(null);
        }
      } catch (err) {
        setError('Failed to search locations. Please try again.');
        console.error('Error searching locations:', err);
      } finally {
        setLoading(false);
      }
    }, 500);
  };

  const handleLocationClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const location = await searchLocations(`${latitude},${longitude}`);
            if (location && location.length > 0) {
              onLocationSelect(location[0]);
            }
          } catch (err) {
            setError('Failed to get your location. Please try searching manually.');
            console.error('Error getting location:', err);
          }
        },
        () => {
          setError('Location access denied. Please search manually.');
        }
      );
    } else {
      setError('Geolocation is not supported by your browser.');
    }
  };

  const handleResultClick = (location) => {
    onLocationSelect(location);
    setResults([]);
    setAnchorEl(null);
  };

  const handleInputFocus = (event) => {
    if (results.length > 0) {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleClickAway = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ position: 'relative', mb: 3 }}>
      <Paper
        component={motion.div}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
        elevation={3}
        sx={{
          p: '2px 4px',
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          background: theme.palette.mode === 'dark' 
            ? 'rgba(255, 255, 255, 0.05)' 
            : 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)',
          border: `1px solid ${theme.palette.divider}`,
          '&:hover': {
            boxShadow: theme.shadows[4],
          },
        }}
      >
        <IconButton
          sx={{ 
            p: '10px', 
            color: theme.palette.primary.main,
            '&:hover': {
              transform: 'scale(1.1)',
              transition: 'transform 0.2s',
            },
          }}
          onClick={handleLocationClick}
          title="Use my location"
        >
          <LocationIcon />
        </IconButton>
        <InputBase
          ref={inputRef}
          sx={{ 
            ml: 1, 
            flex: 1,
            '& input': {
              color: theme.palette.text.primary,
            },
          }}
          placeholder="Search for a city..."
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={handleInputFocus}
        />
        {loading ? (
          <CircularProgress size={24} sx={{ mx: 1 }} />
        ) : (
          <IconButton 
            sx={{ 
              p: '10px',
              '&:hover': {
                transform: 'scale(1.1)',
                transition: 'transform 0.2s',
              },
            }} 
            aria-label="search"
          >
            <SearchIcon />
          </IconButton>
        )}
      </Paper>

      <ClickAwayListener onClickAway={handleClickAway}>
        <Popper
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          placement="bottom-start"
          transition
          style={{ width: anchorEl?.offsetWidth, zIndex: 1300 }}
        >
          {({ TransitionProps }) => (
            <Grow {...TransitionProps}>
              <Paper
                elevation={3}
                sx={{
                  mt: 1,
                  maxHeight: 300,
                  overflow: 'auto',
                  background: theme.palette.mode === 'dark'
                    ? 'rgba(18, 18, 18, 0.95)'
                    : 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${theme.palette.divider}`,
                }}
              >
                <AnimatePresence>
                  {results.map((location, index) => (
                    <motion.div
                      key={`${location.name}-${location.country}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ 
                        delay: index * 0.05,
                        type: "spring",
                        stiffness: 100,
                      }}
                    >
                      <ListItem
                        button
                        onClick={() => handleResultClick(location)}
                        sx={{
                          '&:hover': {
                            backgroundColor: theme.palette.action.hover,
                            transform: 'translateX(5px)',
                            transition: 'transform 0.2s',
                          },
                        }}
                      >
                        <ListItemIcon>
                          <LocationOnIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary={location.name}
                          secondary={location.country}
                        />
                      </ListItem>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </Paper>
            </Grow>
          )}
        </Popper>
      </ClickAwayListener>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          <Typography
            color="error"
            variant="body2"
            sx={{ mt: 1, textAlign: 'center' }}
          >
            {error}
          </Typography>
        </motion.div>
      )}
    </Box>
  );
};

export default SearchBar; 