// Utilidades para manejo de autenticación

export const authUtils = {
	// Verificar si el usuario está autenticado
	isAuthenticated: () => {
		const authFlag = localStorage.getItem("isAuthenticated") === "true";
		const hasToken = !!localStorage.getItem("token");
		const result = authFlag && hasToken;
		
		return result;
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

	// Obtener el token
	getToken: () => {
		return localStorage.getItem("token");
	},

	// Verificar si el token ha expirado
	isTokenExpired: () => {
		const tokenExpiration = localStorage.getItem("tokenExpiration");
		if (!tokenExpiration) {
			return true;
		}
		
		try {
			const expirationDate = new Date(tokenExpiration);
			const now = new Date();
			const isExpired = now >= expirationDate;
			
			return isExpired;
		} catch (error) {
			console.error('❌ Error al verificar expiración del token:', error);
			return true;
		}
	},

	// Guardar datos de usuario después del login
	setUser: (userData, token, tokenExpiration) => {
		// Solo guardar los campos específicos requeridos
		const userToStore = {
			usuarioId: userData.usuarioId,
			nombre: userData.nombre,
			apellido1: userData.apellido1,
			carrera: userData.carrera,
			identificacion: userData.identificacion,
			correo: userData.correo
		};

		localStorage.setItem("usuario", JSON.stringify(userToStore));
		localStorage.setItem("usuarioId", userData.usuarioId.toString());
		localStorage.setItem("token", token);
		localStorage.setItem("tokenExpiration", tokenExpiration);
		localStorage.setItem("isAuthenticated", "true");
	},

	// Limpiar datos de autenticación
	logout: () => {
		localStorage.removeItem("isAuthenticated");
		localStorage.removeItem("usuario");
		localStorage.removeItem("usuarioId");
		localStorage.removeItem("token");
		localStorage.removeItem("tokenExpiration");
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

	// Obtener el rol del usuario (ya no se guarda en localStorage, pero mantenemos la función)
	getUserRole: () => {
		const user = authUtils.getUser();
		return user?.rol || null;
	},

	// Verificar si la sesión es válida (autenticado y token no expirado)
	isSessionValid: () => {
		const isAuth = authUtils.isAuthenticated();
		const isExpired = authUtils.isTokenExpired();
		const isValid = isAuth && !isExpired;
		
		return isValid;
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

	// Agregar token a los headers si está disponible
	const token = authUtils.getToken();
	if (token) {
		defaultOptions.headers["Authorization"] = `Bearer ${token}`;
	}

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
		
		// Si el token ha expirado (401), limpiar la sesión
		if (response.status === 401) {
			authUtils.logout();
			window.location.href = "/login";
			return {
				success: false,
				data: { mensaje: "Sesión expirada" },
				status: 401
			};
		}

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
	// Verificar si tenemos los datos básicos
	if (!authUtils.isSessionValid()) {
		return false;
	}

	try {
		// Aquí podrías hacer una petición al servidor para validar que el usuario sigue activo
		// Por ahora solo verificamos que tengamos los datos locales y el token no haya expirado
		const user = authUtils.getUser();
		const userId = authUtils.getUserId();
		const token = authUtils.getToken();
		
		return user && userId && token && user.usuarioId === userId && !authUtils.isTokenExpired();
	} catch (error) {
		console.error("Error validating session:", error);
		return false;
	}
};
