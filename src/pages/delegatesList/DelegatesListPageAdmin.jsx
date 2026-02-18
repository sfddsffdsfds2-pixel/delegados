import { Backdrop, Box, CircularProgress, Container, CssBaseline, Divider, FormControl, FormLabel, InputLabel, MenuItem, Select, styled, Toolbar, Typography } from "@mui/material";
import DelegatesListAdmin from "./components/DelegatesListAdmin";
import { TextField, InputAdornment, IconButton, Button } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import { useColorScheme } from '@mui/material/styles';
import data from '../../appConfig/Map.json';
import { FullScreenProgress } from '../../generalComponents/FullScreenProgress';


import { useEffect, useMemo, useState } from "react";
import RecintoSelectorModal from "../../generalComponents/SelectRecinto";

const STORAGE_KEY = "delegados";

const readDelegados = () => {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr)
      ? arr.map((d) => ({
        ...d,
        id: d.id ?? d.ci,
      }))
      : [];
  } catch {
    return [];
  }
};

const DelegatesListContainer = styled(Box)(({ theme }) => ({
  height: 'calc(100vh - 64px)',
  display: 'flex',
  maxWidth: '100vw',
  flexDirection: 'column',
  width: '100vw',
  maxWidth: '100vw',
  mt: 4,
  overflow: 'hidden',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    paddingX: theme.spacing(2),
  },
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    zIndex: -1,
    inset: 0,
    backgroundImage:
      'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    backgroundRepeat: 'no-repeat',
    ...theme.applyStyles('dark', {
      backgroundImage:
        'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
    }),
  },
}));

