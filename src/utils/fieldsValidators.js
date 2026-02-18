// Solo letras (incluye tildes y ñ), no espacios al inicio
export const validateName = (value) => {
  if (!value || !value.trim()) return "Este campo es obligatorio";

  if (/^\s/.test(value)) {
    return "No puede comenzar con espacios";
  }

  if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(value)) {
    return "Solo se permiten letras";
  }

  return "";
};

// Solo números, no espacios al inicio o final
export const validatePhone = (value) => {
  if (!value || !value.trim()) return "Este campo es obligatorio";

  if (/^\s|\s$/.test(value)) {
    return "No puede tener espacios al inicio o final";
  }

  if (!/^[0-9]+$/.test(value)) {
    return "Solo se permiten números";
  }

  return "";
};

// Contraseña entre 6 y 50 caracteres
export const validatePassword = (value) => {
  if (!value || !value.trim()) return "Este campo es obligatorio";

  if (value.length < 6) {
    return "Debe tener al menos 6 caracteres";
  }

  if (value.length > 50) {
    return "No puede exceder 50 caracteres";
  }

  return "";
};

// Email válido y no vacío
export const validateEmail = (value) => {
  if (!value || !value.trim()) return "Este campo es obligatorio";

  if (/^\s|\s$/.test(value)) {
    return "No puede tener espacios al inicio o final";
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/;
  if (!emailRegex.test(value)) {
    return "Ingrese un correo electrónico válido";
  }

  if (value.length > 50) {
    return "No puede exceder 50 caracteres";
  }

  return "";
};

// Cédula de Identidad (solo números, obligatorio, sin espacios al inicio o final)
export const validateCI = (value) => {
  if (!value || !value.trim()) return "Este campo es obligatorio";

  if (/^\s|\s$/.test(value)) {
    return "No puede tener espacios al inicio o final";
  }

  if (!/^[0-9]+$/.test(value)) {
    return "Solo se permiten números";
  }

  return "";
};
