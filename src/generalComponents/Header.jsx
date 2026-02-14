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
import { useLocation, useNavigate } from 'react-router-dom';

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const navigation = useNavigate();
  const location = useLocation();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    logout();
    navigation("/", { replace: true })
  }

  const getHeaderStyles = () => {
    switch (location.pathname) {
      case "/":
        return {
          background: "transparent"
        };

      case "/iniciar-sesión":
        return {
          backgroundColor: "#000000"
        };

      case "/registrar-delegado":
        return {
          backgroundColor: "#1E3A8A"
        };

      case "/lista-delegados":
        return {
          backgroundColor: "#524a4a",
        };

      default:
        return {
          backgroundColor: "#222"
        };
    }
  };

  const getHeaderElevation = () => {
    switch (location.pathname) {
      case "/":
        return 0;

      case "/iniciar-sesión":
        return 0;

      case "/registrar-delegado":
        return 2;

      case "/lista-delegados":
        return 3;

      default:
        return 3;
    }
  };




  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed"
        elevation={getHeaderElevation()}
        color='transparent'
        sx={{
          ...getHeaderStyles(),
          transition: "all 0.3s ease-in-out"
        }}>
        <Toolbar>
          <Box display={'flex'} flexDirection={{
            xs: isAuthenticated ? 'row' : 'column',
            sm: 'row'
          }} width={'100%'} justifyContent={'space-between'} alignItems={'center'}>
            <Box display={'flex'} justifyContent={'center'}>
              <Box sx={{
                height: 60,
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                pt: 2,
              }}>
                <Box
                  component="img"
                  src="/logo.webp"
                  alt="Logo partido"
                  sx={{
                    height: 100,
                    width: "auto",
                    mr: 2
                  }}
                />
              </Box>

            </Box>

            {(isAuthenticated && user) ? (
              <Box height={'100%'}>
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
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >

                  <MenuItem onClick={handleClose}>Profile</MenuItem>
                  <MenuItem onClick={handleLogout}>Cerrar Sesión</MenuItem>
                </Menu>
              </Box>
            ) : (
              <Box display={'flex'} alignItems={'center'} gap={1}>
                <Button
                  variant="outlined"
                  onClick={() => {
                    navigation('/registrar-delegado')
                  }}
                  sx={{
                    all: "unset",
                    color: '#FFFFFF',
                    border: '2px solid #FFFFFF',
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "8px",
                    padding: "6px 16px",
                    textAlign: 'center',
                    transition: "all 0.2s ease-in-out",
                    fontWeight: 600,
                    '&:hover': {
                      backgroundColor: "transparent",
                      border: '2px solid #000000',
                      color: "#000000",
                    }
                  }}
                >
                  Registrarse como delegado
                </Button>

                <Button
                  variant="contained"
                  onClick={() => {
                    navigation('/iniciar-sesión')
                  }}
                  sx={{
                    all: "unset",
                    backgroundColor: "#FFFFFF",
                    color: "#000000",
                    padding: "8px 16px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: 600,
                    display: "inline-flex",
                    alignItems: "center",
                    textAlign: 'center',
                    justifyContent: "center",
                    transition: "all 0.2s ease-in-out",
                    '&:hover': {
                      backgroundColor: "#000000",
                      color: '#FFFFFF',
                    }
                  }}
                >
                  Iniciar Sesión
                </Button>
              </Box>
            )}
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}