import { useState } from 'react';
import { authUtils } from '../utils/authUtils';
import api from '../services/apiConfig';

export const usePasswordChange = () => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState(false);

	const changePassword = async (contrasenaActual, contrasenaNueva) => {
		setLoading(true);
		setError('');
		setSuccess(false);

		try {
			// Obtener ID del usuario actual y token
			const usuarioId = authUtils.getUserId();
			const token = authUtils.getToken();
			
			if (!usuarioId) {
				throw new Error('No se encontró información del usuario');
			}

			if (!token) {
				throw new Error('Token de autenticación no encontrado');
			}

			

			const response = await api.post('Usuario/CambiarContrasena', {
				usuarioId: usuarioId,
				contrasenaActual: contrasenaActual,
				contrasenaNueva: contrasenaNueva
			});

			

			// Verificar si la respuesta es exitosa (response.data.estado === 1)
			if (response.data && response.data.estado === 1) {
				setSuccess(true);
				return { success: true, message: response.data.mensaje };
			} else {
				const errorMessage = response.data?.mensaje || 'Error al cambiar la contraseña';
				setError(errorMessage);
				return { success: false, message: errorMessage };
			}
		} catch (error) {
			console.error('Error changing password:', error);
			
			// Manejo de errores de la API
			let errorMessage = 'Error de conexión. Intente nuevamente.';
			
			if (error.response?.data?.mensaje) {
				errorMessage = error.response.data.mensaje;
			} else if (error.response?.data?.message) {
				errorMessage = error.response.data.message;
			} else if (error.message) {
				errorMessage = error.message;
			}
			
			setError(errorMessage);
			return { success: false, message: errorMessage };
		} finally {
			setLoading(false);
		}
	};

	const clearMessages = () => {
		setError('');
		setSuccess(false);
	};

	return {
		changePassword,
		loading,
		error,
		success,
		clearMessages
	};
};