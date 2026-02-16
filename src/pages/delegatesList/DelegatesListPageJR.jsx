import { Box, CircularProgress, CssBaseline,  Divider, FormControl, FormLabel, MenuItem, Select, styled, Toolbar, Typography } from "@mui/material";
import DelegatesListJR from "./components/DelegatesListJR";
import AppTheme from "../../shared-theme/AppTheme";
import { TextField, Button } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import { useColorScheme } from '@mui/material/styles';
import data from '../../appConfig/Map.json';
import { FullScreenProgress } from '../../generalComponents/FullScreenProgress';

import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "../../contexts/AuthContex";
import { db } from "../../firebase/firebase";
import { doc, updateDoc, deleteField } from "firebase/firestore";

const STORAGE_KEY = (uid) => `delegados_${uid || "anon"}`;

const readDelegados = (uid) => {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY(uid));
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
  const { user } = useAuth();

  const [rows, setRows] = useState([]);
  const [searchTypeSelect, setSearchTypeSelect] = useState('ci');
  const [searchText, setSearchText] = useState('');
  const [selectedDistrito, setSelectedDistrito] = useState('all');
  const [selectedRecinto, setSelectedRecinto] = useState('all');
  const [loading, setLoading] = useState(false);

  const [saving, setSaving] = useState(false);
  const [changedMap, setChangedMap] = useState({});

  const changedRef = useRef(new Set());

  const distritosData =
    data.departamentos[0]
      .provincias[0]
      .municipios[0]
      .distritos;

  const mesaMax = useMemo(() => {
    const distritoNum = Number(user?.distrito);
    const recintoName = String(user?.recinto || "").trim();

    if (!recintoName || Number.isNaN(distritoNum)) return 0;

    const distritoObj = distritosData.find(d => Number(d.numero) === distritoNum);
    const recintoObj = distritoObj?.recintos?.find(r => String(r.nombre).trim() === recintoName);

    const m = Number(recintoObj?.mesas);
    return Number.isFinite(m) ? m : 0;
  }, [user?.distrito, user?.recinto, distritosData]);

  const [appliedFilters, setAppliedFilters] = useState({
    searchText: '',
    searchType: 'ci',
  });

  const { setMode } = useColorScheme();

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

  const markChanged = (id) => {
    const key = String(id);
    changedRef.current.add(key);
    setChangedMap((prev) => ({ ...prev, [key]: true }));
  };

  const handleSaveChanges = async () => {
    if (saving) return;

    const ids = Array.from(changedRef.current);
    if (!ids.length) return;

    try {
      setSaving(true);

      const toSave = rows.filter((r) => ids.includes(String(r.id)));

      await Promise.all(
        toSave.map(async (r) => {
          const ref = doc(db, "delegados", String(r.id));

          const payload = {
            asistencia: !!r.asistencia,
            pago: !!r.pago,
          };

          const mesaRaw = r.mesa;
          if (mesaRaw === "" || mesaRaw == null) {
            payload.mesa = deleteField();
          } else {
            const mesaNum = Number(mesaRaw);
            if (!Number.isNaN(mesaNum)) payload.mesa = mesaNum;
          }

          await updateDoc(ref, payload);
        })
      );

      setChangedMap({});
      changedRef.current.clear();
      sessionStorage.setItem(STORAGE_KEY(user?.uid), JSON.stringify(rows));

    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (searchText.trim() === '' && appliedFilters.searchText !== '') {
      setAppliedFilters({
        searchText: '',
        searchType: searchTypeSelect,
      });
    }
  }, [searchText]);

  useEffect(() => {
    if (!user?.uid) return;

    const distrito = Number(user?.distrito);
    const recinto = String(user?.recinto || "");
    if (!recinto || Number.isNaN(distrito)) return;

    setSelectedDistrito(String(distrito));
    setSelectedRecinto(recinto);

    setRows(readDelegados(user.uid));
  }, [user?.uid, user?.distrito, user?.recinto]);

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      if (
        selectedDistrito !== 'all' &&
        Number(row.distrito) !== Number(selectedDistrito)
      ) return false;

      if (
        selectedDistrito !== 'all' &&
        selectedRecinto !== 'all' &&
        row.recinto !== selectedRecinto
      ) return false;

      if (appliedFilters.searchText.trim() !== '') {
        const search = appliedFilters.searchText.toLowerCase().trim();

        if (appliedFilters.searchType === 'ci') {
          if (!String(row.ci).toLowerCase().includes(search)) return false;
        }

        if (appliedFilters.searchType === 'telefono') {
          if (!String(row.telefono).toLowerCase().includes(search)) return false;
        }

        if (appliedFilters.searchType === 'nombre') {
          const fullName = `${row.nombre ?? ''} ${row.apellido ?? ''}`
            .toLowerCase()
            .trim();
          if (!fullName.includes(search)) return false;
        }
      }

      return true;
    });
  }, [rows, selectedDistrito, selectedRecinto, appliedFilters]);

  useEffect(() => {
    const html = document.documentElement;
    const previousScheme = html.getAttribute('data-mui-color-scheme');
    html.setAttribute('data-mui-color-scheme', 'dark');
    return () => {
      if (previousScheme) html.setAttribute('data-mui-color-scheme', previousScheme);
      else html.removeAttribute('data-mui-color-scheme');
    };
  }, []);

  useEffect(() => {
    setMode('dark');
    return () => setMode('light');
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
      {loading && <FullScreenProgress text={'Realizando búsqueda'} />}

      <CssBaseline enableColorScheme />
      <Toolbar />
      <DelegatesListContainer>
        <Box mb={1} display={'flex'} flexDirection={'column'} gap={1}>
          <Box
            width={'100%'}
            display={'flex'}
            flexDirection={{ xs: 'column', sm: 'row' }}
            alignItems={'center'}
            justifyContent={'space-between'}
          >
            <Box>
              <Box display={'flex'} gap={1}>
                <Typography variant="h6" fontWeight={'bold'}>Distrito: </Typography>
                <Typography variant="caption" color="secondary">{user?.distrito}</Typography>
              </Box>

              <Box display={'flex'} gap={1}>
                <Typography variant="h6" fontWeight={'bold'}>Recinto: </Typography>
                <Typography>{user?.recinto}</Typography>
              </Box>
              <Typography>Jefe de recinto:</Typography>
              <Typography>{user?.nombre} {user?.apellido}</Typography>
            </Box>

            <Box width={{ xs: '100%', sm: 'auto' }} display={'flex'} flexDirection={{ xs: 'column', sm: 'row' }} gap={1}>
              <Button onClick={handleSaveChanges} disabled={saving}>
                {saving ? "Guardando..." : "Guardar cambios"}
              </Button>
            </Box>
          </Box>

          <Divider />

          <Box display={'flex'} flexDirection={{ xs: 'column', sm: 'row' }} gap={1} width={'100%'}>
            <FormControl sx={{ minWidth: 150, maxWidth: { xs: '100%', lg: 150 } }}>
              <FormLabel>Buscar por:</FormLabel>
              <Select
                name="distrito"
                value={searchTypeSelect}
                onChange={handleTypeSearchChange}
                required
                renderValue={(selected) => {
                  const option = searchType.find((s) => s.key === selected);
                  return (
                    <Box sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
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
                  '& .MuiOutlinedInput-root': { paddingRight: '0px' },
                  '& .MuiInputAdornment-root': { margin: 0 },
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
                  if (appliedFilters.searchText) handleClear();
                  else handleSearch();
                }}
              >
                {loading ? 'Buscando...' : appliedFilters.searchText ? 'Borrar' : 'Buscar'}
              </Button>
            </Box>
          </Box>

          <Divider />
        </Box>

        <Box flex={1} minHeight={0}>
          <DelegatesListJR
            rows={filteredRows}
            setRows={setRows}
            mesaMax={mesaMax}
            markChanged={markChanged}
          />
        </Box>
      </DelegatesListContainer>
    </AppTheme>
  );
}