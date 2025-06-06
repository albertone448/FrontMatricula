import { createContext, useContext, useState, useEffect } from 'react';
import { authUtils } from '../utils/authUtils';
import api from '../services/apiConfig';

// Crear el contexto
const UserRoleContext = createContext();

// Provider del contexto
export const UserRoleProvider = ({ children }) => {
	const [userRole, setUserRole] = useState(null);
	const [userPermissions, setUserPermissions] = useState({});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [currentUser, setCurrentUser] = useState(null);

	// Función para obtener los datos del usuario por ID
	const fetchUserRole = async () => {
		setLoading(true);
		setError(null);

		try {
			const userId = authUtils.getUserId();
			const token = authUtils.getToken();
			
			
			if (!userId) {
				console.error('❌ No se encontró userId en localStorage');
				setUserRole(null);
				setUserPermissions({});
				setCurrentUser(null);
				setLoading(false);
				return;
			}

			if (!token) {
				console.error('❌ No se encontró token en localStorage');
				setUserRole(null);
				setUserPermissions({});
				setCurrentUser(null);
				setLoading(false);
				return;
			}


			const response = await api.get(`Usuario/GetUsuarioPorId/${userId}`);


			const userData = response.data;
			
			// Actualizar el estado
			setCurrentUser(userData);
			setUserRole(userData.rol);
			
			// Calcular permisos basados en el rol
			const permissions = calculatePermissions(userData.rol);
			setUserPermissions(permissions);

			// Actualizar localStorage con solo los datos necesarios
			const limitedUserData = {
				usuarioId: userData.usuarioId,
				nombre: userData.nombre,
				apellido1: userData.apellido1,
				carrera: userData.carrera,
				identificacion: userData.identificacion,
				correo: userData.correo
			};
			localStorage.setItem("usuario", JSON.stringify(limitedUserData));

		} catch (error) {
			console.error('❌ Error fetching user role:', error);
			
			// Manejo específico de errores de API
			let errorMessage = 'Error al obtener datos del usuario';
			if (error.response?.data?.mensaje) {
				errorMessage = error.response.data.mensaje;
			} else if (error.response?.data?.message) {
				errorMessage = error.response.data.message;
			} else if (error.message) {
				errorMessage = error.message;
			}
			
			setError(errorMessage);
			setUserRole(null);
			setUserPermissions({});
			setCurrentUser(null);
		} finally {
			setLoading(false);
		}
	};

	// Función para calcular permisos basados en el rol
	const calculatePermissions = (rol) => {
		const basePermissions = {
			canViewDashboard: false,
			canManageUsers: false,
			canManageCourses: false,
			canManageSections: false,
			canManageSchedules: false,
			canManageEnrollments: false,
			canViewReports: false,
			canViewProfile: true, // Todos pueden ver su perfil
		};

		switch (rol) {
			case 'Administrador':
				return {
					...basePermissions,
					canViewDashboard: true,
					canManageUsers: true,
					canManageCourses: true,
					canManageSections: true,
					canManageSchedules: true,
					canManageEnrollments: true,
					canViewReports: true,
				};
			
			case 'Profesor':
				return {
					...basePermissions,
					canViewDashboard: true,
					canViewReports: true,
					canManageSections: true, // Solo las secciones que le corresponden
					canManageSchedules: true, // Solo sus horarios
				};
			
			case 'Estudiante':
				return {
					...basePermissions,
					canViewDashboard: true,
					canManageEnrollments: true, // Solo sus propias inscripciones
				};
			
			default:
				return basePermissions;
		}
	};

	// Función para refrescar los datos del usuario
	const refreshUserRole = () => {
		fetchUserRole();
	};

	// Función para verificar si el usuario tiene un permiso específico
	const hasPermission = (permission) => {
		return userPermissions[permission] || false;
	};

	// Función para verificar si el usuario tiene un rol específico
	const hasRole = (role) => {
		return userRole === role;
	};

	// Función para verificar múltiples roles
	const hasAnyRole = (roles) => {
		return roles.includes(userRole);
	};

	// Efecto para cargar el rol al montar el componente
	useEffect(() => {
		// Verificar estado de autenticación
		const isAuthenticated = authUtils.isAuthenticated();
		const isSessionValid = authUtils.isSessionValid();
		const userId = authUtils.getUserId();
		const token = authUtils.getToken();
		
		// Si tenemos userId y token, intentar cargar independientemente de isSessionValid
		if (userId && token) {
			fetchUserRole();
		} else if (userId) {
			fetchUserRole();
		} else {
			setLoading(false);
		}
	}, []);

	// Valor del contexto
	const contextValue = {
		userRole,
		userPermissions,
		currentUser,
		loading,
		error,
		refreshUserRole,
		hasPermission,
		hasRole,
		hasAnyRole,
		
		// Helpers específicos para roles
		isAdmin: userRole === 'Administrador',
		isProfesor: userRole === 'Profesor',
		isEstudiante: userRole === 'Estudiante',
		
		// Helpers para permisos comunes
		canManageUsers: hasPermission('canManageUsers'),
		canManageCourses: hasPermission('canManageCourses'),
		canViewReports: hasPermission('canViewReports'),
	};

	return (
		<UserRoleContext.Provider value={contextValue}>
			{children}
		</UserRoleContext.Provider>
	);
};

// Hook para usar el contexto
export const useUserRole = () => {
	const context = useContext(UserRoleContext);
	
	if (context === undefined) {
		throw new Error('useUserRole must be used within a UserRoleProvider');
	}
	
	return context;
};

// Hook alternativo más simple para solo obtener el rol
export const useRole = () => {
	const { userRole, loading } = useUserRole();
	return { role: userRole, loading };
};

// Hook para verificar permisos específicos
export const usePermission = (permission) => {
	const { hasPermission, loading } = useUserRole();
	return { hasPermission: hasPermission(permission), loading };
};
