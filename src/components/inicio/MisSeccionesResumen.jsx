import { motion } from "framer-motion";
import { BookOpen, Users, Clock, Eye, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SeccionCard = ({ seccion, index }) => {
    const navigate = useNavigate();

    const handleViewSeccion = () => {
        navigate(`/secciones/${seccion.seccionId}`);
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
                    <BookOpen className="w-5 h-5 text-blue-400 mr-2" />
                    <div>
                        <h4 className="text-white font-medium">
                            {seccion.codigoCurso || `C${seccion.cursoId}`}
                        </h4>
                        <p className="text-sm text-gray-400">
                            {seccion.grupo}
                        </p>
                    </div>
                </div>
                <motion.button
                    onClick={handleViewSeccion}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition duration-200"
                    title="Ver detalles de la sección"
                >
                    <Eye className="w-4 h-4" />
                </motion.button>
            </div>

            <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-300">
                    <Users className="w-4 h-4 mr-2 text-green-400" />
                    <span>{seccion.estudiantesCount || 0} estudiantes</span>
                </div>

                {seccion.horario && (
                    <div className="flex items-center text-sm text-gray-300">
                        <Clock className="w-4 h-4 mr-2 text-orange-400" />
                        <span>
                            {seccion.horario.dia} {seccion.horario.horaInicio?.slice(0, 5)} - {seccion.horario.horaFin?.slice(0, 5)}
                        </span>
                    </div>
                )}
            </div>

        </motion.div>
    );
};

const MisSeccionesResumen = ({ secciones, loading }) => {
    const navigate = useNavigate();

    const handleVerTodasSecciones = () => {
        navigate("/secciones");
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
                    <span className="ml-3 text-gray-400">Cargando mis secciones...</span>
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
                    <Target className="w-6 h-6 mr-2 text-blue-400" />
                    Mis Secciones
                </h2>
                <div className="flex items-center space-x-3">
                    <span className="bg-blue-600 text-white text-sm px-3 py-1 rounded-full">
                        {secciones.length}
                    </span>
                    <motion.button
                        onClick={handleVerTodasSecciones}
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
                        No tienes secciones asignadas
                    </h3>
                    <p className="text-gray-400">
                        No se encontraron secciones asignadas para el periodo actual.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {secciones.slice(0, 6).map((seccion, index) => (
                        <SeccionCard 
                            key={seccion.seccionId} 
                            seccion={seccion} 
                            index={index}
                        />
                    ))}
                </div>
            )}

            {secciones.length > 6 && (
                <div className="mt-6 text-center">
                    <motion.button
                        onClick={handleVerTodasSecciones}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition duration-200"
                    >
                        Ver las {secciones.length - 6} secciones restantes
                    </motion.button>
                </div>
            )}
        </motion.div>
    );
};

export default MisSeccionesResumen;