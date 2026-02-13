import * as React from 'react';
import { Box, IconButton, CssBaseline, Button, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AppTheme from '../../../shared-theme/AppTheme';

export default function DelegatesList() {

    const rows = [
        { id: 1, nombre: 'Juan', apellido: 'Perez', distrito: 'Distrito 1', recinto: 'Unidad Educativa Villa Moderna', mesa: 'Mesa 5' },
        { id: 2, nombre: 'Maria', apellido: 'Lopez', distrito: 'Distrito 2', recinto: 'Unidad Educativa Villa Moderna', mesa: 'Mesa 3' },
    ];

    const columns = [
        { field: 'nombre', headerName: 'Nombre', flex: 1 },
        { field: 'apellido', headerName: 'Apellido', flex: 1 },
        { field: 'distrito', headerName: 'Distrito', flex: 1 },
        { field: 'recinto', headerName: 'Recinto', flex: 1 },
        { field: 'mesa', headerName: 'Mesa', flex: 1 },

        {
            field: 'acciones',
            headerName: 'Acciones',
            sortable: false,
            renderCell: (params) => (
                <Box display={'flex'} gap={1} alignItems={'center'} justifyContent={'center'} width={'100%'} height={'100%'}>
                    <Button variant='outlined' onClick={() => handleEdit(params.row)}>
                        <Typography mr={1}>Editar</Typography> <EditIcon fontSize='small' color='success' />
                    </Button>
                    <Button variant='outlined' onClick={() => handleDelete(params.row.id)}>
                        <Typography mr={1}>Eliminar</Typography> <DeleteIcon fontSize='small' color='error' />
                    </Button>
                </Box>
            ),
            minWidth: 250
        },
    ];

    const handleEdit = (row) => {
        console.log('Editar:', row);
    };

    const handleDelete = (id) => {
        console.log('Eliminar:', id);
    };

    return (
        <AppTheme>
            <CssBaseline enableColorScheme />

            <Box sx={{ height: '100%', width: '100%', p: 4 }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSizeOptions={[5, 10]}
                    initialState={{
                        pagination: {
                            paginationModel: { pageSize: 5, page: 0 },
                        },
                    }}
                    sx={{
                        '& .MuiDataGrid-columnHeaders': {
                            backgroundColor: '#111827',
                            fontWeight: 'bold',
                        },
                        '& .MuiDataGrid-columnHeader': {
                            borderRight: '1px solid #1f2937',
                        },
                    }}
                />
            </Box>
        </AppTheme>
    );
}
