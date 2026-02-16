import { memo, useMemo, useState } from 'react';
import { Box, CssBaseline, Button, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AppTheme from '../../../shared-theme/AppTheme';
import EditDelegate from './EditDelegate';
import { useConfirm } from 'material-ui-confirm';
import { db } from "../../../firebase/firebase";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { FullScreenProgress } from '../../../generalComponents/FullScreenProgress';
import { useNotification } from '../../../contexts/NotificationContext';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router-dom';

const STORAGE_KEY = "delegados";

const writeDelegados = (arr) => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
};

const DelegatesListAdmin = memo(function DelegatesList({ rows, setRows }) {
    const [openEdit, setOpenEdit] = useState(false);
    const [selectedDelegate, setSelectedDelegate] = useState(null);
    const [deleteDelegate, setDeleteDelegate] = useState(false);
    const [updateDelegate, setUpdateDelegate] = useState(false);
    const { notify } = useNotification();
    const navigate = useNavigate();

    const confirm = useConfirm()

    const handleEdit = (row) => {
        setSelectedDelegate(row);
        setOpenEdit(true);
    };

    const handleDelete = (id) => {
        confirm({
            title: "Borrar delegado",
            description: "¿Está seguro que desea eliminar permanentemente del sistema al delegado?",
            confirmationText: "Sí, borrar",
            cancellationText: "No",
        })
            .then(async (result) => {
                if (result.confirmed === true) {
                    try {
                        setDeleteDelegate(true)
                        const docId = String(id);

                        await deleteDoc(doc(db, "delegados", docId));

                        setRows((prev) => {
                            const next = prev.filter((r) => String(r.id) !== docId);
                            writeDelegados(next);
                            return next;
                        });

                        notify("Delegado eliminado exitosamente del sistema.", "success");
                    } catch (error) {
                        notify("Ocurrió un error inesperado eliminando el delegado. Inténtalo de nuevo más tarde.", "success");
                        console.log(error)
                    } finally {
                        setDeleteDelegate(false)
                    }
                }
            })
            .catch(() => { });
    };

    const handleSave = async (updated) => {
        try {
            setUpdateDelegate(true);
            const docId = String(updated.id || updated.ci);

            const payload = {
                nombre: updated.nombre ?? "",
                apellido: updated.apellido ?? "",
                telefono: String(updated.telefono ?? ""),
                distrito: Number(updated.distrito),
                jefeRecinto: !!updated.jefeRecinto,
                ci: docId,
            };

            const mesaRaw = updated.mesa;
            if (mesaRaw === "" || mesaRaw == null) {
                payload.mesa = deleteField();
            } else {
                const mesaNum = Number(mesaRaw);
                if (!Number.isNaN(mesaNum)) payload.mesa = mesaNum;
            }

            await updateDoc(doc(db, "delegados", docId), payload);

            setRows((prev) => {
                const next = prev.map((r) =>
                    String(r.id) === docId ? { ...r, ...updated, id: docId } : r
                );
                writeDelegados(next);
                return next;
            });

            setOpenEdit(false);

            notify("Delegado actualizado exitosamente.", "success");
        } catch (e) {
            console.error(e);
            notify("Ocurrió un error inesperado actualizando el delegado. Inténtalo de nuevo más tarde.", "error");
        } finally {
            setUpdateDelegate(false);
        }
    };

    const columns = useMemo(() => [
        {
            field: 'jefe_recinto',
            headerName: 'J.R.',
            description: 'Jefe de recinto',
            sortable: false,
            disableColumnMenu: true,
            headerAlign: 'center',
            align: 'center',
            width: 50,
            maxWidth: 50,
            renderCell: (params) => {
                const isJefe = !!params.row.jefe_recinto;

                return (
                    <Box display={'flex'} gap={1} alignItems={'center'} justifyContent={'center'} width={'100%'} height={'100%'}>
                        {
                            isJefe ? (
                                <CheckBoxIcon fontSize='small' color="success" />
                            ) : (
                                <CheckBoxOutlineBlankIcon fontSize='small' sx={{ opacity: 0.3 }} />
                            )
                        }
                    </Box>
                );
            }
        },
        {
            field: 'nombre',
            headerName: 'Nombre',
            flex: 1,
            sortable: false,
            disableColumnMenu: true,
            headerAlign: 'center',
            align: 'center',
            minWidth: 150,
        },
        {
            field: 'apellido',
            headerName: 'Apellido',
            flex: 1,
            sortable: false,
            disableColumnMenu: true,
            headerAlign: 'center',
            align: 'center',
            minWidth: 150,
        },
        {
            field: 'ci',
            headerName: 'C.I.',
            flex: 1,
            sortable: false,
            disableColumnMenu: true,
            headerAlign: 'center',
            align: 'center',
            minWidth: 100,
        },
        {
            field: 'telefono',
            headerName: 'Teléfono',
            flex: 1,
            sortable: false,
            disableColumnMenu: true,
            headerAlign: 'center',
            align: 'center',
            minWidth: 80,
        },
        {
            field: 'distrito',
            headerName: 'Distrito',
            flex: 1,
            sortable: false,
            disableColumnMenu: true,
            headerAlign: 'center',
            align: 'center',
            minWidth: 80,
            maxWidth: 80
        },
        {
            field: 'recinto',
            headerName: 'Recinto',
            flex: 1,
            sortable: false,
            disableColumnMenu: true,
            headerAlign: 'center',
            align: 'center',
            minWidth: 100,
        },
        {
            field: 'mesa',
            headerName: 'Mesa',
            flex: 1,
            maxWidth: 60,
            minWidth: 60,
            sortable: false,
            disableColumnMenu: true,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'acciones',
            headerName: 'Acciones',
            sortable: false,
            disableColumnMenu: true,
            renderCell: (params) => {
                const isJefe = !!params.row.jefe_recinto;

                return (
                    <Box
                        display="flex"
                        alignItems="center"
                        width="100%"
                        height="100%"
                        gap={1}
                    >
                        {isJefe && (
                            <Button
                                variant="outlined"
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate("/lista-delegados-jr", {
                                    state: {
                                      distrito: String(params.row.distrito),
                                      recinto: String(params.row.recinto),
                                      nombre: String(params.row.nombre || ""),
                                      apellido: String(params.row.apellido || ""),
                                    },
                                  });
                                }}
                                sx={{
                                    flex: 1,
                                    minWidth: 0,
                                    px: 1,
                                }}
                            >
                                <VisibilityIcon fontSize="small" />
                            </Button>
                        )}

                        <Button
                            variant="outlined"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(params.row);
                            }}
                            sx={{
                                flex: 2, 
                                minWidth: 0,
                            }}
                        >
                            <Typography mr={0.5}>Editar</Typography>
                            <EditIcon fontSize="small" color="success" />
                        </Button>

                        <Button
                            variant="outlined"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(params.row.id);
                            }}
                            sx={{
                                flex: 2,
                                minWidth: 0,
                            }}
                        >
                            <Typography mr={0.5}>Eliminar</Typography>
                            <DeleteIcon fontSize="small" color="error" />
                        </Button>
                    </Box>

                )
            },
            minWidth: 250,
            maxWidth: 250,
            headerAlign: 'center',
        },
    ], []);

    if (deleteDelegate) return <FullScreenProgress text='Eliminando delegado...' />

    if (updateDelegate) return <FullScreenProgress text='Actualizando delegado...' />

    return (
        <AppTheme>
            <CssBaseline enableColorScheme />

            <Box sx={{ height: '100%', width: '100%' }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSizeOptions={[50, 100]}
                    disableColumnResize
                    localeText={{
                        noRowsLabel: 'Sin datos para mostrar'
                    }}
                    initialState={{
                        pagination: {
                            paginationModel: { pageSize: 50, page: 0 },
                        },
                    }}
                    sx={{
                        height: '100%',
                        '& .MuiDataGrid-columnHeaders': {
                            backgroundColor: '#111827',
                            fontWeight: 'bold',
                        },
                        '& .MuiDataGrid-columnHeaderTitle': {
                            fontWeight: 'bold',
                            width: '100%',
                            fontSize: 15,
                            textAlign: 'center',
                        },
                        '& .MuiDataGrid-columnHeader': {
                            borderRight: '1px solid #1f2937',
                            backgroundColor: 'rgb(37, 42, 54)'
                        },
                        '& .MuiDataGrid-cell': {
                            borderRight: '1px solid #1f2937',
                        },
                    }}
                />
            </Box>

            <EditDelegate
                open={openEdit}
                onClose={() => setOpenEdit(false)}
                selectedDelegate={selectedDelegate}
                onSave={handleSave}
            />

        </AppTheme>
    );
});

export default DelegatesListAdmin;
