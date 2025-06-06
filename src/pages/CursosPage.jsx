import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/common/Header";
import { motion } from "framer-motion";
import { useUserRole } from "../contexts/UserRoleContext";
import { useCursos } from "../hooks/useCursos";
import { ShieldX, Home } from "lucide-react";

import CursoHeader from "../components/cursos/CursoHeader";
import CursoStats from "../components/cursos/CursoStats";
import CursosTable from "../components/cursos/CursosTable";
import CursoAlertMessages from "../components/cursos/CursoAlertMessages";
import CreateCursoModal from "../components/cursos/CreateCursoModal";

const CursosPage = () => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [cursoToEdit, setCursoToEdit] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    const { userRole, currentUser, loading: roleLoading, userPermissions } = useUserRole();
    const { cursos, loading, error, fetchCursos, createCurso, updateCurso, deleteCurso } = useCursos();

    useEffect(() => {
        fetchCursos();
    }, [fetchCursos]);    
    
    const handleCreateSuccess = async (message) => {
        await fetchCursos(); // Primero actualizamos la lista
        setSuccessMessage(message);
        setTimeout(() => setSuccessMessage(""), 5000);
    };

    const handleCreateCurso = () => setIsModalOpen(true);
    
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCursoToEdit(null); // ✅ Limpiar el curso a editar
    };

    const handleClearSuccess = () => setSuccessMessage("");

    const handleEditCurso = (curso) => {
        setCursoToEdit(curso); // ✅ Pasar el objeto curso completo
        setIsModalOpen(true);
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
            } catch (error) {
                alert(`Error al eliminar curso: ${error.message}`);
            }
        }
    };

    const handleSearchChange = (term) => setSearchTerm(term);

    const handleGoHome = () => {
		navigate("/");
	};

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

    if (userRole !== 'Administrador') {
		return (
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
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                                className="inline-flex items-center justify-center w-24 h-24 bg-red-600 rounded-full mb-8"
                            >
                                <ShieldX className="w-12 h-12 text-white" />
                            </motion.div>
                            <h1 className="text-4xl font-bold text-red-400 mb-6">
                                Acceso Denegado
                            </h1>
                            <p className="text-xl text-gray-300 mb-4">
                                No tienes permisos para acceder a esta página
                            </p>
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
                            <div className="bg-blue-900 bg-opacity-30 border border-blue-700 rounded-lg p-6 mb-8">
                                <h3 className="text-lg font-semibold text-blue-300 mb-3">
                                    ¿Por qué no puedo acceder?
                                </h3>
                                <p className="text-blue-200 text-sm leading-relaxed">
                                    La página de <strong>Gestión de Cursos</strong> está restringida exclusivamente 
                                    para usuarios con rol de <strong className="text-green-400">Administrador</strong>. 
                                    Tu rol actual es <strong className="text-yellow-400">{userRole}</strong>, 
                                    por lo que no tienes los permisos necesarios para acceder a esta funcionalidad.
                                </p>
                            </div>
                            <motion.button
                                onClick={handleGoHome}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition duration-200 flex items-center mx-auto"
                            >
                                <Home className="w-5 h-5 mr-2" />
                                Volver al Inicio
                            </motion.button>
                            <div className="mt-8 text-sm text-gray-500">
                                <p>Si crees que esto es un error, contacta al administrador del sistema.</p>
                            </div>
                        </div>
                    </motion.div>
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

            {/* Modal de creación/edición */}
            <CreateCursoModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSuccess={handleCreateSuccess}
                cursoToEdit={cursoToEdit}
                createCurso={createCurso}  // ✅ Pasar función del hook
                updateCurso={updateCurso}  // ✅ Pasar función del hook
            />
        </div>
    );
};

export default CursosPage;
