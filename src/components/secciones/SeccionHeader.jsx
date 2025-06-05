import { motion } from "framer-motion";
import { FolderPlus, RefreshCw, Shield, BookOpen, ChevronDown } from "lucide-react";
import { useUserRole } from "../../contexts/UserRoleContext";

const SeccionHeader = ({ 
    onCreateSeccion, 
    onRefresh, 
    loading, 
    periodosDisponibles = [], 
    periodoSeleccionado = "", 
    onPeriodoChange = null,
    userRole 
}) => {
    // Vista para administradores
    if (userRole === "Administrador") {
        return (
            <div className="mb-8">
                <div className="flex flex-col space-y-4">
                    {/* ✅ Primera fila: Título y información */}
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
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
                                {periodoSeleccionado && (
                                    <span className="text-blue-400 ml-2">• Periodo: {periodoSeleccionado}</span>
                                )}
                            </p>
                        </div>
                        
                        {/* ✅ Botones de acción */}
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

                    {/* ✅ Segunda fila: Selector de periodo (solo si hay periodos y función de cambio) */}
                    {periodosDisponibles.length > 0 && onPeriodoChange && (
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-gray-800 bg-opacity-30 rounded-lg p-4 border border-gray-700">
                            <div className="flex items-center space-x-4">
                                <span className="text-gray-300 font-medium">Filtrar por periodo:</span>
                                <div className="relative">
                                    <select
                                        value={periodoSeleccionado}
                                        onChange={(e) => onPeriodoChange(e.target.value)}
                                        className="appearance-none bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 pr-10 text-blue-400 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 min-w-[180px]"
                                    >
                                        {periodosDisponibles.map((periodo) => (
                                            <option key={periodo} value={periodo}>
                                                {periodo}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                </div>
                                
                                {/* ✅ Información adicional */}
                                <div className="hidden sm:flex items-center text-sm text-gray-500 space-x-4">
                                    <span>•</span>
                                    <span>{periodosDisponibles.length} periodo{periodosDisponibles.length === 1 ? '' : 's'} disponible{periodosDisponibles.length === 1 ? '' : 's'}</span>
                                    {periodoSeleccionado && (
                                        <>
                                            <span>•</span>
                                            <span className="text-blue-400">Mostrando: {periodoSeleccionado}</span>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* ✅ Información responsiva para móviles */}
                            <div className="sm:hidden mt-3 flex items-center justify-between text-sm text-gray-500">
                                <span>{periodosDisponibles.length} periodo{periodosDisponibles.length === 1 ? '' : 's'} disponible{periodosDisponibles.length === 1 ? '' : 's'}</span>
                                {periodoSeleccionado && (
                                    <span className="text-blue-400">Mostrando: {periodoSeleccionado}</span>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Vista para profesores (sin cambios, ya tenía selector de periodo en SeccionesProfesorView)
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