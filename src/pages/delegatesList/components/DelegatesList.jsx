import { memo, useMemo, useState } from 'react';
import { Box, IconButton, CssBaseline, Button, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AppTheme from '../../../shared-theme/AppTheme';
import EditDelegate from './EditDelegate';
import { useConfirm } from 'material-ui-confirm';
import { db } from "../../../firebase/firebase";
import { doc, updateDoc } from "firebase/firestore";

const STORAGE_KEY = "delegados";

const readDelegados = () => {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    const arr = raw ? JSON.parse(raw) : [];

    return Array.isArray(arr)
      ? arr
          .map((d) => ({
            ...d,
            id: d.id ?? d.ci,
          }))
          .filter((d) => d.id != null)
      : [];
  } catch {
    return [];
  }
};

const writeDelegados = (arr) => {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
};

const DelegatesList = memo(function DelegatesList() {
    const [openEdit, setOpenEdit] = useState(false);
    const [selectedDelegate, setSelectedDelegate] = useState(null);
    const confirm = useConfirm()

    const handleEdit = (row) => {
        setSelectedDelegate(row);
        setOpenEdit(true);
    };


    const handleDelete = () => {
        confirm({
            title: "Borrar al",
            description: "¿Está seguro que desea eliminar permanentemente del sistema al?",
            confirmationText: "Sí, borrar",
            cancellationText: "No",
        })
            .then((result) => {
                if (result.confirmed === true) {

                }
            })
            .catch(() => {
            });
    };

    const [rows, setRows] = useState(() => readDelegados());

    const handleSave = async (updated) => {
      try {
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
      } catch (e) {
        console.error(e);
        alert("Error actualizando delegado");
      }
    };

    const columns = useMemo(() => [
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
            maxWidth: 80,
            minWidth: 80,
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
            renderCell: (params) => (
                <Box display={'flex'} gap={1} alignItems={'center'} justifyContent={'center'} width={'100%'} height={'100%'}>
                    <Button variant='outlined' onClick={(e) => { e.stopPropagation(); handleEdit(params.row) }}>
                        <Typography mr={1}>Editar</Typography> <EditIcon fontSize='small' color='success' />
                    </Button>
                    <Button variant='outlined' onClick={(e) => { e.stopPropagation(); handleDelete(params.row.id) }}>
                        <Typography mr={1}>Eliminar</Typography> <DeleteIcon fontSize='small' color='error' />
                    </Button>
                </Box>
            ),
            minWidth: 250,
            headerAlign: 'center',
        },
    ], []);

    return (
        <AppTheme>
            <CssBaseline enableColorScheme />

            <Box sx={{ height: '100%', width: '100%' }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSizeOptions={[50, 100]}
                    disableColumnResize
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

export default DelegatesList;
