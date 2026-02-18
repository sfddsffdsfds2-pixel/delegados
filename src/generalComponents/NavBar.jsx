import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import GroupsIcon from '@mui/icons-material/Groups';
import BarChartIcon from '@mui/icons-material/BarChart';

export default function NavBar({ open, onClose }) {

    const navigate = useNavigate();

    const drawerSections = [
        {
            title: "Delegados",
            items: [ 
                {
                    label: "Lista de delegados",
                    icon: <GroupsIcon />,
                    path: "/lista-delegados-admin"
                },
                {
                    label: "Añadir delegado",
                    icon: <PersonAddIcon />,
                    path: "/registrar-delegado"
                },
                {
                    label: "Conteo Electoral",
                    icon: <BarChartIcon />,
                    path: "/conteo-electoral"
                },
            ]
        }
    ];

    return (
        <Drawer
            open={open}
            onClose={onClose}
            sx={{ zIndex: 1000 }}
        >
            <Box sx={{ width: 260, pt: 1 }}>
                <Toolbar />

                {drawerSections.map((section, index) => (
                    <React.Fragment key={index}>
                        
                        {section.title && (
                            <Typography
                                variant="caption"
                                sx={{
                                    px: 2,
                                    pt: 2,
                                    pb: 1,
                                    color: "text.secondary",
                                    fontWeight: 600,
                                    letterSpacing: 1,
                                    fontSize: '1rem'
                                }}
                            >
                                {section.title}
                            </Typography>
                        )}

                        <List>
                            {section.items.map((item, itemIndex) => (
                                <ListItem key={itemIndex} disablePadding>
                                    <ListItemButton
                                        onClick={() => {
                                            navigate(item.path);
                                            onClose();
                                        }}
                                    >
                                        <ListItemIcon >
                                            {item.icon}
                                        </ListItemIcon>
                                        <ListItemText primary={item.label} sx={{fontSize: '0.5rem'}} />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>

                        {index !== drawerSections.length - 1 && <Divider />}
                    </React.Fragment>
                ))}
            </Box>
        </Drawer>
    );
}
