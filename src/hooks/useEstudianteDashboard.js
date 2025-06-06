import { useState, useEffect, useCallback } from 'react';
import { authUtils } from '../utils/authUtils';
import api from '../services/apiConfig';

export const useEstudianteDashboard = () => {
    const [secciones, setSecciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [seccionesCount, setSeccionesCount] = useState(0);
    const [creditosInscritos, setCreditosInscritos] = useState(0);
    const [periodoActual, setPeriodoActual] = useState("");

    // Función para calcular el periodo actual
    const calcularPeriodoActual = useCallback(() => {
        const ahora = new Date();
        const año = ahora.getFullYear();
        const mes = ahora.getMonth() + 1; // getMonth() devuelve 0-11

        let periodo;
        if (mes >= 1 && mes <= 4) {
            periodo = "I";
        } else if (mes >= 5 && mes <= 8) {
            periodo = "II";
        } else {
            periodo = "III";
        }

        return `${año}-${periodo}`;
    }, []);

    // Función para obtener información del curso por ID
    const fetchCursoInfo = useCallback(async (cursoId) => {
        try {
            const response = await api.get(`Curso/GetCursoById/${cursoId}`);
            return response.data;
        } catch (error) {
            console.error(`Error al obtener curso ${cursoId}:`, error);
            return null;
        }
    }, []);

    // Función para obtener información del horario por ID
    const fetchHorarioInfo = useCallback(async (horarioId) => {
        try {
            const response = await api.get("Horario/GetAllHorarios");
            const horarios = response.data;
            return horarios.find(h => h.horarioId === horarioId) || null;
        } catch (error) {
            console.error(`Error al obtener horario ${horarioId}:`, error);
            return null;
        }
    }, []);

    // Función principal para cargar los datos del estudiante
    const fetchEstudianteData = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const userId = authUtils.getUserId();
            const token = authUtils.getToken();

            if (!userId || !token) {
                throw new Error("Usuario no autenticado");
            }

            // Calcular periodo actual
            const periodoCalculado = calcularPeriodoActual();
            setPeriodoActual(periodoCalculado);

            // 1. Obtener inscripciones del estudiante
            const inscripcionesResponse = await api.get(`Inscripcion/GetInscripcionesPorUsuario?id=${userId}`);
            const inscripciones = inscripcionesResponse.data;

            if (!inscripciones || inscripciones.length === 0) {
                setSecciones([]);
                setSeccionesCount(0);
                setCreditosInscritos(0);
                setLoading(false);
                return;
            }

            // 2. Obtener información de cada sección
            const seccionesPromises = inscripciones.map(inscripcion => 
                api.get(`Seccion/GetSeccionById/${inscripcion.seccionId}`)
            );
            const seccionesResponses = await Promise.all(seccionesPromises);
            const todasLasSecciones = seccionesResponses.map(response => response.data);

            // 3. Filtrar secciones del periodo actual
            const seccionesDelPeriodo = todasLasSecciones.filter(seccion => 
                seccion.periodo === periodoCalculado
            );

            setSeccionesCount(seccionesDelPeriodo.length);

            if (seccionesDelPeriodo.length === 0) {
                setSecciones([]);
                setCreditosInscritos(0);
                setLoading(false);
                return;
            }

            // 4. Enriquecer cada sección con información adicional
            const seccionesEnriquecidas = await Promise.all(
                seccionesDelPeriodo.map(async (seccion) => {
                    try {
                        // Obtener información del curso
                        const cursoInfo = await fetchCursoInfo(seccion.cursoId);
                        
                        // Obtener información del horario
                        const horarioInfo = await fetchHorarioInfo(seccion.horarioId);

                        return {
                            ...seccion,
                            curso: cursoInfo,
                            horario: horarioInfo,
                            codigoCurso: cursoInfo?.codigo || `C${seccion.cursoId}`,
                            cursoNombre: cursoInfo?.nombre || 'Curso no encontrado',
                            creditos: cursoInfo?.creditos || 0
                        };
                    } catch (error) {
                        console.error(`❌ Error procesando sección ${seccion.seccionId}:`, error);
                        return {
                            ...seccion,
                            curso: null,
                            horario: null,
                            codigoCurso: `C${seccion.cursoId}`,
                            cursoNombre: 'Error al cargar',
                            creditos: 0
                        };
                    }
                })
            );

            // 5. Calcular total de créditos
            const totalCreditos = seccionesEnriquecidas.reduce((total, seccion) => 
                total + (seccion.creditos || 0), 0
            );

            setSecciones(seccionesEnriquecidas);
            setCreditosInscritos(totalCreditos);

        } catch (error) {
            console.error("❌ Error al cargar datos del estudiante:", error);
            setError(error.message || "Error al cargar los datos del estudiante");
        } finally {
            setLoading(false);
        }
    }, [calcularPeriodoActual, fetchCursoInfo, fetchHorarioInfo]);

    // Función para refrescar los datos
    const refreshData = useCallback(() => {
        fetchEstudianteData();
    }, [fetchEstudianteData]);

    // Cargar datos al montar el hook
    useEffect(() => {
        fetchEstudianteData();
    }, [fetchEstudianteData]);

    return {
        secciones,
        loading,
        error,
        seccionesCount,
        creditosInscritos,
        periodoActual,
        refreshData
    };
};
