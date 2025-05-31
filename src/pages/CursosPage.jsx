import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/common/Header";
import { motion } from "framer-motion";
import { useUserRole } from "../contexts/UserRoleContext";
import { useCursos } from "../hooks/useCursos";

import CursoHeader from "../components/cursos/CursoHeader";
import CursoStats from "../components/cursos/CursoStats";
import CursosTable from "../components/cursos/CursosTable";
import CursoAlertMessages from "../components/cursos/CursoAlertMessages";
import CreateCursoModal from "../components/cursos/CreateCursoModal";

const CursosPage = () => {
	const navigate = useNavigate();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [successMessage, setSuccessMessage] = useState("");
	const [searchTerm, setSearchTerm] = useState("");

	const { loading: roleLoading, userPermissions } = useUserRole();
	const { cursos, loading, error, fetchCursos, createCurso, updateCurso, deleteCurso } = useCursos();

	useEffect(() => {
		fetchCursos();
	}, [fetchCursos]);

	const handleCreateSuccess = async (message) => {
		setSuccessMessage(message);
		setTimeout(() => setSuccessMessage(""), 5000);
		fetchCursos();
	};

	const handleCreateCurso = () => setIsModalOpen(true);
	const handleCloseModal = () => setIsModalOpen(false);
	const handleClearSuccess = () => setSuccessMessage("");

	const handleEditCurso = (curso) => {
		// TODO: Implementar edición de curso
		console.log("Editar curso:", curso);
	};

	const handleDeleteCurso = async (curso) => {
		const confirmDelete = window.confirm(
			`¿Está seguro de que desea eliminar el curso ${curso.nombre}?`
		);
		
		if (confirmDelete) {
			try {
				await deleteCurso(curso.cursoId);
				setSuccessMessage(`Curso ${curso.nombre} eliminado exitosamente`);
				setTimeout(() => setSuccessMessage(""), 3000);
				fetchCursos();
			} catch (error) {
				alert(`Error al eliminar curso: ${error.message}`);
			}
		}
	};

	const handleSearchChange = (term) => setSearchTerm(term);

	// Loading state
	if (roleLoading) {
		return (
			<div className='flex-1 overflow-auto relative z-10 bg-gray-900'>
				<Header title="Verificando Acceso" />
				<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
					<div className="flex justify-center items-center h-64">
						<div className="text-center">
							<div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
							<p className="text-gray-400">Cargando...</p>
						</div>
					</div>
				</main>
			</div>
		);
	}

	return (
		<div className='flex-1 overflow-auto relative z-10 bg-gray-900'>
			<Header title={"Gestión de Cursos"} />
			<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
				{/* Mensajes de alerta */}
				<CursoAlertMessages
					successMessage={successMessage}
					errorMessage={error}
					onClearSuccess={handleClearSuccess}
					onRetry={fetchCursos}
				/>

				{/* Header con botones de acción */}
				<CursoHeader
					onCreateCurso={handleCreateCurso}
					onRefresh={fetchCursos}
					loading={loading}
					userPermissions={userPermissions}
				/>

				{/* Estadísticas */}
				<CursoStats
					cursos={cursos}
					loading={loading}
				/>

				{/* Tabla de cursos */}
				<CursosTable
					cursos={cursos}
					loading={loading}
					searchTerm={searchTerm}
					onSearchChange={handleSearchChange}
					onEditCurso={handleEditCurso}
					onDeleteCurso={handleDeleteCurso}
					userPermissions={userPermissions}
				/>
			</main>

			{/* Modal de creación */}
			<CreateCursoModal
				isOpen={isModalOpen}
				onClose={handleCloseModal}
				onSuccess={handleCreateSuccess}
			/>
		</div>
	);
};

export default CursosPage;
