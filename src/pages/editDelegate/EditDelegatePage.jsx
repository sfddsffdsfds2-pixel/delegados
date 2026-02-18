import * as React from 'react';
import {
  Box,
  Button,
  CssBaseline,
  TextField,
  Typography,
  MenuItem,
  Select,
  Toolbar,
  Divider
} from '@mui/material';

import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import { useNavigate, useLocation, useParams } from 'react-router-dom';

import {
  doc,
  updateDoc,
  serverTimestamp,
  deleteField
} from "firebase/firestore";

import { db } from "../../firebase/firebase";
import { useConfirm } from 'material-ui-confirm';
import { useNotification } from '../../contexts/NotificationContext';
import { FullScreenProgress } from '../../generalComponents/FullScreenProgress';
import RecintoSelectorModal from '../../generalComponents/SelectRecinto';

import data from '../../appConfig/Map.json';
import ciExtensions from "../../appConfig/CIExt.json";

import {
  validateName,
  validatePhone,
  validateCI
} from "../../utils/fieldsValidators";

const STORAGE_KEY = "delegados";

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  flexGrow: 1,
  gap: theme.spacing(2),
  boxShadow: theme.shadows[10],
}));

const Container = styled(Box)(({ theme }) => ({
  minHeight: '89vh',
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
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


export default function EditDelegatePage() {

  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const confirm = useConfirm();
  const { notify } = useNotification();

  const distritosData =
    data.departamentos[0]
      .provincias[0]
      .municipios[0]
      .distritos;

  const [saving, setSaving] = React.useState(false);
  const [openRecintoModal, setOpenRecintoModal] = React.useState(false);
  const [mesaMax, setMesaMax] = React.useState(0);
  const [usedMesas, setUsedMesas] = React.useState(new Set());

  const [formData, setFormData] = React.useState(null);
  const [errors, setErrors] = React.useState({});

  // 🔥 Obtener delegado desde state o sessionStorage
  React.useEffect(() => {

    let delegate = location.state?.delegate;

    // fallback si refrescan
    if (!delegate) {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      const arr = raw ? JSON.parse(raw) : [];
      delegate = arr.find(d => String(d.id) === String(id));
    }

    if (!delegate) {
      notify("No se encontró el delegado", "error");
      navigate("/lista-delegados-admin");
      return;
    }

    const ciParts = delegate.ci?.split(" ") || [];

    setFormData({
      ...delegate,
      id: delegate.id,
      ci: ciParts[0] || "",
      ciExtension: ciParts[1] || "CB",
      rol: delegate.jefe_recinto ? "jefe_recinto" : "delegado",
      mesa: delegate.mesa || ""
    });

  }, [location.state, id]);

  // 🔥 Calcular mesas disponibles (como tu modal)
  React.useEffect(() => {

    if (!formData?.distrito || !formData?.recinto) return;

    const distritoObj = distritosData.find(
      d => d.numero === Number(formData.distrito)
    );

    const recintoObj = distritoObj?.recintos.find(
      r => r.nombre === formData.recinto
    );

    if (!recintoObj) return;

    setMesaMax(recintoObj.mesas);

    const raw = sessionStorage.getItem(STORAGE_KEY);
    const arr = raw ? JSON.parse(raw) : [];

    const used = new Set();

    arr.forEach(r => {
      if (
        r.recinto === formData.recinto &&
        Number(r.distrito) === Number(formData.distrito) &&
        r.mesa &&
        String(r.id) !== String(formData.id)
      ) {
        used.add(Number(r.mesa));
      }
    });

    setUsedMesas(used);

  }, [formData?.distrito, formData?.recinto, formData?.id]);

  const mesasDisponibles = React.useMemo(() => {
    if (!mesaMax) return [];
    const options = [];
    for (let i = 1; i <= mesaMax; i++) {
      if (i !== Number(formData?.mesa) && usedMesas.has(i)) continue;
      options.push(i);
    }
    return options;
  }, [mesaMax, usedMesas, formData?.mesa]);

  if (!formData) return null;
  if (saving) return <FullScreenProgress text="Actualizando delegado..." />;

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "rol") {
      setFormData(prev => ({
        ...prev,
        rol: value,
        mesa: value === "jefe_recinto" ? "" : prev.mesa
      }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    let errorMessage = "";

    if (name === "nombre" || name === "apellido")
      errorMessage = validateName(value);

    if (name === "telefono")
      errorMessage = validatePhone(value);

    if (name === "ci")
      errorMessage = validateCI(value);

    setErrors(prev => ({
      ...prev,
      [name]: errorMessage
    }));
  };

  const hasErrors = Object.values(errors).some(e => e);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (hasErrors) return;

    try {
      setSaving(true);

      const ciFinal = `${formData.ci.trim()} ${formData.ciExtension}`;

      const payload = {
        nombre: formData.nombre.trim(),
        apellido: formData.apellido.trim(),
        telefono: formData.telefono.trim(),
        distrito: Number(formData.distrito),
        recinto: formData.recinto,
        ci: ciFinal,
        jefe_recinto: formData.rol === "jefe_recinto",
        updatedAt: serverTimestamp()
      };

      if (formData.rol === "delegado" && formData.mesa)
        payload.mesa = Number(formData.mesa);
      else
        payload.mesa = deleteField();

      await updateDoc(doc(db, "delegados", String(formData.id)), payload);

      // 🔥 actualizar sessionStorage
      const raw = sessionStorage.getItem(STORAGE_KEY);
      const arr = raw ? JSON.parse(raw) : [];

      const updated = arr.map(r =>
        String(r.id) === String(formData.id)
          ? { ...r, ...payload }
          : r
      );

      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

      notify("Delegado actualizado correctamente", "success");
      navigate(-1);

    } catch (err) {
      console.error(err);
      notify("Error actualizando delegado", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    confirm({
      title: "Cancelar edición",
      description: "¿Deseas cancelar los cambios?",
      confirmationText: "Sí",
      cancellationText: "No"
    }).then(r => {
      if (r.confirmed) navigate(-1);
    });
  };

  return (
    <>
      <CssBaseline enableColorScheme />
      <Toolbar />

      <Container>
        <Card>

          <Typography variant="h4">
            Editar delegado
          </Typography>

          <Box component="form" onSubmit={handleSubmit} display="flex" flexDirection="column" gap={2}>

            <Box display="flex" gap={1}>
              <TextField
                label="Nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                error={!!errors.nombre}
                helperText={errors.nombre}
                fullWidth
              />
              <TextField
                label="Apellido"
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                error={!!errors.apellido}
                helperText={errors.apellido}
                fullWidth
              />
            </Box>

            <Box display="flex" gap={1}>
              <TextField
                label="CI"
                name="ci"
                value={formData.ci}
                onChange={handleChange}
                error={!!errors.ci}
                helperText={errors.ci}
                fullWidth
              />
              <Select
                name="ciExtension"
                value={formData.ciExtension}
                onChange={handleChange}
              >
                {ciExtensions.map(ext => (
                  <MenuItem key={ext.code} value={ext.code}>
                    {ext.code}
                  </MenuItem>
                ))}
              </Select>
              <TextField
                label="Teléfono"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                error={!!errors.telefono}
                helperText={errors.telefono}
                fullWidth
              />
            </Box>

            <Button variant="outlined" onClick={() => setOpenRecintoModal(true)}>
              {formData.recinto
                ? `Distrito ${formData.distrito} - ${formData.recinto}`
                : "Seleccionar distrito y recinto"}
            </Button>

            <Select name="rol" value={formData.rol} onChange={handleChange}>
              <MenuItem value="delegado">Delegado</MenuItem>
              <MenuItem value="jefe_recinto">Jefe de recinto</MenuItem>
            </Select>

            {formData.rol === "delegado" && (
              <Select
                name="mesa"
                value={formData.mesa}
                onChange={handleChange}
              >
                {mesasDisponibles.map(m => (
                  <MenuItem key={m} value={m}>
                    Mesa {m}
                  </MenuItem>
                ))}
              </Select>
            )}

            {formData.rol === "jefe_recinto" && (
              <>
                <Divider />
                <Box sx={{ fontSize: 14, opacity: 0.7 }}>
                  El jefe de recinto administra todas las mesas del recinto.
                </Box>
              </>
            )}

            <Box display="flex" gap={2} mt={3}>
              <Button fullWidth color="error" variant="contained" onClick={handleCancel}>
                Cancelar
              </Button>

              <Button fullWidth type="submit" variant="contained" disabled={hasErrors}>
                Guardar cambios
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
          setFormData(prev => ({
            ...prev,
            recinto,
            distrito,
            mesa: ""
          }));
        }}
      />
    </>
  );
}
