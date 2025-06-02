import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/common/Header";
import { motion } from "framer-motion";
import { useUserRole } from "../contexts/UserRoleContext";
import { useSecciones } from "../hooks/useSecciones";

import SeccionHeader from "../components/secciones/SeccionHeader";
import SeccionStatsCards from "../components/secciones/SeccionStatsCards";
import SeccionesTable from "../components/secciones/SeccionesTable";
import SeccionAlertMessages from "../components/secciones/SeccionAlertMessages";
import CreateSeccionModal from "../components/secciones/CreateSeccionModal";

const SeccionesPage = () => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const { loading: roleLoading, userRole } = useUserRole();
    const { secciones, loading, error, fetchSecciones, createSeccion, updateSeccion, deleteSeccion } = useSecciones();
    const [seccionToEdit, setSeccionToEdit] = useState(null);

    // Cargar secciones al montar el componente y cuando cambie el userRole
    useEffect(() => {
        if (!roleLoading) {
            console.log('Fetching secciones...');
            fetchSecciones().catch(err => {
                console.error('Error fetching secciones:', err);
            });
        }
    }, [fetchSecciones, roleLoading]);

    // Handlers
    const handleCreateSuccess = async (message) => {
        setSuccessMessage(message);
        setTimeout(() => setSuccessMessage(""), 5000);
        setIsModalOpen(false);
        setSeccionToEdit(null);
    };

    const handleEditSeccion = (seccion) => {
        setSeccionToEdit(seccion);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSeccionToEdit(null);
    };

    const handleDeleteSeccion = async (seccion) => {
        if (window.confirm(`¿Está seguro que desea eliminar la sección ${seccion.grupo}?`)) {
            try {
                await deleteSeccion(seccion.seccionId);
                setSuccessMessage("Sección eliminada exitosamente");
                setTimeout(() => setSuccessMessage(""), 5000);
            } catch (error) {
                console.error("Error al eliminar sección:", error);
            }
        }
    };

    const handleSearch = (term) => {
        setSearchTerm(term);
    };

    const handleClearSuccess = () => {
        setSuccessMessage("");
    };

    const handleCreateSeccion = () => {
        setIsModalOpen(true);
    };    // Componente de carga
    if (loading) {
        return (
            <div className='flex-1 overflow-auto relative z-10 bg-gray-900'>
                <Header title="Gestión de Secciones" />
                <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
                    <div className="flex justify-center items-center h-[calc(100vh-200px)]">
                        <div className="flex flex-col items-center">
                            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                            <p className="mt-4 text-gray-400">Cargando secciones...</p>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className='flex-1 overflow-auto relative z-10 bg-gray-900'>
            <Header title="Gestión de Secciones" />
            
            <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
                {/* Mensajes de alerta */}
                <SeccionAlertMessages 
                    successMessage={successMessage}
                    errorMessage={error}
                    onClearSuccess={handleClearSuccess}
                    onRetry={fetchSecciones}
                />

                {/* Header de la página */}
                <SeccionHeader 
                    onCreateSeccion={handleCreateSeccion}
                    onRefresh={fetchSecciones}
                    loading={loading}
                />

                {/* Estadísticas */}
                <SeccionStatsCards 
                    secciones={secciones}
                    loading={loading}
                />

                {/* Tabla de secciones */}
                <SeccionesTable 
                    secciones={secciones}
                    loading={loading}
                    searchTerm={searchTerm}
                    onSearchChange={handleSearch}
                    onEditSeccion={handleEditSeccion}
                    onDeleteSeccion={handleDeleteSeccion}
                />

                {/* Modal de creación/edición */}
                <CreateSeccionModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onSuccess={handleCreateSuccess}
                    seccionToEdit={seccionToEdit}
                    createSeccion={createSeccion}
                    updateSeccion={updateSeccion}
                />
            </main>
        </div>
    );
};

export default SeccionesPage;
