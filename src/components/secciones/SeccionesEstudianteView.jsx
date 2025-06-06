import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    BookOpen, 
    User, 
    Calendar, 
    Clock, 
    Target,
    TrendingUp,
    RefreshCw,
    ChevronDown,
    GraduationCap,
    CheckCircle,
    AlertCircle,
    Award,
    BarChart3
} from "lucide-react";
import { authUtils } from "../../utils/authUtils";
import api from "../../services/apiConfig";

const SeccionCard = ({ seccion, evaluaciones, notas, index }) => {
    const calcularNotaFinal = () => {
        let notaTotal = 0;
        let porcentajeTotal = 0;

        evaluaciones.forEach(evaluacion => {
            const nota = notas.find(n => n.evaluacionId === evaluacion.evaluacionId);
            if (nota) {
                notaTotal += (nota.total * evaluacion.porcentaje) / 100;
                porcentajeTotal += evaluacion.porcentaje;
            }
        });

        return {
            notaFinal: porcentajeTotal > 0 ? notaTotal : 0,
            porcentajeCompletado: porcentajeTotal,
            aprobado: notaTotal >= 70 && porcentajeTotal === 100
        };
    };

    const { notaFinal, porcentajeCompletado, aprobado } = calcularNotaFinal();

    const getNotaColor = (nota) => {
        if (nota >= 90) return "text-green-400";
        if (nota >= 80) return "text-blue-400";
        if (nota >= 70) return "text-yellow-400";
        return "text-red-400";
    };

    const getEstadoIcon = () => {
        if (porcentajeCompletado === 100) {
            return aprobado ? 
                <CheckCircle className="w-5 h-5 text-green-400" /> : 
                <AlertCircle className="w-5 h-5 text-red-400" />;
        }
        return <Clock className="w-5 h-5 text-yellow-400" />;
    };

    const getEstadoText = () => {
        if (porcentajeCompletado === 100) {
            return aprobado ? "Aprobado" : "Reprobado";
        }
        return `En progreso (${porcentajeCompletado}%)`;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
            className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-200"
        >
            {/* Header de la tarjeta */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center flex-1">
                    <div className="p-3 bg-blue-500 bg-opacity-20 rounded-lg mr-4">
                        <BookOpen className="w-6 h-6 text-blue-400" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-100">
                            {seccion.codigoCurso}
                        </h3>
                        <p className="text-sm text-gray-400 mb-1">
                            {seccion.cursoNombre}
                        </p>
                        <div className="flex items-center text-xs text-gray-500">
                            <span>{seccion.grupo}</span>
                            <span className="mx-2">•</span>
                            <span>{seccion.carrera}</span>
                        </div>
                    </div>
                </div>
                
                {/* Nota final y estado */}
                <div className="text-right">
                    <div className={`text-2xl font-bold ${getNotaColor(notaFinal)}`}>
                        {notaFinal.toFixed(1)}
                    </div>
                    <div className="flex items-center justify-end mt-1">
                        {getEstadoIcon()}
                        <span className={`text-xs ml-1 ${
                            porcentajeCompletado === 100 ? 
                                (aprobado ? "text-green-400" : "text-red-400") : 
                                "text-yellow-400"
                        }`}>
                            {getEstadoText()}
                        </span>
                    </div>
                </div>
            </div>

            {/* Información del profesor y horario */}
            <div className="space-y-2 mb-4">
                
                {seccion.horario && (
                    <div className="flex items-center text-sm text-gray-300">
                        <Clock className="w-4 h-4 mr-2 text-orange-400" />
                        <span>
                            {seccion.horario.dia} {seccion.horario.horaInicio?.slice(0, 5)} - {seccion.horario.horaFin?.slice(0, 5)}
                        </span>
                    </div>
                )}
                
                <div className="flex items-center text-sm text-gray-300">
                    <Calendar className="w-4 h-4 mr-2 text-purple-400" />
                    <span>{seccion.periodo}</span>
                </div>
            </div>

            {/* Evaluaciones */}
            <div className="border-t border-gray-700 pt-4">
                <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center">
                    <Target className="w-4 h-4 mr-2" />
                    Evaluaciones ({evaluaciones.length})
                </h4>
                
                {evaluaciones.length > 0 ? (
                    <div className="space-y-2">
                        {evaluaciones.map((evaluacion) => {
                            const nota = notas.find(n => n.evaluacionId === evaluacion.evaluacionId);
                            return (
                                <div key={evaluacion.evaluacionId} className="flex items-center justify-between p-2 bg-gray-700 bg-opacity-30 rounded">
                                    <div>
                                        <span className="text-sm text-gray-100">{evaluacion.tipoNombre}</span>
                                        <span className="text-xs text-gray-400 ml-2">({evaluacion.porcentaje}%)</span>
                                    </div>
                                    <div className="text-right">
                                        {nota ? (
                                            <div>
                                                <span className={`text-sm font-medium ${getNotaColor(nota.total)}`}>
                                                    {nota.total.toFixed(1)}
                                                </span>
                                                <div className="text-xs text-gray-400">
                                                    {((nota.total * evaluacion.porcentaje) / 100).toFixed(1)} pts
                                                </div>
                                            </div>
                                        ) : (
                                            <span className="text-xs text-gray-500">Sin nota</span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <p className="text-sm text-gray-500 italic">
                        No hay evaluaciones configuradas
                    </p>
                )}
            </div>

            {/* Progreso de evaluaciones */}
            <div className="mt-4 pt-4 border-t border-gray-700">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-400">Progreso del curso</span>
                    <span className="text-xs text-gray-400">{porcentajeCompletado}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${porcentajeCompletado}%` }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className={`h-2 rounded-full ${
                            porcentajeCompletado === 100 ? 
                                (aprobado ? "bg-green-500" : "bg-red-500") : 
                                "bg-blue-500"
                        }`}
                    />
                </div>
            </div>
        </motion.div>
    );
};

const SeccionesEstudianteView = ({ 
    loading, 
    onRefresh,
    periodosDisponibles = [],
    periodoSeleccionado,
    onPeriodoChange
}) => {
    const [secciones, setSecciones] = useState([]);
    const [loadingData, setLoadingData] = useState(false);
    const [error, setError] = useState("");

    // Función para obtener las secciones del estudiante con evaluaciones y notas
    const fetchSeccionesEstudiante = useCallback(async (periodo = null) => {
        try {
            setLoadingData(true);
            setError("");

            const userId = authUtils.getUserId();
            if (!userId) {
                throw new Error("No se encontró el ID del usuario");
            }

            console.log(`🔍 Obteniendo secciones del estudiante ${userId} para periodo:`, periodo);

            // 1. Obtener inscripciones del estudiante
            const inscripcionesResponse = await api.get(`Inscripcion/GetInscripcionesPorUsuario?id=${userId}`);
            const inscripciones = inscripcionesResponse.data;

            if (!inscripciones || inscripciones.length === 0) {
                setSecciones([]);
                return;
            }

            // 2. Obtener detalles de cada sección
            const seccionesPromises = inscripciones.map(inscripcion => 
                api.get(`Seccion/GetSeccionById/${inscripcion.seccionId}`)
            );
            
            const seccionesResponses = await Promise.all(seccionesPromises);
            let seccionesData = seccionesResponses.map(response => response.data);
            
            // 3. Filtrar por periodo si se especifica
            if (periodo) {
                seccionesData = seccionesData.filter(seccion => seccion.periodo === periodo);
            }

            if (seccionesData.length === 0) {
                setSecciones([]);
                return;
            }

            // 4. Obtener todos los horarios
            const horariosResponse = await api.get("Horario/GetAllHorarios");
            const todosLosHorarios = horariosResponse.data;

            // 5. Obtener información de cada curso
            const cursosPromises = seccionesData.map(seccion => 
                api.get(`Curso/GetCursoById/${seccion.cursoId}`)
            );
            const cursosResponses = await Promise.all(cursosPromises);
            const cursos = cursosResponses.map(response => response.data);

            // 6. Para cada sección, obtener evaluaciones y notas
            const seccionesConDatos = await Promise.all(
                seccionesData.map(async (seccion, index) => {
                    const horario = todosLosHorarios.find(h => h.horarioId === seccion.horarioId);
                    const curso = cursos[index];
                    const inscripcion = inscripciones.find(i => i.seccionId === seccion.seccionId);

                    // Obtener evaluaciones de la sección
                    let evaluaciones = [];
                    let notas = [];
                    
                    try {
                        const evaluacionesResponse = await api.get(`Evaluacion/ObtenerEvaluacionesPorSeccion/${seccion.seccionId}`);
                        evaluaciones = evaluacionesResponse.data.map(evaluacion => ({
                            ...evaluacion,
                            tipoNombre: getTipoEvaluacionNombre(evaluacion.tipEvaluacionId)
                        }));

                        // ✅ ARREGLO: Obtener notas del estudiante para esta sección con manejo de 404
                        try {
                            const notasResponse = await api.get(`Nota/GetNotasPorSeccion/${seccion.seccionId}`);
                            const todasLasNotas = notasResponse.data;
                            
                            // Filtrar solo las notas del estudiante actual
                            notas = todasLasNotas.filter(nota => nota.inscripcionId === inscripcion.inscripcionId);
                        } catch (notasError) {
                            // ✅ Si es 404, significa que no hay notas, no es un error
                            if (notasError.response?.status === 404) {
                                console.log(`📝 No hay notas para sección ${seccion.seccionId} (404), continuando con array vacío`);
                                notas = [];
                            } else {
                                // Si es otro error, re-lanzarlo
                                console.error(`Error obteniendo notas para sección ${seccion.seccionId}:`, notasError);
                                notas = []; // Continuar con array vacío para no romper la funcionalidad
                            }
                        }
                        
                    } catch (evalError) {
                        console.error(`Error obteniendo evaluaciones para sección ${seccion.seccionId}:`, evalError);
                        // Continuar con arrays vacíos para no romper la funcionalidad
                        evaluaciones = [];
                        notas = [];
                    }

                    return {
                        ...seccion,
                        horario,
                        curso,
                        inscripcionId: inscripcion.inscripcionId,
                        codigoCurso: curso?.codigo || `C${seccion.cursoId}`,
                        cursoNombre: curso?.nombre || 'Curso no encontrado',
                        evaluaciones,
                        notas
                    };
                })
            );

            // Ordenar por código de curso
            seccionesConDatos.sort((a, b) => (a.codigoCurso || '').localeCompare(b.codigoCurso || ''));

            setSecciones(seccionesConDatos);
            console.log('✅ Secciones del estudiante procesadas:', seccionesConDatos.length);

        } catch (error) {
            console.error("❌ Error obteniendo secciones del estudiante:", error);
            setError(error.response?.data?.message || error.message || "Error al cargar las secciones");
        } finally {
            setLoadingData(false);
        }
    }, []);

    // Función auxiliar para obtener el nombre del tipo de evaluación
    const getTipoEvaluacionNombre = (tipEvaluacionId) => {
        const tipos = {
            1: "Examen Parcial",
            2: "Examen Final", 
            3: "Tarea",
            4: "Proyecto",
            5: "Quiz",
            6: "Participación",
            7: "Laboratorio",
            8: "Presentación"
        };
        return tipos[tipEvaluacionId] || "Evaluación";
    };

    // Cargar secciones cuando cambie el periodo seleccionado
    useEffect(() => {
        if (periodoSeleccionado) {
            fetchSeccionesEstudiante(periodoSeleccionado);
        }
    }, [periodoSeleccionado, fetchSeccionesEstudiante]);

    // Calcular estadísticas
    const estadisticas = useMemo(() => {
        if (secciones.length === 0) {
            return {
                totalSecciones: 0,
                seccionesAprobadas: 0,
                seccionesEnProgreso: 0,
                promedioGeneral: 0,
                creditosTotales: 0
            };
        }

        let aprobadas = 0;
        let enProgreso = 0;
        let sumaNotas = 0;
        let creditosTotales = 0;

        secciones.forEach(seccion => {
            // Calcular nota final de la sección
            let notaTotal = 0;
            let porcentajeTotal = 0;

            seccion.evaluaciones.forEach(evaluacion => {
                const nota = seccion.notas.find(n => n.evaluacionId === evaluacion.evaluacionId);
                if (nota) {
                    notaTotal += (nota.total * evaluacion.porcentaje) / 100;
                    porcentajeTotal += evaluacion.porcentaje;
                }
            });

            if (porcentajeTotal === 100) {
                if (notaTotal >= 70) {
                    aprobadas++;
                }
                sumaNotas += notaTotal;
            } else {
                enProgreso++;
            }

            creditosTotales += seccion.curso?.creditos || 0;
        });

        return {
            totalSecciones: secciones.length,
            seccionesAprobadas: aprobadas,
            seccionesEnProgreso: enProgreso,
            promedioGeneral: secciones.length > 0 ? (sumaNotas / secciones.length).toFixed(1) : 0,
            creditosTotales
        };
    }, [secciones]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
            >
                <div className="flex-1">
                    <h1 className="text-3xl font-bold text-gray-100 mb-2">Mis Cursos</h1>
                    <p className="text-gray-400 mb-2">
                        Consulta tus cursos inscritos y el progreso de tus evaluaciones
                    </p>
                    
                    {/* Selector de periodo */}
                    {periodosDisponibles.length > 0 && (
                        <div className="flex items-center gap-3 mt-4">
                            <span className="text-gray-400 text-sm">Periodo:</span>
                            <div className="relative">
                                <select
                                    value={periodoSeleccionado}
                                    onChange={(e) => onPeriodoChange(e.target.value)}
                                    className="appearance-none bg-gray-700 border border-gray-600 rounded-lg px-3 py-1 pr-8 text-blue-400 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                >
                                    {periodosDisponibles.map((periodo) => (
                                        <option key={periodo} value={periodo}>
                                            {periodo}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            </div>
                        </div>
                    )}
                </div>
                
                <div className="flex items-center space-x-3">
                    {/* Botón de actualizar */}
                    <motion.button
                        onClick={onRefresh}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={loading || loadingData}
                        className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-800 text-white font-medium py-2 px-4 rounded-lg transition duration-200 flex items-center"
                    >
                        <RefreshCw className={`w-4 h-4 mr-2 ${(loading || loadingData) ? 'animate-spin' : ''}`} />
                        Actualizar
                    </motion.button>
                </div>
            </motion.div>

            {/* Estadísticas */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
            >
                <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-4 border border-gray-700">
                    <div className="flex items-center">
                        <div className="p-2 bg-blue-500 bg-opacity-20 rounded-lg">
                            <BookOpen className="w-5 h-5 text-blue-400" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-400">Total Cursos</p>
                            <p className="text-xl font-bold text-gray-100">{estadisticas.totalSecciones}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-4 border border-gray-700">
                    <div className="flex items-center">
                        <div className="p-2 bg-green-500 bg-opacity-20 rounded-lg">
                            <CheckCircle className="w-5 h-5 text-green-400" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-400">Aprobados</p>
                            <p className="text-xl font-bold text-gray-100">{estadisticas.seccionesAprobadas}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-4 border border-gray-700">
                    <div className="flex items-center">
                        <div className="p-2 bg-yellow-500 bg-opacity-20 rounded-lg">
                            <Clock className="w-5 h-5 text-yellow-400" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-400">En Progreso</p>
                            <p className="text-xl font-bold text-gray-100">{estadisticas.seccionesEnProgreso}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-4 border border-gray-700">
                    <div className="flex items-center">
                        <div className="p-2 bg-orange-500 bg-opacity-20 rounded-lg">
                            <GraduationCap className="w-5 h-5 text-orange-400" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-400">Créditos</p>
                            <p className="text-xl font-bold text-gray-100">{estadisticas.creditosTotales}</p>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Contenido principal */}
            {loadingData ? (
                <div className="flex justify-center items-center py-12">
                    <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="ml-3 text-gray-400">Cargando tus cursos...</span>
                </div>
            ) : error ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-red-500 bg-opacity-20 border border-red-500 text-red-400 px-6 py-4 rounded-lg text-center"
                >
                    <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                    <p className="font-medium">Error al cargar tus cursos</p>
                    <p className="text-sm opacity-75 mt-1">{error}</p>
                </motion.div>
            ) : secciones.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-12 border border-gray-700 text-center"
                >
                    <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-100 mb-2">
                        {periodoSeleccionado ? `No tienes cursos en ${periodoSeleccionado}` : "No tienes cursos inscritos"}
                    </h3>
                    <p className="text-gray-400">
                        {periodoSeleccionado 
                            ? "Intenta seleccionar otro periodo o contacta al administrador para inscribirte en cursos" 
                            : "Contacta al administrador para inscribirte en cursos"
                        }
                    </p>
                </motion.div>
            ) : (
                <>
                    {/* Grid de secciones */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
                    >
                        <AnimatePresence>
                            {secciones.map((seccion, index) => (
                                <SeccionCard
                                    key={seccion.seccionId}
                                    seccion={seccion}
                                    evaluaciones={seccion.evaluaciones}
                                    notas={seccion.notas}
                                    index={index}
                                />
                            ))}
                        </AnimatePresence>
                    </motion.div>

                    {/* Información adicional */}
                    {secciones.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="bg-blue-900 bg-opacity-30 border border-blue-700 rounded-lg p-6"
                        >
                            <h4 className="text-blue-300 font-semibold mb-3">Información sobre tus calificaciones:</h4>
                            <div className="text-blue-200 text-sm space-y-2">
                                <p>• El progreso del curso muestra qué porcentaje de evaluaciones tienen nota asignada.</p>
                                <p>• Solo se considera "Aprobado" cuando todas las evaluaciones (100%) tienen nota y el promedio es ≥ 70.</p>
                                {estadisticas.seccionesEnProgreso > 0 && (
                                    <p className="text-yellow-300">
                                        ⚠️ Tienes {estadisticas.seccionesEnProgreso} curso{estadisticas.seccionesEnProgreso > 1 ? 's' : ''} en progreso. 
                                        Las evaluaciones pendientes aparecerán aquí cuando el profesor asigne las notas.
                                    </p>
                                )}
                            </div>
                        </motion.div>
                    )}
                </>
            )}
        </div>
    );
};

export default SeccionesEstudianteView;