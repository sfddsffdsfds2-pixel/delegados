import React, { useMemo, useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Typography,
    Select,
    MenuItem,
    List,
    ListItemButton,
    ListItemText,
    Chip,
    Paper,
    TextField
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";

export default function RecintoSelectorModal({
    open,
    onClose,
    distritosData,
    onSelect
}) {
    const [selectedDistrito, setSelectedDistrito] = useState("all");
    const [search, setSearch] = useState("");
    const normalize = (text) =>
        text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    const recintosFiltrados = useMemo(() => {
        if (selectedDistrito === "all") return [];

        const distrito = distritosData.find(
            (d) => d.numero === Number(selectedDistrito)
        );

        if (!distrito?.recintos) return [];

        return distrito.recintos.filter((r) =>
            normalize(r.nombre).includes(normalize(search))
        );
    }, [selectedDistrito, distritosData, search]);

    const hayResultadosGlobales = useMemo(() => {
        if (selectedDistrito !== "all") {
            return recintosFiltrados.length > 0;
        }

        return distritosData.some((d) =>
            d.recintos?.some((r) =>
                normalize(r.nombre).includes(normalize(search))
            )
        );
    }, [selectedDistrito, distritosData, search, recintosFiltrados]);



    const handleSelectRecinto = (recintoNombre, distritoNumero) => {
        onSelect({
            recinto: recintoNombre,
            distrito: distritoNumero
        });

        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="md"
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    minHeight: '90vh',
                }
            }}
        >
            <DialogTitle sx={{ fontWeight: 600 }}>
                Seleccionar Recinto
            </DialogTitle>

            <DialogContent dividers sx={{
                overflow: 'hidden',
                display: "flex",
                flexDirection: "column",
            }}>

                {/* Filtro */}
                <Box>
                    <Typography variant="subtitle2" sx={{ mb: 0.5, opacity: 0.7 }}>
                        Filtrar por distrito
                    </Typography>

                    <Select
                        fullWidth
                        value={selectedDistrito}
                        onChange={(e) => setSelectedDistrito(e.target.value)}
                        sx={{ borderRadius: 2, mb: 0.5 }}
                    >
                        <MenuItem value="all">Mostrar todos</MenuItem>
                        {distritosData.map((d) => (
                            <MenuItem key={d.numero} value={d.numero}>
                                Distrito {d.numero}
                            </MenuItem>
                        ))}
                    </Select>

                    {/* Buscador */}
                    <Box mb={1}>
                        <TextField
                            fullWidth
                            placeholder="Buscar recinto por nombre..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: 3
                                }
                            }}
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <IconButton
                                                disabled={!search}
                                                size="small"
                                                onClick={() => setSearch("")}
                                                sx={{
                                                    backgroundColor: 'transparent !important',
                                                    border: 'none',
                                                    opacity: 0.6,
                                                    transition: "0.2s",
                                                    "&:hover": { opacity: 1 }
                                                }}
                                            >
                                                <CloseIcon fontSize="small" />
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <SearchIcon sx={{ opacity: 0.5 }} />
                                        </InputAdornment>
                                    )
                                }
                            }}
                        />

                    </Box>
                </Box>

                <Box sx={{
                    flex: 1,
                    overflowY: "auto",
                    pr: 0.5
                }}>
                    {/* Vista de distrito único */}
                    {selectedDistrito !== "all" && (
                        <Paper
                            elevation={0}
                            sx={{
                                p: 2,
                                borderRadius: 3,
                                backgroundColor: "background.default",
                            }}
                        >
                            <Box display="flex" alignItems="center" mb={2}>
                                <Chip
                                    label={`Distrito ${selectedDistrito}`}
                                    color="primary"
                                    size="small"
                                    sx={{ fontWeight: 600 }}
                                />
                            </Box>

                            <List dense>
                                {recintosFiltrados.map((r) => (
                                    <ListItemButton
                                        key={r.nombre}
                                        onClick={() =>
                                            handleSelectRecinto(r.nombre, selectedDistrito)
                                        }
                                        sx={{
                                            borderRadius: 2,
                                            mb: 0.5,
                                            "&:hover": {
                                                backgroundColor: "primary.main",
                                                color: "#fff"
                                            }
                                        }}
                                    >
                                        <ListItemText primary={r.nombre} />
                                    </ListItemButton>
                                ))}
                            </List>
                        </Paper>
                    )}

                    {selectedDistrito === "all" &&
                        distritosData.map((d) => {
                            const recintosFiltradosGrupo = d.recintos?.filter((r) =>
                                normalize(r.nombre).includes(normalize(search))
                            );

                            if (!recintosFiltradosGrupo?.length) return null;

                            return (
                                <Paper
                                    key={d.numero}
                                    elevation={0}
                                    sx={{
                                        p: 2,
                                        borderRadius: 3,
                                        mb: 2,
                                        backgroundColor: "background.default",
                                        border: "1px solid",
                                        borderColor: "divider"
                                    }}
                                >
                                    <Box display="flex" alignItems="center" mb={1.5}>
                                        <Chip
                                            label={`Distrito ${d.numero}`}
                                            color="primary"
                                            size="small"
                                            sx={{ fontWeight: 600 }}
                                        />
                                    </Box>

                                    <List dense>
                                        {recintosFiltradosGrupo.map((r) => (
                                            <ListItemButton
                                                key={r.nombre}
                                                onClick={() =>
                                                    handleSelectRecinto(r.nombre, d.numero)
                                                }
                                                sx={{
                                                    borderRadius: 2,
                                                    mb: 0.5,
                                                    transition: "all 0.2s ease",
                                                    "&:hover": {
                                                        backgroundColor: "primary.main",
                                                        color: "#fff",
                                                        transform: "translateX(4px)"
                                                    }
                                                }}
                                            >
                                                <ListItemText
                                                    primary={
                                                        <Typography fontWeight={500}>
                                                            {r.nombre}
                                                        </Typography>
                                                    }
                                                    secondary={
                                                        <Typography
                                                            variant="body2"
                                                            sx={{ opacity: 0.7 }}
                                                        >
                                                            📍 {r.direccion}
                                                            <br />
                                                            🧮 {r.mesas} mesas
                                                        </Typography>
                                                    }
                                                />
                                            </ListItemButton>
                                        ))}
                                    </List>
                                </Paper>
                            );
                        })}
                </Box>
            </DialogContent>

            {/* Mensaje sin resultados */}
            {!hayResultadosGlobales && (
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    py={6}
                >
                    <Typography
                        variant="body1"
                        sx={{
                            opacity: 0.6,
                            fontWeight: 500
                        }}
                    >
                        No hay resultados disponibles
                    </Typography>
                </Box>
            )}


            <DialogActions sx={{ p: 2 }}>
                <Button
                    onClick={onClose}
                    variant="outlined"
                    color="inherit"
                >
                    Cerrar
                </Button>
            </DialogActions>
        </Dialog>
    );
}
