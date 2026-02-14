import React, { createContext, useState, useContext, useCallback } from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { styled } from "@mui/material/styles";
import Slide from "@mui/material/Slide";

// Iconos de MUI
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import WarningIcon from '@mui/icons-material/Warning';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const NotificationContext = createContext();
export const useNotification = () => useContext(NotificationContext);

const CustomAlert = styled(MuiAlert, {
    shouldForwardProp: (prop) => prop !== 'severityProp',
})(({ severityProp }) => ({
    backgroundColor:
        severityProp === 'success'
            ? '#4CAF50'
            : severityProp === 'error'
                ? '#F44336'
                : severityProp === 'info'
                    ? '#2196F3'
                    : severityProp === 'warning'
                        ? '#FF9800'
                        : '#2196F3',
    color: '#fff',
    '&.MuiAlert-filled': {
        backgroundColor:
            severityProp === 'success'
                ? '#4CAF50'
                : severityProp === 'error'
                    ? '#F44336'
                    : severityProp === 'info'
                        ? '#2196F3'
                        : severityProp === 'warning'
                            ? '#FF9800'
                            : '#2196F3',
        '& .MuiAlert-icon': {
            color: "#fff",
        },
        '& .MuiAlert-action .MuiIconButton-root': {
            color: "#fff",
            padding: 4,
        },
    },
}));

function SlideTransition(props) {
  return <Slide {...props} direction="down" />;
}


export const NotificationProvider = ({ children }) => {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [severity, setSeverity] = useState("info");
    const [persist, setPersist] = useState(false);

    const notify = useCallback((msg, type = "info", persistMessage = false) => {
        setMessage(msg);
        setSeverity(type);
        setPersist(persistMessage);
        setOpen(true);
    }, []);

    const handleClose = (event, reason) => {
        if (reason === "clickaway") return;
        setOpen(false);
    };

    const severityColors = {
        success: "#4CAF50",
        error: "#F44336",
        info: "#2196F3",
        warning: "#FF9800",
    };

    const severityIcons = {
        success: <CheckCircleIcon fontSize="inherit" />,
        error: <ErrorIcon fontSize="inherit" />,
        info: <InfoIcon fontSize="inherit" />,
        warning: <WarningIcon fontSize="inherit" />,
    };

    return (
        <NotificationContext.Provider value={{ notify }}>
            {children}
            <Snackbar
                open={open}
                autoHideDuration={persist ? null : 4000}
                onClose={handleClose}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
                slots={{
                    transition: SlideTransition
                }}
            >
                <CustomAlert
                    onClose={handleClose}
                    severityProp={severity}
                    icon={severityIcons[severity]}
                    variant="filled"
                    action={
                        <IconButton
                            aria-label="close"
                            size="small"
                            onClick={handleClose}
                            sx={{
                                color: "#fff",        
                                padding: 0,           
                                background: "transparent !important", 
                                "&:hover": {
                                    background: "transparent", 
                                },
                                border: "none",
                            }}
                        >
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    }
                >
                    {message}
                </CustomAlert>
            </Snackbar>
        </NotificationContext.Provider>
    );
};
