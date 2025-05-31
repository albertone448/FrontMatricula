import { useState } from 'react';
import { authUtils } from '../utils/authUtils';

export const usePasswordChange = () => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState(false);

	const changePassword = async (contrasenaActual, contrasenaNueva) => {
		setLoading(true);
		setError('');
		setSuccess(false);

		try {
			// Obtener ID del usuario actual
			const usuarioId = authUtils.getUserId();
			
			if (!usuarioId) {
				throw new Error('No se encontró información del usuario');
			}

			console.log('Enviando cambio de contraseña para usuario:', usuarioId);

			const response = await fetch('http://localhost:5276/api/Usuario/CambiarContrasena', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Accept': '*/*',
				},
				body: JSON.stringify({
					usuarioId: usuarioId,
					contrasenaActual: contrasenaActual,
					contrasenaNueva: contrasenaNueva
				}),
			});

			const data = await response.json();
			console.log('Respuesta del servidor:', data);

			if (response.ok && data.estado === 1) {
				setSuccess(true);
				return { success: true, message: data.mensaje };
			} else {
				const errorMessage = data.mensaje || 'Error al cambiar la contraseña';
				setError(errorMessage);
				return { success: false, message: errorMessage };
			}
		} catch (error) {
			const errorMessage = error.message || 'Error de conexión. Intente nuevamente.';
			setError(errorMessage);
			console.error('Error changing password:', error);
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