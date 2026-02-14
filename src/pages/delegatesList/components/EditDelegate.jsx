import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Checkbox,
    FormControlLabel
} from "@mui/material";
import { useState, useEffect } from "react";


export default function EditDelegate({
  open,
  onClose,
  selectedDelegate,
  onSave
}) {

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    ci: '',
    telefono: '',
    distrito: '',
    mesa: '',
    jefeRecinto: false,
  });

  useEffect(() => {
    if (selectedDelegate) {
      setFormData({
        ...selectedDelegate,
        jefeRecinto: selectedDelegate.jefeRecinto || false,
      });
    }
  }, [selectedDelegate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCheckbox = (e) => {
    setFormData({
      ...formData,
      jefeRecinto: e.target.checked,
    });
  };

  const handleSubmit = () => {
    onSave(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Editar delegado</DialogTitle>

      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>

        <TextField
          label="Nombre"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          fullWidth
        />

        <TextField
          label="Apellido"
          name="apellido"
          value={formData.apellido}
          onChange={handleChange}
          fullWidth
        />

        <TextField
          label="C.I."
          name="ci"
          value={formData.ci}
          onChange={handleChange}
          fullWidth
        />

        <TextField
          label="Teléfono"
          name="telefono"
          value={formData.telefono}
          onChange={handleChange}
          fullWidth
        />

        <TextField
          label="Distrito"
          name="distrito"
          value={formData.distrito}
          onChange={handleChange}
          fullWidth
        />

        <TextField
          label="Número de Mesa"
          name="mesa"
          value={formData.mesa}
          onChange={handleChange}
          type="number"
          fullWidth
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={formData.jefeRecinto}
              onChange={handleCheckbox}
            />
          }
          label="Jefe de recinto"
        />

      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={handleSubmit}>
          Guardar cambios
        </Button>
      </DialogActions>
    </Dialog>
  );
}
