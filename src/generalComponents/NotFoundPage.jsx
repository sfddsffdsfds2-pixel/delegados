import { Box, Button, CssBaseline, Typography, Stack } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import AppTheme from "../shared-theme/AppTheme";

const Container = styled(Box)(() => ({
  height: "100vh",
  width: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
  textAlign: "center",
  backgroundColor: "#111827",
  color: "white",
  padding: "2rem",
}));

export default function NotFoundPage({
  buttonText = "Volver al inicio",
  buttonRoute = "/",
  showButton = true,
  message = "Página no encontrada",
}) {
  const navigate = useNavigate();

  return (
    <AppTheme>
      <CssBaseline enableColorScheme />
      <Container>
        <Typography variant="h2" sx={{ mb: 2, fontWeight: "bold" }}>
          404
        </Typography>
        <Typography variant="h5" sx={{ mb: 4 }}>
          {message}
        </Typography>

        {showButton && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate(buttonRoute)}
          >
            {buttonText}
          </Button>
        )}
      </Container>
    </AppTheme>
  );
}
