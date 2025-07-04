import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
    ClipboardList, 
    Plus, 
    BookOpen, 
    Target, 
    TrendingUp,
    AlertCircle,
    CheckCircle,
    Edit,
    Trash2,
    MoreVertical,
    Users,
    Eye,
    Calculator
} from "lucide-react";
import { useState } from "react";

const EvaluacionCard = ({ evaluacion, index, onEdit, onDelete, onViewNotas, canManageEvaluaciones, seccionId }) => {
    const [showMenu, setShowMenu] = useState(false);

    // Función para obtener el color basado en el tipo de evaluación
    const getTipoColor = (tipEvaluacionId) => {
        const colores = {
            1: "text-red-400 bg-red-500", // Examen Parcial
            2: "text-red-600 bg-red-600", // Examen Final  
            3: "text-blue-400 bg-blue-500", // Tarea
            4: "text-purple-400 bg-purple-500", // Proyecto
            5: "text-green-400 bg-green-500", // Quiz
            6: "text-yellow-400 bg-yellow-500", // Participación
            7: "text-orange-400 bg-orange-500", // Laboratorio
            8: "text-pink-400 bg-pink-500" // Presentación
        };
        return colores[tipEvaluacionId] || "text-gray-400 bg-gray-500";
    };

    const colorClass = getTipoColor(evaluacion.tipEvaluacionId);
    
    const handleEdit = () => {
        setShowMenu(false);
        onEdit(evaluacion);
    };

    const handleDelete = () => {
        setShowMenu(false);
        if (window.confirm(`¿Estás seguro de que deseas eliminar esta evaluación de ${evaluacion.tipoNombre}?`)) {
            onDelete(evaluacion.evaluacionId);
        }
    };

    const handleViewNotas = () => {
        setShowMenu(false);
        onViewNotas(evaluacion);
    };
    
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
            className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-200 relative"
        >
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                    <div className={`p-3 ${colorClass.split(' ')[1]} bg-opacity-20 rounded-lg`}>
                        <ClipboardList className={`w-6 h-6 ${colorClass.split(' ')[0]}`} />
                    </div>
                    <div className="ml-4">
                        <h3 className="text-lg font-semibold text-gray-100">
                            {evaluacion.tipoNombre}
                        </h3>
                    </div>
                </div>
                <div className="flex items-center">
                    <div className="text-right mr-2">
                        <div className="text-2xl font-bold text-blue-400">
                            {evaluacion.porcentaje}%
                        </div>
                        <div className="text-xs text-gray-500">
                            del total
                        </div>
                    </div>
                    
                    {/* Menú de acciones */}
                    {canManageEvaluaciones && (
                        <div className="relative">
                            <button
                                onClick={() => setShowMenu(!showMenu)}
                                className="p-2 text-gray-400 hover:text-gray-300 rounded-lg hover:bg-gray-700 transition-colors duration-200"
                            >
                                <MoreVertical className="w-4 h-4" />
                            </button>
                            
                            {showMenu && (
                                <div className="absolute right-0 top-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-10 min-w-[140px]">
                                    <button
                                        onClick={handleViewNotas}
                                        className="w-full px-3 py-2 text-left text-green-400 hover:bg-gray-700 flex items-center text-sm"
                                    >
                                        <Users className="w-4 h-4 mr-2" />
                                        Ver Notas
                                    </button>
                                    <button
                                        onClick={handleEdit}
                                        className="w-full px-3 py-2 text-left text-blue-400 hover:bg-gray-700 flex items-center text-sm"
                                    >
                                        <Edit className="w-4 h-4 mr-2" />
                                        Editar
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        className="w-full px-3 py-2 text-left text-red-400 hover:bg-gray-700 flex items-center text-sm"
                                    >
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Eliminar
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Botón principal para ver notas */}
            {canManageEvaluaciones && (
                <div className="mt-4 pt-4 border-t border-gray-700">
                    <motion.button
                        onClick={handleViewNotas}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center"
                    >
                        <Users className="w-4 h-4 mr-2" />
                        Gestionar Notas
                    </motion.button>
                </div>
            )}

            
            {/* Overlay para cerrar el menú cuando se hace clic fuera */}
            {showMenu && (
                <div 
                    className="fixed inset-0 z-0" 
                    onClick={() => setShowMenu(false)}
                />
            )}
        </motion.div>
    );
};

const PorcentajeIndicator = ({ porcentajeTotal }) => {
    // Si es exactamente 100%, no mostrar el componente
    if (porcentajeTotal === 100) {
        return null;
    }

    const getIndicatorColor = () => {
        if (porcentajeTotal > 100) return "text-red-400 bg-red-500";
        if (porcentajeTotal >= 80) return "text-yellow-400 bg-yellow-500";
        return "text-blue-400 bg-blue-500";
    };

    const getIndicatorIcon = () => {
        if (porcentajeTotal > 100) return AlertCircle;
        return TrendingUp;
    };

    const colorClass = getIndicatorColor();
    const Icon = getIndicatorIcon();
    
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <div className={`p-3 ${colorClass.split(' ')[1]} bg-opacity-20 rounded-lg`}>
                        <Icon className={`w-6 h-6 ${colorClass.split(' ')[0]}`} />
                    </div>
                    <div className="ml-4">
                        <h3 className="text-lg font-semibold text-gray-100">
                            Porcentaje Total
                        </h3>
                        <p className="text-sm text-gray-400">
                            {porcentajeTotal > 100 ? "Excede el límite" : 
                             `Faltan ${100 - porcentajeTotal}%`}
                        </p>
                    </div>
                </div>
                <div className="text-right">
                    <div className={`text-3xl font-bold ${colorClass.split(' ')[0]}`}>
                        {porcentajeTotal}%
                    </div>
                    <div className="text-xs text-gray-500">
                        de 100%
                    </div>
                </div>
            </div>

            {/* Barra de progreso */}
            <div className="mt-4">
                <div className="w-full bg-gray-700 rounded-full h-3">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(porcentajeTotal, 100)}%` }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className={`h-3 rounded-full ${
                            porcentajeTotal > 100 ? "bg-red-500" :
                            porcentajeTotal >= 80 ? "bg-yellow-500" : "bg-blue-500"
                        }`}
                    />
                </div>
                {porcentajeTotal > 100 && (
                    <p className="text-xs text-red-400 mt-2">
                        ⚠️ El porcentaje total excede el 100%. Revisa las evaluaciones.
                    </p>
                )}
            </div>
        </motion.div>
    );
};

const EvaluacionesList = ({ 
    evaluaciones = [], 
    loading, 
    porcentajeTotal, 
    onAgregarEvaluacion,
    onEditarEvaluacion,
    onEliminarEvaluacion,
    onVerNotasCompletas, // ✅ Nueva prop para manejar ver notas completas
    canManageEvaluaciones = true,
    seccionId
}) => {
    const navigate = useNavigate();

    const handleViewNotas = (evaluacion) => {
        navigate(`/secciones/${seccionId}/evaluaciones/${evaluacion.evaluacionId}`);
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-8 border border-gray-700">
                    <div className="flex justify-center items-center">
                        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        <span className="ml-3 text-gray-400">Cargando evaluaciones...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-100 mb-2 flex items-center">
                        <Target className="w-6 h-6 mr-2 text-blue-400" />
                        Evaluaciones del Curso
                    </h2>
                    <p className="text-gray-400">
                        {evaluaciones.length === 0 ? "No hay evaluaciones configuradas" :
                         `${evaluaciones.length} evaluación${evaluaciones.length === 1 ? '' : 'es'} configurada${evaluaciones.length === 1 ? '' : 's'}`}
                    </p>
                </div>
                
                {/* ✅ Contenedor de botones actualizado */}
                {canManageEvaluaciones && (
                    <div className="flex items-center space-x-3 mt-4 sm:mt-0">
                        {/* ✅ Botón Ver Notas Completas - solo visible si hay evaluaciones */}
                        {evaluaciones.length > 0 && (
                            <motion.button
                                onClick={onVerNotasCompletas}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg transition duration-200 flex items-center"
                            >
                                <Calculator className="w-5 h-5 mr-2" />
                                Ver Notas Completas
                            </motion.button>
                        )}
                        
                        {/* ✅ Botón Agregar Evaluación */}
                        <motion.button
                            onClick={onAgregarEvaluacion}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition duration-200 flex items-center"
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            Agregar Evaluación
                        </motion.button>
                    </div>
                )}
            </div>

            {/* Indicador de porcentaje total */}
            <PorcentajeIndicator porcentajeTotal={porcentajeTotal} />

            {/* Lista de evaluaciones */}
            {evaluaciones.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-12 border border-gray-700 text-center"
                >
                    <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-100 mb-2">
                        No hay evaluaciones configuradas
                    </h3>
                    <p className="text-gray-400 mb-6">
                        {canManageEvaluaciones 
                            ? "Comienza agregando la primera evaluación para este curso."
                            : "El profesor aún no ha configurado las evaluaciones para este curso."
                        }
                    </p>
                    {canManageEvaluaciones && (
                        <motion.button
                            onClick={onAgregarEvaluacion}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition duration-200 flex items-center mx-auto"
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            Agregar Primera Evaluación
                        </motion.button>
                    )}
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {evaluaciones.map((evaluacion, index) => (
                        <EvaluacionCard
                            key={evaluacion.evaluacionId}
                            evaluacion={evaluacion}
                            index={index}
                            onEdit={onEditarEvaluacion}
                            onDelete={onEliminarEvaluacion}
                            onViewNotas={handleViewNotas}
                            canManageEvaluaciones={canManageEvaluaciones}
                            seccionId={seccionId}
                        />
                    ))}
                </div>
            )}

            {/* Información adicional */}
            {evaluaciones.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-blue-900 bg-opacity-30 border border-blue-700 rounded-lg p-6"
                >
                    <h4 className="text-blue-300 font-semibold mb-3">Información sobre las evaluaciones:</h4>
                    <div className="text-blue-200 text-sm space-y-2">
                        <p>• Las evaluaciones configuradas aquí servirán para calcular la nota final del curso.</p>
                        {porcentajeTotal < 100 && (
                            <p className="text-yellow-300">
                                ⚠️ Faltan {100 - porcentajeTotal}% por asignar para completar el sistema de evaluación.
                            </p>
                        )}
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default EvaluacionesList;