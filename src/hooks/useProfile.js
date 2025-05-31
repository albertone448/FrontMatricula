import { useState, useEffect, useCallback } from 'react';
import { authUtils } from '../utils/authUtils';

export const useProfile = () => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	// Obtener perfil del usuario
	const fetchProfile = useCallback(async () => {
		setLoading(true);
		setError("");
		
		try {
			// Obtener ID del localStorage usando authUtils
			const userId = authUtils.getUserId();
			
			if (!userId) {
				throw new Error('No se encontró el ID del usuario en el almacenamiento local');
			}

			const response = await fetch(`http://localhost:5276/api/Usuario/GetUsuarioPorId/${userId}`, {
				method: 'GET',
				headers: {
					'accept': '*/*',
				},
			});

			if (!response.ok) {
				throw new Error(`Error ${response.status}: ${response.statusText}`);
			}

			const userData = await response.json();
			setUser(userData);
		} catch (error) {
			setError(error.message);
			console.error('Error al obtener perfil:', error);
		} finally {
			setLoading(false);
		}
	}, []);

	// Actualizar perfil del usuario
	const updateProfile = useCallback(async (updatedData) => {
		try {
			const userId = authUtils.getUserId();
			
			if (!userId) {
				throw new Error('No se encontró el ID del usuario');
			}

			const response = await fetch(`http://localhost:5276/api/Usuario/UpdateUsuario/${userId}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(updatedData),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.mensaje || 'Error al actualizar el perfil');
			}

			// Actualizar el estado local inmediatamente
			setUser(prevUser => ({ ...prevUser, ...updatedData }));
			
			// Refrescar datos del servidor
			await fetchProfile();
			
			return true;
		} catch (error) {
			setError(error.message);
			throw error;
		}
	}, [fetchProfile]);

	// Cargar perfil al montar el hook
	useEffect(() => {
		fetchProfile();
	}, [fetchProfile]);

	return {
		user,
		loading,
		error,
		fetchProfile,
		updateProfile
	};
};