export default function DelegatesListPageAdmin() {
  const [rows, setRows] = useState(() => readDelegados());
  const [openRecintoModal, setOpenRecintoModal] = useState(false);

  const [searchTypeSelect, setSearchTypeSelect] = useState('ci');
  const [searchText, setSearchText] = useState('');
  const [selectedDistrito, setSelectedDistrito] = useState('all');
  const [selectedRecinto, setSelectedRecinto] = useState('all');
  const [loading, setLoading] = useState(false);
  const [mostrarFiltro, setMostrarFiltro] = useState('all');

  const { setMode } = useColorScheme();


  const distritosData =
    data.departamentos[0]
      .provincias[0]
      .municipios[0]
      .distritos;

  const [appliedFilters, setAppliedFilters] = useState({
    searchText: '',
    searchType: 'ci',
  });



  const handleTypeSearchChange = (e) => {
    setSearchTypeSelect(e.target.value);
  };

  const searchType = [
    { key: 'ci', label: 'C.I.' },
    { key: 'nombre', label: 'Nombre o apellido' },
    { key: 'telefono', label: 'Número de teléfono' },
  ];

  const handleSearch = () => {
    setLoading(true);

    // Aquí simulas la búsqueda
    setTimeout(() => {
      setAppliedFilters({
        searchText,
        searchType: searchTypeSelect,
      });
      setLoading(false);
    }, 1500);
  };

  const handleClear = () => {
    setSearchText('');

    setAppliedFilters({
      searchText: '',
      searchType: searchTypeSelect,
    });
  };

  useEffect(() => {
    if (searchText.trim() === '' && appliedFilters.searchText !== '') {
      setAppliedFilters({
        searchText: '',
        searchType: searchTypeSelect,
      });
    }
  }, [searchText]);

  const normalizeMesa = (m) => {
    const n = Number(m);
    return Number.isFinite(n) && n > 0 ? n : Number.POSITIVE_INFINITY; // sin mesa al final
  };

  const normalizeDistrito = (d) => {
    const n = Number(d);
    return Number.isFinite(n) ? n : Number.POSITIVE_INFINITY;
  };

  const filteredRows = useMemo(() => {
    const out = rows.filter((row) => {
      // 🔹 FILTRO MOSTRAR (JR o todos)
      if (mostrarFiltro === 'jr' && !row.jefe_recinto) return false;

      // 🔹 FILTRO DISTRITO
      if (
        selectedDistrito !== 'all' &&
        Number(row.distrito) !== Number(selectedDistrito)
      ) return false;

      // 🔹 FILTRO RECINTO
      if (selectedRecinto !== 'all' && row.recinto !== selectedRecinto) return false;

      // 🔹 FILTRO BUSQUEDA (SOLO APLICADO)
      if (appliedFilters.searchText.trim() !== '') {
        const search = appliedFilters.searchText.toLowerCase().trim();

        if (appliedFilters.searchType === 'ci') {
          if (!String(row.ci).toLowerCase().includes(search)) return false;
        }

        if (appliedFilters.searchType === 'telefono') {
          if (!String(row.telefono).toLowerCase().includes(search)) return false;
        }

        if (appliedFilters.searchType === 'nombre') {
          const fullName = `${row.nombre ?? ''} ${row.apellido ?? ''}`.toLowerCase().trim();
          if (!fullName.includes(search)) return false;
        }
      }

      return true;
    });
    out.sort((a, b) => {
      // 1) distrito ASC
      const da = normalizeDistrito(a.distrito);
      const db = normalizeDistrito(b.distrito);
      if (da !== db) return da - db;

      // 2) recinto ASC
      const ra = String(a.recinto ?? "").trim().toLowerCase();
      const rb = String(b.recinto ?? "").trim().toLowerCase();
      const recintoCmp = ra.localeCompare(rb, "es", { sensitivity: "base" });
      if (recintoCmp !== 0) return recintoCmp;

      // 3) jefe de recinto primero (true arriba)
      const ja = a.jefe_recinto ? 1 : 0;
      const jb = b.jefe_recinto ? 1 : 0;
      if (ja !== jb) return jb - ja; // true primero

      // 4) mesa ASC (sin mesa al final)
      const ma = normalizeMesa(a.mesa);
      const mb = normalizeMesa(b.mesa);
      if (ma !== mb) return ma - mb;

      // desempate opcional
      const aa = `${a.apellido ?? ''} ${a.nombre ?? ''}`.toLowerCase();
      const bb = `${b.apellido ?? ''} ${b.nombre ?? ''}`.toLowerCase();
      return aa.localeCompare(bb, "es", { sensitivity: "base" });
    });

    return out;
  }, [rows, selectedDistrito, selectedRecinto, appliedFilters, mostrarFiltro]);



  useEffect(() => {
    const html = document.documentElement;

    const previousScheme = html.getAttribute('data-mui-color-scheme');

    html.setAttribute('data-mui-color-scheme', 'dark');

    return () => {
      if (previousScheme) {
        html.setAttribute('data-mui-color-scheme', previousScheme);
      } else {
        html.removeAttribute('data-mui-color-scheme');
      }
    };
  }, []);

  const selectedSearchLabel =
    searchType.find((s) => s.key === searchTypeSelect)?.label || '';

  const formattedLabel =
    searchTypeSelect === 'ci'
      ? selectedSearchLabel
      : selectedSearchLabel.charAt(0).toLowerCase() + selectedSearchLabel.slice(1);

  const dynamicPlaceholder = `Introduce el ${formattedLabel}`;

  useEffect(() => {
    return () => setMode('dark');;
  }, [setMode]);

  return (
    <>
      {
        loading && <FullScreenProgress text={'Realizando búsqueda'} />
      }
      <CssBaseline enableColorScheme />
      <Toolbar />
      <DelegatesListContainer >
        <Box mb={1} display={'flex'} flexDirection={'column'} gap={1}>
          <Box width={'100%'} display={'flex'} flexDirection={{
            xs: 'column',
            sm: 'row'
          }} alignItems={'center'} justifyContent={'space-between'}>
            <Box display={'flex'} flexDirection={{
              xs: 'column',
              sm: 'row'
            }} alignItems={'center'} gap={1} mb={1}>
              <Typography
                lineHeight={1}
                sx={{
                  fontSize: {
                    xs: '1.5rem',
                    sm: '2.5rem',
                  },
                  fontWeight: 500,
                }}
              >
                Lista de delegados
              </Typography>

              <Typography
                lineHeight={1}
                variant="body2"
                sx={{ opacity: 0.7, mt: { xs: 0, sm: 3 }, fontSize: '0.7rem' }}
              >
                {filteredRows.length} delegado{filteredRows.length !== 1 && "s"} encontrados
              </Typography>
            </Box>

            <Box width={{
              xs: '100%',
              sm: 'auto'
            }} display={'flex'} flexDirection={{
              xs: 'column',
              sm: 'row'
            }} gap={1}>
              <Button
                variant="outlined"
                onClick={() => setOpenRecintoModal(true)}
                sx={{
                  gap: 0.5,
                  alignItems: 'start',
                  display: 'flex',
                  flexDirection: 'column',
                  textTransform: "none",
                  overflow: "hidden",
                  width: {
                    xs: '100%',
                    sm: 280
                  },
                  maxWidth: {
                    xs: '100%',
                    sm: 280
                  },
                }}
              >
                <Typography lineHeight={1} fontSize={10}>Distrito y recinto:</Typography>
                <Typography
                  lineHeight={1}
                  sx={{
                    width: "100%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    fontSize: 12,
                    textAlign: 'left'
                  }}
                  color="textSecondary"
                >
                  {selectedDistrito === 'all' && selectedRecinto === 'all'
                    ? "Todos los distritos y todos los recintos"
                    : `Distrito ${selectedDistrito} - ${selectedRecinto}`}
                </Typography>
              </Button>

              <FormControl
                sx={{
                  width: {
                    xs: '100%',
                    sm: 120
                  },
                  maxWidth: {
                    xs: '100%',
                    sm: 120
                  },
                }}
                size="small"
              >
                <InputLabel id="mostrar-label">Filtrar</InputLabel>
                <Select
                  labelId="mostrar-label"
                  label="Mostrar"
                  value={mostrarFiltro}
                  onChange={(e) => setMostrarFiltro(e.target.value)}
                  renderValue={(selected) => {
                    const labels = {
                      all: "Todos",
                      jr: "Solo J.R",
                    };

                    return (
                      <Box
                        sx={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {labels[selected]}
                      </Box>
                    );
                  }}
                  sx={{
                    "& .MuiSelect-select": {
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    },
                  }}
                >
                  <MenuItem value="all">Todos</MenuItem>
                  <MenuItem value="jr">Solo J.R.</MenuItem>
                </Select>
              </FormControl>


            </Box>
          </Box>
          <Divider />
          <Box display={'flex'} flexDirection={{ xs: 'column', sm: 'row' }} gap={1} width={'100%'}>
            <FormControl sx={{
              minWidth: 150, maxWidth: {
                xs: '100%',
                lg: 150
              }
            }}>
              <FormLabel>Buscar por:</FormLabel>
              <Select
                name="search"
                value={searchTypeSelect}
                onChange={handleTypeSearchChange}
                required
                renderValue={(selected) => {
                  const option = searchType.find((s) => s.key === selected);
                  return (
                    <Box
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {option?.label}
                    </Box>
                  );
                }}

              >
                {searchType.map((option) => (
                  <MenuItem key={option.key} value={option.key}>
                    {option.label}
                  </MenuItem>

                ))}
              </Select>
            </FormControl>

            <Box display="flex" width={'100%'} gap={2} alignItems="flex-end" mt={0}>
              <TextField
                fullWidth
                label={dynamicPlaceholder}
                value={searchText}
                placeholder={dynamicPlaceholder}
                onChange={(e) => setSearchText(e.target.value)}
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    paddingRight: '0px',
                  },
                  '& .MuiInputAdornment-root': {
                    margin: 0,
                  },
                }}

              />

              <Button
                variant="contained"
                disabled={!appliedFilters.searchText && searchText.trim() === ''}
                color="secondary"
                startIcon={
                  loading
                    ? <CircularProgress color="inherit" size={20} />
                    : appliedFilters.searchText
                      ? <ClearIcon />
                      : <SearchIcon />
                }
                onClick={() => {
                  if (loading) return;
                  if (appliedFilters.searchText) {
                    handleClear();
                  } else {
                    handleSearch();
                  }
                }}
              >
                {loading
                  ? 'Buscando...'
                  : appliedFilters.searchText
                    ? 'Borrar'
                    : 'Buscar'}
              </Button>

            </Box>
          </Box>
          <Divider />
        </Box>

        <Box flex={1} minHeight={0}>
          <DelegatesListAdmin rows={filteredRows} setRows={setRows} />
        </Box>

      </DelegatesListContainer>

      <RecintoSelectorModal
        open={openRecintoModal}
        onClose={() => setOpenRecintoModal(false)}
        distritosData={distritosData}
        showInDelegatesList
        onSelect={({ recinto, distrito }) => {
          setSelectedDistrito(distrito);
          setSelectedRecinto(recinto);
        }}
      />
    </>
  );
}