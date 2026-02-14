import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { styled } from '@mui/material/styles';
import AppTheme from '../../shared-theme/AppTheme';
import ColorModeSelect from '../login/components/ColorModeSelect';
import { useNavigate } from 'react-router-dom';
import { db } from "../../firebase/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { Toolbar } from '@mui/material';

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  [theme.breakpoints.up('sm')]: {
    maxWidth: '500px',
  },
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
}));

const Container = styled(Stack)(({ theme }) => ({
  height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
  minHeight: '100%',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    zIndex: -1,
    inset: 0,
    background: 'linear-gradient(135deg, #FFA347, #FF7E5F)',
  },
}));

export default function RegisterDelegatePage(props) {
  const navigate = useNavigate();

  const [formData, setFormData] = React.useState({
    nombre: '',
    apellido: '',
    ci: '',
    telefono: '',
    distrito: '',
  });

  const distritos = [
    'Distrito 1',
    'Distrito 2',
    'Distrito 3',
    'Distrito 4',
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const clean = {
      nombre: formData.nombre.trim(),
      apellido: formData.apellido.trim(),
      ci: formData.ci.trim(),
      telefono: formData.telefono.trim(),
      distrito: formData.distrito,
    };

    if (!clean.nombre || !clean.apellido || !clean.ci || !clean.telefono || !clean.distrito) {
      alert("Completa todos los campos");
      return;
    }

    try {
      const ref = doc(db, "delegados", clean.ci);

      const snap = await getDoc(ref);
      if (snap.exists()) {
        alert("Ese CI ya está registrado");
        return;
      }

      await setDoc(ref, {
        ...clean,
        createdAt: serverTimestamp(),
      });

      alert("Registrado correctamente");
      navigate("/", { replace: true });
    } catch (err) {
      console.error(err);
      alert("Error registrando. Revisa rules o config.");
    }
  };

  return ( 
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <Toolbar />
      <Container direction="column" justifyContent="center">
        {/* <ColorModeSelect sx={{ position: 'fixed', top: '1rem', right: '1rem' }} /> */}

        <Card variant="outlined" sx={{overflow: 'auto'}}>
          <Typography
            component="h1"
            variant="h4"
            sx={{ fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
          >
            Registro de delegado
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            <FormControl>
              <FormLabel>Nombre</FormLabel>
              <TextField
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                fullWidth
              />
            </FormControl>

            <FormControl>
              <FormLabel>Apellido</FormLabel>
              <TextField
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                required
                fullWidth
              />
            </FormControl>

            <FormControl>
              <FormLabel>Cédula de Identidad</FormLabel>
              <TextField
                name="ci"
                value={formData.ci}
                onChange={handleChange}
                required
                fullWidth
              />
            </FormControl>

            <FormControl>
              <FormLabel>Número de Teléfono</FormLabel>
              <TextField
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                required
                fullWidth
              />
            </FormControl>

            <FormControl fullWidth>
              <FormLabel>Distrito</FormLabel>
              <Select
                name="distrito"
                value={formData.distrito}
                onChange={handleChange}
                required
              >
                {distritos.map((d, index) => (
                  <MenuItem key={index} value={d}>
                    {d}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button
              type="submit"
              fullWidth
              variant="contained"
            >
              Registrarse
            </Button>

            <Typography
              variant="body2"
              sx={{ textAlign: 'center', mt: 2 }}
            >
              ¿Dudas sobre su distrito?{' '}
              <Link
                component="a"
                href="tel:+59170000000"
              >
                Comuníquese al 70000000
              </Link>
            </Typography>
          </Box>
        </Card>
      </Container>
    </AppTheme>
  );
}
