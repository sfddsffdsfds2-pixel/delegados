import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import { useAuth } from '../contexts/AuthContex';
import { Button } from '@mui/material';

export default function Header() {
  const { user, isAuthenticated } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed"
        elevation={0}
        sx={{
          background: "transparent",
        }}>
        <Toolbar>
          {(isAuthenticated && user) &&
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          }
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Photos
          </Typography>
          {(isAuthenticated && user) ? (
            <div>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose}>Profile</MenuItem>
                <MenuItem onClick={handleClose}>My account</MenuItem>
              </Menu>
            </div>
          ) : (
            <Box display={'flex'} gap={1}>
              <Button
                variant="contained"
                sx={{
                  borderRadius: 3,
                  textTransform: "none",
                  fontWeight: 600,
                  background: "linear-gradient(135deg, #FFA347, #FF7E5F)",
                  '&:hover': {
                    background: "linear-gradient(135deg, #FF8C42, #FF6A4D)",
                  }
                }}
              >
                Registrarse como delegado
              </Button>
              <Button
                variant="contained"
                sx={{
                  borderRadius: 3,
                  textTransform: "none",
                  fontWeight: 600,
                  background: "#FFFFFF",
                  color:  "linear-gradient(135deg, #FF8C42, #FF6A4D)",
                }}
              >
                Iniciar Sesión
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}