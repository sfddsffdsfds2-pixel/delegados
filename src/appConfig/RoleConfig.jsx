import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import SecurityIcon from '@mui/icons-material/Security';

export const getRoleIcon = (role) => {
  switch (role) {
    case 'super_admin': 
      return <SecurityIcon color="primary" />;
    case 'admin':
      return <AdminPanelSettingsIcon color="primary" />;
    case 'jefe_recinto':
      return <HowToRegIcon color="primary" />;
    default:
      return null;
  }
};
