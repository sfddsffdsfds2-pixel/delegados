import React, { useMemo } from "react";
import { Box, Paper, Typography, Divider, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

/* ------------------ MOCK COCHABAMBA (TOTAL) ------------------ */
/**
 * MOCK inventado (no real).
 * Simula el total departamental (Cochabamba) con números grandes.
 */
const COCHABAMBA_TOTAL = [
  { nombre: "LIBRE", votos: 782_450 },
  { nombre: "MAS-IPSP", votos: 701_320 },
  { nombre: "PDC", votos: 315_780 },
  { nombre: "MTS", votos: 214_610 },
  { nombre: "FPV", votos: 102_900 },
];

/* ------------------ PIE SVG ------------------ */
const PieSVG = ({ data, size = 220 }) => {
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

/* ------------------ BAR SVG ------------------ */
const BarSVG = ({ data, width = 640, height = 260 }) => {
  const values = data.map((d) => Number(d.votos) || 0);
  const max = Math.max(...values, 1);

  const padding = 28;
  const chartW = width - padding * 2;
  const chartH = height - padding * 2;

  const barCount = data.length || 1;
  const gap = 18;
  const barW = Math.max((chartW - gap * (barCount - 1)) / barCount, 22);

  const fmt = (n) => (Number(n) || 0).toLocaleString("es-BO");

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
              rx="8"
              fill={fill}
              stroke="rgba(0,0,0,0.25)"
              strokeWidth="1"
            />
            <text
              x={x + barW / 2}
              y={Math.max(y - 8, 14)}
              textAnchor="middle"
              fontSize="12"
              fill="rgba(255,255,255,0.85)"
            >
              {fmt(v)}
            </text>

            <text
              x={x + barW / 2}
              y={padding + chartH + 20}
              textAnchor="middle"
              fontSize="12"
              fill="rgba(255,255,255,0.75)"
            >
              {d.nombre}
            </text>
          </g>
        );
      })}

      <text
        x={padding - 8}
        y={padding + 10}
        textAnchor="end"
        fontSize="12"
        fill="rgba(255,255,255,0.65)"
      >
        {fmt(max)}
      </text>
      <text
        x={padding - 8}
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

export default function ConteoElectoralGraficosPage() {
  const navigate = useNavigate();

  // ✅ datos generales cochabamba (mock)
  const partidos = useMemo(() => COCHABAMBA_TOTAL, []);

  const total = useMemo(
    () => partidos.reduce((acc, p) => acc + (Number(p.votos) || 0), 0),
    [partidos]
  );

  const rows = useMemo(() => {
    const t = total || 1;
    return partidos
      .map((p) => {
        const votos = Number(p.votos) || 0;
        const pct = (votos / t) * 100;
        return { ...p, pct };
      })
      .sort((a, b) => (Number(b.votos) || 0) - (Number(a.votos) || 0));
  }, [partidos, total]);

  const fmt = (n) => (Number(n) || 0).toLocaleString("es-BO");
  const fmtPct = (n) => `${(Number(n) || 0).toFixed(2)}%`;

  return (
    <Box sx={{ px: 2, py: 2 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 800 }}>
          Resultados Cochabamba (Mock)
        </Typography>

        <Button variant="outlined" onClick={() => navigate(-1)}>
          Volver
        </Button>
      </Box>

      <Paper sx={{ p: 2, borderRadius: 2 }}>
        <Typography sx={{ mb: 0.5 }}>
          <b>Ámbito:</b> Departamento de Cochabamba (mock general)
        </Typography>
        <Typography sx={{ mb: 1.5 }}>
          <b>Total votos (partidos):</b> {fmt(total)}
        </Typography>

        <Divider sx={{ mb: 2 }} />

        <Box sx={{ display: "grid", gridTemplateColumns: "360px 1fr", gap: 2 }}>
          {/* IZQ: pie */}
          <Paper
            variant="outlined"
            sx={{
              borderRadius: 2,
              p: 2,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: 320,
            }}
          >
            <Box sx={{ textAlign: "center" }}>
              <Typography sx={{ fontWeight: 900, mb: 1 }}>
                Gráfico de torta
              </Typography>
              <PieSVG data={rows} size={240} />
              <Typography variant="body2" sx={{ opacity: 0.75, mt: 1 }}>
                Distribución por partido (mock)
              </Typography>
            </Box>
          </Paper>

          {/* DER: barras */}
          <Paper variant="outlined" sx={{ borderRadius: 2, p: 2 }}>
            <Typography sx={{ fontWeight: 900, mb: 1 }}>
              Gráfico de barras
            </Typography>

            <Box sx={{ width: "100%", overflowX: "auto" }}>
              <BarSVG data={rows} />
            </Box>
          </Paper>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* PORCENTAJES + LISTA SIMPLE */}
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 2 }}>
          {/* tabla porcentajes */}
          <Paper variant="outlined" sx={{ borderRadius: 2, p: 2 }}>
            <Typography sx={{ fontWeight: 900, mb: 1 }}>
              Porcentajes por partido
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
              {rows.map((p) => (
                <Box
                  key={p.nombre}
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "1fr 120px 110px",
                    alignItems: "center",
                    gap: 1,
                    bgcolor: "action.hover",
                    borderRadius: 1,
                    px: 1.25,
                    py: 0.9,
                  }}
                >
                  <Typography sx={{ fontWeight: 800 }}>{p.nombre}</Typography>
                  <Typography sx={{ textAlign: "right" }}>
                    {fmt(p.votos)}
                  </Typography>
                  <Typography sx={{ textAlign: "right", fontWeight: 800 }}>
                    {fmtPct(p.pct)}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>

          {/* lista simple */}
          <Paper variant="outlined" sx={{ borderRadius: 2, p: 2 }}>
            <Typography sx={{ fontWeight: 900, mb: 1 }}>
              Datos (partido + número)
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
              {rows.map((p) => (
                <Box
                  key={p.nombre}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    bgcolor: "action.hover",
                    borderRadius: 1,
                    px: 1.25,
                    py: 0.9,
                  }}
                >
                  <Typography sx={{ fontWeight: 800 }}>{p.nombre}</Typography>
                  <Typography>{fmt(p.votos)}</Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Box>
      </Paper>
    </Box>
  );
}
