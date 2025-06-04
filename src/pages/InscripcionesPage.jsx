import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useUserRole } from "../contexts/UserRoleContext";
import { authUtils } from "../utils/authUtils";
import api from "../services/apiConfig";
import Header from "../components/common/Header";
import LoadingSpinner from "../components/horarios/LoadingSpinner";
import ErrorMessage from "../components/horarios/ErrorMessage";
import { ConfirmRetirarModal } from "../components/inscripciones/ConfirmRetirarModal";

const InscripcionesPage = () => {
    const { userRole, loading: roleLoading } = useUserRole();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [periodosDisponibles, setPeriodosDisponibles] = useState([]);
    const [periodoSeleccionado, setPeriodoSeleccionado] = useState("");
    const [seccionesDisponibles, setSeccionesDisponibles] = useState([]);
    const [totalCreditos, setTotalCreditos] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterDia, setFilterDia] = useState("");
    const [filterHorario, setFilterHorario] = useState("");
    const [modalRetirarOpen, setModalRetirarOpen] = useState(false);
    const [seccionSeleccionada, setSeccionSeleccionada] = useState(null);

    // Lista de horarios disponibles para filtrar
    const horariosDisponibles = [
        "08:00 - 11:20",
        "13:00 - 16:20",
        "17:00 - 20:20"
    ];

    // Lista de días de la semana
    const diasSemana = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

    // Función para obtener los periodos disponibles para inscripción
    const fetchPeriodosDisponibles = async () => {
        try {
            const seccionesResponse = await api.get("Seccion/GetAllSecciones");
            const secciones = seccionesResponse.data;
            
            if (!secciones || secciones.length === 0) {
                return [];
            }

            const periodos = [...new Set(secciones.map(seccion => seccion.periodo).filter(Boolean))];
            return periodos.sort().reverse(); // Más recientes primero
        } catch (error) {
            console.error("❌ Error obteniendo periodos:", error);
            return [];
        }
    };

    // Función para obtener las secciones disponibles para inscripción
    const fetchSeccionesDisponibles = async (periodo = null) => {
        try {
            setLoading(true);
            setError("");

            const userId = authUtils.getUserId();
            if (!userId) {
                throw new Error("No se encontró el ID del usuario");
            }

            // 1. Obtener todas las secciones
            const seccionesResponse = await api.get("Seccion/GetAllSecciones");
            const todasLasSecciones = seccionesResponse.data;

            // 2. Filtrar por periodo si se especifica
            let seccionesFiltradas = todasLasSecciones;
            if (periodo) {
                seccionesFiltradas = todasLasSecciones.filter(seccion => seccion.periodo === periodo);
            }

            // 3. Obtener las inscripciones actuales del estudiante
            const inscripcionesResponse = await api.get(`Inscripcion/GetInscripcionesPorUsuario?id=${userId}`);
            const inscripcionesActuales = inscripcionesResponse.data;

            // 4. Obtener todos los horarios
            const horariosResponse = await api.get("Horario/GetAllHorarios");
            const todosLosHorarios = horariosResponse.data;

            // 5. Obtener información de los cursos
            const cursosPromises = seccionesFiltradas.map(seccion => 
                api.get(`Curso/GetCursoById/${seccion.cursoId}`)
            );
            const cursosResponses = await Promise.all(cursosPromises);
            const cursos = cursosResponses.map(response => response.data);

            // 6. Procesar y combinar la información
            const seccionesProcesadas = seccionesFiltradas.map((seccion, index) => {
                const curso = cursos[index];
                const inscripcion = inscripcionesActuales.find(i => i.seccionId === seccion.seccionId);
                const horario = todosLosHorarios.find(h => h.horarioId === seccion.horarioId);
                
                return {
                    ...seccion,
                    curso,
                    horario,
                    inscrito: !!inscripcion,
                    inscripcionId: inscripcion?.inscripcionId
                };
            }).filter(item => item.curso && item.horario); // Solo incluir secciones con información completa

            setSeccionesDisponibles(seccionesProcesadas);

        } catch (error) {
            console.error("❌ Error obteniendo secciones disponibles:", error);
            setError(error.response?.data?.message || error.message || "Error al cargar las secciones");
        } finally {
            setLoading(false);
        }
    };

    // Cargar datos cuando el componente se monte
    useEffect(() => {
        if (!roleLoading && userRole === "Estudiante") {
            fetchPeriodosDisponibles().then(periodos => {
                setPeriodosDisponibles(periodos);
                if (periodos.length > 0) {
                    const periodoReciente = periodos[0];
                    setPeriodoSeleccionado(periodoReciente);
                    fetchSeccionesDisponibles(periodoReciente);
                } else {
                    fetchSeccionesDisponibles();
                }
            });
        }
    }, [roleLoading, userRole]);

    // Calcular total de créditos cada vez que cambien las secciones disponibles
    useEffect(() => {
        const creditosInscritos = seccionesDisponibles
            .filter(seccion => seccion.inscrito)
            .reduce((total, seccion) => total + (seccion.curso?.creditos || 0), 0);
        setTotalCreditos(creditosInscritos);
    }, [seccionesDisponibles]);

    // Manejar cambio de periodo
    const handlePeriodoChange = (nuevoPeriodo) => {
        setPeriodoSeleccionado(nuevoPeriodo);
        fetchSeccionesDisponibles(nuevoPeriodo);
    };

    // Manejar refresco de datos
    const handleRefresh = () => {
        fetchSeccionesDisponibles(periodoSeleccionado);
    };

    // Validar antes de inscribir
    const validarInscripcion = (seccion) => {
        // Verificar límite de créditos (máximo 18 créditos por periodo)
        const creditosNuevos = totalCreditos + (seccion.curso?.creditos || 0);
        if (creditosNuevos > 18) {
            setError("No puedes inscribir más de 18 créditos por periodo");
            return false;
        }

        // Verificar si ya tiene un curso en el mismo horario
        const horarioConflicto = seccionesDisponibles.find(s => 
            s.inscrito && 
            s.horario?.dia === seccion.horario?.dia &&
            s.horario?.horaInicio === seccion.horario?.horaInicio
        );

        if (horarioConflicto) {
            setError(`Conflicto de horario con ${horarioConflicto.curso.nombre}`);
            return false;
        }

        return true;
    };

    // Función para inscribir una materia
    const handleInscribirMateria = async (seccionId, nombreCurso) => {
        try {
            setLoading(true);
            setError("");
            setSuccessMessage("");

            const userId = authUtils.getUserId();
            if (!userId) {
                throw new Error("No se encontró el ID del usuario");
            }

            // Encontrar la sección que se quiere inscribir
            const seccion = seccionesDisponibles.find(s => s.seccionId === seccionId);
            if (!seccion) {
                throw new Error("Sección no encontrada");
            }

            // Validar la inscripción
            if (!validarInscripcion(seccion)) {
                return;
            }

            // Crear la inscripción
            await api.post("Inscripcion/AddInscripcion", {
                usuarioId: parseInt(userId),
                seccionId: seccionId
            });

            setSuccessMessage(`Te has inscrito exitosamente en ${nombreCurso}`);
            
            // Recargar las secciones para actualizar el estado
            await fetchSeccionesDisponibles(periodoSeleccionado);
        } catch (error) {
            console.error("❌ Error al inscribir materia:", error);
            setError(error.response?.data?.message || error.message || "Error al inscribir la materia");
        } finally {
            setLoading(false);
        }
    };    // Función para retirar una materia
    const handleRetirarMateria = async (inscripcionId, nombreCurso) => {
        // Encontrar la sección para mostrar más detalles
        const seccion = seccionesDisponibles.find(s => s.inscripcionId === inscripcionId);
        if (!seccion) return;
        
        setSeccionSeleccionada(seccion);
        setModalRetirarOpen(true);
    };

    // Función que se ejecuta cuando se confirma el retiro en el modal
    const handleConfirmRetiro = async () => {
        if (!seccionSeleccionada) return;

        try {
            setLoading(true);
            setError("");
            setSuccessMessage("");

            // Eliminar la inscripción
            await api.delete(`Inscripcion/DeleteInscripcion/${seccionSeleccionada.inscripcionId}`);

            setSuccessMessage(`Has retirado exitosamente ${seccionSeleccionada.curso.nombre}`);
            
            // Recargar las secciones para actualizar el estado
            await fetchSeccionesDisponibles(periodoSeleccionado);
        } catch (error) {
            console.error("❌ Error al retirar materia:", error);
            setError(error.response?.data?.message || error.message || "Error al retirar la materia");
        } finally {
            setLoading(false);
            setModalRetirarOpen(false);
            setSeccionSeleccionada(null);
        }
    };

    // Verificar si el usuario es estudiante
    if (userRole !== "Estudiante") {
        return (
            <div className='flex-1 overflow-auto relative z-10'>
                <Header title='Inscripciones' />
                <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
                    <div className="bg-red-500 bg-opacity-10 border border-red-500 rounded-lg p-4 text-center">
                        <h2 className="text-xl font-bold text-red-500 mb-2">Acceso Denegado</h2>
                        <p className="text-gray-400">Esta página solo está disponible para estudiantes.</p>
                    </div>
                </main>
            </div>
        );
    }

    // Loading state mientras se verifica el rol
    if (roleLoading) {
        return (
            <div className='flex-1 overflow-auto relative z-10'>
                <Header title='Inscripciones' />
                <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
                    <LoadingSpinner message="Verificando permisos..." />
                </main>
            </div>
        );
    }

    // Función para filtrar secciones
    const seccionesFiltradas = seccionesDisponibles.filter(seccion => {
        // Filtro por búsqueda
        const matchSearch = searchTerm === "" || 
            seccion.curso?.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            seccion.curso?.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
            seccion.grupo.toLowerCase().includes(searchTerm.toLowerCase());

        // Filtro por día
        const matchDia = filterDia === "" || seccion.horario?.dia === filterDia;
        
        // Filtro por horario
        const horarioSeccion = seccion.horario ? 
            `${seccion.horario.horaInicio.slice(0, 5)} - ${seccion.horario.horaFin.slice(0, 5)}` : "";
        const matchHorario = filterHorario === "" || horarioSeccion === filterHorario;

        return matchSearch && matchDia && matchHorario;
    });    return (
        <div className='flex-1 overflow-auto relative z-10'>
            <Header title='Inscripciones' />
            <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
                <ConfirmRetirarModal
                    open={modalRetirarOpen}
                    onClose={() => {
                        setModalRetirarOpen(false);
                        setSeccionSeleccionada(null);
                    }}
                    onConfirm={handleConfirmRetiro}
                    seccion={seccionSeleccionada}
                />

                {loading && <LoadingSpinner message="Cargando secciones disponibles..." />}
                
                {error && (
                    <ErrorMessage 
                        message={error} 
                        onRetry={handleRefresh}
                    />
                )}

                {successMessage && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-green-500 bg-opacity-10 border border-green-500 rounded-lg p-4 mb-6"
                    >
                        <p className="text-green-400 text-center">{successMessage}</p>
                    </motion.div>
                )}

                {/* Filtros y búsqueda */}
                <div className="flex flex-col lg:flex-row gap-4 mb-6">
                    {/* Búsqueda */}
                    <div className="relative flex-1">
                        <input
                            type="text"
                            placeholder="Buscar por nombre del curso, código o grupo..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* Filtro por día */}
                    <div className="w-full lg:w-48">
                        <select
                            value={filterDia}
                            onChange={(e) => setFilterDia(e.target.value)}
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">Todos los días</option>
                            {diasSemana.map(dia => (
                                <option key={dia} value={dia}>{dia}</option>
                            ))}
                        </select>
                    </div>

                    {/* Filtro por horario */}
                    <div className="w-full lg:w-48">
                        <select
                            value={filterHorario}
                            onChange={(e) => setFilterHorario(e.target.value)}
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">Todos los horarios</option>
                            {horariosDisponibles.map(horario => (
                                <option key={horario} value={horario}>{horario}</option>
                            ))}
                        </select>
                    </div>

                    {/* Botón para limpiar filtros */}
                    {(searchTerm || filterDia || filterHorario) && (
                        <button
                            onClick={() => {
                                setSearchTerm("");
                                setFilterDia("");
                                setFilterHorario("");
                            }}
                            className="w-full lg:w-auto px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition duration-200"
                        >
                            Limpiar filtros
                        </button>
                    )}
                </div>

                {/* Resumen de créditos */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-6"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-100 mb-1">
                                Créditos Inscritos
                            </h3>
                            <p className="text-gray-400 text-sm">
                                Máximo permitido: 18 créditos por periodo
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-bold text-blue-400">
                                {totalCreditos}
                            </p>
                            <p className="text-sm text-gray-400">
                                de 18 créditos
                            </p>
                        </div>
                    </div>
                    {/* Barra de progreso */}
                    <div className="mt-4">
                        <div className="w-full bg-gray-700 rounded-full h-2">
                            <div
                                className={`h-2 rounded-full transition-all duration-500 ${
                                    totalCreditos > 15 ? "bg-yellow-500" :
                                    totalCreditos > 12 ? "bg-blue-500" :
                                    "bg-green-500"
                                }`}
                                style={{ width: `${(totalCreditos / 18) * 100}%` }}
                            ></div>
                        </div>
                    </div>
                </motion.div>

                {/* Mensaje cuando no hay secciones disponibles */}
                {!loading && !error && seccionesFiltradas.length === 0 && (
                    <div className="text-center py-8">
                        <p className="text-gray-400">
                            {seccionesDisponibles.length === 0 
                                ? "No hay secciones disponibles para este periodo"
                                : "No se encontraron secciones que coincidan con los filtros"}
                        </p>
                    </div>
                )}

                {/* Tabla de secciones disponibles */}
                <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl border border-gray-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-700">
                            <thead className="bg-gray-700 bg-opacity-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                        Curso
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                        Grupo
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                        Horario
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                        Carrera
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                        Cupos
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                        Créditos
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                        Estado
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700 bg-gray-800 bg-opacity-50">
                                {seccionesFiltradas.map((seccion) => (
                                    <motion.tr
                                        key={seccion.seccionId}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className={`hover:bg-gray-700 hover:bg-opacity-30 transition-colors duration-200 ${
                                            seccion.inscrito ? 'bg-blue-900 bg-opacity-10' : ''
                                        }`}
                                    >
                                        {/* Información del curso */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div>
                                                <div className="text-sm font-medium text-gray-100">
                                                    {seccion.curso.nombre}
                                                </div>
                                                <div className="text-sm text-gray-400">
                                                    {seccion.curso.codigo}
                                                </div>
                                            </div>
                                        </td>

                                        {/* Grupo */}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                            {seccion.grupo}
                                        </td>

                                        {/* Horario */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {seccion.horario ? (
                                                <div>
                                                    <div className="text-sm text-blue-400">
                                                        {seccion.horario.dia}
                                                    </div>
                                                    <div className="text-sm text-gray-400">
                                                        {seccion.horario.horaInicio.slice(0, 5)} - {seccion.horario.horaFin.slice(0, 5)}
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className="text-yellow-500 text-sm">Horario no asignado</span>
                                            )}
                                        </td>

                                        {/* Carrera */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-300">
                                                {seccion.carrera || 'Sin asignar'}
                                            </div>
                                        </td>

                                        {/* Cupos */}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                            {seccion.cuposMax}
                                        </td>

                                        {/* Créditos */}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                            {seccion.curso.creditos}
                                        </td>

                                        {/* Estado */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                seccion.inscrito
                                                    ? 'bg-blue-900 text-blue-200'
                                                    : 'bg-gray-700 text-gray-200'
                                            }`}>
                                                {seccion.inscrito ? 'Inscrito' : 'Disponible'}
                                            </span>
                                        </td>

                                        {/* Acciones */}
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => seccion.inscrito 
                                                    ? handleRetirarMateria(seccion.inscripcionId, seccion.curso.nombre)
                                                    : handleInscribirMateria(seccion.seccionId, seccion.curso.nombre)
                                                }
                                                disabled={loading}
                                                className={`px-4 py-2 rounded-lg font-medium transition duration-200 ${
                                                    loading ? "opacity-50 cursor-not-allowed " : ""
                                                }${
                                                    seccion.inscrito
                                                        ? "bg-red-600 hover:bg-red-700 text-white"
                                                        : "bg-blue-600 hover:bg-blue-700 text-white"
                                                }`}
                                            >
                                                {loading ? "..." : 
                                                seccion.inscrito ? "Retirar" : "Inscribir"}
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Modal de confirmación para retirar materia */}
                {modalRetirarOpen && seccionSeleccionada && (
                    <ConfirmRetirarModal
                        open={modalRetirarOpen}
                        onClose={() => setModalRetirarOpen(false)}
                        onConfirm={() => {
                            handleRetirarMateria(seccionSeleccionada.inscripcionId, seccionSeleccionada.curso.nombre);
                            setModalRetirarOpen(false);
                        }}
                        curso={seccionSeleccionada.curso}
                        horario={seccionSeleccionada.horario}
                        grupo={seccionSeleccionada.grupo}
                    />
                )}
            </main>
        </div>
    );
};

export default InscripcionesPage;
