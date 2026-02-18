import React, { useMemo, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Divider,
  List,
  ListItemButton,
  Collapse,
  IconButton,
  Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import Map from "../../appConfig/Map.json";
import { getActaMock } from "../../appConfig/ActasMock";
import { useNavigate } from "react-router-dom";

const buildTree = (data) => {
  const d0 = data?.departamentos?.[0];
  const p0 = d0?.provincias?.[0];
  const m0 = p0?.municipios?.[0];
  const distritos = m0?.distritos ?? [];
  return distritos;
};

const toMesaList = (count) => {
  const n = Number(count) || 0;
  return Array.from({ length: n }, (_, i) => i + 1);
};

const getActaImgSrc = ({ distrito, mesa }) => {
  return `/acta-distrito-${distrito}-mesa-${mesa}.jpeg`;
};

const PieSVG = ({ data, size = 240 }) => {
  const total = data.reduce((acc, d) => acc + (Number(d.votos) || 0), 0) || 1;
  const r = size / 2;
  const cx = r;
  const cy = r;

  const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  };

  const describeArc = (x, y, radius, startAngle, endAngle) => {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    return [
      "M",
      start.x,
      start.y,
      "A",
      radius,
      radius,
      0,
      largeArcFlag,
      0,
      end.x,
      end.y,
      "L",
      x,
      y,
      "Z",
    ].join(" ");
  };

  let accAngle = 0;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {data.map((d, idx) => {
        const value = Number(d.votos) || 0;
        const angle = (value / total) * 360;

        const start = accAngle;
        const end = accAngle + angle;
        accAngle += angle;

        const fill = `hsl(${(idx * 80) % 360} 70% 50%)`;

        return (
          <path
            key={d.nombre}
            d={describeArc(cx, cy, r - 4, start, end)}
            fill={fill}
            stroke="rgba(0,0,0,0.25)"
            strokeWidth="1"
          />
        );
      })}
    </svg>
  );
};

const BarSVG = ({ data, width = 520, height = 260 }) => {
  const values = data.map((d) => Number(d.votos) || 0);
  const max = Math.max(...values, 1);

  const padding = 28;
  const chartW = width - padding * 2;
  const chartH = height - padding * 2;

  const barCount = data.length || 1;
  const gap = 14;
  const barW = Math.max((chartW - gap * (barCount - 1)) / barCount, 18);

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {/* ejes */}
      <line
        x1={padding}
        y1={padding + chartH}
        x2={padding + chartW}
        y2={padding + chartH}
        stroke="rgba(255,255,255,0.25)"
        strokeWidth="1"
      />
      <line
        x1={padding}
        y1={padding}
        x2={padding}
        y2={padding + chartH}
        stroke="rgba(255,255,255,0.25)"
        strokeWidth="1"
      />

      {/* grid */}
      {[1, 2, 3].map((i) => {
        const y = padding + (chartH * i) / 4;
        return (
          <line
            key={i}
            x1={padding}
            y1={y}
            x2={padding + chartW}
            y2={y}
            stroke="rgba(255,255,255,0.10)"
            strokeWidth="1"
          />
        );
      })}

      {/* barras */}
      {data.map((d, idx) => {
        const v = Number(d.votos) || 0;
        const barH = (v / max) * chartH;

        const x = padding + idx * (barW + gap);
        const y = padding + (chartH - barH);

        const fill = `hsl(${(idx * 80) % 360} 70% 50%)`;

        return (
          <g key={d.nombre}>
            <rect
              x={x}
              y={y}
              width={barW}
              height={barH}
              rx="6"
              fill={fill}
              stroke="rgba(0,0,0,0.25)"
              strokeWidth="1"
            />

            {/* valor */}
            <text
              x={x + barW / 2}
              y={Math.max(y - 6, 12)}
              textAnchor="middle"
              fontSize="12"
              fill="rgba(255,255,255,0.85)"
            >
              {v}
            </text>

            {/* label */}
            <text
              x={x + barW / 2}
              y={padding + chartH + 18}
              textAnchor="middle"
              fontSize="12"
              fill="rgba(255,255,255,0.75)"
            >
              {(d.nombre || "").length > 10 ? `${d.nombre.slice(0, 10)}…` : d.nombre}
            </text>
          </g>
        );
      })}

      {/* labels y */}
      <text
        x={padding - 6}
        y={padding + 10}
        textAnchor="end"
        fontSize="12"
        fill="rgba(255,255,255,0.65)"
      >
        {max}
      </text>
      <text
        x={padding - 6}
        y={padding + chartH}
        textAnchor="end"
        fontSize="12"
        fill="rgba(255,255,255,0.65)"
      >
        0
      </text>
    </svg>
  );
};

