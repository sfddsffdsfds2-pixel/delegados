import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import AppTheme from '../shared-theme/AppTheme';
import { Box, CssBaseline } from '@mui/material';


const Container = styled(Stack)(({ theme }) => ({
  height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
  minHeight: '100%',
  overflow: 'hidden',
  position: 'relative',
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

export default function HomePage (props) {
    return ( 
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <Container direction="column" justifyContent="center">
          <Box sx={{
            position: 'absolute',
            bottom: -20,
            left: 100,
            height: 'auto',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            pt: 2,
          }}>
            <Box
              component="img"
              src="/oscarClaros.webp"
              alt="Oscar Claros"
              sx={{
                height: '120vh',
                width: "auto",
                mr: 2
              }}
            />
          </Box>
      </Container>
    </AppTheme>
    );
}