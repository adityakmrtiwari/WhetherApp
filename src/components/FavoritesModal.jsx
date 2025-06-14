import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Button,
  useTheme,
  useMediaQuery,
  Drawer,
  Box,
  Typography,
  Tooltip,
  Avatar,
  Stack,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PublicIcon from '@mui/icons-material/Public';
import { motion, AnimatePresence } from 'framer-motion';

const emptyAnimation = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: 20, transition: { duration: 0.3 } },
};

const listAnimation = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
};

const FavoritesModal = ({ open, onClose, favorites, onRemove, onSelect }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isDark = theme.palette.mode === 'dark';

  const content = (
    <Box
      sx={{
        width: isMobile ? 320 : 400,
        p: 3,
        height: '100%',
        background: isDark
          ? 'linear-gradient(135deg, rgba(44, 62, 80, 0.95) 0%, rgba(0, 0, 0, 0.9) 100%)'
          : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(240, 248, 255, 0.9) 100%)',
        backdropFilter: 'blur(12px)',
        borderRadius: isMobile ? 0 : 2,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 2,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Favorite Locations
        </Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* List or Empty State */}
      <AnimatePresence mode="wait">
        {favorites.length === 0 ? (
          <motion.div key="empty" {...emptyAnimation}>
            <Stack alignItems="center" spacing={2} sx={{ mt: 4, mb: 2 }}>
              <Avatar
                sx={{
                  width: 64,
                  height: 64,
                  bgcolor: theme.palette.primary.light,
                }}
              >
                <LocationOnIcon
                  sx={{ fontSize: 40, color: theme.palette.primary.main }}
                />
              </Avatar>
              <Typography variant="h6" color="text.secondary">
                No favorites yet!
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Add locations to your favorites to see them here.
              </Typography>
            </Stack>
          </motion.div>
        ) : (
          <motion.div key="list" {...listAnimation}>
            <List disablePadding>
              {favorites.map((fav, idx) => (
                <ListItem
                  key={fav.name + fav.country + idx}
                  button
                  onClick={() => onSelect(fav)}
                  sx={{
                    borderRadius: 2,
                    mb: 1,
                    px: 2,
                    py: 1,
                    background: isDark
                      ? 'rgba(255,255,255,0.05)'
                      : 'rgba(0,0,0,0.03)',
                    '&:hover': {
                      background: theme.palette.action.hover,
                    },
                  }}
                >
                  <Avatar
                    sx={{ bgcolor: theme.palette.primary.main, mr: 2 }}
                  >
                    <LocationOnIcon />
                  </Avatar>
                  <ListItemText
                    primary={
                      <Typography sx={{ fontWeight: 600 }}>
                        {fav.name}
                      </Typography>
                    }
                    secondary={
                      <Typography
                        variant="caption"
                        sx={{ display: 'flex', alignItems: 'center' }}
                      >
                        <PublicIcon sx={{ fontSize: 16, mr: 0.5 }} />
                        {fav.country}
                      </Typography>
                    }
                  />
                  <ListItemSecondaryAction>
                    <Tooltip title="Remove from Favorites">
                      <IconButton
                        edge="end"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemove(fav);
                        }}
                      >
                        <DeleteIcon color="error" />
                      </IconButton>
                    </Tooltip>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <DialogActions sx={{ justifyContent: 'flex-end', mt: 2, px: 0 }}>
        <Button onClick={onClose} variant="contained" color="primary">
          Close
        </Button>
      </DialogActions>
    </Box>
  );

  // Drawer on mobile, Dialog on desktop
  return isMobile ? (
    <Drawer anchor="right" open={open} onClose={onClose}>
      {content}
    </Drawer>
  ) : (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogContent sx={{ p: 0 }}>{content}</DialogContent>
    </Dialog>
  );
};

export default FavoritesModal;
