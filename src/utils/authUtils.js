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

	// Obtener solo el usuarioId
	getUserId: () => {
		const userId = localStorage.getItem("usuarioId");
		return userId ? parseInt(userId) : null;
	},

	// Guardar datos de usuario después del login
	setUser: (userData) => {
		localStorage.setItem("usuario", JSON.stringify(userData));
		localStorage.setItem("usuarioId", userData.usuarioId.toString());
		localStorage.setItem("isAuthenticated", "true");
	},

	// Limpiar datos de autenticación
	logout: () => {
		localStorage.removeItem("isAuthenticated");
		localStorage.removeItem("usuario");
		localStorage.removeItem("usuarioId");
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
	},

	// Verificar si el usuario está activo
	isUserActive: () => {
		const user = authUtils.getUser();
		return user?.activo === true;
	},

	// Obtener el rol del usuario
	getUserRole: () => {
		const user = authUtils.getUser();
		return user?.rol || null;
	}
};

// Configuración de la API
export const apiConfig = {
	baseURL: "http://localhost:5276/api",
	endpoints: {
		login: "/Usuario/Login",
		register: "/Usuario/AddUsuario",
		verify: "/Usuario/VerificarUsuario",
		getAllUsers: "/Usuario/GetTodosLosUsuarios",
		updateUser: "/Usuario/UpdateUsuario",
		deleteUser: "/Usuario/DeleteUsuario"
	}
};

// Función helper para hacer peticiones a la API con autenticación
export const apiRequest = async (endpoint, options = {}) => {
	const url = `${apiConfig.baseURL}${endpoint}`;
	
	const defaultOptions = {
		headers: {
			"Content-Type": "application/json",
		},
	};

	// Agregar usuarioId a los headers si está disponible
	const userId = authUtils.getUserId();
	if (userId) {
		defaultOptions.headers["X-Usuario-Id"] = userId.toString();
	}

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

// Función para verificar si la sesión sigue siendo válida
export const validateSession = async () => {
	const userId = authUtils.getUserId();
	if (!userId) return false;

	try {
		// Aquí podrías hacer una petición al servidor para validar que el usuario sigue activo
		// Por ahora solo verificamos que tengamos los datos locales
		const user = authUtils.getUser();
		return user && user.usuarioId === userId;
	} catch (error) {
		console.error("Error validating session:", error);
		return false;
	}
};