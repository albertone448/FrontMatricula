import { createContext, useContext, useState, useEffect } from 'react';
import { authUtils } from '../utils/authUtils';

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
			
			if (!userId) {
				setUserRole(null);
				setUserPermissions({});
				setCurrentUser(null);
				setLoading(false);
				return;
			}

			const response = await fetch(`http://localhost:5276/api/Usuario/GetUsuarioPorId/${userId}`, {
				method: 'GET',
				headers: {
					'Accept': 'application/json',
				},
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const userData = await response.json();
			
			// Actualizar el estado
			setCurrentUser(userData);
			setUserRole(userData.rol);
			
			// Calcular permisos basados en el rol
			const permissions = calculatePermissions(userData.rol);
			setUserPermissions(permissions);

			// Actualizar localStorage con datos frescos del servidor
			localStorage.setItem("usuario", JSON.stringify(userData));

		} catch (error) {
			console.error('Error fetching user role:', error);
			setError(error.message);
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
		fetchUserRole();
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