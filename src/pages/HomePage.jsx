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



function SocialIcon({ imgSrc, link, desc, bg }) {
  return (
    <Box
    component="a"
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      title={desc}
      sx={{
        width: { xs: 55, sm: 70, md: 70 },  // iconos más grandes
        height: { xs: 55, sm: 70, md: 70 },
        borderRadius: "50%",
        background: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all .4s ease",
        boxShadow: "0 12px 30px rgba(0,0,0,0.25)",
        "&:hover": {
          background: bg,
          transform: "translateY(-10px) scale(1.2)", // hover más llamativo
          boxShadow: "0 20px 40px rgba(0,0,0,0.35)",
        },
      }}
    >
      <img src={imgSrc} alt={desc} style={{ width: "50%", height: "50%" }} />
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
                href="#redes"
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
      id="vision"
        sx={{
          py: { xs: 4, md: 0 },
          px: { xs: 3, md: 0 },
          background: "#f5efe7",
        }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={{ xs: 4, md: 10 }}//de la imagen es esto de oscar claros referido espacio 10 distritos a 32px
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
            <Typography sx={{ color: "#e67e00", fontWeight: 700, mb: 2, mt: { xs: 2 , md: 6 },  }}>
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
            <Stack
  direction={{ xs: "column", sm: "row" }}
  gap={2}
  width="100%"
>
  <Button
  variant="outlined"
  onClick={() => {
    const seccion = document.getElementById("redes");
    if (seccion) {
      seccion.scrollIntoView({ behavior: "smooth" });
    }
  }}
    fullWidth
    sx={{
    backgroundColor: "#e98007df !important",    // color por defecto del botón
    color: "#ffffff !important",                 // texto blanco
    boxShadow: "0 12px 30px rgba(0,0,0,0.25)",
    px: 4,
    py: 1.5,
    fontWeight: 700,
    borderRadius: 3,
    '&:hover': {
      backgroundColor: "#ff8c1a !important", }
    }}
  >
    Unete al cambio →
  </Button>

  <Button
  variant="outlined"
  onClick={() => {
    const seccion = document.getElementById("propuestas");
    if (seccion) {
      seccion.scrollIntoView({ behavior: "smooth" });
    }
  }}
    fullWidth
    sx={{
       backgroundColor: "transparent !important", 
      borderColor: "#e67e00",
      color: "#e67e00 !important",
      boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
      px: 4,
      py: 1.5,
      fontWeight: 700,
      borderRadius: 3,
      '&:hover': {
      backgroundColor: "#585757 !important", }
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
    <Typography sx={{ fontSize: {  color: "#6b4a3a",xs: "0.75rem", sm: "0.9rem", md: "1rem" } }}>
      Distitos unidos 
    </Typography>
  </Box>

  <Box sx={{ textAlign: "center", flex: 1 }}>
    <Typography sx={{ fontSize: "2rem", fontWeight: 900, color: "#e67e00" }}>
      + 7
    </Typography>
    <Typography sx={{ fontSize: {  color: "#6b4a3a",xs: "0.75rem", sm: "0.9rem", md: "1rem" } }}>
      Propuestas principales
    </Typography>
  </Box>

  <Box sx={{ textAlign: "center", flex: 1 }}>
    <Typography sx={{ fontSize: "2rem", fontWeight: 900, color: "#e67e00" }}>
      95 +
    </Typography>
    <Typography sx={{ fontSize: {  color: "#6b4a3a",xs: "0.75rem", sm: "0.9rem", md: "1rem" } }}>
      Otb's y organizaciones 
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
              mt: 4, 
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
                mt:0,// margin top 0  para lo que es la imagen dentro del card de oscar claros
                width: "100%",
                maxWidth: { xs: 280, sm: 360, md: 480, lg: 560 },
                p: { xs: 2, sm: 3 }, //[padding espacio de la imagen recpecto al card]
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
 id="Quien soy"
  sx={{
    pt: { xs: 4, md: 8 }, // 🔥 menos espacio vertical
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
        mb: 4,// espacio que deja de bajo la descripcion de soy oscar

        
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
        mb: 6, // 🔥 menos espacio abajo espacio con  la seccion de los cards de abajo propuestas
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
      style={{
        flex: 1,
        display: "flex",
        justifyContent: "center", // 🔥 centra en desktop
      }}
    >
      <Box
        sx={{
          background: "#e6ddd3",
          p: { xs: 3, md: 5 },
          borderRadius: 5,
          textAlign: "center",
          height: "100%",
          width: "100%",
          maxWidth: 420,          // 🔥 CONTROLA EL ANCHO (CLAVE)
          mx: "auto",             // 🔥 CENTRA EN MOBILE
          transition: "all .4s ease",
          border: i === 1 ? "2px solid #e67e00" : "2px solid transparent",
          "&:hover": {
            transform: "translateY(-8px)",
            boxShadow: "0 20px 40px rgba(0,0,0,.15)",
          },
        }}
      >
        {/* Imagen */}
        <Box
          component="img"
          src={item.image}
          alt={item.title}
          sx={{
            width: "100%",
            maxWidth: 300,
            height: 150,
            objectFit: "cover",
            borderRadius: 3,
            display: "block",
            mx: "auto",
            mb: 2,
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
id="propuestas" 
  sx={{
    py: { xs: 4, md: 7 }, // 14 propuestas principales con lo de arriba card separacion optimizado
    px: { xs: 1, md: 8 },
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
    Propuestas 
  </Typography>

  <Typography
    sx={{
      maxWidth: 700,
      mx: "auto",
      color: "#6b4a3a",
      mb: 4,
    }}
  >
    Visión clara y compromiso firme para el desarrollo de Quillacollo.
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
  id="redes" 
  sx={{
    py: { xs: 4, md: 10 }, //separacion optimizada con lo de arriba y abajo ta,mano y md lo que es cuando el txt mas abajo o arriba
    px: 1,
    background: "#e8d8c0",
    color: "white",
    textAlign: "center",
  }}
>
  
  <Box sx={{ maxWidth: 1000, mx: "auto" }}> 
    
    <Typography //que tanto ingresa el texto
      sx={{
        fontSize: { xs: "1.8rem", md: "3rem" },
        fontWeight: 900,
        mb: 2,
        animation: "fadeUp 1s ease forwards",
        color: "#e67e00",
      }}
    >
      Siguenos en nuestras redes sociales 
    </Typography>

    <Typography
      sx={{
        fontSize: { xs: "1rem", md: "1.2rem" },
        mb: 4,
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
       display: "flex",
    justifyContent: "space-between", // mantiene los 4 en línea
    maxWidth: { xs: 280, sm: 350, md: 400 }, // ajusta según quieras el tamaño de los íconos
    mx: "auto",
    animation: "fadeUp 1.6s ease forwards",
      }}
    >
      <SocialIcon
        link="https://chat.whatsapp.com/JIWDQOJLUPxJ1GHj9srKBm"
        imgSrc="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
        desc="WhatsApp"
        bg="#25D366"
      />
      <SocialIcon
        link="https://www.instagram.com/oscarclarosconquilla/"
        imgSrc="https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg"
        desc="Instagram"
        bg="linear-gradient(45deg,#f9ce34,#ee2a7b,#6228d7)"
      />
      <SocialIcon
        link="https://www.facebook.com/profile.php?id=61554300315300"
        imgSrc="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg"
        desc="Facebook"
        bg="#1877F2"
      />
      <SocialIcon
        link="https://www.tiktok.com/@oscar.claros.quil"
        imgSrc="https://static.cdnlogo.com/logos/t/69/tiktok-icon.svg"
        desc="X / TikTok"
        bg="#000"
      />
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






{/* ================= FOOTER HORIZONTAL FIJO ================= */}
<Box
  component="footer"
  sx={{
    background: "#111111",
    color: "#ffffff",
    px: { xs: 1, sm: 2, md: 10 },
   pt: { xs: 1.2, sm: 1.5, md: 4 },
   pb: { xs: 1, sm: 1.2, md: 3 },
  }}
>
  {/* --- FILA PRINCIPAL --- */}
  <Box
    sx={{
      display: "flex",
    flexDirection: { xs: "column", md: "row" },
    justifyContent: "center",
    alignItems: "flex-start", // 🔥 IMPORTANTE
    gap: { xs: 1, md: 2 },
    maxWidth: 1200,
    mx: "auto",
    width: "100%",
    }}
  >
    {/* ===== Columna 1 ===== */}
    <Box sx={{ flex: 1, minWidth: 300 }}>
      <Typography
        sx={{
          fontSize: { xs: "0.85rem", sm: "1.1rem", md: "2rem" },
          fontWeight: 900,
          mb: { xs: 0.5, md: 1 },
          color: "#e67e00",
        }}
      >
        Oscar Claros
      </Typography>

      <Typography
        sx={{
          fontSize: { xs: "0.6rem", sm: "0.75rem", md: "1rem" },
          lineHeight: { xs: 1.2, md: 1.5 },
          color: "#cccccc",
          opacity: 0.9,
        }}
      >
        Comprometidos con el progreso, la transparencia y el desarrollo de nuestra ciudad.
      </Typography>
    </Box>

    {/* ===== Columna 2 ===== */}
    <Box sx={{ flex: 1, minWidth: 300,display: "flex",
    flexDirection: "column",
   alignItems: { xs: "flex-start", md: "center" }, // móvil al inicio, desktop centrado
    mx: { xs: 0, md: "auto" }, }}>
      <Typography
        sx={{
          fontWeight: 700,
          mb: { xs: 0.5, md: 1 },
          fontSize: { xs: "0.75rem", sm: "0.9rem", md: "1rem" },
          
        }}
      >
        Navegación
      </Typography>

     <Box component="ul" sx={{ listStyle: "none", p: 0, m: 0 }}>
  {[
    { label: "Inicio", href: "#" },
    { label: "vision", href: "#vision" },
    { label: "Quien soy", href: "#Quien soy" },
    { label: "Propuestas", href: "#propuestas" },
    { label: "unete al cambio", href: "#redes" },
  ].map((item) => (
    <Box
      key={item.label}
      component="li"
      sx={{
        mb: 0.3,
        fontSize: { xs: "0.6rem", sm: "0.7rem", md: "0.95rem" },
        lineHeight: { xs: 1.1, md: 1.4 },
      }}
    >
      <a
        href={item.href}
        style={{
          color: "#cccccc",
          textDecoration: "none",
          fontWeight: 500,
          transition: "color 0.2s ease",
        }}
        onMouseOver={(e) => (e.target.style.color = "#e67e00")}
        onMouseOut={(e) => (e.target.style.color = "#cccccc")}
      >
        {item.label}
      </a>
    </Box>
  ))}
</Box>

    </Box>

    {/* ===== Columna 3 ===== */}
    <Box sx={{ flex: 1, minWidth: 0 }}>
      <Typography
        sx={{
          fontWeight: 700,
          mb: { xs: 0.5, md: 1 },
          fontSize: { xs: "0.75rem", sm: "0.9rem", md: "1rem" },
        }}
      >
        Contacto
      </Typography>

      <Box
        component="ul"
        sx={{
          listStyle: "none",
          p: 0,
          m: 0,
          color: "#cccccc",
          fontSize: { xs: "0.6rem", sm: "0.7rem", md: "0.95rem" },
          lineHeight: { xs: 1.2, md: 1.4 },
        }}
      >
        <Box component="li" sx={{ mb: 0.3 }}>📍 Av. Blanco Galindo, entre antofagasta y Gral.camacho.Acera sud</Box>
        <Box component="li" sx={{ mb: 0.3 }}>📞 +591 60797939</Box>
        <Box component="li"></Box>
      </Box>
    </Box>
  </Box>

  {/* ===== COPYRIGHT ===== */}
  <Box
    sx={{
     borderTop: "1px solid #333333",
    pt: { xs: 0.8, md: 2 },
    mt: { xs: 1.2, md: 2.5 },
    textAlign: "center",
    }}
  >
    <Typography
      sx={{
        fontSize: { xs: "0.55rem", sm: "0.65rem", md: "0.9rem" },
        color: "#777777",
      }}
    >
      © 2026 Candidato Oscar Claros. Todos los derechos reservados.
    </Typography>
  </Box>
</Box>






      </Box>
    </Box>
  );
}
