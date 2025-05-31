import { useState } from "react";
import Header from "../components/common/Header";
import CreateUserModal from "../components/usuarios/CreateUserModal";
import UserStatsCards from "../components/usuarios/UserStatsCards";
import UsersTable from "../components/usuarios/UsersTable";
import AlertMessages from "../components/usuarios/AlertMessages";
import PageHeader from "../components/usuarios/PageHeader";
import { useUsers } from "../hooks/useUsers";

const UsuariosPage = () => {
	// Estados locales
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [successMessage, setSuccessMessage] = useState("");
	const [searchTerm, setSearchTerm] = useState("");

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

	const handleCreateUser = () => {
		setIsModalOpen(true);
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
	};

	const handleClearSuccess = () => {
		setSuccessMessage("");
	};

	const handleEditUser = (user) => {
		// TODO: Implementar modal de edición
		console.log("Editar usuario:", user);
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

	return (
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
				isOpen={isModalOpen}
				onClose={handleCloseModal}
				onSuccess={handleCreateSuccess}
			/>
		</div>
	);
};

export default UsuariosPage;