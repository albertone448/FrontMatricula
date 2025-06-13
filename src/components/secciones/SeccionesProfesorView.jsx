import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Search, 
    Eye, 
    BookOpen, 
    Users, 
    Calendar, 
    Clock, 
    GraduationCap,
    ChevronLeft,
    ChevronRight,
    RefreshCw,
    ChevronDown
} from "lucide-react";
import { useUserRole } from "../../contexts/UserRoleContext";
import { authUtils } from "../../utils/authUtils";

const SeccionCard = ({ seccion, onViewSeccion }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02 }}
            className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-200"
        >
            {/* Header de la tarjeta */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                    <BookOpen className="w-5 h-5 text-blue-400 mr-2" />
                    <div>
                        <h3 className="text-lg font-semibold text-gray-100">
                            {seccion.codigoCurso || `Curso ${seccion.cursoId}`}
                        </h3>
                        <p className="text-sm text-gray-400">
                            {seccion.cursoNombre || 'Nombre del curso no disponible'}
                        </p>
                    </div>
                </div>
                <motion.button
                    onClick={() => onViewSeccion(seccion)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition duration-200"
                    title="Ver detalles de la sección"
                >
                    <Eye className="w-4 h-4" />
                </motion.button>
            </div>

            {/* Información principal */}
            <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-300">
                    <Users className="w-4 h-4 mr-2 text-green-400" />
                    <span className="font-medium">{seccion.grupo}</span>
                    <span className="mx-2">•</span>
                    <span>{seccion.cuposMax || 0} cupos</span>
                </div>

                <div className="flex items-center text-sm text-gray-300">
                    <Calendar className="w-4 h-4 mr-2 text-purple-400" />
                    <span>{seccion.periodo}</span>
                </div>

                <div className="flex items-center text-sm text-gray-300">
                    <GraduationCap className="w-4 h-4 mr-2 text-yellow-400" />
                    <span className="truncate">{seccion.carrera}</span>
                </div>

                {/* Información del horario si está disponible */}
                {seccion.horario && (
                    <div className="flex items-center text-sm text-gray-300">
                        <Clock className="w-4 h-4 mr-2 text-orange-400" />
                        <span>
                            {seccion.horario.dia} {seccion.horario.horaInicio?.slice(0, 5)} - {seccion.horario.horaFin?.slice(0, 5)}
                        </span>
                    </div>
                )}
            </div>

            {/* Badge de estado */}
            <div className="mt-4 pt-4 border-t border-gray-700">
                <span className="px-3 py-1 bg-green-600 bg-opacity-20 border border-green-500 text-green-400 text-xs font-medium rounded-full">
                    Activa
                </span>
            </div>
        </motion.div>
    );
};

