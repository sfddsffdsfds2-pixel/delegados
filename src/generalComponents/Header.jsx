import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import { useAuth } from '../contexts/AuthContex';
import { Button } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';


export default function Header() {
  const { user, isAuthenticated, authLoading, logout } = useAuth();
  console.log("user", user)
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
          backgroundColor: "#060c1b"
        };

      case "/lista-delegados":
        return {
          backgroundColor: "rgb(37, 42, 54)",
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
          <Box display={'flex'} p={{xs: 0, lg: 0}} flexDirection={{
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
                    height: {
                      xs: 80,
                      lg: 100
                    },
                    width: "auto",
                    mr: 2
                  }}
                />
              </Box>

            </Box>

            {(isAuthenticated && user) ? (
              <Box height={'100%'} display={'flex'} alignItems={'center'} gap={1}>
                <Button
                  onClick={handleMenu}
                  sx={{
                    gap: 1
                  }}
                >
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    sx={{
                      display: { xs: 'none', sm: 'block' }
                    }}
                  >
                    {user?.email}
                  </Typography>

                  <AccountCircle />
                </Button>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                >
                  {/* 👇 Email solo en móvil */}
                  <Box
                    sx={{
                      display: { xs: 'block', sm: 'none' },
                      px: 2,
                      py: 1,
                    }}
                  >
                    <Typography variant="body2" fontWeight="bold">
                      {user?.email}
                    </Typography>
                  </Box>
                  <MenuItem
                    onClick={handleLogout}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}
                  >
                    <LogoutIcon fontSize="small" />
                    Cerrar Sesión
                  </MenuItem>

                </Menu>

              </Box>
            ) : (
              !authLoading ?
                <Box
                  display="flex"
                  flexDirection={{ xs: 'column', sm: 'row' }}
                  alignItems="center"
                  gap={1}
                  width={{ xs: '100%', sm: 'auto' }}
                  px={{
                    xs: 2,
                    lg: 0
                  }}
                >

                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => {
                      navigation('/registrar-delegado')
                    }}
                    sx={{
                      all: "unset",
                      width: { xs: '100%', sm: 'auto' },
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
                    fullWidth
                    variant="contained"
                    onClick={() => {
                      navigation('/iniciar-sesión')
                    }}
                    sx={{
                      all: "unset",
                      width: { xs: '100%', sm: 'auto' },
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
                </Box> : null
            )}
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}