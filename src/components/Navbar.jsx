import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Badge,
  useTheme,
  useMediaQuery,
  Tooltip,
  Container,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  Home as HomeIcon,
  Info as AboutIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Close as CloseIcon,
  ListAlt as ListAltIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ toggleTheme, isDarkMode, favorites, onToggleFavorite, currentLocation, onShowFavorites }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  const navItems = [
    { text: 'Home', icon: <HomeIcon />, path: '/' },
    { text: 'About', icon: <AboutIcon />, path: '/about' },
  ];

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setDrawerOpen(false);
  };

  const isFavorite = currentLocation && favorites.some(
    fav => fav.name === currentLocation.name && fav.country === currentLocation.country
  );

  // Button style for light mode
  const buttonStyle = isDarkMode
    ? {}
    : {
        backgroundColor: '#111',
        color: '#fff',
        '&:hover': {
          backgroundColor: '#222',
        },
      };

  return (
    <motion.div
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
    >
      <AppBar 
        position="fixed" 
        elevation={0}
        sx={{ 
          background: theme.palette.mode === 'dark' 
            ? 'rgba(18, 18, 18, 0.95)' 
            : 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderBottom: `1px solid ${theme.palette.divider}`,
          zIndex: theme.zIndex.drawer + 1,
        }}
      >
        <Container maxWidth="xl">
          <Toolbar 
            sx={{ 
              justifyContent: 'space-between', 
              px: { xs: 1, sm: 2 },
              minHeight: '64px',
            }}
          >
            {/* Left side - Logo and Menu */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {isMobile && (
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={toggleDrawer(true)}
                  sx={{ mr: 2 }}
                >
                  <MenuIcon />
                </IconButton>
              )}
              <Typography
                variant="h6"
                component={motion.div}
                whileHover={{ scale: 1.05 }}
                sx={{
                  fontWeight: 700,
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  cursor: 'pointer',
                }}
                onClick={() => handleNavigation('/')}
              >
                WeatherApp
              </Typography>
            </Box>

            {/* Center - Navigation Links (Desktop only) */}
            {!isMobile && (
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                {navItems.map((item) => (
                  <Button
                    key={item.text}
                    startIcon={item.icon}
                    onClick={() => handleNavigation(item.path)}
                    sx={{
                      color: theme.palette.text.primary,
                      fontWeight: 600,
                      px: 2,
                      py: 1,
                      borderRadius: 2,
                      textTransform: 'none',
                      background: 'none',
                      boxShadow: 'none',
                      '&:hover': {
                        backgroundColor: theme.palette.action.hover,
                      },
                    }}
                  >
                    {item.text}
                  </Button>
                ))}
                {/* Check Favorites Button - styled like Home/About */}
                <Button
                  startIcon={<ListAltIcon />}
                  onClick={onShowFavorites}
                  sx={{
                    color: theme.palette.text.primary,
                    fontWeight: 600,
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    textTransform: 'none',
                    background: 'none',
                    boxShadow: 'none',
                    '&:hover': {
                      backgroundColor: theme.palette.action.hover,
                    },
                  }}
                >
                  Favorites
                </Button>
              </Box>
            )}

            {/* Right side - Theme Toggle and Favorites */}
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 2,
              }}
            >
              <Tooltip title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}>
                <IconButton 
                  onClick={toggleTheme} 
                  color="inherit"
                  size="large"
                  sx={{
                    borderRadius: 2,
                    p: 1.2,
                    ...buttonStyle,
                  }}
                >
                  {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
                </IconButton>
              </Tooltip>
              
              {currentLocation && (
                <Tooltip title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}>
                  <IconButton 
                    onClick={() => onToggleFavorite(currentLocation)} 
                    color="inherit"
                    size="large"
                    sx={{
                      borderRadius: 2,
                      p: 1.2,
                      ...buttonStyle,
                    }}
                  >
                    <Badge 
                      badgeContent={favorites.length} 
                      color="secondary"
                      sx={{
                        '& .MuiBadge-badge': {
                          right: -3,
                          top: 3,
                          backgroundColor: theme.palette.secondary.main,
                        },
                      }}
                    >
                      {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                    </Badge>
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        sx={{
          '& .MuiDrawer-paper': {
            background: theme.palette.background.paper,
            borderRight: `1px solid ${theme.palette.divider}`,
          },
        }}
      >
        <Box
          sx={{
            width: 250,
            height: '100%',
            background: theme.palette.background.paper,
            display: 'flex',
            flexDirection: 'column',
          }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" component="div">
              Menu
            </Typography>
            <IconButton onClick={toggleDrawer(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <List>
            {navItems.map((item) => (
              <ListItem
                button
                key={item.text}
                onClick={() => handleNavigation(item.path)}
                sx={{
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                  },
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
            {/* Check Favorites in Drawer */}
            <ListItem button onClick={onShowFavorites}>
              <ListItemIcon><ListAltIcon /></ListItemIcon>
              <ListItemText primary="Favorites" />
            </ListItem>
          </List>
        </Box>
      </Drawer>
      
      {/* Toolbar spacer to prevent content from being hidden under the AppBar */}
      <Toolbar />
    </motion.div>
  );
};

export default Navbar; 