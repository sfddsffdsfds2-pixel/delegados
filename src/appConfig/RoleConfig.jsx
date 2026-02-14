import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import SecurityIcon from '@mui/icons-material/Security';
import HowToRegIcon from '@mui/icons-material/HowToReg';

export const getRoleIcon = (role) => {
  switch (role) {
    case 'super_admin':
      return <SecurityIcon color="primary" />;
    case 'admin':
      return <AdminPanelSettingsIcon color="secondary" />;
    case 'jefe_recinto':
      return <HowToRegIcon color="success" />;
    default:
      return null;
  }
};
