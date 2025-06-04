import { useState, useEffect } from "react";
import { authUtils } from "../utils/authUtils";
import api from "../services/apiConfig";

export const useInscripciones = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [periodosDisponibles, setPeriodosDisponibles] = useState([]);
    const [periodoSeleccionado, setPeriodoSeleccionado] = useState("");
    const [seccionesDisponibles, setSeccionesDisponibles] = useState([]);
    const [totalCreditos, setTotalCreditos] = useState(0);
    const [modalRetirarOpen, setModalRetirarOpen] = useState(false);
    const [seccionSeleccionada, setSeccionSeleccionada] = useState(null);

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
    };

    // Función para retirar una materia
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
        seccionSeleccionada,
        setError,
        setPeriodosDisponibles,
        setPeriodoSeleccionado,
        setModalRetirarOpen,
        setSeccionSeleccionada,
        fetchPeriodosDisponibles,
        fetchSeccionesDisponibles,
        handleInscribirMateria,
        handleRetirarMateria,
        handleConfirmRetiro,
        handlePeriodoChange,
        handleRefresh
    };
};
