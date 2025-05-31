import { useState, useEffect, useCallback, useRef } from 'react';
import { userService } from '../services/userService';

export const useUsers = () => {
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [isRefreshing, setIsRefreshing] = useState(false);
	const abortControllerRef = useRef(null);

	// Función para cancelar requests pendientes
	const cancelPendingRequests = useCallback(() => {
		if (abortControllerRef.current) {
			abortControllerRef.current.abort();
		}
	}, []);

	// Cargar usuarios con control de cancelación
	const fetchUsers = useCallback(async (showLoader = true) => {
		// Cancelar request anterior si existe
		cancelPendingRequests();

		// Crear nuevo AbortController
		abortControllerRef.current = new AbortController();

		if (showLoader) {
			setLoading(true);
		} else {
			setIsRefreshing(true);
		}
		
		setError("");

		try {
			const data = await userService.getAllUsers({
				signal: abortControllerRef.current.signal
			});
			
			// Solo actualizar si el request no fue cancelado
			if (!abortControllerRef.current.signal.aborted) {
				setUsers(data);
			}
		} catch (error) {
			// Solo mostrar error si no fue una cancelación
			if (!abortControllerRef.current.signal.aborted) {
				setError(error.message);
			}
		} finally {
			if (!abortControllerRef.current.signal.aborted) {
				setLoading(false);
				setIsRefreshing(false);
			}
		}
	}, [cancelPendingRequests]);

	// Crear usuario con actualización optimista
	const createUser = useCallback(async (userData) => {
		try {
			const result = await userService.createUser(userData);
			
			// Actualización optimista - agregar el usuario inmediatamente
			const newUser = { ...userData, usuarioId: result.usuarioId || Date.now() };
			setUsers(prevUsers => [...prevUsers, newUser]);
			
			// Recargar en background para sincronizar
			setTimeout(() => fetchUsers(false), 100);
			
			return result;
		} catch (error) {
			// Si falla, recargar para mantener consistencia
			fetchUsers(false);
			throw error;
		}
	}, [fetchUsers]);

	// Actualizar usuario con actualización optimista
	const updateUser = useCallback(async (userId, userData) => {
		const originalUsers = users;
		
		try {
			// Actualización optimista
			setUsers(prevUsers => 
				prevUsers.map(user => 
					user.usuarioId === userId 
						? { ...user, ...userData }
						: user
				)
			);

			const result = await userService.updateUser(userId, userData);
			
			// Recargar en background para sincronizar
			setTimeout(() => fetchUsers(false), 100);
			
			return result;
		} catch (error) {
			// Revertir cambios si falla
			setUsers(originalUsers);
			throw error;
		}
	}, [users, fetchUsers]);

	// Eliminar usuario con actualización optimista
	const deleteUser = useCallback(async (userId) => {
		const originalUsers = users;
		
		try {
			// Actualización optimista - remover inmediatamente
			setUsers(prevUsers => prevUsers.filter(user => user.usuarioId !== userId));

			await userService.deleteUser(userId);
			
			// Recargar en background para sincronizar
			setTimeout(() => fetchUsers(false), 100);
			
		} catch (error) {
			// Revertir cambios si falla
			setUsers(originalUsers);
			throw error;
		}
	}, [users, fetchUsers]);

	// Cambiar estado del usuario con actualización optimista
	const toggleUserStatus = useCallback(async (userId, isActive) => {
		const originalUsers = users;
		
		try {
			// Actualización optimista
			setUsers(prevUsers => 
				prevUsers.map(user => 
					user.usuarioId === userId 
						? { ...user, activo: isActive }
						: user
				)
			);

			await userService.toggleUserStatus(userId, isActive);
			
			// Recargar en background para sincronizar
			setTimeout(() => fetchUsers(false), 100);
			
		} catch (error) {
			// Revertir cambios si falla
			setUsers(originalUsers);
			throw error;
		}
	}, [users, fetchUsers]);

	// Función para refrescar manualmente
	const refreshUsers = useCallback(() => {
		fetchUsers(false);
	}, [fetchUsers]);

	// Cargar usuarios al montar el hook
	useEffect(() => {
		fetchUsers();

		// Cleanup: cancelar requests al desmontar
		return () => {
			cancelPendingRequests();
		};
	}, [fetchUsers, cancelPendingRequests]);

	return {
		users,
		loading,
		error,
		isRefreshing,
		fetchUsers,
		refreshUsers,
		createUser,
		updateUser,
		deleteUser,
		toggleUserStatus
	};
};