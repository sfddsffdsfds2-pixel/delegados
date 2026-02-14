import { Box, Container, CssBaseline, Divider, FormControl, FormLabel, MenuItem, Select, styled, Toolbar, Typography } from "@mui/material";
import DelegatesList from "./components/DelegatesList";
import AppTheme from "../../shared-theme/AppTheme";
import { TextField, InputAdornment, IconButton, Button } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import { useColorScheme } from '@mui/material/styles';
import data from '../../appConfig/Map.json';

import { useEffect, useState } from "react";

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

export default function DelegatesListPage() {
  const [searchTypeSelect, setSearchTypeSelect] = useState('ci');
  const [searchText, setSearchText] = useState('');
  const [selectedDistrito, setSelectedDistrito] = useState('');
  const [selectedRecinto, setSelectedRecinto] = useState('');
  const distritosData =
    data.departamentos[0]
      .provincias[0]
      .municipios[0]
      .distritos;


  const { setMode } = useColorScheme();


  const handleTypeSearchChange = (e) => {
    setSearchTypeSelect(e.target.value);
  };

  const recintosDisponibles =
    distritosData.find(
      (d) => d.numero === Number(selectedDistrito)
    )?.recintos || [];

  const searchType = [
    { key: 'ci', label: 'Buscar por C.I.' },
    { key: 'nombre', label: 'Buscar por Nombre' },
    { key: 'telefono', label: 'Buscar por número de teléfono' },
  ];

  const handleSearch = () => {
    console.log("Buscar:", searchText);
  };

  const handleClear = () => {
    setSearchText('');
  };

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



  return (
    <AppTheme mode="dark">
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
              <FormControl sx={{minWidth: 100, maxWidth: 100}}>
                <FormLabel>Distrito:</FormLabel>
                <Select
                  name="distrito"
                  value={selectedDistrito}
                  onChange={(e) => {
                    setSelectedDistrito(e.target.value);
                    setSelectedRecinto('');
                  }}
                  required
                >
                  {distritosData.map((d) => (
                    <MenuItem key={d.numero} value={d.numero}>
                      Distrito {d.numero}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl sx={{minWidth: 200, maxWidth: 200}}>
                <FormLabel>Recinto:</FormLabel>
                <Select
                  name="distrito"
                  value={selectedRecinto}
                  onChange={(e) => setSelectedRecinto(e.target.value)}
                  required
                >
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
            <FormControl>
              <FormLabel>Buscar por:</FormLabel>
              <Select
                name="distrito"
                value={searchTypeSelect}
                onChange={handleTypeSearchChange}
                required
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
                label="Buscar"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    paddingRight: '0px', // reduce espacio derecho
                  },
                  '& .MuiInputAdornment-root': {
                    margin: 0,
                  },
                }}
                slotProps={{
                  input: {
                    endAdornment: searchText && (
                      <InputAdornment position="end" sx={{ margin: 0 }}>
                        <IconButton
                          onClick={handleClear}
                          size="small"
                          sx={{
                            padding: 0,
                            marginRight: '0px', // opcional si lo quieres 100% pegado usa 0
                          }}
                        >
                          <ClearIcon fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }
                }}
              />


              <Button
                variant="contained"
                startIcon={<SearchIcon />}
                onClick={handleSearch}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch();
                  }
                }}
              >
                Buscar
              </Button>

            </Box>

          </Box>
          <Divider />
        </Box>

        <Box flex={1} minHeight={0}>
          <DelegatesList />
        </Box>

      </DelegatesListContainer>
    </AppTheme>
  );
}