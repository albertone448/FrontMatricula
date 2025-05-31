const API_BASE_URL = "http://localhost:5276/api/Usuario";

export const userService = {
	// Obtener todos los usuarios
	async getAllUsers() {
		try {
			const response = await fetch(`${API_BASE_URL}/GetTodosLosUsuarios`, {
				method: "GET",
				headers: {
					"Accept": "application/json",
				},
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			return await response.json();
		} catch (error) {
			console.error("Error fetching users:", error);
			throw new Error("Error al cargar los usuarios. Verifique la conexión con el servidor.");
		}
	},

	// Crear nuevo usuario
	async createUser(userData) {
		try {
			const response = await fetch(`${API_BASE_URL}/AddUsuario`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(userData),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.mensaje || "Error al crear usuario");
			}

			return data;
		} catch (error) {
			console.error("Error creating user:", error);
			if (error.message.includes("Failed to fetch")) {
				throw new Error("Error de conexión. Intente nuevamente.");
			}
			throw error;
		}
	},

	// Actualizar usuario
	async updateUser(userId, userData) {
		try {
			const response = await fetch(`${API_BASE_URL}/UpdateUsuario/${userId}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(userData),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.mensaje || "Error al actualizar usuario");
			}

			return data;
		} catch (error) {
			console.error("Error updating user:", error);
			if (error.message.includes("Failed to fetch")) {
				throw new Error("Error de conexión. Intente nuevamente.");
			}
			throw error;
		}
	},

	// Eliminar usuario
	async deleteUser(userId) {
		try {
			const response = await fetch(`${API_BASE_URL}/DeleteUsuario/${userId}`, {
				method: "DELETE",
				headers: {
					"Accept": "application/json",
				},
			});

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.mensaje || "Error al eliminar usuario");
			}

			return { success: true };
		} catch (error) {
			console.error("Error deleting user:", error);
			if (error.message.includes("Failed to fetch")) {
				throw new Error("Error de conexión. Intente nuevamente.");
			}
			throw error;
		}
	},

	// Activar/desactivar usuario
	async toggleUserStatus(userId, isActive) {
		try {
			const response = await fetch(`${API_BASE_URL}/ToggleUserStatus/${userId}`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ activo: isActive }),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.mensaje || "Error al cambiar estado del usuario");
			}

			return data;
		} catch (error) {
			console.error("Error toggling user status:", error);
			if (error.message.includes("Failed to fetch")) {
				throw new Error("Error de conexión. Intente nuevamente.");
			}
			throw error;
		}
	}
};