const SeccionRow = ({ seccion, onViewSeccion }) => {
    return (
        <motion.tr
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="hover:bg-gray-700 hover:bg-opacity-30 transition-colors duration-200"
        >
            {/* Curso */}
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                    <BookOpen className="w-4 h-4 text-blue-400 mr-2" />
                    <div>
                        <div className="text-sm font-medium text-gray-100">
                            {seccion.codigoCurso || `C${seccion.cursoId}`}
                        </div>
                        <div className="text-xs text-gray-400">
                            {seccion.cursoNombre || 'Curso no encontrado'}
                        </div>
                    </div>
                </div>
            </td>
            
            {/* Grupo */}
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {seccion.grupo || 'Sin asignar'}
            </td>
            
            {/* Periodo */}
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {seccion.periodo || 'Sin asignar'}
            </td>
            
            {/* Carrera */}
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 max-w-xs truncate">
                {seccion.carrera || 'Sin asignar'}
            </td>
            
            {/* Cupos */}
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1 text-green-400" />
                    {seccion.cuposMax || 0}
                </div>
            </td>
            
            {/* Horario */}
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {seccion.horario ? (
                    <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1 text-orange-400" />
                        <span className="text-xs">
                            {seccion.horario.dia}<br/>
                            {seccion.horario.horaInicio?.slice(0, 5)} - {seccion.horario.horaFin?.slice(0, 5)}
                        </span>
                    </div>
                ) : (
                    'Sin horario'
                )}
            </td>
            
            {/* Acciones */}
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                <motion.button
                    onClick={() => onViewSeccion(seccion)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-blue-400 hover:text-blue-300 transition-colors duration-200 p-1 rounded"
                    title="Ver detalles de la sección"
                >
                    <Eye className="w-4 h-4" />
                </motion.button>
            </td>
        </motion.tr>
    );
};

const Pagination = ({ currentPage, totalPages, onPageChange, totalItems, itemsPerPage }) => {
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    const getPageNumbers = useCallback(() => {
        const pages = [];
        const maxVisible = 5;
        
        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            const start = Math.max(1, currentPage - 2);
            const end = Math.min(totalPages, start + maxVisible - 1);
            
            for (let i = start; i <= end; i++) {
                pages.push(i);
            }
        }
        
        return pages;
    }, [currentPage, totalPages]);

    if (totalPages <= 1) return null;

    return (
        <div className="px-6 py-4 border-t border-gray-700">
            <div className="flex items-center justify-between">
                <div className="text-sm text-gray-400">
                    Mostrando {startItem} - {endItem} de {totalItems} secciones
                </div>

                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-2 text-sm bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center"
                    >
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Anterior
                    </button>

                    <div className="flex space-x-1">
                        {getPageNumbers().map((page) => (
                            <button
                                key={page}
                                onClick={() => onPageChange(page)}
                                className={`px-3 py-2 text-sm rounded-lg transition-colors duration-200 ${
                                    page === currentPage
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                }`}
                            >
                                {page}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-2 text-sm bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center"
                    >
                        Siguiente
                        <ChevronRight className="w-4 h-4 ml-1" />
                    </button>
                </div>
            </div>
        </div>
    );
};

const SeccionesProfesorView = ({ 
    secciones, 
    loading, 
    onRefresh, 
    onViewSeccion,
    periodosDisponibles = [],
    periodoSeleccionado,
    onPeriodoChange
}) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [viewMode, setViewMode] = useState("cards"); // "cards" o "table"
    const [currentPage, setCurrentPage] = useState(1);
    const { currentUser } = useUserRole();
    const itemsPerPage = 6; // Para cards, menos elementos por página

    // Debounce del término de búsqueda
    useEffect(() => {
        setIsSearching(true);
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
            setIsSearching(false);
        }, 300);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Filtrar secciones del profesor actual
    const userId = authUtils.getUserId();
    const seccionesDelProfesor = useMemo(() => {
        if (!secciones || !userId) return [];
        
        let seccionesFiltradas = secciones.filter(seccion => seccion.usuarioId === userId);
        
        // Filtrar por periodo si está seleccionado
        if (periodoSeleccionado) {
            seccionesFiltradas = seccionesFiltradas.filter(seccion => seccion.periodo === periodoSeleccionado);
        }
        
        return seccionesFiltradas;
    }, [secciones, userId, periodoSeleccionado]);

    // Filtrar secciones según búsqueda
    const filteredSecciones = useMemo(() => {
        if (!debouncedSearchTerm.trim()) return seccionesDelProfesor;
        
        const searchLower = debouncedSearchTerm.toLowerCase();
        return seccionesDelProfesor.filter(seccion =>
            seccion.grupo?.toLowerCase().includes(searchLower) ||
            seccion.periodo?.toLowerCase().includes(searchLower) ||
            seccion.carrera?.toLowerCase().includes(searchLower) ||
            seccion.cursoNombre?.toLowerCase().includes(searchLower) ||
            seccion.codigoCurso?.toLowerCase().includes(searchLower)
        );
    }, [seccionesDelProfesor, debouncedSearchTerm]);

    // Calcular paginación
    const totalPages = Math.ceil(filteredSecciones.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentSecciones = filteredSecciones.slice(startIndex, startIndex + itemsPerPage);

    // Resetear página cuando cambie la búsqueda o el periodo
    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedSearchTerm, periodoSeleccionado]);

    // Calcular estadísticas
    const stats = {
        total: seccionesDelProfesor.length,
        cursosUnicos: [...new Set(seccionesDelProfesor.map(s => s.cursoId))].length,
        periodosActivos: [...new Set(seccionesDelProfesor.map(s => s.periodo))].length,
        cuposTotales: seccionesDelProfesor.reduce((sum, s) => sum + (s.cuposMax || 0), 0)
    };

    const handlePageChange = useCallback((page) => {
        setCurrentPage(page);
    }, []);

    const handleSearchChange = useCallback((value) => {
        setSearchTerm(value);
    }, []);

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
            >
                <div className="flex-1">
                    <h1 className="text-3xl font-bold text-gray-100 mb-2">Mis Secciones</h1>
                    <p className="text-gray-400 mb-2">
                        Gestiona y supervisa las secciones que tienes asignadas
                    </p>
                    
                    {/* Información del profesor y selector de periodo */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        {currentUser && (
                            <p className="text-sm text-blue-400">
                                Profesor: {currentUser.nombre} {currentUser.apellido1}
                            </p>
                        )}
                        
                        {/* Selector de periodo */}
                        {periodosDisponibles.length > 0 && (
                            <div className="flex items-center gap-3">
                                <span className="text-gray-400 text-sm">Periodo:</span>
                                <div className="relative">
                                    <select
                                        value={periodoSeleccionado}
                                        onChange={(e) => onPeriodoChange(e.target.value)}
                                        className="appearance-none bg-gray-700 border border-gray-600 rounded-lg px-3 py-1 pr-8 text-blue-400 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                    >
                                        <option value="">Todos los periodos</option>
                                        {periodosDisponibles.map((periodo) => (
                                            <option key={periodo} value={periodo}>
                                                {periodo}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                </div>
                                {periodosDisponibles.length > 1 && (
                                    <span className="text-xs text-gray-500">
                                        ({periodosDisponibles.length} periodos disponibles)
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                </div>
                
                <div className="flex items-center space-x-3">
                    {/* Selector de vista */}
                    <div className="flex bg-gray-700 rounded-lg p-1">
                        <button
                            onClick={() => setViewMode("cards")}
                            className={`px-3 py-1 rounded text-sm font-medium transition duration-200 ${
                                viewMode === "cards"
                                    ? "bg-blue-600 text-white"
                                    : "text-gray-400 hover:text-gray-300"
                            }`}
                        >
                            Tarjetas
                        </button>
                        <button
                            onClick={() => setViewMode("table")}
                            className={`px-3 py-1 rounded text-sm font-medium transition duration-200 ${
                                viewMode === "table"
                                    ? "bg-blue-600 text-white"
                                    : "text-gray-400 hover:text-gray-300"
                            }`}
                        >
                            Tabla
                        </button>
                    </div>

                    {/* Botón de actualizar */}
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
            </motion.div>

            {/* Estadísticas rápidas */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
            >
                <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-4 border border-gray-700">
                    <div className="flex items-center">
                        <div className="p-2 bg-blue-500 bg-opacity-20 rounded-lg">
                            <Users className="w-5 h-5 text-blue-400" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-400">
                                {periodoSeleccionado ? `Secciones en ${periodoSeleccionado}` : 'Mis Secciones'}
                            </p>
                            <p className="text-xl font-bold text-gray-100">{loading ? "..." : stats.total}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-4 border border-gray-700">
                    <div className="flex items-center">
                        <div className="p-2 bg-green-500 bg-opacity-20 rounded-lg">
                            <BookOpen className="w-5 h-5 text-green-400" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-400">Cursos Únicos</p>
                            <p className="text-xl font-bold text-gray-100">{loading ? "..." : stats.cursosUnicos}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-4 border border-gray-700">
                    <div className="flex items-center">
                        <div className="p-2 bg-purple-500 bg-opacity-20 rounded-lg">
                            <Calendar className="w-5 h-5 text-purple-400" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-400">Periodos</p>
                            <p className="text-xl font-bold text-gray-100">{loading ? "..." : stats.periodosActivos}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-4 border border-gray-700">
                    <div className="flex items-center">
                        <div className="p-2 bg-yellow-500 bg-opacity-20 rounded-lg">
                            <GraduationCap className="w-5 h-5 text-yellow-400" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-400">Total Cupos</p>
                            <p className="text-xl font-bold text-gray-100">{loading ? "..." : stats.cuposTotales}</p>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Barra de búsqueda */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
            >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-100 mb-1">
                            {isSearching ? "Buscando..." : `${filteredSecciones.length} secciones encontradas`}
                        </h3>
                        <p className="text-sm text-gray-400">
                            {periodoSeleccionado && `Periodo: ${periodoSeleccionado} • `}
                            {debouncedSearchTerm && `Búsqueda: "${debouncedSearchTerm}"`}
                        </p>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Buscar por curso, grupo, carrera..."
                            value={searchTerm}
                            onChange={(e) => handleSearchChange(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 w-80"
                        />
                    </div>
                </div>
            </motion.div>

            {/* Contenido principal */}
            {loading ? (
                <div className="flex justify-center items-center py-12">
                    <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="ml-3 text-gray-400">Cargando tus secciones...</span>
                </div>
            ) : filteredSecciones.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-12 border border-gray-700 text-center"
                >
                    <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-100 mb-2">
                        {searchTerm || periodoSeleccionado ? "No se encontraron secciones" : "No tienes secciones asignadas"}
                    </h3>
                    <p className="text-gray-400">
                        {searchTerm || periodoSeleccionado 
                            ? "Intenta con otros términos de búsqueda o cambia el periodo" 
                            : "Contacta al administrador para que te asigne secciones"
                        }
                    </p>
                </motion.div>
            ) : (
                <>
                    {/* Vista de tarjetas */}
                    {viewMode === "cards" && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        >
                            <AnimatePresence>
                                {currentSecciones.map((seccion) => (
                                    <SeccionCard
                                        key={seccion.seccionId}
                                        seccion={seccion}
                                        onViewSeccion={onViewSeccion}
                                    />
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    )}

                    {/* Vista de tabla */}
                    {viewMode === "table" && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl border border-gray-700"
                        >
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-700">
                                    <thead>
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Curso</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Grupo</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Periodo</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Carrera</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Cupos</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Horario</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-700">
                                        <AnimatePresence>
                                            {currentSecciones.map((seccion) => (
                                                <SeccionRow
                                                    key={seccion.seccionId}
                                                    seccion={seccion}
                                                    onViewSeccion={onViewSeccion}
                                                />
                                            ))}
                                        </AnimatePresence>
                                    </tbody>
                                </table>
                            </div>
                            
                            {/* Paginación para tabla */}
                            {filteredSecciones.length > itemsPerPage && (
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={handlePageChange}
                                    totalItems={filteredSecciones.length}
                                    itemsPerPage={itemsPerPage}
                                />
                            )}
                        </motion.div>
                    )}

                    {/* Paginación para cards */}
                    {viewMode === "cards" && filteredSecciones.length > itemsPerPage && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl border border-gray-700"
                        >
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                                totalItems={filteredSecciones.length}
                                itemsPerPage={itemsPerPage}
                            />
                        </motion.div>
                    )}
                </>
            )}
        </div>
    );
};

export default SeccionesProfesorView;