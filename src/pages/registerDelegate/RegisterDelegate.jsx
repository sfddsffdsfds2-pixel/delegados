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
  boxShadow: theme.shadows[10],
  '&:hover': {
    boxShadow: theme.shadows[20],
  },
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
    recinto: '',
  });

  const geoData = {
    "departamentos": [
      {
        "nombre": "Cochabamba",
        "provincias": [
          {
            "nombre": "Quillacollo",
            "municipios": [
              {
                "nombre": "Quillacollo",
                "distritos": [
                  {
                    "numero": 1,
                    "recintos": [
                      { "nombre": "Unidad Educativa Nestor Adriazola (Ex Colegio Nacional Calama)", "direccion": "Av. Constantino Morales y Av. Blanco Galindo Nro. 13", "mesas": 31 },
                      { "nombre": "Instituto Particular Quillacollo", "direccion": "Quillacollo", "mesas": 14 },
                      { "nombre": "Liceo América", "direccion": "General Pando y Pacheco", "mesas": 23 },
                      { "nombre": "Unidad Educativa Villa Moderna", "direccion": "Waldo Ballivián esq. Rafael Pabón", "mesas": 19 },
                      { "nombre": "(Cárcel) Penal San Pablo", "direccion": "Penal de San Pablo", "mesas": 2 },
                      { "nombre": "Unidad Educativa 1ro. de Mayo", "direccion": "Calle 1ro de Mayo entre 21 de Septiembre y Thomas Bata", "mesas": 4 },
                      { "nombre": "Unidad Educativa San Martin de Porres Tarde", "direccion": "Calle s/n Av. Albina Patiño", "mesas": 1 }
                    ]
                  },
                  {
                    "numero": 2,
                    "recintos": [
                      { "nombre": "Colegio Cristina Prada", "direccion": "23 de Marzo S/N y Carmela Cerruto", "mesas": 14 },
                      { "nombre": "Colegio Franz Tamayo", "direccion": "Av. Suárez Miranda Nro. 515", "mesas": 22 },
                      { "nombre": "Escuela Simón Bolívar", "direccion": "Cleomedes Blanco y Atacama", "mesas": 16 },
                      { "nombre": "Escuela Fidelia C. De Sanchez", "direccion": "Calle 6 de Agosto y Cleomedes Blanco", "mesas": 12 },
                      { "nombre": "Unidad Educativa Heroínas", "direccion": "C/ Ayacucho entre Gral. Camacho y Pacheco", "mesas": 13 },
                      { "nombre": "Teofilo Vargas Candia B", "direccion": "23 de Marzo S/N y Carmela Cerruto", "mesas": 22 },
                      { "nombre": "Unidad Educativa Flora Salinas Hinojosa Amalia Echalar", "direccion": "Luis Uría y 23 de Marzo", "mesas": 1 },
                      { "nombre": "Unidad Educativa Nuestra Señora de Urkupiña", "direccion": "Calle Ricardo Soruco entre Walter Moreno y Nataniel Aguirre", "mesas": 2 },
                      { "nombre": "Unidad Educativa Milivoy Eterovic Matenda", "direccion": "Km 12 1/2 Av. Blanco Galindo y Av. Cochabamba", "mesas": 14 }
                    ]
                  },
                  {
                    "numero": 3,
                    "recintos": [
                      { "nombre": "Escuela 12 de Septiembre", "direccion": "General Camacho Final Sud", "mesas": 16 },
                      { "nombre": "Escuela Tomas Bata", "direccion": "Calle 12 de Enero", "mesas": 13 },
                      { "nombre": "Unidad Educativa 12 de Enero B", "direccion": "Av. Gral. Camacho entre Calle 10 y Av. Fructuoso Mercado", "mesas": 5 },
                      { "nombre": "Unidad Educativa Villa Asunción", "direccion": "Villa Asunción, lado Centro de Salud", "mesas": 4 },
                      { "nombre": "Unidad Educativa San Martín de Porres", "direccion": "Barrio Manaco, Calle 12 de Enero", "mesas": 2 },
                      { "nombre": "Colegio Nacional Calama (Nueva Infraestructura)", "direccion": "Av. Ferroviaria Sud", "mesas": 6 }
                    ]
                  },
                  {
                    "numero": 4,
                    "recintos": [
                      { "nombre": "Unidad Educativa Ironcollo", "direccion": "Ironcollo", "mesas": 15 },
                      { "nombre": "Unidad Educativa Martin Cardenas", "direccion": "Barrio Fabril Esmeralda", "mesas": 11 },
                      { "nombre": "Unidad Educativa Tunari", "direccion": "C/ 23 de Marzo entre Nueva Luz, OTB Tunari", "mesas": 8 },
                      { "nombre": "Unidad Educativa 23 de Marzo", "direccion": "Calle Huachirancho", "mesas": 3 },
                      { "nombre": "Unidad Educativa Jose Miguel Lanza (Illataco)", "direccion": "5 Km de Quillacollo al Norte", "mesas": 9 },
                      { "nombre": "Normal Simón Rodríguez (Ex Nucleo Escolar Paucarpata)", "direccion": "4 Km de Quillacollo al Norte", "mesas": 14 }
                    ]
                  },
                  {
                    "numero": 5,
                    "recintos": [
                      { "nombre": "Unidad Educativa 21 de Septiembre", "direccion": "OTB Aasana Villa María, Calle 13 frente a la Plaza", "mesas": 13 },
                      { "nombre": "Escuela Felix Martinez", "direccion": "Av. Blanco Galindo Km 10 1/2", "mesas": 29 },
                      { "nombre": "Centro Integral Niño Jesus Fe y Alegria", "direccion": "Calle 4 y Miraflores", "mesas": 9 },
                      { "nombre": "Unidad Educativa Pocpocollo", "direccion": "Comunidad Pocpocollo", "mesas": 2 }
                    ]
                  },
                  {
                    "numero": 6,
                    "recintos": [
                      { "nombre": "Unidad Educativa Villa De Urkupiña", "direccion": "Final Sud Av. Martín Cárdenas Calvario", "mesas": 18 },
                      { "nombre": "Unidad Educativa Cerro Cota", "direccion": "OTB La Cota, zona Calvario", "mesas": 2 },
                      { "nombre": "Unidad Educativa Cotapachi", "direccion": "Carretera Quillacollo–Cochabamba, Sindicato Agrario Cotapachi", "mesas": 2 }
                    ]
                  },
                  {
                    "numero": 7,
                    "recintos": [
                      { "nombre": "Unidad Educativa Marquina", "direccion": "Quillacollo", "mesas": 21 },
                      { "nombre": "Unidad Educativa Marquina (Secundaria)", "direccion": "Zona Marquina, 6 Km camino a Morochata", "mesas": 4 },
                      { "nombre": "Unidad Educativa Bella Vista", "direccion": "Bella Vista, 7 Km camino a Morochata", "mesas": 23 },
                      { "nombre": "Unidad Educativa Potrero", "direccion": "Comunidad Potrero, camino vecinal al norte", "mesas": 6 }
                    ]
                  },
                  {
                    "numero": 8,
                    "recintos": [
                      { "nombre": "Escuela Arturo Quitón", "direccion": "Calle Final Antofagasta", "mesas": 19 },
                      { "nombre": "Unidad Educativa Rene Crespo Rico", "direccion": "Calle Final Antofagasta", "mesas": 3 },
                      { "nombre": "Unidad Educativa Oscar Alfaro", "direccion": "Pantoja Baja, parada Línea P", "mesas": 4 },
                      { "nombre": "Unidad Educativa El Paso", "direccion": "El Paso", "mesas": 18 },
                      { "nombre": "Unidad Educativa Maria Auxiliadora", "direccion": "Km 17 entre El Paso y Tiquipaya", "mesas": 7 },
                      { "nombre": "Instituto Tecnológico El Paso", "direccion": "Av. Elías Meneces", "mesas": 9 },
                      { "nombre": "Unidad Educativa El Paso A", "direccion": "Zona Central El Paso", "mesas": 16 },
                      { "nombre": "Unidad Educativa Molle Molle", "direccion": "Comunidad Molle Molle", "mesas": 2 },
                      { "nombre": "Unidad Educativa Santiago Apóstol", "direccion": "Zona Candelaria Urinzaya, El Paso", "mesas": 2 }
                    ]
                  },
                  {
                    "numero": 9,
                    "recintos": [
                      { "nombre": "Unidad Educativa Rene Barrientos Ortuño (Misicuni)", "direccion": "Misicuni", "mesas": 2 },
                      { "nombre": "Centro Internado Misicuni", "direccion": "Misicuni", "mesas": 3 },
                      { "nombre": "Unidad Educativa Liriuni", "direccion": "Liriuni", "mesas": 1 }
                    ]
                  },
                  {
                    "numero": 10,
                    "recintos": [
                      { "nombre": "Unidad Educativa Mcal. José Ballivián", "direccion": "Barrio Saavedra, Av. Capitán Víctor Ustáriz", "mesas": 14 }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  };

  const DEP = "Cochabamba";
  const PROV = "Quillacollo";
  const MUNI = "Quillacollo";

  const municipioObj = React.useMemo(() => {
    const dep = geoData.departamentos.find(d => d.nombre === DEP);
    const prov = dep?.provincias?.find(p => p.nombre === PROV);
    const muni = prov?.municipios?.find(m => m.nombre === MUNI);
    return muni ?? null;
  }, []);

  const distritos = React.useMemo(() => {
    return (municipioObj?.distritos ?? []).map(d => d.numero);
  }, [municipioObj]);

  const recintosDisponibles = React.useMemo(() => {
    const distNum = Number(formData.distrito);
    if (!distNum) return [];
    const found = municipioObj?.distritos?.find(d => d.numero === distNum);
    return found?.recintos ?? [];
  }, [formData.distrito, municipioObj]);

  const handleChange = (e) => {
    const { name, value } = e.target;

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

    const ciClean = String(formData.ci).trim().replace(/\s+/g, "");
    const distNum = Number(formData.distrito);

    const clean = {
      nombre: formData.nombre.trim(),
      apellido: formData.apellido.trim(),
      ci: ciClean,
      telefono: formData.telefono.trim(),
      distrito: distNum,
      recinto: formData.recinto,
      createdAt: serverTimestamp()
    };

    if (!clean.nombre || !clean.apellido || !clean.ci || !clean.telefono || !clean.distrito || !clean.recinto) {
      alert("Completa todos los campos");
      return;
    }

    try {
      const ref = doc(db, "delegados", ciClean);

      await setDoc(ref, clean, { merge: false });

      alert("Registrado correctamente");
      navigate("/", { replace: true });
    } catch (err) {
      console.error(err);
      alert(err?.message || "Error registrando. Revisa rules o config.");
    }
  };

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <Container direction="column" justifyContent="center" mt={{ xs: 12, lg: 0 }}>

        <Card variant="outlined" sx={{ overflow: 'auto' }}>
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
                {distritos.map((d) => (
                  <MenuItem key={d} value={d}>
                    Distrito {d}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>

              <FormLabel>Recinto (Unidad Educativa)</FormLabel>
              <Select
                name="recinto"
                value={formData.recinto}
                onChange={handleChange}
                required
                disabled={!formData.distrito}
                displayEmpty
              >
                <MenuItem value="" disabled>
                  {formData.distrito ? "Selecciona una unidad educativa" : "Primero elige un distrito"}
                </MenuItem>

                {recintosDisponibles.map((r, idx) => (
                  <MenuItem key={idx} value={r.nombre}>
                    {r.nombre}
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
