import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import InfoIcon from '@mui/icons-material/Info';

export default function ForgotPassword({ open, handleClose }) {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          p: 1,
        },
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <InfoIcon color="primary" />
        Olvidé mi contraseña
      </DialogTitle>
      <DialogContent sx={{ textAlign: 'center', py: 1 }}>
        <DialogContentText sx={{ mb: 2 }}>
          Si olvidaste tu contraseña, por favor comunícate al siguiente número:
        </DialogContentText>
        <Box
          sx={{
            display: 'inline-block',
            backgroundColor: 'rgba(0, 123, 255, 0.1)',
            color: 'primary.main',
            px: 3,
            py: 1.5,
            borderRadius: 1,
            fontWeight: 'bold',
            fontSize: '1.25rem',
          }}
        >
          7777777
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
        <Button onClick={handleClose} variant="contained">
          Aceptar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
