// src/pages/HomePage.jsx
import { useState, useEffect } from "react";
import { Box, Typography, Stack, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import { motion } from "framer-motion";
import { orange } from "@mui/material/colors";

/* ================= HERO CONTAINER ================= */
const Hero = styled(Box)(() => ({
  minHeight: "100vh",
  width: "100%",
  position: "relative",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
}));

/* ================= SLIDES ================= */
const slides = [
  {
    image: "/hospital.webp",
    title: "Juntos por el progreso",
    description: "Hospitales modernos y accesibles para todos.",
  },
  {
    image: "/alcaldiaa.webp",
    title: "Edificio Municipal",
    description: "Servicios eficientes para la población.",
  },
  {
    image: "/universidadd.webp",
    title: "Universidad Autónoma",
    description: "Educación para la juventud.",
  },
];



function SocialIcon({ children, link, bg }) {
  return (
    <Box
      component="a"
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      sx={{
        width: 75,
        height: 75,
        borderRadius: "50%",
        background: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: bg.includes("gradient") ? "#E1306C" : bg,
        transition: "all .4s ease",
        boxShadow: "0 12px 30px rgba(0,0,0,0.25)",
        "&:hover": {
          background: bg,
          color: "white",
          transform: "translateY(-10px) scale(1.1)",
          boxShadow: "0 20px 40px rgba(0,0,0,0.35)",
        },
      }}
    >
      {children}
    </Box>
  );
}
/* ================= COMPONENT ================= */
export default function HomePage() 
{
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const i = setInterval(() => {
      setCurrent((p) => (p === slides.length - 1 ? 0 : p + 1));
    }, 5000);
    return () => clearInterval(i);
  }, []);

  return (
    <Box>
      {/* ================= HERO ================= */}
      <Hero
        sx={{
          backgroundImage: `url(${slides[current].image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          transition: "all 1s ease",
        }}
      >
        {/* Overlay oscuro */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to right, rgba(0,0,0,.9) 20%, rgba(0,0,0,.55) 60%)",
            zIndex: 1,
          }}
        />

        {/* Contenido Hero */}
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={{ xs: 4, md: 8 }}
          alignItems="center"
          justifyContent="center"
          sx={{
            position: "relative",
            zIndex: 2,
            width: "100%",
            maxWidth: 1300,
            px: { xs: 2, sm: 4, md: 6 },
            py: { xs: 10, md: 0 },
          }}
        >
          {/* Imagen candidato (responsive) */}
          <Box
            component={motion.img}
            src="/oscarClaros.webp"
            alt="Candidato"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            sx={{
              width: {
                xs: "80%",
                sm: "65%",
                md: "45%",
                lg: "40%",
              },
              maxWidth: 520,
              height: "auto",
              objectFit: "contain",
              filter: "drop-shadow(0 20px 50px rgba(0,0,0,.8))",
            }}
          />

          {/* Texto Hero */}
          <Box
            component={motion.div}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            sx={{
              color: "white",
              textAlign: { xs: "center", md: "left" },
              maxWidth: 520,
            }}
          >
            <Typography
              sx={{
                fontSize: { xs: "2rem", sm: "2.6rem", md: "3.4rem" },
                fontWeight: 900,
                lineHeight: 1.1,
                mb: 2,
              }}
            >
              {slides[current].title}
            </Typography>

            <Typography
              sx={{
                fontSize: { xs: "1rem", sm: "1.2rem", md: "1.4rem" },
                opacity: 0.9,
                mb: 4,
              }}
            >
              {slides[current].description}
            </Typography>

            <Button
              variant="contained"
              sx={{
                background: "#ff8a00",
                px: 5,
                py: 1.8,
                fontWeight: "bold",
                borderRadius: 3,
                "&:hover": { background: "#ff6a00" },
              }}
            >
              Únete al cambio
            </Button>
          </Box>
        </Stack>
      </Hero>

      {/* ================= SECCIÓN INFORMACIÓN + IMAGEN ================= */}
      <Box
        sx={{
          py: { xs: 10, md: 16 },
          px: { xs: 3, md: 10 },
          background: "#f5efe7",
        }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={{ xs: 6, md: 10 }}
          alignItems="center"
          maxWidth={1300}
          mx="auto"
        >
          {/* Texto izquierdo */}
          <Box
            component={motion.div}
            initial={{ opacity: 0, x: -80 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9 }}
            viewport={{ once: true }}
            sx={{ flex: 1 }}
          >
            <Typography sx={{ color: "#e67e00", fontWeight: 700, mb: 2 }}>
              ● Una nueva visión
            </Typography>

            <Typography
              sx={{
                fontSize: { xs: "2.2rem", md: "3.2rem" },
                fontWeight: 900,
                color: "#e67e00",
                lineHeight: 1.05,
                mb: 3,
              }}
            >
              Juntos por un <br /> futuro mejor
            </Typography>

            <Typography
              sx={{
                fontSize: "1.1rem",
                color: "#6b4a3a",
                lineHeight: 1.8,
                mb: 4,
                maxWidth: 520,
              }}
            >
              Conozco de cerca los desafíos que enfrentan nuestras familias. Mi compromiso es resolver los problemas reales de Quillacollo, como alcantarillado, calles, salud y servicios, con trabajo serio, soluciones claras y resultados visibles. Juntos construiremos un futuro mejor con participación de todos.
            </Typography>

            {/* Botones */}
            <Stack direction="row" spacing={2} flexWrap="wrap">
              <Button
                variant="contained"
                sx={{
                  background: "#e67e00",
                  px: 4,
                  py: 1.5,
                  fontWeight: 700,
                  borderRadius: 3,
                }}
              >
                Apoya nuestra campaña →
              </Button>

              <Button
                variant="outlined"
                sx={{
                  borderColor: "#e67e00",
                  color: "#e67e00",
                  px: 4,
                  py: 1.5,
                  fontWeight: 700,
                  borderRadius: 3,
                }}
              >
                Conoce nuestras propuestas
              </Button>
            </Stack>

            {/* Stats */}
<Box
  sx={{
    mt: 4,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 2,
    flexWrap: "nowrap",      // 🔥 NUNCA BAJA
  }}
>
  <Box sx={{ textAlign: "center", flex: 1 }}>
    <Typography sx={{ fontSize: "2rem", fontWeight: 900, color: "#e67e00" }}>
      10
    </Typography>
    <Typography sx={{ fontSize: { xs: "0.75rem", sm: "0.9rem", md: "1rem" } }}>
      Distitos unidos 
    </Typography>
  </Box>

  <Box sx={{ textAlign: "center", flex: 1 }}>
    <Typography sx={{ fontSize: "2rem", fontWeight: 900, color: "#e67e00" }}>
      7
    </Typography>
    <Typography sx={{ fontSize: { xs: "0.75rem", sm: "0.9rem", md: "1rem" } }}>
      Propuestas principales
    </Typography>
  </Box>

  <Box sx={{ textAlign: "center", flex: 1 }}>
    <Typography sx={{ fontSize: "2rem", fontWeight: 900, color: "#e67e00" }}>
      95
    </Typography>
    <Typography sx={{ fontSize: { xs: "0.75rem", sm: "0.9rem", md: "1rem" } }}>
      Otb's y organizaciones sociales
    </Typography>
  </Box>
</Box>
          </Box>

          {/* Imagen derecha (wrapper controlado para evitar overflow) */}
          <Box
            component={motion.div}
            initial={{ opacity: 0, x: 80, scale: 0.95 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.9 }}
            viewport={{ once: true }}
            sx={{
              flex: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
            }}
          >
            {/* Wrapper que controla overflow y tamaño */}
            <Box
              sx={{
                width: "100%",
                maxWidth: { xs: 280, sm: 360, md: 480, lg: 560 },
                p: { xs: 2, sm: 3 },
                borderRadius: 6,
                background: "linear-gradient(180deg,#e6c9a6,#d8c3a5)",
                overflow: "hidden",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Box
                component={motion.img}
                src="/oscar claros.jpg" // pon aquí la ruta correcta de tu imagen
                alt="Candidato"
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.4 }}
                sx={{
                  width: "100%",
                  height: "auto",
                  maxHeight: { xs: 300, sm: 380, md: 460, lg: 520 },
                  objectFit: "cover",
                  display: "block",
                  borderRadius: 3,
                  boxShadow: "0px 30px 60px rgba(0,0,0,0.35)",
                }}
              />
            </Box>
          </Box>
        </Stack>

 {/* ================= QUIÉN SOY ================= */}
<Box
  sx={{
    py: { xs: 4, md: 12 }, // 🔥 menos espacio vertical
    px: { xs: 1, md: 10 },
    background: "#f7f2ec",
    textAlign: "center",
  }}
>
  {/* Título */}
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    viewport={{ once: true }}
  >
    <Typography
      sx={{
        fontSize: { xs: "2rem", md: "3rem" },
        fontWeight: 900,
        color: "#e67e00",
        mb: 2,
      }}
    >
      Quién soy
    </Typography>

    <Typography
      sx={{
        maxWidth: 700,
        mx: "auto",
        color: "#6b4a3a",
        fontSize: { xs: "1rem", md: "1.2rem" },
        mb: 8, // 🔥 menos espacio abajo
      }}
    >
      Soy Óscar Claros Rivas, abogado y candidato a la Alcaldía de Quillacollo.
Mi vida ha estado marcada por el liderazgo estudiantil, el trabajo desde joven y el compromiso cívico. 

Mi historia está profundamente ligada a Quillacollo. Aquí crecí, aquí trabajé y aquí decidí asumir el desafío de servir a mi comunidad para fortalecer su desarrollo y su democracia.
    </Typography>
  </motion.div>

  {/* Cards */}
  <Stack
    direction={{ xs: "column", md: "row" }}
    spacing={5}
    justifyContent="center"
    alignItems="stretch"
  >
    {[
      {
        title: "Raíces y valores",
        text: "Crecí en Quillacollo aprendiendo que el esfuerzo, la unidad y la honestidad son la base para salir adelante.",
        image: "/juventud1.png",
      },
      {
        title: "Gestión con resultados",
        text: "Propuestas pensadas para mejorar la vida de las familias de Quillacollo, con planificación, experiencia y compromiso real.",
        image: "/este.png",
      },
      {
        title: "Participación y Democracia",
        text: "Una gestión construida junto a los vecinos, con transparencia y control social para que cada ciudadano sea parte del cambio.",
        image: "/juntovencidad.jpg",
      },
    ].map((item, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: i * 0.2 }}
        viewport={{ once: true }}
        style={{ flex: 1 }}
      >
        <Box
          sx={{
            background: "#e6ddd3",
            p: { xs: 2.6, md: 5 }, // 🔥 padding optimizado
            borderRadius: 5,
            textAlign: "center",
            height: "100%",
            transition: "all .4s ease",
            border: i === 1 ? "2px solid #e67e00" : "1px solid transparent",
            "&:hover": {
              transform: "translateY(-8px)",
              boxShadow: "0 20px 40px rgba(0,0,0,.15)",
            },
          }}
        >
          {/* Imagen más grande */}
          <Box
            component="img"
            src={item.image}
            alt={item.title}
            sx={{
              width: "100%",
              maxWidth: 300,  // 🔥 más grande
              height: 150,    // 🔥 más presencia
              objectFit: "cover",
              borderRadius: 3,
              display: "block",
              mx: "auto",
              mb: 3,
            }}
          />

          <Typography
            sx={{
              fontSize: "1.4rem",
              fontWeight: 800,
              color: "#e67e00",
              mb: 2,
            }}
          >
            {item.title}
          </Typography>

          <Typography
            sx={{
              color: "#6b4a3a",
              lineHeight: 1.7,
            }}
          >
            {item.text}
          </Typography>
        </Box>
      </motion.div>
    ))}
  </Stack>
</Box>


{/* ================= PROPUESTAS RESPONSIVE REAL ================= */}
<Box
  sx={{
    py: { xs: 8, md: 14 },
    px: { xs: 2, md: 8 },
    background: "#f3ece4",
    textAlign: "center",
  }}
>
  {/* Título */}
  <Typography
    sx={{
      fontSize: { xs: "1.8rem", md: "3rem" },
      fontWeight: 900,
      color: "#e67e00",
      mb: 2,
    }}
  >
    Propuestas Prioritarias
  </Typography>

  <Typography
    sx={{
      maxWidth: 700,
      mx: "auto",
      color: "#6b4a3a",
      mb: 8,
    }}
  >
    Transformamos ideas en acciones concretas para un futuro sólido.
  </Typography>

  {/* GRID RESPONSIVE REAL */}
  <Box
    sx={{
      display: "grid",
      gridTemplateColumns: {
        xs: "1fr",          // Celular
        sm: "1fr 1fr",      // Tablet
        md: "1fr 1fr",      // Desktop
        lg: "1fr 1fr",      // Desktop grande
      },
      gap: 4,
      maxWidth: 1000,
      mx: "auto",
    }}
  >
    {[
  {
    title: "Universidad Autónoma ",
    text: "Creación de una Universidad Autónoma al servicio de la juventud estudiosa del Valle Bajo, con apoyo del Gobierno Central.",
    color: "#e67e00",
    icon: "🎓",
  },
  {
    title: "Terminal Interdepartamental",
    text: "Construcción de una terminal moderna conectada con la nueva terminal del Cercado y otros departamentos, mejorando el flujo vial y el transporte pesado en el municipio.",
    color: "#1e3a8a",
    icon: "🚌",
  },
  {
    title: "Edificio Municipal ",
    text: "Construcción de un nuevo edificio municipal para brindar mejor atención a la población y optimizar los trámites administrativos.",
    color: "#49494c",
    icon: "🏛️",
  },
  {
    title: "Hospital de Tercer Nivel",
    text: "Hospital con todas las especialidades médicas, 300 camas, UCI, tecnología avanzada e infraestructura moderna con apoyo del Gobierno Central.",
    color: "#b91c1c",
    icon: "🏥",
  },
   {
    title: "Medio ambiente y áreas verdes",
    text: "Planta de reciclaje, recuperación de áreas verdes y laguna de Cotapachi, además de canalización y desagüe pluvial para prevenir inundaciones.",
    color: "#16a34a",
    icon: "🌿"
  },
  {
  title: "Desagüe Pluvial",
  text: "Construcción de desagüe pluvial para aguas servidas y residuales,  evitando inundaciones y protegiendo nuestras calles.",
  color: "#0ea5e9",
  icon: "💧"
}

]
.map((item, i) => (
      <Box
        key={i}
        sx={{
          background: "white",
          borderRadius: 4,
          p: 4,
          boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
          transition: "all .3s ease",
          "&:hover": {
            transform: "translateY(-8px)",
            boxShadow: `0 20px 40px ${item.color}40`,
          },
        }}
      >
        <Box
          sx={{
            width: 70,
            height: 70,
            mx: "auto",
            mb: 3,
            borderRadius: "50%",
            background: item.color,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.8rem",
            color: "white",
          }}
        >
          {item.icon}
        </Box>

        <Typography
          sx={{
            fontWeight: 800,
            fontSize: "1.2rem",
            color: item.color,
            mb: 2,
          }}
        >
          {item.title}
        </Typography>

        <Typography sx={{ color: "#6b4a3a" }}>
          {item.text}
        </Typography>
      </Box>
    ))}
  </Box>
</Box>




{/* ================= UNETE AL MOVIMIENTO ================= */}
<Box
  sx={{
    py: { xs: 10, md: 14 },
    px: 2,
    background: "#e8d8c0",
    color: "white",
    textAlign: "center",
  }}
>
  <Box sx={{ maxWidth: 1000, mx: "auto" }}>
    
    <Typography
      sx={{
        fontSize: { xs: "2rem", md: "3rem" },
        fontWeight: 900,
        mb: 3,
        animation: "fadeUp 1s ease forwards",
        color: "#e67e00",
      }}
    >
      Siguenos en nuestras redes sociales 
    </Typography>

    <Typography
      sx={{
        fontSize: { xs: "1rem", md: "1.2rem" },
        mb: 8,
        opacity: 0.95,
        animation: "fadeUp 1.3s ease forwards",
         color: "#6b4a3a",
      }}
    >
      Tu voto y apoyo son fundamentales. Juntos podemos hacer que Quillacollo
      alcance su verdadero potencial.
    </Typography>

   {/* REDES SOCIALES */}
<Box
  sx={{
    display: "grid",
    gridTemplateColumns: {
      xs: "repeat(2, 1fr)",   // celular → 2 y 2
      sm: "repeat(2, 1fr)",   // tablet → 2 y 2
      md: "repeat(4, 1fr)",   // desktop → 4 en una fila
    },
    gap: { xs: 2, md: 4 },
    maxWidth: 450,
    mx: "auto",
    justifyItems: "center",
    animation: "fadeUp 1.6s ease forwards",
  }}
>


      <SocialIcon link="#" bg="#1877F2">
        <svg viewBox="0 0 24 24" width="28" fill="currentColor">
          <path d="M22 12a10 10 0 10-11.5 9.9v-7H8v-3h2.5V9.5c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.2c-1.2 0-1.6.7-1.6 1.5V12H17l-.4 3h-2.7v7A10 10 0 0022 12z"/>
        </svg>
      </SocialIcon>

      <SocialIcon link="#" bg="linear-gradient(45deg,#f9ce34,#ee2a7b,#6228d7)">
        <svg viewBox="0 0 24 24" width="28" fill="currentColor">
          <path d="M7 2C4.2 2 2 4.2 2 7v10c0 2.8 2.2 5 5 5h10c2.8 0 5-2.2 5-5V7c0-2.8-2.2-5-5-5H7zm5 5.5A4.5 4.5 0 1112 16a4.5 4.5 0 010-9zm6-1a1 1 0 110 2 1 1 0 010-2z"/>
        </svg>
      </SocialIcon>

      <SocialIcon link="#" bg="#25D366">
        <svg viewBox="0 0 24 24" width="28" fill="currentColor">
          <path d="M12 2a10 10 0 00-8.7 15l-1.3 4.8 4.9-1.3A10 10 0 1012 2zm5.2 13.7c-.2.6-1.1 1-1.6 1.1-.4.1-.9.2-1.5 0-3-.8-5-3.5-5.2-3.7-.2-.2-1.2-1.6-1.2-3 0-1.4.7-2.1 1-2.4.3-.3.6-.4.8-.4.2 0 .4 0 .6 0 .2 0 .4-.1.6.5.2.6.8 2 .9 2.1.1.2.1.4 0 .6-.1.2-.2.4-.3.5-.2.2-.4.5-.5.6-.2.2-.4.4-.2.8.2.4 1 1.7 2.1 2.7 1.4 1.3 2.5 1.7 2.9 1.9.4.2.6.1.8-.1.2-.2.9-1 1.1-1.3.2-.3.4-.2.6-.1.2.1 1.5.7 1.8.9.3.2.4.3.4.5 0 .2 0 1-.2 1.6z"/>
        </svg>
      </SocialIcon>

      <SocialIcon link="#" bg="#000">
        <svg viewBox="0 0 24 24" width="28" fill="currentColor">
          <path d="M16 3c.4 1.6 1.8 2.8 3.5 3v3a7 7 0 01-3.5-1v6.5a5.5 5.5 0 11-4-5.3v3.2a2.3 2.3 0 102 2.3V3h2z"/>
        </svg>
      </SocialIcon>
    </Box>
  </Box>

  <style>
    {`
      @keyframes fadeUp {
        from { opacity: 0; transform: translateY(30px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `}
  </style>
</Box>







{/* ================= FOOTER ================= */}
<Box
  sx={{
    background: "#111",
    color: "white",
    pt: 8,
    pb: 4,
    px: 2,
  }}
>
  <Box
    sx={{
      maxWidth: 1200,
      mx: "auto",
      display: "grid",
      gridTemplateColumns: {
        xs: "1fr",
        sm: "repeat(2, 1fr)",
        md: "repeat(3, 1fr)",  // ← AHORA SOLO 3 COLUMNAS
      },
      gap: 6,
      mb: 6,
    }}
  >
    {/* LOGO / NOMBRE */}
    <Box>
      
      <Typography fontWeight={900} fontSize="1.5 rem" mb={2} color={"#e67e00"} variant="h4" 
  component="div">
        oscar claros
      </Typography>
      <Typography sx={{ opacity: 0.7 }}>
        Comprometidos con el progreso, la transparencia y el desarrollo de
        nuestra ciudad.
      </Typography>
    </Box>

    {/* ENLACES */}
    <Box>
      <Typography fontWeight={700} mb={2}>
        Navegación
      </Typography>
      <Typography sx={{ opacity: 0.7, mb: 1, cursor: "pointer" }}>
        Inicio
      </Typography>
      <Typography sx={{ opacity: 0.7, mb: 1, cursor: "pointer" }}>
        Propuestas
      </Typography>
      <Typography sx={{ opacity: 0.7, mb: 1, cursor: "pointer" }}>
        Equipo
      </Typography>
      <Typography sx={{ opacity: 0.7, cursor: "pointer" }}>
        Contacto
      </Typography>
    </Box>

    {/* CONTACTO */}
    <Box>
      <Typography fontWeight={700} mb={2}>
        Contacto
      </Typography>
      <Typography sx={{ opacity: 0.7, mb: 1 }}>
        📍 Valle Bajo
      </Typography>
      <Typography sx={{ opacity: 0.7, mb: 1 }}>
        📞 +591 70000000
      </Typography>
      <Typography sx={{ opacity: 0.7 }}>
        ✉ contacto@movimiento.bo
      </Typography>
    </Box>
  </Box>

  {/* LINEA INFERIOR */}
  <Box
    sx={{
      borderTop: "1px solid rgba(255,255,255,0.1)",
      pt: 3,
      textAlign: "center",
      opacity: 0.6,
      fontSize: "0.9rem",
    }}
  >
    © {new Date().getFullYear()} Movimiento Ciudadano. Todos los derechos reservados.
  </Box>
</Box>




      </Box>
    </Box>
  );
}
