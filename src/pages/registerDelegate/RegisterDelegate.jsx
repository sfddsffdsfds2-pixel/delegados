import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import MuiCard from '@mui/material/Card';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { styled } from '@mui/material/styles';
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
import ciExtensions from "../../appConfig/CIExt.json";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  validateName,
  validatePhone,
  validatePassword,
  validateEmail,
  validateCI
} from "../../utils/fieldsValidators.js";
import UserCreatedModal from './components/UserCreatedModal.jsx';
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
  position: 'relative',
  minHeight: '89vh',
  maxHeight: '100%',
  padding: 16,
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  maxWidth: '100%',
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
  const [loading, setIsLoading] = useState(false);
  const [selectedDistrito, setSelectedDistrito] = useState('all');
  const [selectedRecinto, setSelectedRecinto] = useState('all');
  const { notify } = useNotification();
  const [openRecintoModal, setOpenRecintoModal] = useState(false);
  const [errors, setErrors] = useState({});
  const confirm = useConfirm();
  const [createdUser, setCreatedUser] = useState(null);
  const [showCreatedModal, setShowCreatedModal] = useState(false);

  const distritosData =
    data.departamentos[0]
      .provincias[0]
      .municipios[0]
      .distritos;

  const handleCancelClick = (id) => {
    confirm({
      title: "Cancelar creación de delegado",
      description: "¿Está seguro que desea cancelar la creación del delegado?",
      confirmationText: "Sí, cancelar",
      cancellationText: "No",
    })
      .then(async (result) => {
        if (result.confirmed === true) {
          navigate("/lista-delegados-admin", { replace: true });
        }
      })
      .catch(() => { });
  };

  const [formData, setFormData] = React.useState({
    nombre: '',
    apellido: '',
    ci: '',
    ciExtension: 'CB',
    telefono: '',
    distrito: '',
    recinto: '',
    rol: 'delegado',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    let errorMessage = "";

    if (name === "nombre" || name === "apellido") {
      errorMessage = validateName(value);
    }

    if (name === "ci") {
      errorMessage = validateCI(value);
    }

    if (name === "telefono") {
      errorMessage = validatePhone(value);
    }

    if (name === "email" && formData.rol === "jefe_recinto") {
      errorMessage = validateEmail(value);
    }

    if (name === "confirmPassword") {
      errorMessage = validatePassword(value);
    }

    setErrors((prev) => ({
      ...prev,
      [name]: errorMessage,
    }));
  };

  const secondaryAuth = React.useMemo(() => {
    const mainApp = getApps()[0];
    const name = "secondary";
    const secApp = getApps().find(a => a.name === name) || initializeApp(mainApp.options, name);
    return getAuth(secApp);
  }, []);

  useEffect(() => {
    const initialErrors = {
      nombre: validateName(formData.nombre),
      apellido: validateName(formData.apellido),
      ci: validateCI(formData.ci),
      telefono: validatePhone(formData.telefono),
      email: formData.rol === "jefe_recinto" ? validateEmail(formData.email) : "",
      confirmPassword: formData.rol === "jefe_recinto" ? validatePassword(formData.confirmPassword) : "",
      distritoRecinto: !formData.distrito || !formData.recinto
        ? "Selecciona distrito y recinto"
        : ""
    };

    setErrors(initialErrors);
  }, [formData.distrito, formData.recinto, formData.email, formData.confirmPassword, formData.rol]);


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    const ciClean = String(formData.ci).trim().replace(/\s+/g, "");
    const ciFinal = formData.ciExtension
      ? `${ciClean} ${formData.ciExtension}`
      : ciClean;
    const distNum = Number(formData.distrito);

    const isJR = formData.rol === "jefe_recinto";

    const clean = {
      nombre: formData.nombre.trim(),
      apellido: formData.apellido.trim(),
      ci: ciFinal,
      telefono: formData.telefono.trim(),
      distrito: distNum,
      recinto: formData.recinto,
      createdAt: serverTimestamp(),
      jefe_recinto: isJR,
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

      let jrUid = null;

      if (isJR) {
        const emailJR = String(formData.email || "").trim().toLowerCase();
        const passJR = String(formData.confirmPassword || "").trim();


        if (!emailJR || !passJR) {
          notify("Completa correo y contraseña para el jefe de recinto.", "info");
          setIsLoading(false);
          return;
        }

        const cred = await createUserWithEmailAndPassword(secondaryAuth, emailJR, passJR);
        jrUid = cred.user.uid;

        await setDoc(doc(db, "admin", jrUid), {
          email: emailJR,
          rol: "jefe_recinto",
          distrito: String(distNum),
          recinto: formData.recinto,
          createdAt: serverTimestamp(),
        });
      }

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
      setCreatedUser({ id: ciClean, ...clean, email: formData.email || "", password: formData.confirmPassword || "" });
      setShowCreatedModal(true);

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

  const hasErrors = Object.values(errors).some((err) => err);

  if (loading) return <FullScreenProgress text="Registrando delegado..." />

  return (
    <>
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
                    error={!!errors.nombre}
                    helperText={errors.nombre}
                    required
                    fullWidth
                    slotProps={{
                      htmlInput: {
                        maxLength: 50
                      }
                    }}
                  />
                </FormControl>

                <FormControl fullWidth>
                  <FormLabel>Apellido:</FormLabel>
                  <TextField
                    name="apellido"
                    value={formData.apellido}
                    onChange={handleChange}
                    error={!!errors.apellido}
                    helperText={errors.apellido}
                    required
                    fullWidth
                    slotProps={{
                      htmlInput: {
                        maxLength: 50
                      }
                    }}
                  />
                </FormControl>
              </Box>

              <Box display={'flex'} gap={1} flexDirection={{
                xs: 'column',
                sm: 'row',
              }}>
                <FormControl fullWidth>
                  <FormLabel>Cédula de Identidad:</FormLabel>

                  <Box display="flex" gap={1}>
                    <TextField
                      name="ci"
                      value={formData.ci}
                      onChange={handleChange}
                      required
                      fullWidth
                      error={!!errors.ci}
                      helperText={errors.ci}
                      slotProps={{
                        htmlInput: {
                          maxLength: 20
                        }
                      }}
                    />

                    <FormControl sx={{ minWidth: 110 }}>
                      <Select
                        name="ciExtension"
                        value={formData.ciExtension}
                        onChange={handleChange}
                        displayEmpty
                        size="small"
                        renderValue={(selected) => {
                          if (!selected) return "Ext.";
                          return selected;
                        }}
                      >
                        {ciExtensions.map((ext) => (
                          <MenuItem key={ext.code} value={ext.code}>
                            {ext.code} - {ext.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                </FormControl>

                <FormControl fullWidth>
                  <FormLabel>Número de Teléfono:</FormLabel>
                  <TextField
                    name="telefono"
                    slotProps={{
                      htmlInput: {
                        maxLength: 15
                      }
                    }}
                    value={formData.telefono}
                    onChange={handleChange}
                    error={!!errors.telefono}
                    helperText={errors.telefono}
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
                    sx={{
                      justifyContent: "flex-start",
                      color: errors.distritoRecinto ? 'error.main' : 'inherit',
                      borderColor: errors.distritoRecinto ? 'error.main' : 'inherit',
                      '&:hover': {
                        borderColor: errors.distritoRecinto ? 'error.dark' : 'inherit',
                      },
                    }}
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
                        name="email"
                        placeholder="Ingrese un correo electrónico para el jefe de recinto"
                        value={formData.email}
                        error={!!errors.email}
                        onChange={handleChange}
                        required
                        fullWidth
                        helperText={errors.email}
                        slotProps={{
                          htmlInput: {
                            maxLength: 50
                          }
                        }}
                      />
                    </FormControl>

                    <FormControl fullWidth>
                      <FormLabel>Contraseña:</FormLabel>
                      <TextField
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        error={!!errors.confirmPassword}
                        helperText={errors.confirmPassword}
                        required
                        fullWidth
                        slotProps={{
                          htmlInput: {
                            maxLength: 30
                          }
                        }}
                      />
                    </FormControl>
                  </Box>
                </>
              )}
            </Box>

            <Box sx={{ mt: 5, display: 'flex', gap: 2 }}>
              <Button
                fullWidth
                variant="contained"
                color="error"
                onClick={handleCancelClick}
                sx={{
                  borderColor: 'error.main !important',
                  color: '#fff',
                  '&:hover': {
                    borderColor: 'error.dark !important',
                    backgroundColor: 'error.main',
                    color: '#fff'
                  }
                }}
              >
                Cancelar
              </Button>


              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  '&.Mui-disabled': {
                    background: '#86818150',
                    color: '#aaa',
                    border: '1px solid #86818150'
                  }
                }}
                disabled={hasErrors}
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

      <UserCreatedModal
        open={showCreatedModal}
        onClose={() => setShowCreatedModal(false)}
        user={createdUser}
        resetFormData={() => setFormData({
          nombre: '',
          apellido: '',
          ci: '',
          ciExtension: '',
          telefono: '',
          distrito: '',
          recinto: '',
          rol: 'delegado',
          password: '',
          confirmPassword: '',
          email: ''
        })}
      />
    </>
  );
}
