import { motion } from "framer-motion";
import { FolderPlus, RefreshCw, Shield, BookOpen } from "lucide-react";
import { useUserRole } from "../../contexts/UserRoleContext";

const SeccionHeader = ({ onCreateSeccion, onRefresh, loading }) => {
    const { userRole } = useUserRole();

    // Vista para administradores
    if (userRole === "Administrador") {
        return (
            <div className="mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center mb-2">
                            <Shield className="w-6 h-6 text-red-400 mr-2" />
                            <h1 className="text-2xl font-bold text-gray-100">Gestión de Secciones</h1>
                            <span className="ml-3 px-3 py-1 bg-red-600 bg-opacity-20 border border-red-500 text-red-400 text-xs font-medium rounded-full">
                                Solo Administradores
                            </span>
                        </div>
                        <p className="text-gray-400">
                            Administra las secciones de cursos, asigna profesores y gestiona horarios
                        </p>
                    </div>
                    <div className="flex items-center space-x-3 mt-4 sm:mt-0">
                        <motion.button
                            onClick={onRefresh}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            disabled={loading}
                            className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-800 text-white font-medium py-2 px-4 rounded-lg transition duration-200 flex items-center"
                        >
                            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                            Actualizar
                        </motion.button>
                        <motion.button
                            onClick={onCreateSeccion}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition duration-200 flex items-center"
                        >
                            <FolderPlus className="w-5 h-5 mr-2" />
                            Crear Sección
                        </motion.button>
                    </div>
                </div>
            </div>
        );
    }

    // Vista para profesores
    if (userRole === "Profesor") {
        return (
            <div className="mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center mb-2">
                            <BookOpen className="w-6 h-6 text-blue-400 mr-2" />
                            <h1 className="text-2xl font-bold text-gray-100">Mis Secciones</h1>
                            <span className="ml-3 px-3 py-1 bg-blue-600 bg-opacity-20 border border-blue-500 text-blue-400 text-xs font-medium rounded-full">
                                Vista Profesor
                            </span>
                        </div>
                        <p className="text-gray-400">
                            Consulta y supervisa las secciones que tienes asignadas
                        </p>
                    </div>
                    <div className="flex items-center space-x-3 mt-4 sm:mt-0">
                        <motion.button
                            onClick={onRefresh}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            disabled={loading}
                            className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-800 text-white font-medium py-2 px-4 rounded-lg transition duration-200 flex items-center"
                        >
                            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                            Actualizar
                        </motion.button>
                    </div>
                </div>
            </div>
        );
    }

    // Fallback por defecto
    return null;
};

export default SeccionHeader;