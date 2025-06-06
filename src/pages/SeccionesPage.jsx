import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/common/Header";
import { motion } from "framer-motion";
import { useUserRole } from "../contexts/UserRoleContext";
import { useSecciones } from "../hooks/useSecciones";
import { AdminOnly } from "../components/common/RoleBasedAccess";
import { ShieldX, Home } from "lucide-react";
import { authUtils } from "../utils/authUtils";
import api from "../services/apiConfig";

import SeccionHeader from "../components/secciones/SeccionHeader";
import SeccionStatsCards from "../components/secciones/SeccionStatsCards";
import SeccionesTable from "../components/secciones/SeccionesTable";
import SeccionAlertMessages from "../components/secciones/SeccionAlertMessages";
import CreateSeccionModal from "../components/secciones/CreateSeccionModal";
import SeccionesProfesorView from "../components/secciones/SeccionesProfesorView";
import SeccionesEstudianteView from "../components/secciones/SeccionesEstudianteView";

const SeccionesPage = () => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const { loading: roleLoading, userRole, currentUser } = useUserRole();
    const { 
        secciones, 
        loading, 
        error, 
        profesores, 
        cursos, 
        fetchSecciones, 
        createSeccion, 
        updateSeccion, 
        deleteSeccion 
    } = useSecciones();
    const [seccionToEdit, setSeccionToEdit] = useState(null);
    
    // Estados para la funcionalidad de periodos (compartidos entre todos los roles)
    const [periodosDisponibles, setPeriodosDisponibles] = useState([]);
    const [periodoSeleccionado, setPeriodoSeleccionado] = useState("");

    // ✅ Función para obtener todos los periodos disponibles (para administradores)
    const obtenerTodosLosPeriodos = () => {
        if (!secciones || userRole !== "Administrador") return [];
        
        // Extraer todos los periodos únicos de todas las secciones
        const periodos = [...new Set(secciones.map(seccion => seccion.periodo).filter(Boolean))];
        
        
        return periodos.sort().reverse(); // Más recientes primero
    };

    // Función para obtener periodos disponibles del profesor
    const obtenerPeriodosDelProfesor = () => {
        if (!secciones || userRole !== "Profesor") return [];
        
        const userId = authUtils.getUserId();
        if (!userId) return [];
        
        // Filtrar secciones del profesor actual
        const seccionesDelProfesor = secciones.filter(seccion => seccion.usuarioId === userId);
        
        // Extraer periodos únicos
        const periodos = [...new Set(seccionesDelProfesor.map(seccion => seccion.periodo).filter(Boolean))];
        
        
        return periodos.sort().reverse(); // Más recientes primero
    };

    // Función para obtener periodos disponibles del estudiante
    const obtenerPeriodosDelEstudiante = async () => {
        try {
            const userId = authUtils.getUserId();
            if (!userId) return [];

        

            // Obtener todas las inscripciones del estudiante
            const inscripcionesResponse = await api.get(`Inscripcion/GetInscripcionesPorUsuario?id=${userId}`);
            const inscripciones = inscripcionesResponse.data;

            if (!inscripciones || inscripciones.length === 0) {
                return [];
            }

            // Obtener secciones para extraer periodos únicos
            const seccionesPromises = inscripciones.map(inscripcion => 
                api.get(`Seccion/GetSeccionById/${inscripcion.seccionId}`)
            );
            
            const seccionesResponses = await Promise.all(seccionesPromises);
            const secciones = seccionesResponses.map(response => response.data);

            // Extraer periodos únicos
            const periodos = [...new Set(secciones.map(seccion => seccion.periodo).filter(Boolean))];
        

            return periodos.sort().reverse(); // Más recientes primero
        } catch (error) {
            console.error("❌ Error obteniendo periodos del estudiante:", error);
            return [];
        }
    };

    // Cargar secciones al montar el componente y cuando cambie el userRole
    useEffect(() => {
        if (!roleLoading && (userRole === "Administrador" || userRole === "Profesor")) {
    
            fetchSecciones().catch(err => {
                console.error('Error fetching secciones:', err);
            });
        }
    }, [fetchSecciones, roleLoading, userRole]);

    // ✅ Actualizar periodos disponibles cuando cambien las secciones (ACTUALIZADO para incluir administrador)
    useEffect(() => {
        if (userRole === "Administrador" && secciones.length > 0) {
            // ✅ Para administradores, mostrar todos los periodos
            const periodos = obtenerTodosLosPeriodos();
            setPeriodosDisponibles(periodos);
            
            // Si hay periodos y no hay uno seleccionado, seleccionar el más reciente
            if (periodos.length > 0 && !periodoSeleccionado) {
                setPeriodoSeleccionado(periodos[0]);
            }
        } else if (userRole === "Profesor" && secciones.length > 0) {
            const periodos = obtenerPeriodosDelProfesor();
            setPeriodosDisponibles(periodos);
            
            // Si hay periodos y no hay uno seleccionado, seleccionar el más reciente
            if (periodos.length > 0 && !periodoSeleccionado) {
                setPeriodoSeleccionado(periodos[0]);
            }
        } else if (userRole === "Estudiante") {
            // Para estudiantes, obtener periodos asincrónicamente
            obtenerPeriodosDelEstudiante().then(periodos => {
                setPeriodosDisponibles(periodos);
                
                // Si hay periodos y no hay uno seleccionado, seleccionar el más reciente
                if (periodos.length > 0 && !periodoSeleccionado) {
                    setPeriodoSeleccionado(periodos[0]);
                }
            });
        }
    }, [secciones, userRole, periodoSeleccionado]);

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
        if (window.confirm(`¿Está seguro que desea eliminar la sección ${seccion.grupo} del curso ${seccion.cursoNombre}?`)) {
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
    };

    const handleGoHome = () => {
        navigate("/");
    };

    // Handler para ver detalles de una sección (para todos los roles que pueden acceder)
    const handleViewSeccion = (seccion) => {
        // Navegar a la página de detalles de la sección
        navigate(`/secciones/${seccion.seccionId}`);
    };

    // Handler para cambio de periodo (para todos los roles)
    const handlePeriodoChange = (nuevoPeriodo) => {
        setPeriodoSeleccionado(nuevoPeriodo);
    };

    // ✅ Handler para refrescar datos (ACTUALIZADO para incluir administrador)
    const handleRefreshSecciones = () => {
        if (userRole === "Administrador" || userRole === "Profesor") {
            fetchSecciones().then(() => {
                // ✅ Para administradores, actualizar todos los periodos disponibles
                if (userRole === "Administrador") {
                    const periodos = obtenerTodosLosPeriodos();
                    setPeriodosDisponibles(periodos);
                }
                // Para profesores, actualizar también los periodos disponibles
                else if (userRole === "Profesor") {
                    const periodos = obtenerPeriodosDelProfesor();
                    setPeriodosDisponibles(periodos);
                }
            });
        } else if (userRole === "Estudiante") {
            // Para estudiantes, refrescar periodos disponibles
            obtenerPeriodosDelEstudiante().then(periodos => {
                setPeriodosDisponibles(periodos);
            });
        }
    };

    // Componente de acceso denegado para roles no reconocidos
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
                                El acceso a <strong>Secciones</strong> está disponible para usuarios con rol de 
                                <strong className="text-green-400"> Administrador</strong> (gestión completa), 
                                <strong className="text-blue-400"> Profesor</strong> (sus secciones asignadas) o
                                <strong className="text-purple-400"> Estudiante</strong> (consulta de sus cursos). 
                                Tu rol actual es <strong className="text-yellow-400">{userRole}</strong>, 
                                por lo que no tienes acceso a esta funcionalidad.
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

    // ✅ Componente para vista de administrador (ACTUALIZADO con filtro por periodo)
    const SeccionesAdminContent = () => {
        // ✅ Filtrar secciones por periodo seleccionado
        const seccionesFiltradas = periodoSeleccionado 
            ? secciones.filter(seccion => seccion.periodo === periodoSeleccionado)
            : secciones;

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

                    {/* ✅ Header de la página - ACTUALIZADO con selector de periodo */}
                    <SeccionHeader 
                        onCreateSeccion={handleCreateSeccion}
                        onRefresh={handleRefreshSecciones}
                        loading={loading}
                        periodosDisponibles={periodosDisponibles}
                        periodoSeleccionado={periodoSeleccionado}
                        onPeriodoChange={handlePeriodoChange}
                        userRole={userRole}
                    />

                    {/* ✅ Estadísticas - usando secciones filtradas */}
                    <SeccionStatsCards 
                        secciones={seccionesFiltradas}
                        loading={loading}
                    />

                    {/* ✅ Tabla de secciones - usando secciones filtradas */}
                    <SeccionesTable 
                        secciones={seccionesFiltradas}
                        loading={loading}
                        searchTerm={searchTerm}
                        onSearchChange={handleSearch}
                        onEditSeccion={handleEditSeccion}
                        onDeleteSeccion={handleDeleteSeccion}
                        onViewSeccion={handleViewSeccion}
                        userRole={userRole}
                    />

                    {/* Modal de creación/edición */}
                    <CreateSeccionModal
                        isOpen={isModalOpen}
                        onClose={handleCloseModal}
                        onSuccess={handleCreateSuccess}
                        seccionToEdit={seccionToEdit}
                        createSeccion={createSeccion}
                        updateSeccion={updateSeccion}
                        profesores={profesores}
                        cursos={cursos}
                    />
                </main>
            </div>
        );
    };

    // Componente para vista de profesor (solo sus secciones con selección de periodo)
    const SeccionesProfesorContent = () => (
        <div className='flex-1 overflow-auto relative z-10 bg-gray-900'>
            <Header title="Mis Secciones" />
            
            <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
                {/* Mensajes de alerta */}
                <SeccionAlertMessages 
                    successMessage={successMessage}
                    errorMessage={error}
                    onClearSuccess={handleClearSuccess}
                    onRetry={handleRefreshSecciones}
                />

                {/* Vista específica para profesores con selección de periodo */}
                <SeccionesProfesorView 
                    secciones={secciones}
                    loading={loading}
                    onRefresh={handleRefreshSecciones}
                    onViewSeccion={handleViewSeccion}
                    periodosDisponibles={periodosDisponibles}
                    periodoSeleccionado={periodoSeleccionado}
                    onPeriodoChange={handlePeriodoChange}
                />
            </main>
        </div>
    );

    // Componente para vista de estudiante (solo lectura de sus secciones)
    const SeccionesEstudianteContent = () => (
        <div className='flex-1 overflow-auto relative z-10 bg-gray-900'>
            <Header title="Mis Cursos" />
            
            <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
                {/* Mensajes de alerta */}
                <SeccionAlertMessages 
                    successMessage={successMessage}
                    errorMessage={error}
                    onClearSuccess={handleClearSuccess}
                    onRetry={handleRefreshSecciones}
                />

                {/* Vista específica para estudiantes */}
                <SeccionesEstudianteView 
                    loading={loading}
                    onRefresh={handleRefreshSecciones}
                    periodosDisponibles={periodosDisponibles}
                    periodoSeleccionado={periodoSeleccionado}
                    onPeriodoChange={handlePeriodoChange}
                />
            </main>
        </div>
    );

    // Renderizado condicional basado en el estado de carga y rol
    if (roleLoading) {
        return <LoadingContent />;
    }

    // Decidir qué contenido mostrar según el rol
    if (userRole === "Administrador") {
        return <SeccionesAdminContent />;
    } else if (userRole === "Profesor") {
        return <SeccionesProfesorContent />;
    } else if (userRole === "Estudiante") {
        return <SeccionesEstudianteContent />;
    } else {
        // Para roles no reconocidos
        return <AccessDeniedContent />;
    }
};

export default SeccionesPage;