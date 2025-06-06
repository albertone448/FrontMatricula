import { useState, useEffect, useCallback } from 'react';
import { authUtils } from '../utils/authUtils';
import api from '../services/apiConfig';

export const useProfesorDashboard = () => {
    const [secciones, setSecciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [seccionesCount, setSeccionesCount] = useState(0);
    const [estudiantesCount, setEstudiantesCount] = useState(0);
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

    // Función para obtener el número de estudiantes por sección
    const fetchEstudiantesPorSeccion = useCallback(async (seccionId) => {
        try {
            const response = await api.get(`Inscripcion/ListarUsuariosPorSeccion?id=${seccionId}`);
            return response.data?.length || 0;
        } catch (error) {
            console.error(`Error al obtener estudiantes de sección ${seccionId}:`, error);
            return 0;
        }
    }, []);

    // Función principal para cargar los datos del profesor
    const fetchProfesorData = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const userId = authUtils.getUserId();
            const token = authUtils.getToken();

            if (!userId || !token) {
                throw new Error("Usuario no autenticado");
            }

            console.log("🔍 Obteniendo datos del profesor:", userId);

            // Calcular periodo actual
            const periodoCalculado = calcularPeriodoActual();
            setPeriodoActual(periodoCalculado);

            console.log("📅 Periodo actual calculado:", periodoCalculado);

            // 1. Obtener todas las secciones
            const seccionesResponse = await api.get("Seccion/GetAllSecciones");
            const todasLasSecciones = seccionesResponse.data;

            console.log("📚 Total de secciones obtenidas:", todasLasSecciones.length);

            // 2. Filtrar secciones del profesor actual y del periodo actual
            const seccionesDelProfesor = todasLasSecciones.filter(seccion => 
                seccion.usuarioId === userId && seccion.periodo === periodoCalculado
            );

            console.log("👨‍🏫 Secciones del profesor en periodo actual:", seccionesDelProfesor.length);

            setSeccionesCount(seccionesDelProfesor.length);

            if (seccionesDelProfesor.length === 0) {
                setSecciones([]);
                setEstudiantesCount(0);
                setLoading(false);
                return;
            }

            // 3. Enriquecer cada sección con información adicional
            const seccionesEnriquecidas = await Promise.all(
                seccionesDelProfesor.map(async (seccion) => {
                    try {
                        console.log(`🔍 Procesando sección ${seccion.seccionId}`);

                        // Obtener información del curso
                        const cursoInfo = await fetchCursoInfo(seccion.cursoId);
                        
                        // Obtener información del horario
                        const horarioInfo = await fetchHorarioInfo(seccion.horarioId);
                        
                        // Obtener número de estudiantes
                        const estudiantesCount = await fetchEstudiantesPorSeccion(seccion.seccionId);

                        console.log(`📊 Sección ${seccion.seccionId}: ${estudiantesCount} estudiantes`);

                        return {
                            ...seccion,
                            curso: cursoInfo,
                            horario: horarioInfo,
                            estudiantesCount: estudiantesCount,
                            codigoCurso: cursoInfo?.codigo || `C${seccion.cursoId}`,
                            cursoNombre: cursoInfo?.nombre || 'Curso no encontrado'
                        };
                    } catch (error) {
                        console.error(`❌ Error procesando sección ${seccion.seccionId}:`, error);
                        return {
                            ...seccion,
                            curso: null,
                            horario: null,
                            estudiantesCount: 0,
                            codigoCurso: `C${seccion.cursoId}`,
                            cursoNombre: 'Error al cargar'
                        };
                    }
                })
            );

            // 4. Calcular total de estudiantes
            const totalEstudiantes = seccionesEnriquecidas.reduce((total, seccion) => 
                total + (seccion.estudiantesCount || 0), 0
            );

            console.log("✅ Datos del profesor procesados:", {
                secciones: seccionesEnriquecidas.length,
                totalEstudiantes: totalEstudiantes,
                periodo: periodoCalculado
            });

            setSecciones(seccionesEnriquecidas);
            setEstudiantesCount(totalEstudiantes);

        } catch (error) {
            console.error("❌ Error al cargar datos del profesor:", error);
            setError(error.message || "Error al cargar los datos del profesor");
        } finally {
            setLoading(false);
        }
    }, [calcularPeriodoActual, fetchCursoInfo, fetchHorarioInfo, fetchEstudiantesPorSeccion]);

    // Función para refrescar los datos
    const refreshData = useCallback(() => {
        fetchProfesorData();
    }, [fetchProfesorData]);

    // Cargar datos al montar el hook
    useEffect(() => {
        fetchProfesorData();
    }, [fetchProfesorData]);

    return {
        secciones,
        loading,
        error,
        seccionesCount,
        estudiantesCount,
        periodoActual,
        refreshData
    };
};