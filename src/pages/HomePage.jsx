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
  height: "100vh",
  width: "100%",
  position: "relative",
  overflow: "hidden",
  display: "flex",
  alignItems: "center",
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
    description:
      "Terminal que conecte con la nueva terminal del Cercado.",
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
      setCurrent((prev) =>
        prev === slides.length - 1 ? 0 : prev + 1
      );
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
        {/* Overlay oscuro */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to right, rgba(0,0,0,0.9) 35%, rgba(0,0,0,0.6) 65%)",
            zIndex: 1,
          }}
        />

        {/* CONTENIDO PRINCIPAL */}
        <Stack
          direction={{ xs: "column", md: "row" }}
          alignItems="center"
          justifyContent="center"
          sx={{
            position: "relative",
            zIndex: 2,
            width: "100%",
            height: "100%",
            px: { xs: 3, md: 12 },
            textAlign: { xs: "center", md: "left" },
          }}
        >
          {/* ALCALDE */}
          <Box
            component="img"
            src="/oscarClaros.webp"
            alt="Oscar Claros"
            sx={{
              position: 'absolute',
              height: { xs: "110vh", md: "110vh" },
              maxHeight: { xs: "110vh", md: "110vh" },
              objectFit: "contain",
              alignSelf: { md: "flex-end" },
              filter: "drop-shadow(0px 20px 40px rgba(0,0,0,0.6))",
              zIndex: 2,
              bottom: 0,
              left: 130,
            }}
          />

          {/* TEXTO DINÁMICO */}
          <Box
            sx={{
              color: "white",
              ml: { md: 6 },
              maxWidth: 700,
              position: 'absolute',
              top: 100,
              right: 200,
              zIndex: {
                xs: 3
              }
            }}
          >
            <Typography
              sx={{
                fontSize: { xs: "2.2rem", md: "4rem" },
                fontWeight: "bold",
                lineHeight: 1.1,
                mb: 3,
              }}
            >
              {slides[current].title}
            </Typography>

            <Typography
              sx={{
                fontSize: { xs: "1.2rem", md: "1.6rem" },
                mb: 4,
                opacity: 0.9,
              }}
            >
              {slides[current].description}
            </Typography>
          </Box>
        </Stack>
      </Container>
    </AppTheme>
  );
}
