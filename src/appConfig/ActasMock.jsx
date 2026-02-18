const baseActa = {
  documento: {
    titulo: "ACTA ELECTORAL DE ESCRUTINIO Y CONTEO",
    eleccion:
      "ELECCIÓN DE PRESIDENTE Y VICEPRESIDENTE DEL ESTADO PLURINACIONAL DE BOLIVIA 2025 - SEGUNDA VUELTA",
    fecha_eleccion: "19 DE OCTUBRE DE 2025",
    codigo_verificacion: "139060",
    tipo: "A1",
    organo: "OEP - Órgano Electoral Plurinacional",
  },
  ubicacion_mesa: {
    codigo_mesa: "303200-1",
    departamento: "Cochabamba",
    provincia: "Quillacollo",
    municipio: "Quillacollo",
    localidad: "Quillacollo",
    recinto: "Colegio Franz Tamayo",
    numero_mesa: "5",
  },
  conteo_votos: {
    partidos: [
      { nombre: "PDC", votos: 97 },
      { nombre: "LIBRE", votos: 98 },
    ],
    resumen: {
      votos_validos: 195,
      votos_blancos: 0,
      votos_nulos: 5,
    },
    observaciones: "",
  },
};

export const ACTAS_MOCK = {
  "2|Colegio Franz Tamayo|5": baseActa,

  "1|Instituto Particular Quillacollo|2": {
    ...baseActa,
    ubicacion_mesa: {
      ...baseActa.ubicacion_mesa,
      recinto: "Instituto Particular Quillacollo",
      numero_mesa: "2",
      codigo_mesa: "303200-2",
    },
    conteo_votos: {
      ...baseActa.conteo_votos,
      partidos: [
        { nombre: "PDC", votos: 40 },
        { nombre: "LIBRE", votos: 61 },
      ],
      resumen: { votos_validos: 101, votos_blancos: 2, votos_nulos: 3 },
    },
  },
};

export const getActaMock = ({ distrito, recinto, mesa }) => {
  const key = `${distrito}|${recinto}|${mesa}`;
  return ACTAS_MOCK[key] ?? null;
};
