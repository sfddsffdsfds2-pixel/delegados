import * as React from "react";
import {
    Box,
    Button,
    CssBaseline,
    TextField,
    Typography,
    MenuItem,
    Select,
    Toolbar,
    Divider,
    FormControl,
    FormLabel
} from "@mui/material";
import MuiCard from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import {
    doc,
    updateDoc,
    serverTimestamp,
    deleteField,
    setDoc
} from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { useConfirm } from "material-ui-confirm";
import { useNotification } from "../../contexts/NotificationContext";
import { FullScreenProgress } from "../../generalComponents/FullScreenProgress";
import RecintoSelectorModal from "../../generalComponents/SelectRecinto";
import data from "../../appConfig/Map.json";
import ciExtensions from "../../appConfig/CIExt.json";
import {
    validateName,
    validatePhone,
    validatePassword,
    validateEmail,
    validateCI
} from "../../utils/fieldsValidators";

const STORAGE_KEY = "delegados";

const Card = styled(MuiCard)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    width: "100%",
    flexGrow: 1,
    height: "100%",
    gap: theme.spacing(2),
    boxShadow: theme.shadows[10]
}));


const Container = styled(Box)(({ theme }) => ({
    minHeight: "89vh",
    padding: theme.spacing(2),
    display: "flex",
    flexDirection: "column"
}));

