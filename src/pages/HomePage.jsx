import { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import AppTheme from "../shared-theme/AppTheme";
import {
  Box,
  CssBaseline,
  Typography,
  Stack,
  Button,
} from "@mui/material";

const Container = styled(Box)(() => ({
  height: "100dvh",
  width: "100%",
  position: "relative",
  overflow: "hidden",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const slides = [
  {
    image: "/hospital.webp",
    title: "Juntos por el progreso",
    description: "Hospitales modernos y accesibles para todos.",
  },
  {
    image: "/alcaldiaa.webp",
    title: "Construcción del Edificio Municipal",
    description: "Mejor atención a la población y servicios eficientes.",
  },
  {
    image: "/universidadd.webp",
    title: "Creación de la Universidad Autónoma",
    description: "Universidad al servicio de la juventud estudiosa.",
  },
  {
    image: "/bus.webp",
    title: "Terminal Interdepartamental",
    description: "Terminal que conecte con la nueva terminal del Cercado.",
  },
  {
    image: "/compromiso.webp",
    title: "Compromiso real",
    description: "Transparencia y trabajo constante.",
  },
  {
    image: "/juventud.webp",
    title: "Juventud y energía",
    description: "Impulsando nuevas oportunidades.",
  },
];

export default function HomePage(props) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />

      <Container
        sx={{
          backgroundImage: `url(${slides[current].image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          transition: "background-image 1s ease-in-out",
        }}
      >
        {/* Capa oscura */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            zIndex: 1,
          }}
        />

        {/* Contenido principal */}
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={6}
          alignItems="center"
          justifyContent="space-between"
          sx={{
            position: "relative",
            zIndex: 2,
            width: "100%",
            maxWidth: "1400px",
            px: 6,
          }}
        >
          {/* Imagen del alcalde */}
          <Box
            component="img"
            src="/oscarClaros.webp"
            alt="Oscar Claros"
            sx={{
              height: { xs: "50vh", md: "85vh" },
              objectFit: "contain",
            }}
          />

          {/* Texto */}
          <Box
            sx={{
              color: "white",
              maxWidth: 600,
              textAlign: { xs: "center", md: "left" },
            }}
          >
            <Typography
              variant="h3"
              fontWeight="bold"
              mb={3}
              sx={{
                fontSize: { xs: "2rem", md: "3rem" },
              }}
            >
              {slides[current].title}
            </Typography>

            <Typography
              variant="h6"
              mb={4}
              sx={{
                fontSize: { xs: "1.1rem", md: "1.4rem" },
              }}
            >
              {slides[current].description}
            </Typography>

            <Button
              variant="contained"
              size="large"
              sx={{
                backgroundColor: "#FFA347",
                fontWeight: "bold",
                px: 4,
                py: 1.5,
                borderRadius: 3,
                "&:hover": {
                  backgroundColor: "#FF7E5F",
                },
              }}
            >
              Únete al cambio
            </Button>
          </Box>
        </Stack>
      </Container>
    </AppTheme>
  );
}
