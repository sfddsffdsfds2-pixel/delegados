import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  FormLabel,
  Select,
  MenuItem,
  Box,
  Divider
} from "@mui/material";
import { useState, useEffect, useMemo } from "react";
import RecintoSelectorModal from "../../../generalComponents/SelectRecinto";
import data from "../../../appConfig/Map.json";
import ciExtensions from "../../../appConfig/CIExt.json";

import {
  validateName,
  validatePhone,
  validateCI
} from "../../../utils/fieldsValidators";

export default function EditDelegate({
  open,
  onClose,
  selectedDelegate,
  onSave
}) {

  const distritosData =
    data.departamentos[0]
      .provincias[0]
      .municipios[0]
      .distritos;

  const [openRecintoModal, setOpenRecintoModal] = useState(false);

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    ci: '',
    ciExtension: 'CB',
    telefono: '',
    distrito: '',
    recinto: '',
    mesa: '',
    rol: 'delegado'
  });

  const [errors, setErrors] = useState({});

  // Cargar datos
  useEffect(() => {
    if (selectedDelegate) {

      const ciParts = selectedDelegate.ci?.split(" ") || [];

      setFormData({
        ...selectedDelegate,
        ci: ciParts[0] || '',
        ciExtension: ciParts[1] || 'CB',
        rol: selectedDelegate.jefe_recinto ? "jefe_recinto" : "delegado",
        mesa: selectedDelegate.mesa || ''
      });
    }
  }, [selectedDelegate]);

  // Generar mesas
  const mesasDisponibles = useMemo(() => {
    if (!formData.distrito || !formData.recinto) return [];

    const distritoObj = distritosData.find(
      d => d.numero === Number(formData.distrito)
    );

    if (!distritoObj) return [];

    const recintoObj = distritoObj.recintos.find(
      r => r.nombre === formData.recinto
    );

    if (!recintoObj) return [];

    return Array.from({ length: recintoObj.mesas }, (_, i) => i + 1);
  }, [formData.distrito, formData.recinto]);

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

    setErrors(prev => ({
      ...prev,
      [name]: errorMessage
    }));
  };

  // Validación automática
  useEffect(() => {

    const newErrors = {
      nombre: validateName(formData.nombre),
      apellido: validateName(formData.apellido),
      ci: validateCI(formData.ci),
      telefono: validatePhone(formData.telefono),
      distritoRecinto: !formData.distrito || !formData.recinto
        ? "Selecciona distrito y recinto"
        : "",
      mesa: formData.rol === "delegado" && !formData.mesa
        ? "Selecciona una mesa"
        : ""
    };

    setErrors(newErrors);

  }, [
    formData.nombre,
    formData.apellido,
    formData.ci,
    formData.telefono,
    formData.distrito,
    formData.recinto,
    formData.mesa,
    formData.rol
  ]);

  const handleSubmit = () => {

    const hasErrors = Object.values(errors).some(err => err);

    if (hasErrors) return;

    const ciClean = String(formData.ci).trim().replace(/\s+/g, "");
    const ciFinal = formData.ciExtension
      ? `${ciClean} ${formData.ciExtension}`
      : ciClean;

    const cleanData = {
      nombre: formData.nombre.trim(),
      apellido: formData.apellido.trim(),
      ci: ciFinal,
      telefono: formData.telefono.trim(),
      distrito: Number(formData.distrito),
      recinto: formData.recinto,
      mesa: formData.rol === "delegado" ? formData.mesa : null,
      jefe_recinto: formData.rol === "jefe_recinto"
    };

    onSave(cleanData);
  };

  const hasErrors = Object.values(errors).some(err => err);

  return (
    <>
      <Dialog
        open={open}
        onClose={(_, reason) => {
          if (reason === "backdropClick") return;
          onClose();
        }}
        fullScreen
      >
        <DialogTitle>Editar delegado</DialogTitle>

        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            mt: 1
          }}
        >

          {/* Nombre + Apellido */}
          <Box display="flex" gap={1} flexDirection={{ xs: "column", sm: "row" }}>
            <FormControl fullWidth>
              <FormLabel>Nombre:</FormLabel>
              <TextField
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                error={!!errors.nombre}
                helperText={errors.nombre}
                fullWidth
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
                fullWidth
              />
            </FormControl>
          </Box>

          {/* CI + Extension + Teléfono */}
          <Box display="flex" gap={1} flexDirection={{ xs: "column", sm: "row" }}>
            <FormControl fullWidth>
              <FormLabel>Cédula de Identidad:</FormLabel>

              <Box display="flex" gap={1}>
                <TextField
                  name="ci"
                  value={formData.ci}
                  onChange={handleChange}
                  error={!!errors.ci}
                  helperText={errors.ci}
                  fullWidth
                />

                <FormControl sx={{ minWidth: 110 }}>
                  <Select
                    name="ciExtension"
                    value={formData.ciExtension}
                    onChange={handleChange}
                    size="small"
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
              <FormLabel>Teléfono:</FormLabel>
              <TextField
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                error={!!errors.telefono}
                helperText={errors.telefono}
                fullWidth
              />
            </FormControl>
          </Box>

          {/* Distrito + Rol */}
          <Box display="flex" gap={1} flexDirection={{ xs: "column", sm: "row" }}>
            <FormControl fullWidth>
              <FormLabel>Distrito y recinto:</FormLabel>
              <Button
                variant="outlined"
                onClick={() => setOpenRecintoModal(true)}
                sx={{
                  justifyContent: "flex-start",
                  color: errors.distritoRecinto ? 'error.main' : 'inherit',
                  borderColor: errors.distritoRecinto ? 'error.main' : 'inherit'
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

          {/* Mesa SOLO delegado */}
          {formData.rol === "delegado" && (
            <FormControl fullWidth disabled={!formData.recinto}>
              <FormLabel>Número de Mesa:</FormLabel>
              <Select
                name="mesa"
                value={formData.mesa}
                onChange={handleChange}
                error={!!errors.mesa}
              >
                {mesasDisponibles.map((mesa) => (
                  <MenuItem key={mesa} value={mesa}>
                    Mesa {mesa}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {formData.rol === "jefe_recinto" && (
            <>
              <Divider />
              <Box sx={{ fontSize: 14, opacity: 0.7 }}>
                El jefe de recinto administra todas las mesas del recinto.
              </Box>
            </>
          )}

        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>
            Cancelar
          </Button>

          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={hasErrors}
          >
            Guardar cambios
          </Button>
        </DialogActions>
      </Dialog>

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