export default function EditDelegatePage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams();
    const confirm = useConfirm();
    const { notify } = useNotification();

    const distritosData =
        data.departamentos[0].provincias[0].municipios[0].distritos;

    const [saving, setSaving] = React.useState(false);
    const [openRecintoModal, setOpenRecintoModal] = React.useState(false);
    const [formData, setFormData] = React.useState(null);
    const [errors, setErrors] = React.useState({});

    const secondaryAuth = React.useMemo(() => {
        const mainApp = getApps()[0];
        const name = "secondary-edit";
        const secApp =
            getApps().find(a => a.name === name) ||
            initializeApp(mainApp.options, name);
        return getAuth(secApp);
    }, []);

    // 🔥 cargar delegado
    React.useEffect(() => {
        let delegate = location.state?.delegate;

        if (!delegate) {
            const raw = sessionStorage.getItem(STORAGE_KEY);
            const arr = raw ? JSON.parse(raw) : [];
            delegate = arr.find(d => String(d.id) === String(id));
        }

        if (!delegate) {
            notify("Delegado no encontrado", "error");
            navigate("/lista-delegados-admin");
            return;
        }

        const ciParts = delegate.ci?.split(" ") || [];

        setFormData({
            ...delegate,
            id: delegate.id,
            ci: ciParts[0] || "",
            ciExtension: ciParts[1] || "CB",
            rol: delegate.jefe_recinto ? "jefe_recinto" : "delegado",
            email: "",
            confirmPassword: ""
        });
    }, [id]);

    if (!formData) return null;
    if (saving) return <FullScreenProgress text="Actualizando delegado..." />;

    // 🔥 obtener cantidad de mesas del recinto seleccionado
    const getMesasDisponibles = () => {
        if (!formData.distrito || !formData.recinto) return [];

        const distritoObj = distritosData.find(
            d => Number(d.numero) === Number(formData.distrito)
        );

        const recintoObj = distritoObj?.recintos.find(
            r => r.nombre === formData.recinto
        );

        if (!recintoObj) return [];

        return Array.from({ length: recintoObj.mesas }, (_, i) => i + 1);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        let errorMessage = "";

        if (name === "nombre" || name === "apellido")
            errorMessage = validateName(value);

        if (name === "telefono")
            errorMessage = validatePhone(value);

        if (name === "ci")
            errorMessage = validateCI(value);

        if (name === "email" && formData.rol === "jefe_recinto")
            errorMessage = validateEmail(value);

        if (name === "confirmPassword" && formData.rol === "jefe_recinto")
            errorMessage = validatePassword(value);

        setErrors(prev => ({
            ...prev,
            [name]: errorMessage
        }));
    };

    const hasErrors = Object.values(errors).some(e => e);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (hasErrors) return;

        try {
            setSaving(true);

            const ciClean = formData.ci.trim().replace(/\s+/g, "");
            const ciFinal = `${ciClean} ${formData.ciExtension}`;
            const isJR = formData.rol === "jefe_recinto";

            if (isJR && !formData.jefe_recinto) {
                const email = formData.email?.trim().toLowerCase();
                const password = formData.confirmPassword?.trim();

                if (!email || !password) {
                    notify("Debes ingresar correo y contraseña.", "info");
                    setSaving(false);
                    return;
                }

                const cred = await createUserWithEmailAndPassword(
                    secondaryAuth,
                    email,
                    password
                );

                await setDoc(doc(db, "admin", cred.user.uid), {
                    email,
                    rol: "jefe_recinto",
                    distrito: String(formData.distrito),
                    recinto: formData.recinto,
                    createdAt: serverTimestamp()
                });
            }

            const payload = {
                nombre: formData.nombre.trim(),
                apellido: formData.apellido.trim(),
                telefono: formData.telefono.trim(),
                distrito: Number(formData.distrito),
                recinto: formData.recinto,
                ci: ciFinal,
                jefe_recinto: isJR,
                updatedAt: serverTimestamp()
            };

            if (!isJR && formData.mesa)
                payload.mesa = Number(formData.mesa);
            else
                payload.mesa = deleteField();

            await updateDoc(doc(db, "delegados", String(formData.id)), payload);

            // actualizar sessionStorage
            const raw = sessionStorage.getItem(STORAGE_KEY);
            const arr = raw ? JSON.parse(raw) : [];

            const updated = arr.map(r =>
                String(r.id) === String(formData.id)
                    ? { ...r, ...payload }
                    : r
            );

            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

            notify("Delegado actualizado correctamente", "success");
            navigate(-1);

        } catch (err) {
            console.error(err);
            notify("Error actualizando delegado", "error");
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        confirm({
            title: "Cancelar edición",
            description: "¿Deseas cancelar los cambios?",
            confirmationText: "Sí",
            cancellationText: "No"
        }).then(r => {
            if (r.confirmed) navigate(-1);
        });
    };

    const mesasDisponibles = getMesasDisponibles();

    return (
        <>
            <CssBaseline />
            <Toolbar />
            <Container>
                <Card>
                    <Typography variant="h4">
                        Editar delegado
                    </Typography>

                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                            flexGrow: 1   // 👈 CLAVE
                        }}
                    >
                        {/* Nombre y apellido */}
                        <Box display="flex" gap={1} flexDirection={{ xs: "column", sm: "row" }}>
                            <FormControl fullWidth>
                                <FormLabel>Nombre:</FormLabel>
                                <TextField
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    error={!!errors.nombre}
                                    helperText={errors.nombre}
                                    fullWidth
                                />
                            </FormControl>
                            <FormControl fullWidth>
                                <FormLabel>Apellido:</FormLabel>
                                <TextField
                                    name="apellido"
                                    value={formData.apellido}
                                    onChange={handleChange}
                                    error={!!errors.apellido}
                                    helperText={errors.apellido}
                                    fullWidth
                                />
                            </FormControl>
                        </Box>

                        {/* CI */}
                        <Box display={'flex'} alignItems={'center'} gap={1} flexDirection={{
                            xs: 'column',
                            sm: 'row',
                        }}>
                            <FormControl fullWidth>
                                <FormLabel>Cédula de Identidad</FormLabel>
                                <Box display="flex" gap={1}>
                                    <TextField
                                        name="ci"
                                        value={formData.ci}
                                        onChange={handleChange}
                                        error={!!errors.ci}
                                        helperText={errors.ci}
                                        fullWidth
                                    />
                                    <Select
                                        name="ciExtension"
                                        value={formData.ciExtension}
                                        onChange={handleChange}
                                        size="small"
                                    >
                                        {ciExtensions.map(ext => (
                                            <MenuItem key={ext.code} value={ext.code}>
                                                {ext.code}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </Box>
                            </FormControl>

                            {/* Teléfono */}
                            <FormControl fullWidth>
                                <FormLabel>Número de Teléfono:</FormLabel>
                                <TextField
                                    name="telefono"
                                    value={formData.telefono}
                                    onChange={handleChange}
                                    error={!!errors.telefono}
                                    helperText={errors.telefono}
                                    fullWidth
                                />
                            </FormControl>
                        </Box>

                        <Box display={'flex'} gap={1} flexDirection={{
                            xs: 'column',
                            sm: 'row',
                        }}>

                            {/* Distrito y recinto */}
                            <FormControl fullWidth>
                                <FormLabel>Distrito y recinto:</FormLabel>

                                <Button
                                    variant="outlined"
                                    onClick={() => setOpenRecintoModal(true)}
                                >
                                    {formData.recinto
                                        ? `Distrito ${formData.distrito} - ${formData.recinto}`
                                        : "Seleccionar distrito y recinto"}
                                </Button>
                            </FormControl>

                            {/* Rol */}
                            <FormControl fullWidth>
                                <FormLabel>Distrito y recinto:</FormLabel>
                                <Select
                                    name="rol"
                                    value={formData.rol}
                                    onChange={handleChange}
                                >
                                    <MenuItem value="delegado">Delegado de mesa</MenuItem>
                                    <MenuItem value="jefe_recinto">Jefe de recinto</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>

                        {/* Mesa */}
                        {formData.rol === "delegado" && mesasDisponibles.length > 0 && (
                            <Select
                                name="mesa"
                                value={formData.mesa || ""}
                                onChange={handleChange}
                                displayEmpty
                            >
                                <MenuItem value="">
                                    Seleccionar mesa
                                </MenuItem>
                                {mesasDisponibles.map(num => (
                                    <MenuItem key={num} value={num}>
                                        Mesa {num}
                                    </MenuItem>
                                ))}
                            </Select>
                        )}

                        {/* Credenciales si es jefe */}
                        {formData.rol === "jefe_recinto" && (
                            <>
                                <Divider />
                                <Box display={'flex'} gap={1} flexDirection={{
                                    xs: 'column',
                                    sm: 'row',
                                }}>
                                    <TextField
                                        label="Correo electrónico"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        error={!!errors.email}
                                        helperText={errors.email}
                                        fullWidth
                                    />
                                    <TextField
                                        label="Contraseña"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        error={!!errors.confirmPassword}
                                        helperText={errors.confirmPassword}
                                        fullWidth
                                    />
                                </Box>
                            </>
                        )}

                        <Box display="flex" gap={2} mt={3}>
                            <Button fullWidth color="error" variant="contained" onClick={handleCancel}>
                                Cancelar
                            </Button>
                            <Button fullWidth type="submit" variant="contained" disabled={hasErrors}>
                                Guardar cambios
                            </Button>
                        </Box>

                    </Box>
                </Card>
            </Container>

            <RecintoSelectorModal
                open={openRecintoModal}
                onClose={() => setOpenRecintoModal(false)}
                distritosData={distritosData}
                onSelect={({ recinto, distrito }) => {
                    setFormData(prev => ({
                        ...prev,
                        recinto,
                        distrito,
                        mesa: ""
                    }));
                }}
            />
        </>
    );
}
