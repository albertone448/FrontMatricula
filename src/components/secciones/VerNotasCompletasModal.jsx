import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    X, 
    User, 
    AlertCircle,
    Calculator,
    Mail,
    CreditCard,
    Target,
    CheckCircle,
    XCircle,
    Clock
} from "lucide-react";

const EstudianteNotaRow = ({ estudiante, evaluaciones, index }) => {
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

    const getEstadoIcon = () => {
        if (porcentajeCompletado === 100) {
            return aprobado ? 
                <CheckCircle className="w-4 h-4 text-green-400" /> : 
                <XCircle className="w-4 h-4 text-red-400" />;
        }
        return <Clock className="w-4 h-4 text-yellow-400" />;
    };

    const getEstadoText = () => {
        if (porcentajeCompletado === 100) {
            return aprobado ? "Aprobado" : "Reprobado";
        }
        return `${porcentajeCompletado}%`;
    };

    return (
        <motion.tr
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05, duration: 0.2 }}
            className="hover:bg-gray-700 hover:bg-opacity-30 transition-colors duration-200 border-b border-gray-700"
        >
            {/* Estudiante */}
            <td className="px-4 py-3">
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {estudiante.usuario.nombre.charAt(0)}{estudiante.usuario.apellido1.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-100 truncate">
                            {estudiante.nombreCompleto}
                        </p>
                        <div className="flex items-center text-xs text-gray-400 space-x-2">
                            <span className="flex items-center">
                                <CreditCard className="w-3 h-3 mr-1" />
                                {estudiante.identificacion}
                            </span>
                        </div>
                    </div>
                </div>
            </td>

            {/* Evaluaciones (solo notas) */}
            {evaluaciones.map((evaluacion) => {
                const nota = estudiante.notas.find(n => n.evaluacionId === evaluacion.evaluacionId);
                return (
                    <td key={evaluacion.evaluacionId} className="px-3 py-3 text-center">
                        {nota ? (
                            <div className="flex flex-col items-center">
                                <span className={`text-sm font-bold ${getNotaColor(nota.total)}`}>
                                    {nota.total.toFixed(1)}
                                </span>
                                <span className="text-xs text-gray-500">
                                    {((nota.total * evaluacion.porcentaje) / 100).toFixed(1)}pts
                                </span>
                            </div>
                        ) : (
                            <span className="text-xs text-gray-500">-</span>
                        )}
                    </td>
                );
            })}

            {/* Nota Final */}
            <td className="px-4 py-3 text-center">
                <div className="flex flex-col items-center">
                    <span className={`text-lg font-bold ${getNotaColor(notaFinal)}`}>
                        {notaFinal.toFixed(1)}
                    </span>
                    <span className="text-xs text-gray-400">/{porcentajeCompletado}%</span>
                </div>
            </td>

            {/* Estado */}
            <td className="px-4 py-3 text-center">
                <div className="flex items-center justify-center space-x-1">
                    {getEstadoIcon()}
                    <span className={`text-xs font-medium ${
                        porcentajeCompletado === 100 ? 
                            (aprobado ? "text-green-400" : "text-red-400") : 
                            "text-yellow-400"
                    }`}>
                        {getEstadoText()}
                    </span>
                </div>
            </td>
        </motion.tr>
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

            // ✅ Si estudiantes es empty array, obtenerlos desde la API
            let estudiantesParaUsar = estudiantes;
            
            if (!estudiantes || estudiantes.length === 0) {
                console.log('⚠️ No hay estudiantes en props, obteniendo desde API...');
                
                try {
                    // Obtener inscripciones
                    const response = await fetch(`http://localhost:5276/api/Inscripcion/ListarUsuariosPorSeccion?id=${seccionId}`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`,
                            'Content-Type': 'application/json'
                        }
                    });
                    
                    if (!response.ok) {
                        throw new Error(`Error ${response.status}: ${response.statusText}`);
                    }
                    
                    const inscripciones = await response.json();
                    
                    // Obtener usuarios únicos
                    const usuariosUnicos = [...new Map(inscripciones.map(ins => [ins.usuarioId, ins])).values()];
                    
                    // Obtener información completa de cada usuario
                    const usuariosPromises = usuariosUnicos.map(async (inscripcion) => {
                        const userResponse = await fetch(`http://localhost:5276/api/Usuario/GetUsuarioPorId/${inscripcion.usuarioId}`, {
                            method: 'GET',
                            headers: {
                                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                                'Content-Type': 'application/json'
                            }
                        });
                        
                        if (!userResponse.ok) {
                            console.error(`Error obteniendo usuario ${inscripcion.usuarioId}`);
                            return null;
                        }
                        
                        const usuario = await userResponse.json();
                        
                        return {
                            inscripcionId: inscripcion.inscripcionId,
                            usuarioId: inscripcion.usuarioId,
                            usuario: usuario,
                            nombreCompleto: `${usuario.nombre} ${usuario.apellido1} ${usuario.apellido2 || ''}`.trim(),
                            identificacion: usuario.identificacion,
                            correo: usuario.correo
                        };
                    });
                    
                    const estudiantesObtenidos = await Promise.all(usuariosPromises);
                    estudiantesParaUsar = estudiantesObtenidos.filter(est => est !== null);
                    
                } catch (apiError) {
                    console.error('❌ Error obteniendo estudiantes desde API:', apiError);
                    estudiantesParaUsar = [];
                }
            }

            // Obtener todas las notas de la sección
            const notasData = await fetchNotasPorSeccion(seccionId);
            setNotasCompletas(notasData);

            if (estudiantesParaUsar.length === 0) {
                setEstudiantesConNotas([]);
                return;
            }

            // Procesar estudiantes con sus notas
            const estudiantesConNotasProcesados = estudiantesParaUsar.map(estudiante => {
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
            (estudiantesConNotas.reduce((sum, est) => sum + calcularNotaFinalEstudiante(est.notas, evaluaciones), 0) / estudiantesConNotas.length).toFixed(1) : "0",
        estudiantesConNotas: estudiantesConNotas.filter(est => est.notas.length > 0).length
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
            {/* Overlay con z-index muy alto */}
            <div 
                className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm" 
                onClick={handleClose} 
            />
            
            {/* Modal con z-index aún más alto */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="relative z-[10000] bg-gray-800 bg-opacity-95 backdrop-blur-md shadow-2xl rounded-xl border border-gray-700 w-[95vw] max-w-7xl h-[90vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header - Fijo */}
                <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-gray-700 bg-gray-900 bg-opacity-80">
                    <div className="flex items-center">
                        <div className="p-2 bg-purple-600 rounded-lg mr-3">
                            <Calculator className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-100">Notas Completas</h2>
                            <p className="text-sm text-gray-400">Resumen consolidado de evaluaciones</p>
                        </div>
                    </div>
                    
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-300 transition duration-200 p-2 rounded-lg hover:bg-gray-700"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Estadísticas - Fijo */}
                <div className="flex-shrink-0 p-4 border-b border-gray-700 bg-gray-900 bg-opacity-50">
                    <div className="grid grid-cols-4 gap-4 text-center">
                        <div>
                            <div className="text-xl font-bold text-blue-400">{estadisticas.totalEstudiantes}</div>
                            <div className="text-xs text-gray-400">Total</div>
                        </div>
                        <div>
                            <div className="text-xl font-bold text-green-400">{estadisticas.aprobados}</div>
                            <div className="text-xs text-gray-400">Aprobados</div>
                        </div>
                        <div>
                            <div className="text-xl font-bold text-yellow-400">{estadisticas.estudiantesConNotas}</div>
                            <div className="text-xs text-gray-400">Con Notas</div>
                        </div>
                        <div>
                            <div className="text-xl font-bold text-purple-400">{estadisticas.promedioGeneral}</div>
                            <div className="text-xs text-gray-400">Promedio</div>
                        </div>
                    </div>
                </div>

                {/* Contenido - Scrolleable */}
                <div className="flex-1 overflow-hidden">
                    {loading ? (
                        <div className="flex justify-center items-center h-full">
                            <div className="text-center">
                                <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                                <span className="text-sm text-gray-400">Cargando notas...</span>
                            </div>
                        </div>
                    ) : error ? (
                        <div className="flex justify-center items-center h-full">
                            <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-400 px-6 py-4 rounded-lg">
                                <AlertCircle className="w-5 h-5 mx-auto mb-2" />
                                <p className="font-medium text-sm">Error al cargar las notas</p>
                                <p className="text-xs opacity-75 mt-1">{error}</p>
                            </div>
                        </div>
                    ) : estudiantesConNotas.length === 0 ? (
                        <div className="flex justify-center items-center h-full">
                            <div className="text-center">
                                <User className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                <h3 className="text-lg font-bold text-gray-100 mb-2">
                                    No hay estudiantes registrados
                                </h3>
                                <p className="text-sm text-gray-400">
                                    Esta sección no tiene estudiantes inscritos.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full overflow-y-auto">
                            {/* Info adicional si no hay notas */}
                            {estadisticas.estudiantesConNotas === 0 && (
                                <div className="m-4 bg-yellow-900 bg-opacity-30 border border-yellow-700 rounded-lg p-3">
                                    <p className="text-yellow-200 text-sm">
                                        📝 {estadisticas.totalEstudiantes} estudiantes inscritos sin notas asignadas aún.
                                    </p>
                                </div>
                            )}
                            
                            {/* Tabla compacta */}
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-900 bg-opacity-50 sticky top-0">
                                        <tr>
                                            <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
                                                Estudiante
                                            </th>
                                            {evaluaciones.map((evaluacion) => (
                                                <th key={evaluacion.evaluacionId} className="text-center px-3 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider min-w-[80px]">
                                                    <div className="flex flex-col items-center">
                                                        <span className="truncate max-w-[60px]" title={evaluacion.tipoNombre}>
                                                            {evaluacion.tipoNombre}
                                                        </span>
                                                        <span className="text-xs text-gray-500">
                                                            {evaluacion.porcentaje}%
                                                        </span>
                                                    </div>
                                                </th>
                                            ))}
                                            <th className="text-center px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
                                                Final
                                            </th>
                                            <th className="text-center px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
                                                Estado
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-700">
                                        <AnimatePresence>
                                            {estudiantesConNotas.map((estudiante, index) => (
                                                <EstudianteNotaRow
                                                    key={estudiante.inscripcionId}
                                                    estudiante={estudiante}
                                                    evaluaciones={evaluaciones}
                                                    index={index}
                                                />
                                            ))}
                                        </AnimatePresence>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer - Fijo */}
                <div className="flex-shrink-0 p-4 border-t border-gray-700 bg-gray-900 bg-opacity-50">
                    <div className="bg-blue-900 bg-opacity-30 border border-blue-700 rounded-lg p-3">
                        <h4 className="text-blue-300 font-medium mb-1 text-sm">Información:</h4>
                        <div className="text-blue-200 text-xs space-y-1">
                            <p>• La nota de aprobacion es 70.</p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default VerNotasCompletasModal;