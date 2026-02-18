import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import MenuIcon from '@mui/icons-material/Menu';
import { IconButton } from '@mui/material';
import Menu from '@mui/material/Menu';
import { useAuth } from '../contexts/AuthContex';
import { Button } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import NavBar from './NavBar';
import CloseIcon from '@mui/icons-material/Close';
import { getRoleIcon } from '../appConfig/RoleConfig';
import { useNotification } from '../contexts/NotificationContext';


export default function Header() {
  const { user, isAuthenticated, authLoading, logout } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const navigation = useNavigate();
  const location = useLocation();
  const isLoginPage = location.pathname === "/iniciar-sesion";
  const isRegisterDelegatePage = location.pathname === "/registrar-delegado";
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const { notify } = useNotification();

  const toggleDrawer = () => {
    setDrawerOpen(prev => !prev);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    logout();
    navigation("/", { replace: true });
    notify("Cerraste sesión.", "info");
  }

  const getHeaderStyles = () => {
    switch (location.pathname) {
      case "/":
        return {
          background: "transparent !important"
        };

      case "/iniciar-sesion":
        return {
          backgroundColor: "transparent"
        };

      case "/registrar-delegado":
        return {
          backgroundColor: "rgb(37, 42, 54)",
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

      case "/iniciar-sesion":
        return 0;

      case "/registrar-delegado":
        return 3;

      case "/lista-delegados":
        return 3;

      default:
        return 3;
    }
  };


  const getButtonStylesByRoute = (route, type, buttonType) => {
    switch (route) {
      case '/':
        if (buttonType === 'register') {
          return type === 'outlined'
            ? {
              color: '#FFFFFF',
              border: '2px solid #FFFFFF',
              '&:hover': {
                backgroundColor: 'transparent',
                color: '#FF7E5F',
                border: '2px solid #FF7E5F',
              },
            }
            : {
              backgroundColor: '#000000',
              color: '#FFFFFF',
              '&:hover': {
                backgroundColor: '#000000',
                color: '#000000',
              },
            };
        } else if (buttonType === 'login') {
          return type === 'outlined'
            ? {
              color: '#FFFFFF',
              border: '2px solid #FFFFFF',
              '&:hover': {
                color: '#FF7E5F',
                border: '2px solid #FF7E5F',
                backgroundColor: 'transparent',
              },
            }
            : {
              backgroundColor: '#FF7E5F',
              color: '#FFFFFF',
              '&:hover': {
                backgroundColor: '#FFFFFF',
                color: '#FF7E5F',
              },
            };
        }
        break;

      case '/registrar-delegado':
        if (buttonType === 'register') {
          return type === 'outlined'
            ? {
              color: '#000000',
              border: '2px solid #000000',
              '&:hover': {
                backgroundColor: 'transparent',
                color: '#FFFFFF',
                border: '2px solid #FFFFFF',
              },
            }
            : {
              backgroundColor: '#FFFFFF',
              color: '#0088FF',
              '&:hover': {
                backgroundColor: '#0088FF',
                color: '#FFFFFF',
              },
            };
        } else if (buttonType === 'login') {
          return type === 'outlined'
            ? {
              color: '#FFFFFF',
              border: '2px solid #FFFFFF',
              '&:hover': {
                color: '#FF7E5F',
                border: '2px solid #FF7E5F',
                backgroundColor: 'transparent',
              },
            }
            : {
              backgroundColor: '#FFFFFF',
              color: '#000000',
              '&:hover': {
                backgroundColor: '#000000',
                color: '#FFFFFF',
              },
            };
        }

      default:
        return type === 'outlined'
          ? {
            color: '#FFFFFF',
            border: '2px solid #FFFFFF',
            '&:hover': {
              color: '#FF7E5F',
              border: '2px solid #FF7E5F',
              backgroundColor: 'transparent',
            },
          }
          : {
            backgroundColor: '#FFFFFF',
            color: '#000000',
            '&:hover': {
              backgroundColor: '#000000',
              color: '#FFFFFF',
            },
          };
    }
  };


  const getAppBarPosition = () => {
  return location.pathname === "/" ? "absolute" : "fixed";
};

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position={getAppBarPosition()}
        elevation={getHeaderElevation()}
        color='transparent'
        sx={{
          ...getHeaderStyles(),
          transition: "all 0.3s ease-in-out"
        }}>
        <Toolbar>
          {(isAuthenticated && user) && (
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 1 }}
              onClick={toggleDrawer}
            >
              {drawerOpen ? <CloseIcon /> : <MenuIcon />}
            </IconButton>
          )}

          <Box display={'flex'} p={0} flexDirection={{
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
                      lg: 90
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

                  {getRoleIcon(user?.rol)}
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

                  {!isRegisterDelegatePage &&
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={() => {
                        if (isLoginPage) {
                          navigation('/', { replace: true });
                        } else {
                          navigation('/iniciar-sesion');
                        }
                      }}
                      sx={{
                        all: "unset",
                        width: { xs: '100%', sm: 'auto' },
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "8px",
                        padding: "6px 16px",
                        textAlign: 'center',
                        transition: "all 0.2s ease-in-out",
                        fontWeight: 600,
                        ...getButtonStylesByRoute(location.pathname, 'contained', 'login')
                      }}
                    >
                      {isLoginPage ? "Volver al inicio" : "Iniciar Sesión"}
                    </Button>
                  }
                </Box> : null
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <NavBar open={drawerOpen} onClose={handleDrawerClose} />
    </Box>
  );
}