import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { styled, useColorScheme } from '@mui/material/styles';
import AppTheme from '../../shared-theme/AppTheme';
import { useNavigate } from 'react-router-dom';
import { db } from "../../firebase/firebase";
import { doc, getDoc, setDoc, serverTimestamp, runTransaction } from "firebase/firestore";
import { Divider, Toolbar } from '@mui/material';
import { useConfirm } from 'material-ui-confirm';
import { useState } from 'react';
import { useNotification } from '../../contexts/NotificationContext';
import { FullScreenProgress } from '../../generalComponents/FullScreenProgress';
import data from '../../appConfig/Map.json';
import RecintoSelectorModal from '../../generalComponents/SelectRecinto';
import { useMemo } from 'react';
import { useEffect } from 'react';

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  height: '100%',
  flexGrow: 1,
  paddingHorizontal: theme.spacing(4),
  gap: theme.spacing(2),
  maxWidth: '100%',
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  boxShadow: theme.shadows[10],
  '&:hover': {
    boxShadow: theme.shadows[20],
  },
}));

const Container = styled(Box)(({ theme }) => ({
  minHeight: '89vh',
  maxHeight: 'auto',
  padding: 16,
  display: 'flex',
  maxWidth: '100vw',
  flexDirection: 'column',
  width: '100vw',
  maxWidth: '100vw',
  mt: 4,
  overflow: 'hidden',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    paddingX: theme.spacing(2),
  },
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    zIndex: -1,
    inset: 0,
    backgroundImage:
      'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    backgroundRepeat: 'no-repeat',
    ...theme.applyStyles('dark', {
      backgroundImage:
        'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
    }),
  },
}));

