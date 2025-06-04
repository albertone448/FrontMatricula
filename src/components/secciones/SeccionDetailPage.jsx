import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
    ArrowLeft, 
    BookOpen, 
    User, 
    Users, 
    Calendar, 
    Clock, 
    GraduationCap,
    RefreshCw,
    Mail,
    Target,
    CheckCircle,
    AlertCircle
} from "lucide-react";
import Header from "../common/Header";
import { useSecciones } from "../../hooks/useSecciones";
import { useEvaluaciones } from "../../hooks/useEvaluaciones";
import { useUserRole } from "../../contexts/UserRoleContext";
import { authUtils } from "../../utils/authUtils";
import EvaluacionesList from "./EvaluacionesList";
import CrearEvaluacionModal from "./CrearEvaluacionModal";
import EditarEvaluacionModal from "./EditarEvaluacionModal";

const InfoCard = ({ icon: Icon, title, value, color = "text-blue-400", subtitle = null }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
    >
        <div className="flex items-center">
            <div className={`p-3 ${color.replace('text-', 'bg-').replace('400', '500')} bg-opacity-20 rounded-lg`}>
                <Icon className={`w-6 h-6 ${color}`} />
            </div>
            <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-400">{title}</p>
                <p className="text-xl font-bold text-gray-100">{value || 'No asignado'}</p>
                {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
            </div>
        </div>
    </motion.div>
);

const SeccionDetailPage = () => {
    const { seccionId } = useParams();
    const navigate = useNavigate();
    const { userRole } = useUserRole();
    const { getSeccionById } = useSecciones();
    const [seccion, setSeccion] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [activeTab, setActiveTab] = useState("info"); // "info" o "evaluaciones"
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [evaluacionToEdit, setEvaluacionToEdit] = useState(null);

    // Hook de evaluaciones
    const {
        evaluaciones,
        loading: evaluacionesLoading,
        error: evaluacionesError,
        tiposEvaluacion,
        fetchEvaluaciones,
        createEvaluacion,
        updateEvaluacion,
        deleteEvaluacion,
        calcularPorcentajeTotal,
        validarPorcentaje,
        contarTipoEvaluacion
    } = useEvaluaciones();

    // Verificar permisos para gestionar evaluaciones
    const canManageEvaluaciones = () => {
        if (userRole === "Administrador") return true;
        if (userRole === "Profesor" && seccion) {
            const userId = authUtils.getUserId();
            return seccion.usuarioId === userId;
        }
        return false;
    };

    useEffect(() => {
        const fetchSeccionDetail = async () => {
            try {
                setLoading(true);
                setError("");
                const seccionData = await getSeccionById(parseInt(seccionId));
                setSeccion(seccionData);
                
                // Cargar evaluaciones después de cargar la sección
                await fetchEvaluaciones(parseInt(seccionId));
            } catch (error) {
                console.error("Error al cargar detalles de la sección:", error);
                setError("Error al cargar los detalles de la sección");
            } finally {
                setLoading(false);
            }
        };

        if (seccionId) {
            fetchSeccionDetail();
        }
    }, [seccionId, getSeccionById, fetchEvaluaciones]);

    const handleGoBack = () => {
        navigate("/secciones");
    };

    const handleRefresh = async () => {
        if (seccionId) {
            try {
                setLoading(true);
                const seccionData = await getSeccionById(parseInt(seccionId));
                setSeccion(seccionData);
                await fetchEvaluaciones(parseInt(seccionId));
            } catch (error) {
                setError("Error al actualizar los datos");
            } finally {
                setLoading(false);
            }
        }
    };

    const handleAgregarEvaluacion = () => {
        setIsCreateModalOpen(true);
    };

    const handleEditarEvaluacion = (evaluacion) => {
        setEvaluacionToEdit(evaluacion);
        setIsEditModalOpen(true);
    };

    const handleEliminarEvaluacion = async (evaluacionId) => {
        try {
            await deleteEvaluacion(evaluacionId);
            setSuccessMessage("Evaluación eliminada exitosamente");
            setTimeout(() => setSuccessMessage(""), 5000);
        } catch (error) {
            console.error("Error al eliminar evaluación:", error);
            // El error ya se maneja en el hook, pero podemos mostrar un mensaje adicional si es necesario
        }
    };

    const handleCloseCreateModal = () => {
        setIsCreateModalOpen(false);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setEvaluacionToEdit(null);
    };

    const handleEvaluacionSuccess = (message) => {
        setSuccessMessage(message);
        setTimeout(() => setSuccessMessage(""), 5000);
        setIsCreateModalOpen(false);
        setIsEditModalOpen(false);
        setEvaluacionToEdit(null);
    };

    const formatHorario = (horario) => {
        if (!horario) return "No asignado";
        return `${horario.dia} ${horario.horaInicio?.slice(0, 5)} - ${horario.horaFin?.slice(0, 5)}`;
    };

    const porcentajeTotal = calcularPorcentajeTotal(evaluaciones);

    if (loading && !seccion) {
        return (
            <div className='flex-1 overflow-auto relative z-10'>
                <Header title="Cargando Sección..." />
                <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
                    <div className="flex justify-center items-center h-96">
                        <div className="text-center">
                            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-gray-400 text-lg">Cargando detalles de la sección...</p>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    if (error && !seccion) {
        return (
            <div className='flex-1 overflow-auto relative z-10'>
                <Header title="Error" />
                <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
                    <div className="text-center py-12">
                        <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-400 px-6 py-4 rounded-lg inline-block">
                            <p className="font-medium">Error al cargar la sección</p>
                            <p className="text-sm opacity-75 mt-1">{error}</p>
                        </div>
                        <button
                            onClick={handleGoBack}
                            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-200"
                        >
                            Volver a Secciones
                        </button>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className='flex-1 overflow-auto relative z-10'>
            <Header title={`Sección ${seccion?.grupo}`} />
            
            <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
                {/* Mensaje de éxito */}
                <AnimatePresence>
                    {successMessage && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="bg-green-500 bg-opacity-20 border border-green-500 text-green-400 px-4 py-3 rounded-lg text-sm flex items-center mb-6"
                        >
                            <CheckCircle className="w-5 h-5 mr-2" />
                            <div className="flex-1">{successMessage}</div>
                            <button
                                onClick={() => setSuccessMessage("")}
                                className="ml-2 text-green-300 hover:text-green-200 transition-colors duration-200"
                            >
                                <span className="text-xl">&times;</span>
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Mensaje de error de evaluaciones */}
                <AnimatePresence>
                    {evaluacionesError && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="bg-red-500 bg-opacity-20 border border-red-500 text-red-400 px-4 py-3 rounded-lg text-sm flex items-center mb-6"
                        >
                            <AlertCircle className="w-5 h-5 mr-2" />
                            <div className="flex-1">
                                <p className="font-medium">Error al gestionar evaluaciones</p>
                                <p className="text-xs opacity-75 mt-1">{evaluacionesError}</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Navegación */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between mb-8"
                >
                    <button
                        onClick={handleGoBack}
                        className="flex items-center text-gray-400 hover:text-gray-300 transition duration-200"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Volver a Secciones
                    </button>
                    
                    <button
                        onClick={handleRefresh}
                        disabled={loading}
                        className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-800 text-white font-medium py-2 px-4 rounded-lg transition duration-200 flex items-center"
                    >
                        <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                        Actualizar
                    </button>
                </motion.div>

                {/* Header de la sección */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-8 border border-gray-700 mb-8"
                >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex items-center mb-6 lg:mb-0">
                            <div className="p-4 bg-blue-600 rounded-full mr-6">
                                <BookOpen className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-100 mb-2">
                                    {seccion?.codigoCurso} - {seccion?.grupo}
                                </h1>
                                <p className="text-xl text-gray-400 mb-1">{seccion?.cursoNombre}</p>
                                <div className="flex items-center text-sm text-gray-500">
                                    <Calendar className="w-4 h-4 mr-1" />
                                    <span>Periodo {seccion?.periodo}</span>
                                    <span className="mx-2">•</span>
                                    <span>ID: {seccion?.seccionId}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-400">{seccion?.cuposMax || 0}</div>
                                <div className="text-sm text-gray-400">Cupos Máximos</div>
                            </div>
                            <div className="w-px h-12 bg-gray-700"></div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-green-400">0</div>
                                <div className="text-sm text-gray-400">Inscritos</div>
                            </div>
                            <div className="w-px h-12 bg-gray-700"></div>
                            <div className="text-center">
                                <div className={`text-2xl font-bold ${
                                    porcentajeTotal === 100 ? "text-green-400" :
                                    porcentajeTotal > 100 ? "text-red-400" : "text-yellow-400"
                                }`}>
                                    {porcentajeTotal}%
                                </div>
                                <div className="text-sm text-gray-400">Evaluaciones</div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Tabs de navegación */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-8"
                >
                    <div className="flex space-x-1 bg-gray-800 bg-opacity-50 p-1 rounded-lg">
                        <button
                            onClick={() => setActiveTab("info")}
                            className={`flex-1 py-3 px-6 rounded-lg font-medium transition duration-200 flex items-center justify-center ${
                                activeTab === "info"
                                    ? "bg-blue-600 text-white"
                                    : "text-gray-400 hover:text-gray-300 hover:bg-gray-700"
                            }`}
                        >
                            <BookOpen className="w-5 h-5 mr-2" />
                            Información General
                        </button>
                        <button
                            onClick={() => setActiveTab("evaluaciones")}
                            className={`flex-1 py-3 px-6 rounded-lg font-medium transition duration-200 flex items-center justify-center ${
                                activeTab === "evaluaciones"
                                    ? "bg-blue-600 text-white"
                                    : "text-gray-400 hover:text-gray-300 hover:bg-gray-700"
                            }`}
                        >
                            <Target className="w-5 h-5 mr-2" />
                            Evaluaciones
                            {evaluaciones.length > 0 && (
                                <span className="ml-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                                    {evaluaciones.length}
                                </span>
                            )}
                        </button>
                    </div>
                </motion.div>

                {/* Contenido según el tab activo */}
                <AnimatePresence mode="wait">
                    {activeTab === "info" && (
                        <motion.div
                            key="info"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-8"
                        >
                            {/* Información general */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <InfoCard
                                    icon={User}
                                    title="Profesor Asignado"
                                    value={seccion?.profesorNombre}
                                    color="text-green-400"
                                    subtitle={seccion?.profesor?.correo}
                                />
                                
                                <InfoCard
                                    icon={Clock}
                                    title="Horario"
                                    value={formatHorario(seccion?.horario)}
                                    color="text-orange-400"
                                    subtitle={seccion?.horario ? "Aula por confirmar" : null}
                                />
                                
                                <InfoCard
                                    icon={GraduationCap}
                                    title="Carrera"
                                    value={seccion?.carrera}
                                    color="text-purple-400"
                                />
                            </div>

                            {/* Información del curso */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
                            >
                                <h2 className="text-xl font-bold text-gray-100 mb-4 flex items-center">
                                    <BookOpen className="w-5 h-5 mr-2 text-blue-400" />
                                    Información del Curso
                                </h2>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-400 mb-2">Código del Curso</h3>
                                        <p className="text-lg text-gray-100">{seccion?.codigoCurso}</p>
                                    </div>
                                    
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-400 mb-2">Nombre del Curso</h3>
                                        <p className="text-lg text-gray-100">{seccion?.cursoNombre}</p>
                                    </div>
                                    
                                    {seccion?.curso?.creditos && (
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-400 mb-2">Créditos</h3>
                                            <p className="text-lg text-gray-100">{seccion.curso.creditos}</p>
                                        </div>
                                    )}
                                    
                                    {seccion?.curso?.descripcion && (
                                        <div className="md:col-span-2">
                                            <h3 className="text-sm font-medium text-gray-400 mb-2">Descripción</h3>
                                            <p className="text-gray-300">{seccion.curso.descripcion}</p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>

                            {/* Información del profesor */}
                            {seccion?.profesor && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
                                >
                                    <h2 className="text-xl font-bold text-gray-100 mb-4 flex items-center">
                                        <User className="w-5 h-5 mr-2 text-green-400" />
                                        Información del Profesor
                                    </h2>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-400 mb-2">Nombre Completo</h3>
                                            <p className="text-lg text-gray-100">
                                                {seccion.profesor.nombre} {seccion.profesor.apellido1} {seccion.profesor.apellido2}
                                            </p>
                                        </div>
                                        
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-400 mb-2">Correo Electrónico</h3>
                                            <p className="text-lg text-gray-100 flex items-center">
                                                <Mail className="w-4 h-4 mr-2" />
                                                {seccion.profesor.correo}
                                            </p>
                                        </div>
                                        
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-400 mb-2">Identificación</h3>
                                            <p className="text-lg text-gray-100">{seccion.profesor.identificacion}</p>
                                        </div>
                                        
                                        {seccion.profesor.carrera && (
                                            <div>
                                                <h3 className="text-sm font-medium text-gray-400 mb-2">Especialidad</h3>
                                                <p className="text-lg text-gray-100">{seccion.profesor.carrera}</p>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}

                            {/* Acciones adicionales */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
                            >
                                <h2 className="text-xl font-bold text-gray-100 mb-4">Acciones Disponibles</h2>
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center">
                                        <Users className="w-5 h-5 mr-2" />
                                        Ver Estudiantes
                                    </button>
                                    
                                    <button className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center">
                                        <Calendar className="w-5 h-5 mr-2" />
                                        Gestionar Asistencia
                                    </button>
                                    
                                    <button className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center">
                                        <BookOpen className="w-5 h-5 mr-2" />
                                        Material del Curso
                                    </button>
                                </div>
                                
                                <div className="mt-4 p-4 bg-blue-900 bg-opacity-30 border border-blue-700 rounded-lg">
                                    <p className="text-blue-300 text-sm">
                                        <strong>Nota:</strong> Estas funcionalidades estarán disponibles en futuras actualizaciones del sistema.
                                    </p>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}

                    {activeTab === "evaluaciones" && (
                        <motion.div
                            key="evaluaciones"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <EvaluacionesList
                                evaluaciones={evaluaciones}
                                loading={evaluacionesLoading}
                                porcentajeTotal={porcentajeTotal}
                                onAgregarEvaluacion={handleAgregarEvaluacion}
                                onEditarEvaluacion={handleEditarEvaluacion}
                                onEliminarEvaluacion={handleEliminarEvaluacion}
                                canManageEvaluaciones={canManageEvaluaciones()}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Modal para crear evaluación */}
                <CrearEvaluacionModal
                    isOpen={isCreateModalOpen}
                    onClose={handleCloseCreateModal}
                    onSuccess={handleEvaluacionSuccess}
                    seccionId={seccionId}
                    tiposEvaluacion={tiposEvaluacion}
                    evaluacionesExistentes={evaluaciones}
                    validarPorcentaje={validarPorcentaje}
                    contarTipoEvaluacion={contarTipoEvaluacion}
                    createEvaluacion={createEvaluacion}
                />

                {/* Modal para editar evaluación */}
                <EditarEvaluacionModal
                    isOpen={isEditModalOpen}
                    onClose={handleCloseEditModal}
                    onSuccess={handleEvaluacionSuccess}
                    evaluacionToEdit={evaluacionToEdit}
                    tiposEvaluacion={tiposEvaluacion}
                    evaluacionesExistentes={evaluaciones}
                    validarPorcentaje={validarPorcentaje}
                    updateEvaluacion={updateEvaluacion}
                />
            </main>
        </div>
    );
};

export default SeccionDetailPage;