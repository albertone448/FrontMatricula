import { authUtils } from '../utils/authUtils';
import api from '../services/apiConfig';

export const userService = {
	// Obtener todos los usuarios
	async getAllUsers() {
		try {
			const token = authUtils.getToken();
			if (!token) {
				throw new Error('Token de autenticación no encontrado');
			}

			const response = await api.get('Usuario/GetTodosLosUsuarios');
			return response.data;
		} catch (error) {
			console.error("Error fetching users:", error);
			if (error.response?.status === 401 || error.message.includes('Sesión expirada')) {
				throw error;
			}
			throw new Error(error.response?.data?.message || "Error al cargar los usuarios. Verifique la conexión con el servidor.");
		}
	},

	// Crear nuevo usuario
	async createUser(userData) {
		try {
			const token = authUtils.getToken();
			if (!token) {
				throw new Error('Token de autenticación no encontrado');
			}

			const response = await api.post('Usuario/AddUsuario', userData);
			return response.data;
		} catch (error) {
			console.error("Error creating user:", error);
			if (error.response?.status === 401 || error.message.includes('Sesión expirada')) {
				throw error;
			}
			
			let errorMessage = "Error al crear usuario";
			if (error.response?.data?.mensaje) {
				errorMessage = error.response.data.mensaje;
			} else if (error.response?.data?.message) {
				errorMessage = error.response.data.message;
			} else if (error.message && !error.message.includes("Failed to fetch")) {
				errorMessage = error.message;
			} else if (error.message?.includes("Failed to fetch")) {
				errorMessage = "Error de conexión. Intente nuevamente.";
			}
			
			throw new Error(errorMessage);
		}
	},

	// Actualizar usuario
	async updateUser(userId, userData) {
		try {
			const token = authUtils.getToken();
			if (!token) {
				throw new Error('Token de autenticación no encontrado');
			}

			const response = await api.put(`Usuario/UpdateUsuario/${userId}`, userData);
			
			// Manejar respuesta basada en el status code
			if (response.status === 204) {
				console.log('Usuario actualizado exitosamente (204 No Content)');
				return { success: true, data: userData };
			}
			
			return response.data;
		} catch (error) {
			console.error("Error updating user:", error);
			if (error.response?.status === 401 || error.message.includes('Sesión expirada')) {
				throw error;
			}
			
			let errorMessage = "Error al actualizar usuario";
			if (error.response?.data?.mensaje) {
				errorMessage = error.response.data.mensaje;
			} else if (error.response?.data?.message) {
				errorMessage = error.response.data.message;
			} else if (error.message && !error.message.includes("Failed to fetch")) {
				errorMessage = error.message;
			} else if (error.message?.includes("Failed to fetch")) {
				errorMessage = "Error de conexión. Intente nuevamente.";
			}
			
			throw new Error(errorMessage);
		}
	},

	// Eliminar usuario
	async deleteUser(userId) {
		try {
			const token = authUtils.getToken();
			if (!token) {
				throw new Error('Token de autenticación no encontrado');
			}

			const response = await api.delete(`Usuario/DeleteUsuario/${userId}`);
			
			// Manejar respuesta basada en el status code
			if (response.status === 204) {
				console.log('Usuario eliminado exitosamente (204 No Content)');
				return { success: true };
			}
			
			return response.data || { success: true };
		} catch (error) {
			console.error("Error deleting user:", error);
			if (error.response?.status === 401 || error.message.includes('Sesión expirada')) {
				throw error;
			}
			
			let errorMessage = "Error al eliminar usuario";
			if (error.response?.data?.mensaje) {
				errorMessage = error.response.data.mensaje;
			} else if (error.response?.data?.message) {
				errorMessage = error.response.data.message;
			} else if (error.message && !error.message.includes("Failed to fetch")) {
				errorMessage = error.message;
			} else if (error.message?.includes("Failed to fetch")) {
				errorMessage = "Error de conexión. Intente nuevamente.";
			}
			
			throw new Error(errorMessage);
		}
	},

	// Activar/desactivar usuario
	async toggleUserStatus(userId, isActive) {
		try {
			const token = authUtils.getToken();
			if (!token) {
				throw new Error('Token de autenticación no encontrado');
			}

			const response = await api.patch(`Usuario/ToggleUserStatus/${userId}`, { 
				activo: isActive 
			});
			
			// Manejar respuesta basada en el status code
			if (response.status === 204) {
				console.log('Estado del usuario actualizado exitosamente (204 No Content)');
				return { success: true, activo: isActive };
			}
			
			return response.data;
		} catch (error) {
			console.error("Error toggling user status:", error);
			if (error.response?.status === 401 || error.message.includes('Sesión expirada')) {
				throw error;
			}
			
			let errorMessage = "Error al cambiar estado del usuario";
			if (error.response?.data?.mensaje) {
				errorMessage = error.response.data.mensaje;
			} else if (error.response?.data?.message) {
				errorMessage = error.response.data.message;
			} else if (error.message && !error.message.includes("Failed to fetch")) {
				errorMessage = error.message;
			} else if (error.message?.includes("Failed to fetch")) {
				errorMessage = "Error de conexión. Intente nuevamente.";
			}
			
			throw new Error(errorMessage);
		}
	},

	// Login de usuario (mantiene fetch manual como solicitaste)
	async loginUser(correo, contrasena) {
		try {
			const response = await fetch('http://localhost:5276/api/Usuario/Login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/json',
				},
				body: JSON.stringify({
					correo,
					contrasena
				}),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.mensaje || 'Error en el login');
			}

			return data;
		} catch (error) {
			console.error("Error in login:", error);
			if (error.message.includes("Failed to fetch")) {
				throw new Error("Error de conexión. Verifique que el servidor esté activo.");
			}
			throw error;
		}
	}
};