export default function RegisterDelegatePage(props) {
  const navigate = useNavigate();
  const { setMode } = useColorScheme();
  const [loading, setIsLoading] = useState(false);
  const [selectedDistrito, setSelectedDistrito] = useState('all');
  const [selectedRecinto, setSelectedRecinto] = useState('all');
  const { notify } = useNotification();
  const [openRecintoModal, setOpenRecintoModal] = useState(false);
  const confirm = useConfirm();

  const distritosData =
    data.departamentos[0]
      .provincias[0]
      .municipios[0]
      .distritos;

  const handleCancelClick = (id) => {
    confirm({
      title: "Borrar delegado",
      description: "¿Está seguro que desea cancelar la creación del delegado?",
      confirmationText: "Sí, borrar",
      cancellationText: "No",
    })
      .then(async (result) => {
        if (result.confirmed === true) {
          navigate("/lista-delegados-admin", { replace: true });
        }
      })
      .catch(() => { });
  };

  React.useEffect(() => {
    setMode('dark');

    return () => {
      setMode('light');
    };
  }, [setMode]);

  const [formData, setFormData] = React.useState({
    nombre: '',
    apellido: '',
    ci: '',
    telefono: '',
    distrito: '',
    recinto: '',
    rol: 'delegado',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "rol") {
      setFormData((prev) => ({
        ...prev,
        rol: value,
        password: '',
        confirmPassword: ''
      }));
      return;
    }

    if (name === "distrito") {
      setFormData((prev) => ({
        ...prev,
        distrito: value,
        recinto: "",
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    const ciClean = String(formData.ci).trim().replace(/\s+/g, "");
    const distNum = Number(formData.distrito);

    const clean = {
      nombre: formData.nombre.trim(),
      apellido: formData.apellido.trim(),
      ci: ciClean,
      telefono: formData.telefono.trim(),
      distrito: distNum,
      recinto: formData.recinto,
      createdAt: serverTimestamp(),
    };

    if (
      !clean.nombre ||
      !clean.apellido ||
      !clean.ci ||
      !clean.telefono ||
      !clean.distrito ||
      !clean.recinto
    ) {
      notify("Completa todos los campos antes de crear un delegado", 'info');
      return;
    }

    try {
      setIsLoading(true);
      const ref = doc(db, "delegados", ciClean);

      await runTransaction(db, async (tx) => {
        const snap = await tx.get(ref);

        if (snap.exists()) {
          throw new Error("CI_EXISTS");
        }

        tx.set(ref, clean);
      });

      try {
        const raw = sessionStorage.getItem("delegados");
        const arr = raw ? JSON.parse(raw) : [];
        const next = Array.isArray(arr) ? arr : [];

        next.unshift({ id: ciClean, ...clean });

        sessionStorage.setItem("delegados", JSON.stringify(next));
      } catch (e2) {
        console.warn("No se pudo actualizar sessionStorage delegados", e2);
      }

      notify("Delegado registrado exitosamente.", 'success');
      navigate("/lista-delegados-admin", { replace: true });
    } catch (err) {
      console.error(err);

      if (err?.message === "CI_EXISTS") {
        notify("Error al registrar: Este C.I. ya está registrado en el sistema.", 'error');
        return;
      }
      notify("Ocurrió un error inesperado al registrar el delegado. Inténtalo de nuevo más tarde.", "success");
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) return <FullScreenProgress text="Registrando delegado..." />

  return (
    <AppTheme>
      <CssBaseline enableColorScheme />
      <Toolbar />
      <Container direction="column">
        <Card variant="outlined">
          <Box display={'flex'} height={'100%'} flexDirection={'column'} flexGrow={1}>
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
                flexGrow: 1,
              }}
            >
              <Box display={'flex'} gap={1} flexDirection={{
                xs: 'column',
                sm: 'row',
              }}>
                <FormControl fullWidth>
                  <FormLabel>Nombre:</FormLabel>
                  <TextField
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                    fullWidth
                  />
                </FormControl>

                <FormControl fullWidth>
                  <FormLabel>Apellido:</FormLabel>
                  <TextField
                    name="apellido"
                    value={formData.apellido}
                    onChange={handleChange}
                    required
                    fullWidth
                  />
                </FormControl>
              </Box>

              <Box display={'flex'} gap={1} flexDirection={{
                xs: 'column',
                sm: 'row',
              }}>
                <FormControl fullWidth>
                  <FormLabel>Cédula de Identidad:</FormLabel>
                  <TextField
                    name="ci"
                    value={formData.ci}
                    onChange={handleChange}
                    required
                    fullWidth
                  />
                </FormControl>

                <FormControl fullWidth>
                  <FormLabel>Número de Teléfono:</FormLabel>
                  <TextField
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    required
                    fullWidth
                  />
                </FormControl>
              </Box>

              <Box display={'flex'} gap={1} flexDirection={{
                xs: 'column',
                sm: 'row',
              }}>
                <FormControl fullWidth>
                  <FormLabel>Distrito y recinto:</FormLabel>

                  <Button
                    variant="outlined"
                    onClick={() => setOpenRecintoModal(true)}
                    sx={{ justifyContent: "flex-start" }}
                  >
                    {formData.recinto
                      ? `Distrito ${formData.distrito} - ${formData.recinto}`
                      : "Seleccionar distrito y recinto"}
                  </Button>
                </FormControl>

                <FormControl fullWidth>
                  <FormLabel>Rol:</FormLabel>
                  <Select
                    name="rol"
                    value={formData.rol}
                    onChange={handleChange}
                    required
                    displayEmpty
                  >
                    <MenuItem value="delegado">
                      Delegado de mesa
                    </MenuItem>

                    <MenuItem value="jefe_recinto">
                      Jefe de recinto
                    </MenuItem>
                  </Select>
                </FormControl>
              </Box>

              {formData.rol === "jefe_recinto" && (
                <>
                  <Divider />
                  <Box
                    display="flex"
                    gap={1}
                    flexDirection={{ xs: "column", sm: "row" }}
                  >
                    <FormControl fullWidth>
                      <FormLabel>Correo electrónico:</FormLabel>
                      <TextField
                        name="password"
                        placeholder="Ingrese un correo electrónico para el jefe de recinto"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        fullWidth
                      />
                    </FormControl>

                    <FormControl fullWidth>
                      <FormLabel>Contraseña:</FormLabel>
                      <TextField
                        name="confirmPassword"
                        placeholder="Ingrese una contraseña para el jefe de recinto"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        fullWidth
                      />
                    </FormControl>
                  </Box>
                </>
              )}
            </Box>

            <Box sx={{ mt: 5, display: 'flex', gap: 2 }}>
              <Button
                fullWidth
                variant="outlined"
                color="error"
                onClick={handleCancelClick}
              >
                Cancelar
              </Button>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  unset: 'all',
                  mt: 'auto'
                }}
                onClick={handleSubmit}
              >
                Registrar
              </Button>
            </Box>
          </Box>
        </Card>
      </Container>

      <RecintoSelectorModal
        open={openRecintoModal}
        onClose={() => setOpenRecintoModal(false)}
        distritosData={distritosData}
        onSelect={({ recinto, distrito }) => {
          setFormData((prev) => ({
            ...prev,
            recinto,
            distrito
          }));

          setSelectedDistrito(distrito);
          setSelectedRecinto(recinto);
        }}
      />

    </AppTheme >
  );
}
