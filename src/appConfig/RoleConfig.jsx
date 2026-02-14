import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import HowToRegIcon from '@mui/icons-material/HowToReg';

export const getRoleIcon = (role) => {
  switch (role) {
    case 'admin':
      return <AdminPanelSettingsIcon color="primary" />;
    case 'jefe_recinto':
      return <HowToRegIcon color="primary" />;
    default:
      return null;
  }
};
