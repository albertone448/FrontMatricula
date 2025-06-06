import { useState, useEffect, useCallback } from 'react';
import { authUtils } from '../utils/authUtils';
import api from '../services/apiConfig';

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
			const token = authUtils.getToken();
			
			if (!userId) {
				throw new Error('No se encontró el ID del usuario en el almacenamiento local');
			}

			if (!token) {
				throw new Error('Token de autenticación no encontrado');
			}

			const response = await api.get(`Usuario/GetUsuarioPorId/${userId}`);
			setUser(response.data);
		} catch (error) {
			console.error('Error al obtener perfil:', error);
			setError(error.response?.data?.message || error.message);
		} finally {
			setLoading(false);
		}
	}, []);

	// Actualizar perfil del usuario
	const updateProfile = useCallback(async (updatedData) => {
		setLoading(true);
		setError("");
		
		try {
			const userId = authUtils.getUserId();
			const token = authUtils.getToken();
			
			if (!userId) {
				throw new Error('No se encontró el ID del usuario');
			}

			if (!token) {
				throw new Error('Token de autenticación no encontrado');
			}

			const response = await api.put(`Usuario/UpdateUsuario/${userId}`, updatedData);
			
			// Manejar respuesta basada en el status code
			let updatedUser = null;
			if (response.status === 204) {
				updatedUser = { ...user, ...updatedData };
			} else {
				updatedUser = response.data;
			}

			// Actualizar el estado local inmediatamente
			setUser(prevUser => ({ ...prevUser, ...updatedData }));
			
			// Refrescar datos del servidor
			await fetchProfile();
			
			return updatedUser;
		} catch (error) {
			console.error('Error al actualizar perfil:', error);
			setError(error.response?.data?.message || error.message);
			throw error;
		} finally {
			setLoading(false);
		}
	}, [fetchProfile, user]);

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