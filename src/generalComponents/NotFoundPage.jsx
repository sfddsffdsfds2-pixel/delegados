import { Box, Button, CssBaseline, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

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
  buttonText = "Volver",
  buttonRoute = null, 
  showButton = true,
  message = "Página no encontrada",
}) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (buttonRoute) {
      navigate(buttonRoute); 
    } else {
      navigate(-1, { replace: true });
    }
  };

  return (
    <>  
      <CssBaseline enableColorScheme />
      <Container>
        <Typography variant="h2" sx={{ mb: 2, fontWeight: "bold" }}>
          404
        </Typography>
        <Typography variant="h5" sx={{ mb: 4 }}>
          {message}
        </Typography>

        {showButton && (
          <Button variant="contained" color="primary" onClick={handleClick}>
            {buttonText}
          </Button>
        )}
      </Container>
    </>
  );
}
