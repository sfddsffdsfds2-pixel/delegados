import { Backdrop, Box, CircularProgress, Container, CssBaseline, Divider, FormControl, FormLabel, MenuItem, Select, styled, Toolbar, Typography } from "@mui/material";
import DelegatesList from "./components/DelegatesListAdmin";
import AppTheme from "../../shared-theme/AppTheme";
import { TextField, InputAdornment, IconButton, Button } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import { useColorScheme } from '@mui/material/styles';
import data from '../../appConfig/Map.json';
import { FullScreenProgress } from '../../generalComponents/FullScreenProgress';

import { useEffect, useMemo, useState } from "react";

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

export default function DelegatesListPageJR() {
  const [rows, setRows] = useState(() => readDelegados());

  const [searchTypeSelect, setSearchTypeSelect] = useState('ci');
  const [searchText, setSearchText] = useState('');
  const [selectedDistrito, setSelectedDistrito] = useState('all');
  const [selectedRecinto, setSelectedRecinto] = useState('all');
  const [loading, setLoading] = useState(false);

  const distritosData =
    data.departamentos[0]
      .provincias[0]
      .municipios[0]
      .distritos;

  const [appliedFilters, setAppliedFilters] = useState({
    searchText: '',
    searchType: 'ci',
  });


  const { setMode } = useColorScheme();

  const handleTypeSearchChange = (e) => {
    setSearchTypeSelect(e.target.value);
  };

  const recintosDisponibles =
    selectedDistrito === 'all'
      ? []
      : distritosData.find(
        (d) => d.numero === Number(selectedDistrito)
      )?.recintos || [];

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



  const filteredRows = useMemo(() => {
    return rows.filter((row) => {

      // 🔹 FILTRO DISTRITO
      if (
        selectedDistrito !== 'all' &&
        Number(row.distrito) !== Number(selectedDistrito)
      ) {
        return false;
      }

      // 🔹 FILTRO RECINTO
      if (
        selectedDistrito !== 'all' &&
        selectedRecinto !== 'all' &&
        row.recinto !== selectedRecinto
      ) {
        return false;
      }

      // 🔹 FILTRO BUSQUEDA (SOLO APLICADO)
      if (appliedFilters.searchText.trim() !== '') {
        const search = appliedFilters.searchText.toLowerCase().trim();

        if (appliedFilters.searchType === 'ci') {
          if (!String(row.ci).toLowerCase().includes(search)) {
            return false;
          }
        }

        if (appliedFilters.searchType === 'telefono') {
          if (!String(row.telefono).toLowerCase().includes(search)) {
            return false;
          }
        }

        if (appliedFilters.searchType === 'nombre') {
          const fullName = `${row.nombre ?? ''} ${row.apellido ?? ''}`
            .toLowerCase()
            .trim();

          if (!fullName.includes(search)) {
            return false;
          }
        }
      }

      return true;
    });
  }, [
    rows,
    selectedDistrito,
    selectedRecinto,
    appliedFilters
  ]);



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

  useEffect(() => {
    setMode('dark');

    return () => {
      setMode('light');
    };
  }, [setMode]);

  const selectedSearchLabel =
    searchType.find((s) => s.key === searchTypeSelect)?.label || '';

  const formattedLabel =
    searchTypeSelect === 'ci'
      ? selectedSearchLabel
      : selectedSearchLabel.charAt(0).toLowerCase() + selectedSearchLabel.slice(1);

  const dynamicPlaceholder = `Introduce el ${formattedLabel}`;



  return (
    <AppTheme mode="dark">
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
            <Typography
              sx={{
                fontSize: {
                  xs: '1.5rem',
                  sm: '2.5rem',
                  textAlign: {
                    xs: 'center',
                    sm: 'left'
                  }
                },
                fontWeight: 500,
              }}
            >Lista de delegados</Typography>
            <Box width={{
              xs: '100%',
              sm: 'auto'
            }} display={'flex'} flexDirection={{
              xs: 'column',
              sm: 'row'
            }} gap={1}>
              <FormControl sx={{
                minWidth: 150, maxWidth: {
                  xs: '100%',
                  lg: 150
                }
              }}>
                <FormLabel>Distrito:</FormLabel>
                <Select
                  name="distrito"
                  value={selectedDistrito}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSelectedDistrito(value);

                    if (value === 'all') {
                      setSelectedRecinto('all');
                    } else {
                      const distritoEncontrado = distritosData.find(
                        (d) => d.numero === Number(value)
                      );

                      if (distritoEncontrado?.recintos?.length > 0) {
                        setSelectedRecinto('all');
                      } else {
                        setSelectedRecinto('');
                      }
                    }
                  }}
                  renderValue={(selected) => (
                    <Box
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {selected === 'all'
                        ? 'Todos los distritos'
                        : `Distrito ${selected}`}
                    </Box>
                  )}

                  required
                >
                  <MenuItem value="all">
                    Todos los distritos
                  </MenuItem>
                  {distritosData.map((d) => (
                    <MenuItem key={d.numero} value={d.numero}>
                      Distrito {d.numero}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl sx={{
                minWidth: 200, maxWidth: {
                  xs: '100%',
                  lg: 200
                }
              }}>
                <FormLabel>Recinto:</FormLabel>
                <Select
                  name="distrito"
                  value={selectedRecinto}
                  onChange={(e) => setSelectedRecinto(e.target.value)}
                  required
                  disabled={selectedDistrito === 'all'}
                  renderValue={(selected) => (
                    <Box
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {selected === 'all' ? 'Todos los recintos' : selected}
                    </Box>
                  )}
                >
                  <MenuItem value="all">
                    Todos los recintos
                  </MenuItem>
                  {recintosDisponibles.map((r) => (
                    <MenuItem key={r.nombre} value={r.nombre}>
                      {r.nombre}
                    </MenuItem>
                  ))}
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
                name="distrito"
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

            <Box display="flex" width={'100%'} gap={2} alignItems="flex-end" mt={2}>
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
          <DelegatesList rows={filteredRows} setRows={setRows} />
        </Box>

      </DelegatesListContainer>
    </AppTheme>
  );
}