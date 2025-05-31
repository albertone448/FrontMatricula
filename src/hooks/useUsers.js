import { useState, useEffect, useCallback } from 'react';
import { userService } from '../services/userService';

export const useUsers = () => {
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	// Cargar usuarios
	const fetchUsers = useCallback(async () => {
		setLoading(true);
		setError("");
		try {
			const data = await userService.getAllUsers();
			setUsers(data);
		} catch (error) {
			setError(error.message);
		} finally {
			setLoading(false);
		}
	}, []);

	// Crear usuario
	const createUser = async (userData) => {
		try {
			const result = await userService.createUser(userData);
			await fetchUsers(); // Recargar la lista
			return result;
		} catch (error) {
			throw error;
		}
	};

	// Actualizar usuario
	const updateUser = async (userId, userData) => {
		try {
			const result = await userService.updateUser(userId, userData);
			await fetchUsers(); // Recargar la lista
			return result;
		} catch (error) {
			throw error;
		}
	};

	// Eliminar usuario
	const deleteUser = async (userId) => {
		try {
			await userService.deleteUser(userId);
			await fetchUsers(); // Recargar la lista
		} catch (error) {
			throw error;
		}
	};

	// Cambiar estado del usuario
	const toggleUserStatus = async (userId, isActive) => {
		try {
			await userService.toggleUserStatus(userId, isActive);
			await fetchUsers(); // Recargar la lista
		} catch (error) {
			throw error;
		}
	};

	// Cargar usuarios al montar el hook
	useEffect(() => {
		fetchUsers();
	}, [fetchUsers]);

	return {
		users,
		loading,
		error,
		fetchUsers,
		createUser,
		updateUser,
		deleteUser,
		toggleUserStatus
	};
};