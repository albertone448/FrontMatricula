import { useState, useCallback } from 'react';
import { authUtils } from '../utils/authUtils';
import api from '../services/apiConfig';

export const useEvaluaciones = () => {
    const [evaluaciones, setEvaluaciones] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Tipos de evaluación predefinidos
    const tiposEvaluacion = [
        {
            tipEvaluacionId: 1,
            nombre: "Examen Parcial",
            descripcion: "Evaluación teórica y práctica parcial"
        },
        {
            tipEvaluacionId: 2,
            nombre: "Examen Final",
            descripcion: "Evaluación final del curso"
        },
        {
            tipEvaluacionId: 3,
            nombre: "Tarea",
            descripcion: "Asignaciones y trabajos individuales"
        },
        {
            tipEvaluacionId: 4,
            nombre: "Proyecto",
            descripcion: "Proyecto grupal o individual"
        },
        {
            tipEvaluacionId: 5,
            nombre: "Quiz",
            descripcion: "Evaluaciones cortas"
        },
        {
            tipEvaluacionId: 6,
            nombre: "Participación",
            descripcion: "Participación en clase y actividades"
        },
        {
            tipEvaluacionId: 7,
            nombre: "Laboratorio",
            descripcion: "Prácticas de laboratorio"
        },
        {
            tipEvaluacionId: 8,
            nombre: "Presentación",
            descripcion: "Exposiciones orales"
        }
    ];

    // Función para obtener el nombre del tipo de evaluación por ID
    const getTipoEvaluacionNombre = useCallback((tipEvaluacionId) => {
        const tipo = tiposEvaluacion.find(t => t.tipEvaluacionId === tipEvaluacionId);
        return tipo ? tipo.nombre : 'Tipo desconocido';
    }, []);

    // Función para obtener la descripción del tipo de evaluación por ID
    const getTipoEvaluacionDescripcion = useCallback((tipEvaluacionId) => {
        const tipo = tiposEvaluacion.find(t => t.tipEvaluacionId === tipEvaluacionId);
        return tipo ? tipo.descripcion : '';
    }, []);

    // Función para obtener evaluaciones de una sección
    const fetchEvaluaciones = useCallback(async (seccionId) => {
        setLoading(true);
        setError("");

        try {
            const token = authUtils.getToken();
            if (!token) {
                throw new Error("Token de autenticación no encontrado");
            }

            console.log(`🔍 Obteniendo evaluaciones para sección ${seccionId}`);

            const response = await api.get(`Evaluacion/ObtenerEvaluacionesPorSeccion/${seccionId}`);
            
            console.log('✅ Evaluaciones obtenidas:', response.data);

            // Enriquecer las evaluaciones con información del tipo
            const evaluacionesEnriquecidas = response.data.map(evaluacion => ({
                ...evaluacion,
                tipoNombre: getTipoEvaluacionNombre(evaluacion.tipEvaluacionId),
                tipoDescripcion: getTipoEvaluacionDescripcion(evaluacion.tipEvaluacionId)
            }));

            setEvaluaciones(evaluacionesEnriquecidas);
            return evaluacionesEnriquecidas;
        } catch (error) {
            console.error("❌ Error al obtener evaluaciones:", error);
            const errorMessage = error.response?.data?.message || error.message || "Error al cargar las evaluaciones";
            setError(errorMessage);
            throw error;
        } finally {
            setLoading(false);
        }
    }, [getTipoEvaluacionNombre, getTipoEvaluacionDescripcion]);

    // Función para crear una nueva evaluación
    const createEvaluacion = useCallback(async (evaluacionData) => {
        setLoading(true);
        setError("");

        try {
            const token = authUtils.getToken();
            if (!token) {
                throw new Error("Token de autenticación no encontrado");
            }

            console.log('📝 Creando evaluación:', evaluacionData);

            const response = await api.post("Evaluacion/AddEvaluacion", evaluacionData);
            
            console.log('✅ Evaluación creada exitosamente:', response.data);

            // Refrescar las evaluaciones después de crear una nueva
            await fetchEvaluaciones(evaluacionData.seccionId);
            
            return response.data;
        } catch (error) {
            console.error("❌ Error al crear evaluación:", error);
            const errorMessage = error.response?.data?.message || error.message || "Error al crear la evaluación";
            setError(errorMessage);
            throw error;
        } finally {
            setLoading(false);
        }
    }, [fetchEvaluaciones]);

    // Función para calcular el porcentaje total usado
    const calcularPorcentajeTotal = useCallback((evaluacionesActuales = []) => {
        return evaluacionesActuales.reduce((total, evaluacion) => {
            return total + (parseFloat(evaluacion.porcentaje) || 0);
        }, 0);
    }, []);

    // Función para validar si se puede agregar un nuevo porcentaje
    const validarPorcentaje = useCallback((nuevoPorcentaje, evaluacionesActuales = []) => {
        const porcentajeTotal = calcularPorcentajeTotal(evaluacionesActuales);
        const porcentajeDisponible = 100 - porcentajeTotal;
        
        if (nuevoPorcentaje > porcentajeDisponible) {
            return {
                esValido: false,
                mensaje: `Solo quedan ${porcentajeDisponible}% disponibles. El total actual es ${porcentajeTotal}%.`,
                porcentajeDisponible
            };
        }

        return {
            esValido: true,
            mensaje: "Porcentaje válido",
            porcentajeDisponible
        };
    }, [calcularPorcentajeTotal]);

    // Función para contar cuántas veces se ha usado un tipo de evaluación
    const contarTipoEvaluacion = useCallback((tipEvaluacionId, evaluacionesActuales = []) => {
        return evaluacionesActuales.filter(evaluacion => evaluacion.tipEvaluacionId === tipEvaluacionId).length;
    }, []);

    return {
        evaluaciones,
        loading,
        error,
        tiposEvaluacion,
        fetchEvaluaciones,
        createEvaluacion,
        calcularPorcentajeTotal,
        validarPorcentaje,
        contarTipoEvaluacion,
        getTipoEvaluacionNombre,
        getTipoEvaluacionDescripcion
    };
};