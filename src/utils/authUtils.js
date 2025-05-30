// Utilidades para manejo de autenticación

export const authUtils = {
	// Verificar si el usuario está autenticado
	isAuthenticated: () => {
		return localStorage.getItem("isAuthenticated") === "true";
	},

	// Obtener datos del usuario
	getUser: () => {
		const userData = localStorage.getItem("usuario");
		return userData ? JSON.parse(userData) : null;
	},

	// Guardar datos de usuario después del login
	setUser: (userData) => {
		localStorage.setItem("usuario", JSON.stringify(userData));
		localStorage.setItem("isAuthenticated", "true");
	},

	// Limpiar datos de autenticación
	logout: () => {
		localStorage.removeItem("isAuthenticated");
		localStorage.removeItem("usuario");
		localStorage.removeItem("pendingUserId");
		localStorage.removeItem("userEmail");
	},

	// Verificar si el usuario tiene un rol específico
	hasRole: (role) => {
		const user = authUtils.getUser();
		return user?.rol === role;
	},

	// Obtener el nombre completo del usuario
	getFullName: () => {
		const user = authUtils.getUser();
		if (!user) return "Usuario";
		return `${user.nombre || ""} ${user.apellido1 || ""}`.trim() || "Usuario";
	}
};

// Configuración de la API
export const apiConfig = {
	baseURL: "http://localhost:5276/api",
	endpoints: {
		login: "/Usuario/Login",
		register: "/Usuario/AddUsuario",
		verify: "/Usuario/VerificarUsuario"
	}
};

// Función helper para hacer peticiones a la API
export const apiRequest = async (endpoint, options = {}) => {
	const url = `${apiConfig.baseURL}${endpoint}`;
	
	const defaultOptions = {
		headers: {
			"Content-Type": "application/json",
		},
	};

	const config = {
		...defaultOptions,
		...options,
		headers: {
			...defaultOptions.headers,
			...options.headers,
		},
	};

	try {
		const response = await fetch(url, config);
		const data = await response.json();
		
		return {
			success: response.ok,
			data,
			status: response.status
		};
	} catch (error) {
		console.error("API Request Error:", error);
		return {
			success: false,
			data: { mensaje: "Error de conexión" },
			status: 0
		};
	}
};