export default function ConteoElectoralPage() {
  const distritos = useMemo(() => buildTree(Map), []);

  const [openDistrito, setOpenDistrito] = useState(() => ({}));
  const [openRecinto, setOpenRecinto] = useState(() => ({}));

  const [selected, setSelected] = useState({
    distrito: null,
    recinto: null,
    mesa: null,
  });

  const CHECK_MESA = useMemo(
    () => ({ distrito: 2, recinto: "Colegio Franz Tamayo", mesa: 5 }),
    []
  );

  const acta = useMemo(() => {
    if (!selected.distrito || !selected.recinto || !selected.mesa) return null;
    return getActaMock({
      distrito: selected.distrito,
      recinto: selected.recinto,
      mesa: selected.mesa,
    });
  }, [selected]);

  const partidos = useMemo(() => acta?.conteo_votos?.partidos ?? [], [acta]);

  const total = useMemo(
    () => partidos.reduce((acc, p) => acc + (Number(p.votos) || 0), 0),
    [partidos]
  );

  const navigate = useNavigate();

  const [imgOk, setImgOk] = useState(true);
  React.useEffect(() => {
    if (selected.mesa) setImgOk(true);
  }, [selected.distrito, selected.mesa]);

  const [rightMode, setRightMode] = useState("acta");

  const handleSelectMesa = ({ distrito, recinto, mesa }) => {
    setSelected({ distrito, recinto, mesa });
    setRightMode("acta");
  };

  const handleShowCharts = () => {
    if (!acta) return;
    setRightMode("charts");
  };

  return (
    <Box sx={{ px: 2, py: 2 }}>
      <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>
        Conteo Electoral (Mock)
      </Typography>

      <Box sx={{ display: "grid", gridTemplateColumns: "380px 1fr", gap: 2 }}>
        {/* LEFT TREE */}
        <Paper sx={{ p: 1.5, borderRadius: 2 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 2,
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 800 }}>
              Conteo Electoral (Mock)
            </Typography>

            <Button
              variant="outlined"
              onClick={() => navigate("/conteo-electoral-graficos")}
            >
              Gráficos generales
            </Button>
          </Box>

          <Divider sx={{ mb: 1 }} />

          <List dense sx={{ py: 0 }}>
            {distritos.map((d) => {
              const distritoKey = `d-${d.numero}`;
              const isDistritoOpen = !!openDistrito[distritoKey];

              return (
                <Box key={d.numero}>
                  <ListItemButton
                    onClick={() =>
                      setOpenDistrito((prev) => ({
                        ...prev,
                        [distritoKey]: !prev[distritoKey],
                      }))
                    }
                    sx={{ borderRadius: 1 }}
                  >
                    {isDistritoOpen ? <ExpandMoreIcon /> : <ChevronRightIcon />}
                    <Typography sx={{ fontWeight: 700, ml: 1 }}>
                      Distrito {d.numero}
                    </Typography>
                  </ListItemButton>

                  <Collapse in={isDistritoOpen} timeout="auto" unmountOnExit>
                    <Box sx={{ pl: 2 }}>
                      {(d.recintos ?? []).map((r) => {
                        const recintoKey = `r-${d.numero}-${r.nombre}`;
                        const isRecintoOpen = !!openRecinto[recintoKey];

                        return (
                          <Box key={recintoKey} sx={{ mt: 0.5 }}>
                            <ListItemButton
                              onClick={() =>
                                setOpenRecinto((prev) => ({
                                  ...prev,
                                  [recintoKey]: !prev[recintoKey],
                                }))
                              }
                              sx={{ borderRadius: 1 }}
                            >
                              {isRecintoOpen ? (
                                <ExpandMoreIcon fontSize="small" />
                              ) : (
                                <ChevronRightIcon fontSize="small" />
                              )}
                              <Typography sx={{ ml: 1 }}>
                                Recinto: {r.nombre}
                              </Typography>
                            </ListItemButton>

                            <Collapse in={isRecintoOpen} timeout="auto" unmountOnExit>
                              <Box sx={{ pl: 2 }}>
                                {toMesaList(r.mesas).map((mesaNum) => {
                                  const isSelected =
                                    selected.distrito === d.numero &&
                                    selected.recinto === r.nombre &&
                                    selected.mesa === mesaNum;

                                  const hasCheck =
                                    d.numero === CHECK_MESA.distrito &&
                                    r.nombre === CHECK_MESA.recinto &&
                                    mesaNum === CHECK_MESA.mesa;

                                  return (
                                    <Box
                                      key={`${recintoKey}-m-${mesaNum}`}
                                      sx={{ display: "flex", alignItems: "center", gap: 1 }}
                                    >
                                      <ListItemButton
                                        onClick={() =>
                                          handleSelectMesa({
                                            distrito: d.numero,
                                            recinto: r.nombre,
                                            mesa: mesaNum,
                                          })
                                        }
                                        sx={{
                                          borderRadius: 1,
                                          my: 0.25,
                                          bgcolor: isSelected ? "action.selected" : "transparent",
                                        }}
                                      >
                                        <Typography sx={{ ml: 1 }}>Mesa {mesaNum}</Typography>
                                      </ListItemButton>

                                      {hasCheck && (
                                        <IconButton
                                          size="small"
                                          onClick={handleShowCharts}
                                          title="Mostrar gráficos (mock)"
                                          sx={{ flexShrink: 0 }}
                                        >
                                          <CheckCircleIcon fontSize="small" />
                                        </IconButton>
                                      )}
                                    </Box>
                                  );
                                })}
                              </Box>
                            </Collapse>
                          </Box>
                        );
                      })}
                    </Box>
                  </Collapse>

                  <Divider sx={{ my: 1 }} />
                </Box>
              );
            })}
          </List>
        </Paper>

        {/* RIGHT PANEL */}
        <Paper sx={{ p: 2, borderRadius: 2 }}>
          {!selected.mesa ? (
            <Typography sx={{ opacity: 0.8 }}>
              Selecciona una mesa para ver el acta (mock).
            </Typography>
          ) : rightMode === "charts" ? (
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 900, mb: 0.5 }}>
                Gráficos (Mock)
              </Typography>
              <Typography sx={{ opacity: 0.8, mb: 1.5 }}>
                Distrito {selected.distrito} · {selected.recinto} · Mesa {selected.mesa}
              </Typography>

              <Divider sx={{ mb: 2 }} />

              {!acta || partidos.length === 0 ? (
                <Typography sx={{ opacity: 0.7 }}>
                  No hay datos de acta para graficar.
                </Typography>
              ) : (
                <Box sx={{ display: "grid", gridTemplateColumns: "360px 1fr", gap: 2 }}>
                  <Paper
                    variant="outlined"
                    sx={{
                      borderRadius: 2,
                      p: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      minHeight: 320,
                    }}
                  >
                    <Box sx={{ textAlign: "center" }}>
                      <Typography sx={{ fontWeight: 800, mb: 1 }}>
                        Torta
                      </Typography>
                      <PieSVG data={partidos} size={240} />
                      <Typography variant="body2" sx={{ opacity: 0.75, mt: 1 }}>
                        Total votos partidos: {total}
                      </Typography>
                    </Box>
                  </Paper>

                  <Paper variant="outlined" sx={{ borderRadius: 2, p: 2 }}>
                    <Typography sx={{ fontWeight: 800, mb: 1 }}>
                      Barras
                    </Typography>

                    <Box sx={{ width: "100%", overflowX: "auto" }}>
                      <BarSVG data={partidos} width={560} height={280} />
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Typography sx={{ fontWeight: 800, mb: 1 }}>
                      Detalle
                    </Typography>

                    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
                      {partidos.map((p) => (
                        <Box
                          key={p.nombre}
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            bgcolor: "action.hover",
                            borderRadius: 1,
                            px: 1.25,
                            py: 0.75,
                          }}
                        >
                          <Typography sx={{ fontWeight: 700 }}>{p.nombre}</Typography>
                          <Typography>{p.votos}</Typography>
                        </Box>
                      ))}
                    </Box>
                  </Paper>
                </Box>
              )}
            </Box>
          ) : (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 360px",
                gap: 2,
              }}
            >
              {/* FOTO */}
              <Paper
                variant="outlined"
                sx={{
                  borderRadius: 2,
                  p: 2,
                  minHeight: 360,
                }}
              >
                <Box sx={{ textAlign: "center" }}>
                  <Typography sx={{ fontWeight: 800, mb: 1 }}>
                    acta-distrito-{selected.distrito}-mesa-{selected.mesa}
                  </Typography>

                  <Typography variant="body2" sx={{ opacity: 0.7 }}>
                    (Imagen desde /public si existe)
                  </Typography>

                  <Box sx={{ mt: 2 }}>
                    {imgOk ? (
                      <img
                        src={getActaImgSrc({
                          distrito: selected.distrito,
                          mesa: selected.mesa,
                        })}
                        alt={`Acta distrito ${selected.distrito} mesa ${selected.mesa}`}
                        style={{
                          width: "100%",
                          maxHeight: 520,
                          objectFit: "contain",
                          borderRadius: 12,
                        }}
                        onError={() => setImgOk(false)}
                      />
                    ) : (
                      <Box
                        sx={{
                          mt: 0,
                          width: "100%",
                          height: 320,
                          borderRadius: 2,
                          bgcolor: "action.hover",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexDirection: "column",
                          gap: 1,
                        }}
                      >
                        <Typography sx={{ opacity: 0.7 }}>
                          No se encontró imagen para:
                        </Typography>
                        <Typography sx={{ fontWeight: 800, opacity: 0.85 }}>
                          {getActaImgSrc({
                            distrito: selected.distrito,
                            mesa: selected.mesa,
                          })}
                        </Typography>
                        <Typography sx={{ opacity: 0.7 }}>
                          Sube el archivo a /public con ese nombre (y extensión).
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Box>
              </Paper>

              {/* DATOS */}
              <Paper variant="outlined" sx={{ borderRadius: 2, p: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1 }}>
                  Datos del Acta (Mock)
                </Typography>

                <Divider sx={{ mb: 1.5 }} />

                <Typography sx={{ mb: 0.5 }}>
                  <b>Distrito:</b> {selected.distrito}
                </Typography>
                <Typography sx={{ mb: 0.5 }}>
                  <b>Recinto:</b> {selected.recinto}
                </Typography>
                <Typography sx={{ mb: 1.5 }}>
                  <b>Mesa:</b> {selected.mesa}
                </Typography>

                <Divider sx={{ mb: 1.5 }} />

                <Typography sx={{ fontWeight: 800, mb: 1 }}>
                  Votos por partido
                </Typography>

                {!acta ? (
                  <Typography sx={{ opacity: 0.7 }}>
                    No hay acta mock para esta mesa.
                  </Typography>
                ) : (
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
                    {(acta.conteo_votos?.partidos ?? []).map((p) => (
                      <Box
                        key={p.nombre}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          bgcolor: "action.hover",
                          borderRadius: 1,
                          px: 1.25,
                          py: 0.75,
                        }}
                      >
                        <Typography sx={{ fontWeight: 700 }}>{p.nombre}</Typography>
                        <Typography>{p.votos}</Typography>
                      </Box>
                    ))}
                  </Box>
                )}
              </Paper>
            </Box>
          )}
        </Paper>
      </Box>
    </Box>
  );
}