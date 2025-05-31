import { useUserRole } from '../../contexts/UserRoleContext';

// Componente para mostrar contenido basado en roles
const RoleBasedAccess = ({ 
	roles = [], 
	permissions = [], 
	children, 
	fallback = null,
	requireAll = false // si true, requiere TODOS los roles/permisos; si false, requiere AL MENOS UNO
}) => {
	const { userRole, hasPermission, loading } = useUserRole();

	// Mostrar loading si aún está cargando
	if (loading) {
		return (
			<div className="flex items-center justify-center p-4">
				<div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
				<span className="ml-2 text-gray-400">Verificando permisos...</span>
			</div>
		);
	}

	// Verificar roles
	let hasRequiredRole = false;
	if (roles.length > 0) {
		if (requireAll) {
			// Requiere TODOS los roles (caso raro, pero posible)
			hasRequiredRole = roles.every(role => userRole === role);
		} else {
			// Requiere AL MENOS UN rol
			hasRequiredRole = roles.includes(userRole);
		}
	} else {
		// Si no se especifican roles, asumimos que tiene acceso
		hasRequiredRole = true;
	}

	// Verificar permisos
	let hasRequiredPermission = false;
	if (permissions.length > 0) {
		if (requireAll) {
			// Requiere TODOS los permisos
			hasRequiredPermission = permissions.every(permission => hasPermission(permission));
		} else {
			// Requiere AL MENOS UN permiso
			hasRequiredPermission = permissions.some(permission => hasPermission(permission));
		}
	} else {
		// Si no se especifican permisos, asumimos que tiene acceso
		hasRequiredPermission = true;
	}

	// Determinar si tiene acceso
	const hasAccess = hasRequiredRole && hasRequiredPermission;

	// Renderizar contenido o fallback
	return hasAccess ? children : fallback;
};

// Componente específico para administradores
export const AdminOnly = ({ children, fallback = null }) => (
	<RoleBasedAccess roles={['Administrador']} fallback={fallback}>
		{children}
	</RoleBasedAccess>
);

// Componente específico para profesores
export const ProfesorOnly = ({ children, fallback = null }) => (
	<RoleBasedAccess roles={['Profesor']} fallback={fallback}>
		{children}
	</RoleBasedAccess>
);

// Componente específico para estudiantes
export const EstudianteOnly = ({ children, fallback = null }) => (
	<RoleBasedAccess roles={['Estudiante']} fallback={fallback}>
		{children}
	</RoleBasedAccess>
);

// Componente para profesores y administradores
export const ProfesorOrAdmin = ({ children, fallback = null }) => (
	<RoleBasedAccess roles={['Profesor', 'Administrador']} fallback={fallback}>
		{children}
	</RoleBasedAccess>
);

// Componente para usuarios autenticados (cualquier rol)
export const AuthenticatedOnly = ({ children, fallback = null }) => (
	<RoleBasedAccess roles={['Administrador', 'Profesor', 'Estudiante']} fallback={fallback}>
		{children}
	</RoleBasedAccess>
);

export default RoleBasedAccess;