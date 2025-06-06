import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/common/Header";
import CreateUserModal from "../components/usuarios/CreateUserModal";
import EditUserModal from "../components/usuarios/EditUserModal";
import UserStatsCards from "../components/usuarios/UserStatsCards";
import UsersTable from "../components/usuarios/UsersTable";
import AlertMessages from "../components/usuarios/AlertMessages";
import PageHeader from "../components/usuarios/PageHeader";
import { AdminOnly } from "../components/common/RoleBasedAccess";
import { useUsers } from "../hooks/useUsers";
import { useUserRole } from "../contexts/UserRoleContext";
import { motion } from "framer-motion";
import { ShieldX, Home } from "lucide-react";

const UsuariosPage = () => {
	const navigate = useNavigate();
	
	// Estados locales
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [userToEdit, setUserToEdit] = useState(null);
	const [successMessage, setSuccessMessage] = useState("");
	const [searchTerm, setSearchTerm] = useState("");

	// Hook de roles
	const { isAdmin, loading: roleLoading, userRole, currentUser } = useUserRole();

	// Hook personalizado para gestión de usuarios
	const {
		users,
		loading,
		error,
		fetchUsers,
		createUser,
		updateUser,
		deleteUser
	} = useUsers();

	// Handlers
	const handleCreateSuccess = async (message) => {
		setSuccessMessage(message);
		setTimeout(() => setSuccessMessage(""), 5000);
	};

	const handleEditSuccess = async (message) => {
		setSuccessMessage(message);
		setTimeout(() => setSuccessMessage(""), 5000);
	};

	const handleCreateUser = () => {
		setIsCreateModalOpen(true);
	};

	const handleCloseCreateModal = () => {
		setIsCreateModalOpen(false);
	};

	const handleEditUser = (user) => {
		
		setUserToEdit(user);
		setIsEditModalOpen(true);
	};

	const handleCloseEditModal = () => {
		setIsEditModalOpen(false);
		setUserToEdit(null);
	};

	const handleClearSuccess = () => {
		setSuccessMessage("");
	};

	const handleDeleteUser = async (user) => {
		// TODO: Implementar confirmación de eliminación
		const confirmDelete = window.confirm(
			`¿Está seguro de que desea eliminar al usuario ${user.nombre} ${user.apellido1}?`
		);
		
		if (confirmDelete) {
			try {
				await deleteUser(user.usuarioId);
				setSuccessMessage(`Usuario ${user.nombre} ${user.apellido1} eliminado exitosamente`);
				setTimeout(() => setSuccessMessage(""), 3000);
			} catch (error) {
				alert(`Error al eliminar usuario: ${error.message}`);
			}
		}
	};

	const handleSearchChange = (term) => {
		setSearchTerm(term);
	};

	const handleGoHome = () => {
		navigate("/");
	};

	// Componente de acceso denegado
	const AccessDeniedContent = () => (
		<div className='flex-1 overflow-auto relative z-10 bg-gray-900'>
			<Header title="Acceso Denegado" />
			<main className='max-w-4xl mx-auto py-6 px-4 lg:px-8'>
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className="text-center"
				>
					<div className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-xl rounded-xl p-12 border border-gray-700">
						{/* Icono de acceso denegado */}
						<motion.div
							initial={{ scale: 0 }}
							animate={{ scale: 1 }}
							transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
							className="inline-flex items-center justify-center w-24 h-24 bg-red-600 rounded-full mb-8"
						>
							<ShieldX className="w-12 h-12 text-white" />
						</motion.div>

						{/* Título */}
						<h1 className="text-4xl font-bold text-red-400 mb-6">
							Acceso Denegado
						</h1>

						{/* Mensaje principal */}
						<p className="text-xl text-gray-300 mb-4">
							No tienes permisos para acceder a esta página
						</p>

						{/* Información del usuario */}
						<div className="bg-gray-700 bg-opacity-50 rounded-lg p-6 mb-8">
							<h3 className="text-lg font-semibold text-gray-200 mb-3">
								Información de tu cuenta:
							</h3>
							<div className="space-y-2 text-gray-400">
								<p><strong>Usuario:</strong> {currentUser?.nombre} {currentUser?.apellido1}</p>
								<p><strong>Rol actual:</strong> <span className="text-yellow-400">{userRole}</span></p>
								<p><strong>Correo:</strong> {currentUser?.correo}</p>
							</div>
						</div>

						{/* Explicación */}
						<div className="bg-blue-900 bg-opacity-30 border border-blue-700 rounded-lg p-6 mb-8">
							<h3 className="text-lg font-semibold text-blue-300 mb-3">
								¿Por qué no puedo acceder?
							</h3>
							<p className="text-blue-200 text-sm leading-relaxed">
								La página de <strong>Gestión de Usuarios</strong> está restringida exclusivamente 
								para usuarios con rol de <strong className="text-green-400">Administrador</strong>. 
								Tu rol actual es <strong className="text-yellow-400">{userRole}</strong>, 
								por lo que no tienes los permisos necesarios para acceder a esta funcionalidad.
							</p>
						</div>

						{/* Botón para volver */}
						<motion.button
							onClick={handleGoHome}
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition duration-200 flex items-center mx-auto"
						>
							<Home className="w-5 h-5 mr-2" />
							Volver al Inicio
						</motion.button>

						{/* Información adicional */}
						<div className="mt-8 text-sm text-gray-500">
							<p>Si crees que esto es un error, contacta al administrador del sistema.</p>
						</div>
					</div>
				</motion.div>
			</main>
		</div>
	);

	// Componente de carga mientras se verifican los roles
	const LoadingContent = () => (
		<div className='flex-1 overflow-auto relative z-10 bg-gray-900'>
			<Header title="Verificando Permisos" />
			<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
				<div className="flex items-center justify-center h-96">
					<div className="text-center">
						<div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
						<p className="text-gray-400 text-lg">Verificando permisos de acceso...</p>
					</div>
				</div>
			</main>
		</div>
	);

	// Componente principal con contenido de usuarios (solo para admins)
	const UsuariosContent = () => (
		<div className='flex-1 overflow-auto relative z-10 bg-gray-900'>
			<Header title={"Gestión de Usuarios"} />

			<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
				{/* Mensajes de alerta */}
				<AlertMessages 
					successMessage={successMessage}
					errorMessage={error}
					onClearSuccess={handleClearSuccess}
					onRetry={fetchUsers}
				/>

				{/* Header de la página */}
				<PageHeader 
					onCreateUser={handleCreateUser}
					onRefresh={fetchUsers}
					loading={loading}
				/>

				{/* Estadísticas */}
				<UserStatsCards 
					users={users}
					loading={loading}
				/>

				{/* Tabla de usuarios */}
				<UsersTable 
					users={users}
					loading={loading}
					searchTerm={searchTerm}
					onSearchChange={handleSearchChange}
					onEditUser={handleEditUser}
					onDeleteUser={handleDeleteUser}
				/>
			</main>

			{/* Modal de creación */}
			<CreateUserModal
				isOpen={isCreateModalOpen}
				onClose={handleCloseCreateModal}
				onSuccess={handleCreateSuccess}
			/>

			{/* Modal de edición */}
			<EditUserModal
				isOpen={isEditModalOpen}
				onClose={handleCloseEditModal}
				onSuccess={handleEditSuccess}
				userToEdit={userToEdit}
			/>
		</div>
	);

	// Renderizado condicional basado en el estado de carga y rol
	if (roleLoading) {
		return <LoadingContent />;
	}

	// Usar AdminOnly para mostrar contenido o acceso denegado
	return (
		<AdminOnly fallback={<AccessDeniedContent />}>
			<UsuariosContent />
		</AdminOnly>
	);
};

export default UsuariosPage;