import { memo, useMemo, useState } from 'react';
import { Box, IconButton, CssBaseline, Button, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AppTheme from '../../../shared-theme/AppTheme';
import EditDelegate from './EditDelegate';
import { useConfirm } from 'material-ui-confirm';

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


    const rows = useMemo(() => [
        { id: 1, nombre: 'Carlos', apellido: 'Mendoza', ci: '7845123 LP', telefono: '71234567', distrito: 'Distrito 1', recinto: 'Unidad Educativa Villa Moderna', mesa: 'Mesa 1' },
        { id: 2, nombre: 'Lucia', apellido: 'Fernandez', ci: '6932145 SC', telefono: '72345678', distrito: 'Distrito 2', recinto: 'Colegio Nacional Central', mesa: 'Mesa 2' },
        { id: 3, nombre: 'Miguel', apellido: 'Rojas', ci: '8123456 CB', telefono: '73456789', distrito: 'Distrito 3', recinto: 'Escuela San Martin', mesa: 'Mesa 3' },
        { id: 4, nombre: 'Ana', apellido: 'Gutierrez', ci: '7456123 LP', telefono: '74567890', distrito: 'Distrito 1', recinto: 'Unidad Educativa Villa Moderna', mesa: 'Mesa 4' },
        { id: 5, nombre: 'Jorge', apellido: 'Salazar', ci: '6987451 OR', telefono: '75678901', distrito: 'Distrito 4', recinto: 'Colegio Bolivar', mesa: 'Mesa 5' },
        { id: 6, nombre: 'Maria', apellido: 'Quispe', ci: '8569741 PT', telefono: '76789012', distrito: 'Distrito 2', recinto: 'Escuela America', mesa: 'Mesa 6' },
        { id: 7, nombre: 'Pedro', apellido: 'Vargas', ci: '7412589 SC', telefono: '77890123', distrito: 'Distrito 5', recinto: 'Colegio Nacional Central', mesa: 'Mesa 7' },
        { id: 8, nombre: 'Sofia', apellido: 'Lozano', ci: '9632587 LP', telefono: '78901234', distrito: 'Distrito 3', recinto: 'Escuela San Martin', mesa: 'Mesa 8' },
        { id: 9, nombre: 'Luis', apellido: 'Herrera', ci: '8521479 CB', telefono: '79012345', distrito: 'Distrito 1', recinto: 'Unidad Educativa Villa Moderna', mesa: 'Mesa 9' },
        { id: 10, nombre: 'Valeria', apellido: 'Castro', ci: '7412369 SC', telefono: '70123456', distrito: 'Distrito 4', recinto: 'Colegio Bolivar', mesa: 'Mesa 10' },
        { id: 11, nombre: 'Ricardo', apellido: 'Torrez', ci: '8523697 LP', telefono: '71239876', distrito: 'Distrito 2', recinto: 'Escuela America', mesa: 'Mesa 1' },
        { id: 12, nombre: 'Daniela', apellido: 'Paredes', ci: '9637412 OR', telefono: '72398765', distrito: 'Distrito 3', recinto: 'Escuela San Martin', mesa: 'Mesa 2' },
        { id: 13, nombre: 'Fernando', apellido: 'Arias', ci: '7418529 PT', telefono: '73487654', distrito: 'Distrito 5', recinto: 'Colegio Nacional Central', mesa: 'Mesa 3' },
        { id: 14, nombre: 'Camila', apellido: 'Molina', ci: '8529631 LP', telefono: '74576543', distrito: 'Distrito 1', recinto: 'Unidad Educativa Villa Moderna', mesa: 'Mesa 4' },
        { id: 15, nombre: 'Andres', apellido: 'Suarez', ci: '9638527 CB', telefono: '75665432', distrito: 'Distrito 4', recinto: 'Colegio Bolivar', mesa: 'Mesa 5' },
        { id: 16, nombre: 'Paola', apellido: 'Navarro', ci: '7419638 SC', telefono: '76754321', distrito: 'Distrito 2', recinto: 'Escuela America', mesa: 'Mesa 6' },
        { id: 17, nombre: 'Diego', apellido: 'Ramos', ci: '8527413 LP', telefono: '77843210', distrito: 'Distrito 3', recinto: 'Escuela San Martin', mesa: 'Mesa 7' },
        { id: 18, nombre: 'Gabriela', apellido: 'Flores', ci: '9631597 OR', telefono: '78932109', distrito: 'Distrito 5', recinto: 'Colegio Nacional Central', mesa: 'Mesa 8' },
        { id: 19, nombre: 'Hector', apellido: 'Ortiz', ci: '7413579 CB', telefono: '79021098', distrito: 'Distrito 1', recinto: 'Unidad Educativa Villa Moderna', mesa: 'Mesa 9' },
        { id: 20, nombre: 'Natalia', apellido: 'Vega', ci: '8524561 SC', telefono: '70110987', distrito: 'Distrito 4', recinto: 'Colegio Bolivar', mesa: 'Mesa 10' },
        { id: 21, nombre: 'Esteban', apellido: 'Cruz', ci: '9632584 LP', telefono: '71299876', distrito: 'Distrito 2', recinto: 'Escuela America', mesa: 'Mesa 1' },
        { id: 22, nombre: 'Carla', apellido: 'Reyes', ci: '7414562 PT', telefono: '72388765', distrito: 'Distrito 3', recinto: 'Escuela San Martin', mesa: 'Mesa 2' },
        { id: 23, nombre: 'Oscar', apellido: 'Medina', ci: '8527896 OR', telefono: '73477654', distrito: 'Distrito 5', recinto: 'Colegio Nacional Central', mesa: 'Mesa 3' },
        { id: 24, nombre: 'Liliana', apellido: 'Soto', ci: '9636541 CB', telefono: '74566543', distrito: 'Distrito 1', recinto: 'Unidad Educativa Villa Moderna', mesa: 'Mesa 4' },
        { id: 25, nombre: 'Raul', apellido: 'Chavez', ci: '7418523 LP', telefono: '75655432', distrito: 'Distrito 4', recinto: 'Colegio Bolivar', mesa: 'Mesa 5' },
        { id: 26, nombre: 'Monica', apellido: 'Silva', ci: '8521476 SC', telefono: '76744321', distrito: 'Distrito 2', recinto: 'Escuela America', mesa: 'Mesa 6' },
        { id: 27, nombre: 'Victor', apellido: 'Peña', ci: '9637415 PT', telefono: '77833210', distrito: 'Distrito 3', recinto: 'Escuela San Martin', mesa: 'Mesa 7' },
        { id: 28, nombre: 'Rosa', apellido: 'Delgado', ci: '7419632 LP', telefono: '78922109', distrito: 'Distrito 5', recinto: 'Colegio Nacional Central', mesa: 'Mesa 8' },
        { id: 29, nombre: 'Alberto', apellido: 'Campos', ci: '8523694 OR', telefono: '79011098', distrito: 'Distrito 1', recinto: 'Unidad Educativa Villa Moderna', mesa: 'Mesa 9' },
        { id: 30, nombre: 'Patricia', apellido: 'Luna', ci: '9638524 CB', telefono: '70100987', distrito: 'Distrito 4', recinto: 'Colegio Bolivar', mesa: 'Mesa 10' },
    ], [handleEdit, handleDelete]);


    const columns = useMemo(() => [
        {
            field: 'nombre',
            headerName: 'Nombre',
            flex: 1,
            sortable: false,
            disableColumnMenu: true,
            headerAlign: 'center',
        },
        {
            field: 'apellido',
            headerName: 'Apellido',
            flex: 1,
            sortable: false,
            disableColumnMenu: true,
            headerAlign: 'center',
        },
        {
            field: 'ci',
            headerName: 'C.I.',
            flex: 1,
            sortable: false,
            disableColumnMenu: true,
            headerAlign: 'center',
        },
        {
            field: 'telefono',
            headerName: 'Teléfono',
            flex: 1,
            sortable: false,
            disableColumnMenu: true,
            headerAlign: 'center',
        },
        {
            field: 'distrito',
            headerName: 'Distrito',
            flex: 1,
            sortable: false,
            disableColumnMenu: true,
            headerAlign: 'center',
        },
        {
            field: 'recinto',
            headerName: 'Recinto',
            flex: 1,
            sortable: false,
            disableColumnMenu: true,
            headerAlign: 'center',
        },
        {
            field: 'mesa',
            headerName: 'Mesa',
            flex: 1,
            maxWidth: 100,
            minWidth: 100,
            sortable: false,
            disableColumnMenu: true,
            headerAlign: 'center',
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
                setSelectedDelegate={setSelectedDelegate}
                onSave={() => {
                    console.log("Guardar cambios:", selectedDelegate);
                    setOpenEdit(false);
                }}
            />

        </AppTheme>
    );
});

export default DelegatesList;
