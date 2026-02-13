import { Container, CssBaseline, styled, Typography } from "@mui/material";
import DelegatesList from "./components/DelegatesList";
import AppTheme from "../../shared-theme/AppTheme";

const DelegatesListContainer = styled(Container)(({ theme }) => ({
  height: '100vh',
  width: '100vw',
  paddingY: 4,
//   padding: theme.spacing(2),
//   [theme.breakpoints.up('sm')]: {
//     padding: theme.spacing(4),
//   },
//   '&::before': {
//     content: '""',
//     display: 'block',
//     position: 'absolute',
//     zIndex: -1,
//     inset: 0,
//     backgroundImage:
//       'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
//     backgroundRepeat: 'no-repeat',
//     ...theme.applyStyles('dark', {
//       backgroundImage:
//         'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
//     }),
//   },
}));

export default function DelegatesListPage() {
    return (
        <AppTheme>
            <CssBaseline enableColorScheme />
            <DelegatesListContainer >
                <Typography>Lista de delegados</Typography> 
                <DelegatesList />
            </DelegatesListContainer>
        </AppTheme>
    );
}