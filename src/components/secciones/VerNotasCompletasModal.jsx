import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    X, 
    Eye, 
    User, 
    TrendingUp, 
    Award, 
    AlertCircle,
    CheckCircle,
    Calculator,
    Mail,
    CreditCard,
    Target,
    Percent
} from "lucide-react";

const EstudianteNotasCard = ({ estudiante, evaluaciones, onClose }) => {
    const calcularNotaFinal = () => {
        let notaTotal = 0;
        let porcentajeTotal = 0;

        evaluaciones.forEach(evaluacion => {
            const nota = estudiante.notas.find(n => n.evaluacionId === evaluacion.evaluacionId);
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

    const getEstadoColor = () => {
        if (porcentajeCompletado === 100) {
            return aprobado ? "text-green-400 bg-green-500" : "text-red-400 bg-red-500";
        }
        return "text-yellow-400 bg-yellow-500";
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-4"
        >
            {/* Header del estudiante */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                    <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                        {estudiante.usuario.nombre.charAt(0)}{estudiante.usuario.apellido1.charAt(0)}
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold text-gray-100">
                            {estudiante.nombreCompleto}
                        </h3>
                        <div className="flex items-center text-sm text-gray-400 mt-1">
                            <CreditCard className="w-4 h-4 mr-1" />
                            <span>{estudiante.identificacion}</span>
                            <span className="mx-2">•</span>
                            <Mail className="w-4 h-4 mr-1" />
                            <span>{estudiante.correo}</span>
                        </div>
                    </div>
                </div>
                
                {/* Nota final destacada */}
                <div className="text-center">
                    <div className={`text-3xl font-bold ${getNotaColor(notaFinal)}`}>
                        {notaFinal.toFixed(1)}
                    </div>
                    <div className="text-sm text-gray-400">Nota Final</div>
                    <div className={`text-xs px-2 py-1 rounded-full mt-1 ${getEstadoColor()} bg-opacity-20`}>
                        {porcentajeCompletado === 100 ? 
                            (aprobado ? "Aprobado" : "Reprobado") : 
                            `${porcentajeCompletado}% Completado`
                        }
                    </div>
                </div>
            </div>

            {/* Detalles de evaluaciones */}
            <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-100 flex items-center">
                    <Target className="w-5 h-5 mr-2 text-blue-400" />
                    Detalles por Evaluación
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {evaluaciones.map((evaluacion) => {
                        const nota = estudiante.notas.find(n => n.evaluacionId === evaluacion.evaluacionId);
                        const contribucion = nota ? (nota.total * evaluacion.porcentaje) / 100 : 0;
                        
                        return (
                            <div key={evaluacion.evaluacionId} className="bg-gray-700 bg-opacity-50 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <h5 className="font-medium text-gray-100">{evaluacion.tipoNombre}</h5>
                                    <span className="text-sm text-gray-400">{evaluacion.porcentaje}%</span>
                                </div>
                                
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        {nota ? (
                                            <>
                                                <span className={`text-lg font-bold ${getNotaColor(nota.total)}`}>
                                                    {nota.total.toFixed(1)}
                                                </span>
                                                <span className="text-gray-400 text-sm ml-1">/100</span>
                                            </>
                                        ) : (
                                            <span className="text-gray-500 text-sm">Sin nota</span>
                                        )}
                                    </div>
                                    
                                    <div className="text-right">
                                        <div className="text-sm text-blue-400">
                                            +{contribucion.toFixed(1)} pts
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            al total
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Barra de progreso */}
                                <div className="mt-3">
                                    <div className="w-full bg-gray-600 rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full transition-all duration-500 ${
                                                nota ? (nota.total >= 70 ? "bg-green-500" : "bg-red-500") : "bg-gray-500"
                                            }`}
                                            style={{ width: nota ? `${nota.total}%` : "0%" }}
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Resumen final */}
                <div className="mt-6 pt-4 border-t border-gray-700">
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                            <div className="text-lg font-bold text-blue-400">
                                {estudiante.notas.length}
                            </div>
                            <div className="text-sm text-gray-400">Evaluaciones</div>
                        </div>
                        <div>
                            <div className="text-lg font-bold text-purple-400">
                                {porcentajeCompletado}%
                            </div>
                            <div className="text-sm text-gray-400">Completado</div>
                        </div>
                        <div>
                            <div className={`text-lg font-bold ${getNotaColor(notaFinal)}`}>
                                {notaFinal.toFixed(1)}
                            </div>
                            <div className="text-sm text-gray-400">Promedio</div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const VerNotasCompletasModal = ({ 
    isOpen, 
    onClose, 
    seccionId,
    estudiantes = [],
    evaluaciones = [],
    fetchNotasPorSeccion
}) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [notasCompletas, setNotasCompletas] = useState([]);
    const [estudiantesConNotas, setEstudiantesConNotas] = useState([]);

    useEffect(() => {
        if (isOpen && seccionId) {
            fetchNotasData();
        }
    }, [isOpen, seccionId]);

    const fetchNotasData = async () => {
        try {
            setLoading(true);
            setError("");

            console.log(`🔍 Obteniendo todas las notas para sección ${seccionId}`);

            // Obtener todas las notas de la sección
            const notasData = await fetchNotasPorSeccion(seccionId);
            setNotasCompletas(notasData);

            // Procesar estudiantes con sus notas
            const estudiantesConNotasProcesados = estudiantes.map(estudiante => {
                const notasDelEstudiante = notasData.filter(nota => 
                    nota.inscripcionId === estudiante.inscripcionId
                );

                return {
                    ...estudiante,
                    notas: notasDelEstudiante
                };
            });

            // Ordenar por nota final (descendente)
            estudiantesConNotasProcesados.sort((a, b) => {
                const notaA = calcularNotaFinalEstudiante(a.notas, evaluaciones);
                const notaB = calcularNotaFinalEstudiante(b.notas, evaluaciones);
                return notaB - notaA;
            });

            setEstudiantesConNotas(estudiantesConNotasProcesados);

            console.log('✅ Notas completas cargadas exitosamente');

        } catch (error) {
            console.error("❌ Error al cargar notas completas:", error);
            setError(error.message || "Error al cargar las notas completas");
        } finally {
            setLoading(false);
        }
    };

    const calcularNotaFinalEstudiante = (notas, evaluaciones) => {
        let notaTotal = 0;
        evaluaciones.forEach(evaluacion => {
            const nota = notas.find(n => n.evaluacionId === evaluacion.evaluacionId);
            if (nota) {
                notaTotal += (nota.total * evaluacion.porcentaje) / 100;
            }
        });
        return notaTotal;
    };

    const handleClose = () => {
        setNotasCompletas([]);
        setEstudiantesConNotas([]);
        setError("");
        onClose();
    };

    if (!isOpen) return null;

    const estadisticas = {
        totalEstudiantes: estudiantesConNotas.length,
        aprobados: estudiantesConNotas.filter(est => {
            const notaFinal = calcularNotaFinalEstudiante(est.notas, evaluaciones);
            const porcentajeTotal = evaluaciones.reduce((sum, ev) => {
                const tieneNota = est.notas.some(n => n.evaluacionId === ev.evaluacionId);
                return tieneNota ? sum + ev.porcentaje : sum;
            }, 0);
            return notaFinal >= 70 && porcentajeTotal === 100;
        }).length,
        promedioGeneral: estudiantesConNotas.length > 0 ? 
            (estudiantesConNotas.reduce((sum, est) => sum + calcularNotaFinalEstudiante(est.notas, evaluaciones), 0) / estudiantesConNotas.length).toFixed(1) : "0"
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay */}
            <div 
                className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" 
                onClick={handleClose} 
            />
            
            {/* Modal */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="relative bg-gray-800 bg-opacity-95 backdrop-blur-md shadow-xl rounded-xl border border-gray-700 w-full max-w-6xl mx-4 max-h-[90vh] overflow-hidden"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-700">
                    <div className="flex items-center">
                        <div className="p-3 bg-purple-600 rounded-full mr-4">
                            <Calculator className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-100">Notas Completas</h2>
                            <p className="text-gray-400">Resumen de todas las evaluaciones y notas finales</p>
                        </div>
                    </div>
                    
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-300 transition duration-200 p-2 rounded-lg hover:bg-gray-700"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Estadísticas generales */}
                <div className="p-6 border-b border-gray-700 bg-gray-900 bg-opacity-50">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-blue-400">{estadisticas.totalEstudiantes}</div>
                            <div className="text-sm text-gray-400">Total Estudiantes</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-400">{estadisticas.aprobados}</div>
                            <div className="text-sm text-gray-400">Aprobados</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-red-400">{estadisticas.totalEstudiantes - estadisticas.aprobados}</div>
                            <div className="text-sm text-gray-400">En Riesgo</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-purple-400">{estadisticas.promedioGeneral}</div>
                            <div className="text-sm text-gray-400">Promedio General</div>
                        </div>
                    </div>
                </div>

                {/* Contenido */}
                <div className="p-6 overflow-y-auto max-h-[60vh]">
                    {loading ? (
                        <div className="flex justify-center items-center py-12">
                            <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                            <span className="ml-3 text-gray-400">Cargando notas completas...</span>
                        </div>
                    ) : error ? (
                        <div className="text-center py-12">
                            <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-400 px-6 py-4 rounded-lg inline-block">
                                <AlertCircle className="w-6 h-6 mx-auto mb-2" />
                                <p className="font-medium">Error al cargar las notas</p>
                                <p className="text-sm opacity-75 mt-1">{error}</p>
                            </div>
                        </div>
                    ) : estudiantesConNotas.length === 0 ? (
                        <div className="text-center py-12">
                            <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-gray-100 mb-2">
                                No hay estudiantes con notas
                            </h3>
                            <p className="text-gray-400">
                                Esta sección no tiene estudiantes con notas asignadas.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <AnimatePresence>
                                {estudiantesConNotas.map((estudiante, index) => (
                                    <motion.div
                                        key={estudiante.inscripcionId}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <EstudianteNotasCard
                                            estudiante={estudiante}
                                            evaluaciones={evaluaciones}
                                            onClose={handleClose}
                                        />
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-700 bg-gray-900 bg-opacity-50">
                    <div className="bg-blue-900 bg-opacity-30 border border-blue-700 rounded-lg p-4">
                        <h4 className="text-blue-300 font-semibold mb-2">Información del cálculo de notas:</h4>
                        <div className="text-blue-200 text-sm space-y-1">
                            <p>• La nota final se calcula sumando cada evaluación multiplicada por su porcentaje.</p>
                            <p>• Para aprobar se requiere una nota final ≥ 70 y tener todas las evaluaciones completas.</p>
                            <p>• Los estudiantes están ordenados por nota final (mayor a menor).</p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default VerNotasCompletasModal;