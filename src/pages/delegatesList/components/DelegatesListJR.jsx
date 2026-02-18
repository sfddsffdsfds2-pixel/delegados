import { memo, useMemo, useState } from 'react';
import { Box, IconButton, CssBaseline, Button, Typography, Select, MenuItem } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import EditDelegate from './EditDelegate';
import { useConfirm } from 'material-ui-confirm';
import { db } from "../../../firebase/firebase";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { FullScreenProgress } from '../../../generalComponents/FullScreenProgress';
import { useNotification } from '../../../contexts/NotificationContext';

const STORAGE_KEY = "delegados";

const writeDelegados = (arr) => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
};

const DelegatesListJR = memo(function DelegatesList({ rows, setRows, mesaMax = 0, markChanged }) {
    const [openEdit, setOpenEdit] = useState(false);
    const [selectedDelegate, setSelectedDelegate] = useState(null);
    const [deleteDelegate, setDeleteDelegate] = useState(false);
    const [updateDelegate, setUpdateDelegate] = useState(false);
    const { notify } = useNotification();

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

    const usedMesas = useMemo(() => {
      const s = new Set();
      rows.forEach((r) => {
        const m = Number(r.mesa);
        if (Number.isFinite(m) && m > 0) s.add(m);
      });
      return s;
    }, [rows]);

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
          field: 'mesa',
          headerName: 'Mesa',
          flex: 1,
          maxWidth: 110,
          minWidth: 110,
          sortable: true,
          disableColumnMenu: true,
          headerAlign: 'center',
          align: 'center',
          renderCell: (params) => {
            const rowId = params.row.id;
            const currentMesaNum = Number(params.row.mesa);
            const currentMesa = Number.isFinite(currentMesaNum) && currentMesaNum > 0 ? currentMesaNum : "";

            const total = Number(mesaMax);
            if (!Number.isFinite(total) || total <= 0) return "-";

            const options = [];
            for (let i = 1; i <= total; i++) {
              if (i !== currentMesa && usedMesas.has(i)) continue;
              options.push(i);
            }

            return (
              <Select
                size="small"
                value={currentMesa}
                displayEmpty
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => {
                  const v = e.target.value;
                  const mesa = v === "" ? "" : Number(v);

                  setRows((prev) => {
                    const next = prev.map((r) =>
                      r.id === rowId ? { ...r, mesa } : r
                    );
                    writeDelegados(next);
                    return next;
                  });

                  if (markChanged) markChanged(rowId);
                }}
                sx={{ width: 85 }}
              >
                <MenuItem value="">
                  Sin
                </MenuItem>

                {options.map((m) => (
                  <MenuItem key={m} value={m}>
                    {m}
                  </MenuItem>
                ))}
              </Select>
            );
          }
        },
        {
            field: 'asistencia',
            headerName: 'Asistió',
            flex: 1,
            maxWidth: 80,
            minWidth: 80,
            sortable: false,
            disableColumnMenu: true,
            headerAlign: 'center',
            align: 'center',
            renderCell: (params) => (
              <input
                type="checkbox"
                checked={!!params.value}
                onChange={(e) => {
                  const updatedRow = { ...params.row, asistencia: e.target.checked };

                  setRows((prev) =>
                    prev.map((r) => (r.id === params.row.id ? updatedRow : r))
                  );

                  if (markChanged) markChanged(params.row.id);
                }}
              />
            )
        },
        {
            field: 'pago',
            headerName: 'Pagado',
            flex: 1,
            maxWidth: 80,
            minWidth: 80,
            sortable: false,
            disableColumnMenu: true,
            headerAlign: 'center',
            align: 'center',
            renderCell: (params) => (
              <input
                type="checkbox"
                checked={!!params.value}
                onChange={(e) => {
                  const updatedRow = { ...params.row, pago: e.target.checked };

                  setRows((prev) =>
                    prev.map((r) => (r.id === params.row.id ? updatedRow : r))
                  );

                  if (markChanged) markChanged(params.row.id);
                }}
              />
            )
        },
    ], [mesaMax, usedMesas, setRows, markChanged]);

    if (deleteDelegate) return <FullScreenProgress text='Eliminando delegado...' />

    if (updateDelegate) return <FullScreenProgress text='Actualizando delegado...' />

    return (
        <>
            <CssBaseline enableColorScheme />

            <Box sx={{ height: '100%', width: '100%' }}>
                <DataGrid
                    rows={rows.filter(r => !r?.jefe_recinto)}
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

        </>
    );
});

export default DelegatesListJR;
