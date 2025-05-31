export const USER_ROLES = {
	ESTUDIANTE: "Estudiante",
	PROFESOR: "Profesor",
	ADMINISTRADOR: "Administrador"
};

export const CARRERAS = [
	"Ingeniería Informática",
	"Ingeniería Industrial",
	"Ingeniería Civil",
	"Administración de Empresas",
	"Contaduría Pública",
	"Derecho",
	"Psicología",
	"Medicina"
];

export const USER_STATUS = {
	ACTIVE: "Activo",
	INACTIVE: "Inactivo",
	PENDING_VERIFICATION: "Pendiente verificación"
};

export const FORM_VALIDATION = {
	MIN_PASSWORD_LENGTH: 6,
	REQUIRED_FIELDS: [
		'nombre',
		'apellido1',
		'identificacion',
		'rol',
		'carrera',
		'correo',
		'contrasena'
	]
};

export const API_ENDPOINTS = {
	GET_ALL_USERS: "GetTodosLosUsuarios",
	ADD_USER: "AddUsuario",
	UPDATE_USER: "UpdateUsuario",
	DELETE_USER: "DeleteUsuario",
	TOGGLE_USER_STATUS: "ToggleUserStatus"
};