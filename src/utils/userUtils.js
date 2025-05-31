import { USER_ROLES } from '../constants/userConstants';

// Obtener color para el rol
export const getRoleColor = (rol) => {
	const roleColors = {
		[USER_ROLES.ADMINISTRADOR]: 'bg-red-800 text-red-100',
		[USER_ROLES.PROFESOR]: 'bg-yellow-800 text-yellow-100',
		[USER_ROLES.ESTUDIANTE]: 'bg-blue-800 text-blue-100'
	};
	return roleColors[rol] || 'bg-gray-800 text-gray-100';
};

// Obtener iniciales del usuario
export const getUserInitials = (user) => {
	const firstInitial = user.nombre ? user.nombre.charAt(0).toUpperCase() : '';
	const lastInitial = user.apellido1 ? user.apellido1.charAt(0).toUpperCase() : '';
	return firstInitial + lastInitial;
};

// Obtener nombre completo del usuario
export const getFullName = (user) => {
	const parts = [user.nombre, user.apellido1, user.apellido2].filter(Boolean);
	return parts.join(' ');
};

// Validar formato de email
export const isValidEmail = (email) => {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
};

// Filtrar usuarios por término de búsqueda
export const filterUsers = (users, searchTerm) => {
	if (!searchTerm) return users;
	
	const term = searchTerm.toLowerCase();
	return users.filter(user =>
		user.nombre.toLowerCase().includes(term) ||
		user.apellido1.toLowerCase().includes(term) ||
		user.apellido2?.toLowerCase().includes(term) ||
		user.correo.toLowerCase().includes(term) ||
		user.identificacion.includes(term) ||
		user.rol.toLowerCase().includes(term) ||
		user.carrera.toLowerCase().includes(term)
	);
};

// Calcular estadísticas de usuarios
export const calculateUserStats = (users) => {
	return {
		total: users.length,
		active: users.filter(u => u.activo).length,
		inactive: users.filter(u => !u.activo).length,
		students: users.filter(u => u.rol === USER_ROLES.ESTUDIANTE).length,
		professors: users.filter(u => u.rol === USER_ROLES.PROFESOR).length,
		administrators: users.filter(u => u.rol === USER_ROLES.ADMINISTRADOR).length,
		pendingVerification: users.filter(u => u.numeroVerificacion).length
	};
};

// Formatear fecha
export const formatDate = (dateString) => {
	if (!dateString) return 'N/A';
	
	const date = new Date(dateString);
	return date.toLocaleDateString('es-ES', {
		year: 'numeric',
		month: 'short',
		day: 'numeric'
	});
};

// Validar datos del formulario
export const validateUserForm = (formData) => {
	const errors = {};

	// Validar campos requeridos
	if (!formData.nombre?.trim()) {
		errors.nombre = 'El nombre es requerido';
	}

	if (!formData.apellido1?.trim()) {
		errors.apellido1 = 'El primer apellido es requerido';
	}

	if (!formData.identificacion?.trim()) {
		errors.identificacion = 'La identificación es requerida';
	}

	if (!formData.correo?.trim()) {
		errors.correo = 'El correo es requerido';
	} else if (!isValidEmail(formData.correo)) {
		errors.correo = 'El formato del correo no es válido';
	}

	if (!formData.contrasena?.trim()) {
		errors.contrasena = 'La contraseña es requerida';
	} else if (formData.contrasena.length < 6) {
		errors.contrasena = 'La contraseña debe tener al menos 6 caracteres';
	}

	if (!formData.carrera) {
		errors.carrera = 'La carrera es requerida';
	}

	return {
		isValid: Object.keys(errors).length === 0,
		errors
	};
};