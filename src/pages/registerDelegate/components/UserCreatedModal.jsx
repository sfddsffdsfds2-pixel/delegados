import * as React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function UserCreatedModal({ 
  open, 
  onClose, 
  user, 
  resetFormData 
}) {
  const navigate = useNavigate();

  const handleClose = () => {
    onClose();
    resetFormData?.();
  };

  return (
      <Dialog
          open={open}
          onClose={(event, reason) => {
              if (reason === "backdropClick" || reason === "escapeKeyDown") {
                  return;
              }
              handleClose();
          }}
          disableEscapeKeyDown
          maxWidth="sm"
          fullWidth
>
      <DialogTitle>Usuario creado exitosamente</DialogTitle>
      <DialogContent dividers>
        {user && (
          <Box display="flex" flexDirection="column" gap={1}>
            <Typography><b>Nombre:</b> {user.nombre}</Typography>
            <Typography><b>Apellido:</b> {user.apellido}</Typography>
            <Typography><b>CI:</b> {user.ci}</Typography>
            <Typography><b>Teléfono:</b> {user.telefono}</Typography>
            <Typography><b>Distrito:</b> {user.distrito}</Typography>
            <Typography><b>Recinto:</b> {user.recinto}</Typography>
            <Typography><b>Rol:</b> {user.jefe_recinto ? 'Jefe de recinto' : 'Delegado'}</Typography>
            {user.email && <Typography><b>Email:</b> {user.email}</Typography>}
            {user.password && <Typography><b>Contraseña:</b> {user.password}</Typography>}
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ display: 'flex', justifyContent: 'space-between', p: 2 }}>
        <Button
          variant="outlined"
          color="error"
          onClick={handleClose}
        >
          Cerrar
        </Button>
        <Button
          variant="contained"
          onClick={() => navigate("/lista-delegados-admin")}
        >
          Volver a la lista
        </Button>
      </DialogActions>
    </Dialog>
  );
}
