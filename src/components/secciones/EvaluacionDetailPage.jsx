import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
    ArrowLeft, 
    Target, 
    Users, 
    BookOpen,
    RefreshCw,
    User,
    Mail,
    CreditCard,
    Save,
    CheckCircle,
    AlertCircle,
    Percent,
    Shield
} from "lucide-react";
import Header from "../common/Header";
import { useEvaluaciones } from "../../hooks/useEvaluaciones";
import { useNotas } from "../../hooks/useNotas";
import { useSecciones } from "../../hooks/useSecciones";
import { useUserRole } from "../../contexts/UserRoleContext";
import { authUtils } from "../../utils/authUtils";

const EstudianteNotaCard = ({ estudiante, evaluacion, onSaveNota, loading, userRole }) => {
    const [nota, setNota] = useState(estudiante.nota?.total || "");
    const [saving, setSaving] = useState(false);
    const [localError, setLocalError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    // Actualizar nota cuando cambie el estudiante
    useEffect(() => {
        setNota(estudiante.nota?.total || "");
        setLocalError("");
        setSuccessMessage("");
    }, [estudiante.nota]);

    const handleNotaChange = (value) => {
        // Solo permitir números decimales de 0 a 100
        const numericValue = value.replace(/[^0-9.]/g, "");
        
        // Evitar múltiples puntos decimales
        const parts = numericValue.split('.');
        if (parts.length > 2) {
            return;
        }
        
        // Limitar a 2 decimales
        if (parts[1] && parts[1].length > 2) {
            return;
        }
        
        const finalValue = parseFloat(numericValue);
        if (numericValue === "" || (finalValue >= 0 && finalValue <= 100)) {
            setNota(numericValue);
            setLocalError("");
        }
    };

    const handleSaveNota = async () => {
        if (!nota || nota === "") {
            setLocalError("La nota es requerida");
            return;
        }

        const notaNumber = parseFloat(nota);
        if (isNaN(notaNumber) || notaNumber < 0 || notaNumber > 100) {
            setLocalError("La nota debe ser un número entre 0 y 100");
            return;
        }

        setSaving(true);
        setLocalError("");
        setSuccessMessage("");

        try {
            // Usar la nueva función saveNota que maneja crear/actualizar automáticamente
            const notaData = {
                notaId: estudiante.nota?.notaId || 0, // 0 si es nueva nota
                evaluacionId: evaluacion.evaluacionId,
                inscripcionId: estudiante.inscripcionId,
                total: notaNumber
            };

            const result = await onSaveNota(notaData);
            
            // Mostrar mensaje personalizado basado en si fue creación o actualización
            const mensaje = result.isNew 
                ? "Nota creada exitosamente" 
                : "Nota actualizada exitosamente";
            
            setSuccessMessage(mensaje);
            setTimeout(() => setSuccessMessage(""), 3000);
            
        } catch (error) {
            console.error('❌ Error al guardar nota:', error);
            setLocalError(error.message || "Error al guardar la nota");
        } finally {
            setSaving(false);
        }
    };

    // Determinar si hay cambios
    const hasChanges = estudiante.nota?.total !== parseFloat(nota) || (!estudiante.nota && nota !== "");

    // Determinar el tipo de operación que se realizará
    const isNewNota = !estudiante.nota?.notaId || estudiante.nota.notaId === 0;
    const operationText = isNewNota ? "Crear" : "Actualizar";

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
        >
            {/* Información del estudiante */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center flex-1">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                        {estudiante.usuario.nombre.charAt(0)}{estudiante.usuario.apellido1.charAt(0)}
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-100">
                            {estudiante.nombreCompleto}
                        </h3>
                        <div className="flex items-center text-sm text-gray-400 mt-1">
                            <CreditCard className="w-4 h-4 mr-1" />
                            <span>{estudiante.identificacion}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-400 mt-1">
                            <Mail className="w-4 h-4 mr-1" />
                            <span>{estudiante.correo}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Campo de nota */}
            <div className="space-y-3">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Nota ({evaluacion.porcentaje}% del total)
                    </label>
                    <div className="flex items-center space-x-3">
                        <div className="relative flex-1">
                            <input
                                type="text"
                                value={nota}
                                onChange={(e) => handleNotaChange(e.target.value)}
                                placeholder="0.00"
                                disabled={loading || saving}
                                className="w-full px-3 py-2 pr-8 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                <span className="text-gray-400 text-sm">/100</span>
                            </div>
                        </div>
                        
                        <motion.button
                            onClick={handleSaveNota}
                            disabled={loading || saving || !hasChanges || !nota}
                            whileHover={{ scale: saving ? 1 : 1.02 }}
                            whileTap={{ scale: saving ? 1 : 0.98 }}
                            className={`font-medium py-2 px-4 rounded-lg transition duration-200 flex items-center min-w-[120px] justify-center ${
                                isNewNota 
                                    ? "bg-green-600 hover:bg-green-700 disabled:bg-gray-600" 
                                    : "bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600"
                            } disabled:cursor-not-allowed text-white`}
                            title={isNewNota ? "Crear nueva nota" : "Actualizar nota existente"}
                        >
                            {saving ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <>
                                    <Save className="w-4 h-4 mr-2" />
                                    {operationText}
                                </>
                            )}
                        </motion.button>
                    </div>
                    
                    {/* Mensaje de estado */}
                    <AnimatePresence>
                        {successMessage && (
                            <motion.p
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="text-green-400 text-sm mt-2 flex items-center"
                            >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                {successMessage}
                            </motion.p>
                        )}
                        
                        {localError && (
                            <motion.p
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="text-red-400 text-sm mt-2 flex items-center"
                            >
                                <AlertCircle className="w-4 h-4 mr-1" />
                                {localError}
                            </motion.p>
                        )}
                    </AnimatePresence>
                    
                    <p className="text-xs text-gray-500 mt-1">
                        Ingresa una nota entre 0 y 100 puntos
                    </p>
                </div>
                
                {/* Estado de la nota */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-700">
                    <div className="text-sm text-gray-400">
                        Estado: {estudiante.nota ? (
                            <span className="text-green-400">Con nota asignada</span>
                        ) : (
                            <span className="text-yellow-400">Sin nota asignada</span>
                        )}
                    </div>
                    
                    {hasChanges && (
                        <div className="text-xs text-blue-400">
                            • Cambios sin guardar
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

const EvaluacionDetailPage = () => {
    const { seccionId, evaluacionId } = useParams();
    const navigate = useNavigate();
    const { userRole } = useUserRole();
    const { getSeccionById } = useSecciones();
    const { fetchEvaluaciones } = useEvaluaciones();
    const { fetchEstudiantesConNotas, saveNota } = useNotas();
    
    const [seccion, setSeccion] = useState(null);
    const [evaluacion, setEvaluacion] = useState(null);
    const [estudiantes, setEstudiantes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    // ✅ Verificar permisos - ACTUALIZADO para incluir administradores
    const canManageNotas = () => {
        if (userRole === "Administrador") {
            return true;
        }
        if (userRole === "Profesor" && seccion) {
            const userId = authUtils.getUserId();
            const hasAccess = seccion.usuarioId === userId;
            return hasAccess;
        }
        return false;
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError("");

                // 1. Obtener información de la sección
                const seccionData = await getSeccionById(parseInt(seccionId));
                setSeccion(seccionData);

                // 2. Obtener información de las evaluaciones de la sección
                const evaluacionesData = await fetchEvaluaciones(parseInt(seccionId));
                
                const evaluacionData = evaluacionesData.find(e => e.evaluacionId === parseInt(evaluacionId));
                
                if (!evaluacionData) {
                    throw new Error("Evaluación no encontrada");
                }
                setEvaluacion(evaluacionData);

                // 3. Obtener estudiantes con sus notas
                const estudiantesData = await fetchEstudiantesConNotas(parseInt(seccionId), parseInt(evaluacionId));
                setEstudiantes(estudiantesData);

            } catch (error) {
                console.error("❌ Error al cargar datos:", error);
                setError(error.message || "Error al cargar los datos");
            } finally {
                setLoading(false);
            }
        };

        if (seccionId && evaluacionId) {
            fetchData();
        }
    }, [seccionId, evaluacionId, getSeccionById, fetchEvaluaciones, fetchEstudiantesConNotas, userRole]);

    const handleGoBack = () => {
        navigate(`/secciones/${seccionId}`);
    };

    const handleRefresh = async () => {
        if (seccionId && evaluacionId) {
            try {
                setLoading(true);
                const estudiantesData = await fetchEstudiantesConNotas(parseInt(seccionId), parseInt(evaluacionId));
                setEstudiantes(estudiantesData);
            } catch (error) {
                setError("Error al actualizar los datos");
            } finally {
                setLoading(false);
            }
        }
    };

    // ✅ Nueva función que maneja tanto crear como actualizar notas
    const handleSaveNota = async (notaData) => {
        try {
            // Pasar seccionId y evaluacionId para poder refrescar después de crear
            const result = await saveNota(notaData, parseInt(seccionId), parseInt(evaluacionId));
            
            // Actualizar el estudiante en el estado local con el ID real
            setEstudiantes(prev => prev.map(est => 
                est.inscripcionId === notaData.inscripcionId 
                    ? {
                        ...est,
                        nota: {
                            notaId: result.notaId, // Usar el ID real devuelto por la API
                            evaluacionId: result.evaluacionId,
                            inscripcionId: result.inscripcionId,
                            total: result.total
                        }
                    }
                    : est
            ));

            const operacion = result.isNew ? "creada" : "actualizada";
            setSuccessMessage(`Nota ${operacion} exitosamente por ${userRole}`);
            setTimeout(() => setSuccessMessage(""), 3000);
            
            return result;
        } catch (error) {
            console.error('❌ Error en handleSaveNota:', error);
            throw error;
        }
    };

    // ✅ Verificar acceso antes de mostrar contenido
    if (!loading && !canManageNotas()) {
        return (
            <div className='flex-1 overflow-auto relative z-10'>
                <Header title="Acceso Denegado" />
                <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-12"
                    >
                        <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-400 px-6 py-8 rounded-lg inline-block">
                            <Shield className="w-12 h-12 mx-auto mb-4" />
                            <p className="font-medium text-lg mb-2">No tienes permisos para gestionar notas de esta evaluación</p>
                            <p className="text-sm opacity-75">
                                Solo el profesor asignado y los administradores pueden gestionar las notas de las evaluaciones.
                            </p>
                            <div className="mt-4 p-3 bg-gray-800 rounded-lg">
                                <p className="text-xs text-gray-300">
                                    <strong>Tu rol:</strong> {userRole} | 
                                    <strong> Sección:</strong> {seccion?.grupo} | 
                                    <strong> Profesor:</strong> {seccion?.profesorNombre}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleGoBack}
                            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition duration-200"
                        >
                            Volver a la Sección
                        </button>
                    </motion.div>
                </main>
            </div>
        );
    }

    if (loading) {
        return (
            <div className='flex-1 overflow-auto relative z-10'>
                <Header title="Cargando..." />
                <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
                    <div className="flex justify-center items-center h-96">
                        <div className="text-center">
                            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-gray-400 text-lg">Cargando evaluación y estudiantes...</p>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    if (error) {
        return (
            <div className='flex-1 overflow-auto relative z-10'>
                <Header title="Error" />
                <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
                    <div className="text-center py-12">
                        <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-400 px-6 py-4 rounded-lg inline-block">
                            <p className="font-medium">Error al cargar la evaluación</p>
                            <p className="text-sm opacity-75 mt-1">{error}</p>
                        </div>
                        <button
                            onClick={handleGoBack}
                            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-200"
                        >
                            Volver a la Sección
                        </button>
                    </div>
                </main>
            </div>
        );
    }

    const estadisticas = {
        totalEstudiantes: estudiantes.length,
        conNota: estudiantes.filter(e => e.nota).length,
        sinNota: estudiantes.filter(e => !e.nota).length,
        promedio: estudiantes.filter(e => e.nota).length > 0 
            ? (estudiantes.filter(e => e.nota).reduce((sum, e) => sum + e.nota.total, 0) / estudiantes.filter(e => e.nota).length).toFixed(2)
            : "N/A"
    };

    return (
        <div className='flex-1 overflow-auto relative z-10'>
            <Header title={`${evaluacion?.tipoNombre} - Notas`} />
            
            <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
                {/* ✅ Indicador de rol para administradores */}
                {userRole === "Administrador" && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-500 bg-opacity-20 border border-red-500 text-red-400 px-4 py-2 rounded-lg text-sm flex items-center mb-6"
                    >
                        <Shield className="w-4 h-4 mr-2" />
                        <span className="font-medium">Vista de Administrador:</span>
                        <span className="ml-1">Puedes gestionar las notas de todos los estudiantes en esta evaluación.</span>
                    </motion.div>
                )}

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
                        Volver a la Sección
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

                {/* Header de la evaluación */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-8 border border-gray-700 mb-8"
                >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex items-center mb-6 lg:mb-0">
                            <div className="p-4 bg-purple-600 rounded-full mr-6">
                                <Target className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-100 mb-2">
                                    {evaluacion?.tipoNombre}
                                </h1>
                                <p className="text-xl text-gray-400 mb-1">{seccion?.codigoCurso} - {seccion?.grupo}</p>
                                <div className="flex items-center text-sm text-gray-500">
                                    <BookOpen className="w-4 h-4 mr-1" />
                                    <span>{seccion?.cursoNombre}</span>
                                    <span className="mx-2">•</span>
                                    <Percent className="w-4 h-4 mr-1" />
                                    <span>{evaluacion?.porcentaje}% del total</span>
                                    {userRole === "Administrador" && (
                                        <>
                                            <span className="mx-2">•</span>
                                            <Shield className="w-4 h-4 mr-1 text-red-400" />
                                            <span className="text-red-400">Admin</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                        
                        {/* Estadísticas */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-400">{estadisticas.totalEstudiantes}</div>
                                <div className="text-sm text-gray-400">Total Estudiantes</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-green-400">{estadisticas.conNota}</div>
                                <div className="text-sm text-gray-400">Con Nota</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-yellow-400">{estadisticas.sinNota}</div>
                                <div className="text-sm text-gray-400">Sin Nota</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-purple-400">{estadisticas.promedio}</div>
                                <div className="text-sm text-gray-400">Promedio</div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Lista de estudiantes */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-6"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-100 mb-2 flex items-center">
                                <Users className="w-6 h-6 mr-2 text-blue-400" />
                                Estudiantes Inscritos
                            </h2>
                            <p className="text-gray-400">
                                Gestiona las notas de los {estudiantes.length} estudiantes inscritos en esta evaluación
                                {userRole === "Administrador" && (
                                    <span className="text-red-400 ml-2">(Vista de Administrador)</span>
                                )}
                            </p>
                        </div>
                    </div>

                    {estudiantes.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-12 border border-gray-700 text-center"
                        >
                            <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-gray-100 mb-2">
                                No hay estudiantes inscritos
                            </h3>
                            <p className="text-gray-400">
                                Esta sección no tiene estudiantes inscritos en este momento.
                            </p>
                        </motion.div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                            {estudiantes.map((estudiante, index) => (
                                <motion.div
                                    key={estudiante.inscripcionId}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <EstudianteNotaCard
                                        estudiante={estudiante}
                                        evaluacion={evaluacion}
                                        onSaveNota={handleSaveNota}
                                        loading={loading}
                                        userRole={userRole}
                                    />
                                </motion.div>
                            ))}
                        </div>
                    )}

                    {/* Información adicional */}
                    {estudiantes.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="bg-blue-900 bg-opacity-30 border border-blue-700 rounded-lg p-6"
                        >
                            <h4 className="text-blue-300 font-semibold mb-3">Información sobre las notas:</h4>
                            <div className="text-blue-200 text-sm space-y-2">
                                <p>• Las notas deben estar entre 0 y 100 puntos.</p>
                                <p>• Esta evaluación vale {evaluacion?.porcentaje}% de la nota final del curso.</p>
                                <p>• Los cambios se guardan individualmente para cada estudiante.</p>
                                <p>• Regresa a la sección principal para ver el resumen consolidado de todas las evaluaciones.</p>
                                {userRole === "Administrador" && (
                                    <p className="text-red-300">
                                        • <strong>Administrador:</strong> Tienes acceso completo para gestionar todas las notas de esta evaluación.
                                    </p>
                                )}
                                {estadisticas.sinNota > 0 && (
                                    <p className="text-yellow-300">
                                        ⚠️ {estadisticas.sinNota} estudiante{estadisticas.sinNota > 1 ? 's' : ''} aún no tiene{estadisticas.sinNota > 1 ? 'n' : ''} nota asignada.
                                    </p>
                                )}
                            </div>
                        </motion.div>
                    )}
                </motion.div>
            </main>
        </div>
    );
};

export default EvaluacionDetailPage;
