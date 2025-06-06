import { useState, useEffect } from "react";
import { authUtils } from "../utils/authUtils";
import api from "../services/apiConfig";
import SeccionesTable from "../components/secciones/SeccionesTable";

export const useInscripciones = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [periodosDisponibles, setPeriodosDisponibles] = useState([]);
    const [periodoSeleccionado, setPeriodoSeleccionado] = useState("");
    const [seccionesDisponibles, setSeccionesDisponibles] = useState([]);
    const [totalCreditos, setTotalCreditos] = useState(0);
    const [modalRetirarOpen, setModalRetirarOpen] = useState(false);
    const [inscripcionParaRetiro, setInscripcionParaRetiro] = useState(null);

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

            // 5.1. Obtener información de los profesores (using seccion.usuarioId as the link to the professor)
            const profesorUserIds = [...new Set(seccionesFiltradas.map(s => s.usuarioId).filter(Boolean))]; 
            
            let profesoresMap = {};
            if (profesorUserIds.length > 0) {
                const profesoresPromises = profesorUserIds.map(id =>
                    api.get(`Usuario/GetUsuarioPorId/${id}`).catch(err => {
                        
                        return null; 
                    })
                );
                const profesoresResponses = await Promise.all(profesoresPromises);
                

                profesoresResponses.forEach(response => {
                    if (response && response.data) { 
                        profesoresMap[response.data.usuarioId] = response.data;
                    }
                });
                
            }

            // Adicional: Obtener notas para las inscripciones actuales del estudiante
            let notasMap = {}; 
            if (inscripcionesActuales && inscripcionesActuales.length > 0) {
                const notasPromises = inscripcionesActuales.map((insc, idx) => { 
                    if (insc.inscripcionId) {
                        return api.get(`Nota/GetNotasPorInscripcion/${insc.inscripcionId}`)
                            .then(response => {
                                return { 
                                    inscripcionId: insc.inscripcionId, 
                                    tieneNotas: Array.isArray(response.data) && response.data.length > 0 
                                };
                            })
                            .catch(err => {
                                // console.warn(`Failed to load notas for inscripcionId ${insc.inscripcionId}:`, err); // Removed log
                                return { inscripcionId: insc.inscripcionId, tieneNotas: false }; 
                            });
                    }
                    return Promise.resolve({ inscripcionId: null, tieneNotas: false });
                });
                const notasResults = await Promise.all(notasPromises);
                notasResults.forEach(result => {
                    if (result.inscripcionId) {
                        notasMap[result.inscripcionId] = result.tieneNotas;
                    }
                });
               
            }

            // 6. Obtener el número de inscritos para cada sección
            const inscritosPromises = seccionesFiltradas.map(seccion =>
                api.get(`Inscripcion/ListarUsuariosPorSeccion?id=${seccion.seccionId}`)
                    .then(response => ({
                        seccionId: seccion.seccionId,
                        inscritosCount: response.data.length
                    }))
                    .catch(() => ({ seccionId: seccion.seccionId, inscritosCount: 0 }))
            );
            const inscritosCounts = await Promise.all(inscritosPromises);
            const inscritosMap = inscritosCounts.reduce((map, item) => {
                map[item.seccionId] = item.inscritosCount;
                return map;
            }, {});

            // 7. Procesar y combinar la información
            const seccionesProcesadas = seccionesFiltradas.map((seccion, index) => {
                const curso = cursos[index];
                const inscripcion = inscripcionesActuales.find(i => i.seccionId === seccion.seccionId);
                const horario = todosLosHorarios.find(h => h.horarioId === seccion.horarioId);
                const profesor = seccion.usuarioId ? profesoresMap[seccion.usuarioId] : null;
                const estaInscrito = !!inscripcion;
                const inscripcionIdActual = inscripcion?.inscripcionId;
                
                let lookupNotas = false;
                if (estaInscrito && inscripcionIdActual) {
                    lookupNotas = notasMap[inscripcionIdActual] || false;
                }
                const tieneNotasParaEstaSeccion = lookupNotas;

                return {
                    ...seccion,
                    curso,
                    horario,
                    profesor, 
                    inscrito: estaInscrito,
                    inscripcionId: inscripcionIdActual,
                    tieneNotas: tieneNotasParaEstaSeccion,
                    inscritos: inscritosMap[seccion.seccionId] || 0
                };
            }).filter(item => item.curso && item.horario); 

            setSeccionesDisponibles(seccionesProcesadas);
            // Removed log for final seccionesDisponibles
        } catch (error) {
            console.error("❌ Error obteniendo secciones disponibles:", error);
            setError(error.response?.data?.message || error.message || "Error al cargar las secciones");
        } finally {
            setLoading(false);
        }
    };

    // Validar antes de inscribir
    const validarInscripcion = (seccion, userCarrera) => { // Added userCarrera parameter
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

        // Verificar si la carrera de la sección es permitida para el usuario
        if (seccion.carrera && seccion.carrera !== "Carrera Libre" && seccion.carrera !== userCarrera) {
            setError(`Solo puedes inscribir materias de tu carrera (${userCarrera}) o de Carrera Libre.`);
            return false;
        }

        return true;
    };

    // Función para inscribir una materia
    const handleInscribirMateria = async (seccionId, nombreCurso, userCarrera) => { // Added userCarrera parameter
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
            if (!validarInscripcion(seccion, userCarrera)) { // Pass userCarrera
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
    };

    // Función para retirar una materia
    const handleRetirarMateria = async (inscripcionId, curso, horario, grupo) => {
        if (!inscripcionId) { 
            console.error("❌ handleRetirarMateria: inscripcionId no fue proporcionado.");
            return;
        }
        
        const seccionCompleta = seccionesDisponibles.find(s => s.inscripcionId === inscripcionId);

        if (!seccionCompleta) {
            console.error("❌ handleRetirarMateria: No se encontró la sección/inscripción completa con ID:", inscripcionId);
            // Fallback logic might be needed if seccionCompleta is essential and not found
            // For now, setting an error and returning if critical info is missing.
            setError("No se pudo encontrar la información de la sección para retirar.");
            return;
        }

        // Verificar si la sección tiene notas antes de proceder
        if (seccionCompleta.tieneNotas) {
            setError("No se puede retirar una materia que ya tiene notas registradas.");
            setSuccessMessage(""); // Clear any previous success message
            return; // No abrir el modal
        }

        setInscripcionParaRetiro({
            inscripcionId: seccionCompleta.inscripcionId,
            curso: seccionCompleta.curso,
            horario: seccionCompleta.horario,
            grupo: seccionCompleta.grupo,
            profesor: seccionCompleta.profesor // Store complete profesor object
        });
        setModalRetirarOpen(true);
    };

    // Función que se ejecuta cuando se confirma el retiro en el modal
    const handleConfirmRetiro = async () => {
        if (!inscripcionParaRetiro || !inscripcionParaRetiro.inscripcionId) {
            // console.error("❌ Error: No hay inscripción seleccionada para retirar o falta inscripcionId.", inscripcionParaRetiro); // Kept this error log as it indicates a potential bug state
            setError("Error: No se pudo identificar la inscripción a retirar.");
            setModalRetirarOpen(false);
            setInscripcionParaRetiro(null);
            return;
        }

        try {
            setLoading(true);
            setError("");
            setSuccessMessage("");

            // Eliminar la inscripción
            await api.delete('Inscripcion/DeleteInscripcion', { 
                data: { inscripcionId: inscripcionParaRetiro.inscripcionId,
                    usuarioId: authUtils.getUserId(),  
                    seccionId: inscripcionParaRetiro.seccionId  
                 } 
            });

            setSuccessMessage(`Has retirado exitosamente ${inscripcionParaRetiro.curso.nombre}`);
            
            // Recargar las secciones para actualizar el estado
            await fetchSeccionesDisponibles(periodoSeleccionado);
        } catch (error) {
            console.error("❌ Error al retirar materia (completo):", error);
            if (error.response) {
                console.error("❌ Error response data:", error.response.data);
                console.error("❌ Error response status:", error.response.status);
                console.error("❌ Error response headers:", error.response.headers);
            } else if (error.request) {
                console.error("❌ Error request:", error.request);
            } else {
                console.error("❌ Error message:", error.message);
            }
            setError(error.response?.data?.message || error.message || "Error al retirar la materia");
        } finally {
            setLoading(false);
            setModalRetirarOpen(false);
            setInscripcionParaRetiro(null);
        }
    };

    // Cálculo de créditos totales
    useEffect(() => {
        const creditosInscritos = seccionesDisponibles
            .filter(seccion => seccion.inscrito)
            .reduce((total, seccion) => total + (seccion.curso?.creditos || 0), 0);
        setTotalCreditos(creditosInscritos);
    }, [seccionesDisponibles]);

    // Función para manejar cambio de periodo
    const handlePeriodoChange = (nuevoPeriodo) => {
        setPeriodoSeleccionado(nuevoPeriodo);
        fetchSeccionesDisponibles(nuevoPeriodo);
    };

    // Función para refrescar datos
    const handleRefresh = () => {
        fetchSeccionesDisponibles(periodoSeleccionado);
    };

    return {
        loading,
        error,
        successMessage,
        periodosDisponibles,
        periodoSeleccionado,
        seccionesDisponibles,
        totalCreditos,
        modalRetirarOpen,
        inscripcionParaRetiro,
        setError,
        setPeriodosDisponibles,
        setPeriodoSeleccionado,
        setModalRetirarOpen,
        setInscripcionParaRetiro,
        fetchPeriodosDisponibles,
        fetchSeccionesDisponibles,
        handleInscribirMateria,
        handleRetirarMateria,
        handleConfirmRetiro,
        handlePeriodoChange,
        handleRefresh
    };
};
