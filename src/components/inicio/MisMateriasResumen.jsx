import { motion } from "framer-motion";
import { BookOpen, Clock, CreditCard, Eye, GraduationCap } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MateriaCard = ({ seccion, index }) => {
    const navigate = useNavigate();

    const handleViewSeccion = () => {
        navigate(`/secciones/${seccion.seccionId}`);
    };

    const getCreditosColor = (creditos) => {
        if (creditos <= 2) return "text-green-400";
        if (creditos <= 4) return "text-yellow-400";
        return "text-red-400";
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
            className="bg-gray-700 bg-opacity-50 rounded-lg p-4 border border-gray-600 hover:border-gray-500 transition-all duration-200"
        >
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center">
                    <BookOpen className="w-5 h-5 text-blue-400 mr-2 flex-shrink-0" />
                    <div className="min-w-0">
                        <h4 className="text-white font-medium truncate">
                            {seccion.cursoNombre || 'Curso sin nombre'}
                        </h4>
                        <p className="text-sm text-gray-400 truncate">
                            {seccion.codigoCurso || `C${seccion.cursoId}`} - {seccion.grupo}
                        </p>
                    </div>
                </div>
                <motion.button
                    onClick={handleViewSeccion}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition duration-200 flex-shrink-0"
                    title="Ver detalles de la materia"
                >
                    <Eye className="w-4 h-4" />
                </motion.button>
            </div>

            <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-300">
                    <CreditCard className="w-4 h-4 mr-2 text-purple-400 flex-shrink-0" />
                    <span className={`font-medium ${getCreditosColor(seccion.creditos)}`}>
                        {seccion.creditos || 0} créditos
                    </span>
                </div>

                {seccion.horario && (
                    <div className="flex items-center text-sm text-gray-300">
                        <Clock className="w-4 h-4 mr-2 text-orange-400 flex-shrink-0" />
                        <span className="truncate">
                            {seccion.horario.dia} {seccion.horario.horaInicio?.slice(0, 5)} - {seccion.horario.horaFin?.slice(0, 5)}
                        </span>
                    </div>
                )}

                <div className="flex items-center text-sm text-gray-300">
                    <GraduationCap className="w-4 h-4 mr-2 text-green-400 flex-shrink-0" />
                    <span className="truncate">
                        {seccion.carrera || 'Carrera no especificada'}
                    </span>
                </div>
            </div>

            <div className="mt-3 pt-3 border-t border-gray-600">
                <span className="text-xs text-gray-500">
                    Sección ID: {seccion.seccionId}
                </span>
            </div>
        </motion.div>
    );
};

const MisMateriasResumen = ({ secciones, loading }) => {
    const navigate = useNavigate();

    const handleVerTodasMaterias = () => {
        navigate("/secciones");
    };

    const handleVerInscripciones = () => {
        navigate("/inscripciones");
    };

    if (loading) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
            >
                <div className="flex justify-center items-center h-32">
                    <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="ml-3 text-gray-400">Cargando mis materias...</span>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
        >
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-100 flex items-center">
                    <BookOpen className="w-6 h-6 mr-2 text-blue-400" />
                    Mis Materias
                </h2>
                <div className="flex items-center space-x-3">
                    <span className="bg-blue-600 text-white text-sm px-3 py-1 rounded-full">
                        {secciones.length}
                    </span>
                    <motion.button
                        onClick={handleVerTodasMaterias}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded-lg transition duration-200"
                    >
                        Ver Todas
                    </motion.button>
                </div>
            </div>

            {secciones.length === 0 ? (
                <div className="text-center py-8">
                    <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-gray-100 mb-2">
                        No tienes materias inscritas
                    </h3>
                    <p className="text-gray-400 mb-4">
                        No se encontraron materias inscritas para el periodo actual.
                    </p>
                    <motion.button
                        onClick={handleVerInscripciones}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition duration-200"
                    >
                        Inscribir Materias
                    </motion.button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {secciones.slice(0, 4).map((seccion, index) => (
                        <MateriaCard 
                            key={seccion.seccionId} 
                            seccion={seccion} 
                            index={index}
                        />
                    ))}
                </div>
            )}

            {secciones.length > 4 && (
                <div className="mt-6 text-center">
                    <motion.button
                        onClick={handleVerTodasMaterias}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition duration-200"
                    >
                        Ver las {secciones.length - 4} materias restantes
                    </motion.button>
                </div>
            )}

            {secciones.length > 0 && (
                <div className="mt-6 pt-4 border-t border-gray-700">
                    <div className="flex justify-center">
                        <motion.button
                            onClick={handleVerInscripciones}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition duration-200 flex items-center"
                        >
                            <GraduationCap className="w-5 h-5 mr-2" />
                            Gestionar Inscripciones
                        </motion.button>
                    </div>
                </div>
            )}
        </motion.div>
    );
};

export default MisMateriasResumen;