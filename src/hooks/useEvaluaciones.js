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

            

            const response = await api.get(`Evaluacion/ObtenerEvaluacionesPorSeccion/${seccionId}`);
            
            

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

            

            const response = await api.post("Evaluacion/AddEvaluacion", evaluacionData);

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

    // Función para actualizar una evaluación existente
    const updateEvaluacion = useCallback(async (evaluacionData) => {
        setLoading(true);
        setError("");

        try {
            const token = authUtils.getToken();
            if (!token) {
                throw new Error("Token de autenticación no encontrado");
            }

            const response = await api.put("Evaluacion/UpdateEvaluacion", evaluacionData);

            // Actualizar la evaluación en el estado local
            setEvaluaciones(prev => prev.map(evaluacion =>
                evaluacion.evaluacionId === evaluacionData.evaluacionId
                    ? {
                        ...evaluacion,
                        tipEvaluacionId: evaluacionData.tipEvaluacionId,
                        porcentaje: evaluacionData.porcentaje,
                        tipoNombre: getTipoEvaluacionNombre(evaluacionData.tipEvaluacionId),
                        tipoDescripcion: getTipoEvaluacionDescripcion(evaluacionData.tipEvaluacionId)
                    }
                    : evaluacion
            ));
            
            return response.data;
        } catch (error) {
            console.error("❌ Error al actualizar evaluación:", error);
            const errorMessage = error.response?.data?.message || error.message || "Error al actualizar la evaluación";
            setError(errorMessage);
            throw error;
        } finally {
            setLoading(false);
        }
    }, [getTipoEvaluacionNombre, getTipoEvaluacionDescripcion]);

    // Función para eliminar una evaluación
    const deleteEvaluacion = useCallback(async (evaluacionId) => {
        setLoading(true);
        setError("");

        try {
            const token = authUtils.getToken();
            if (!token) {
                throw new Error("Token de autenticación no encontrado");
            }

            

            const response = await api.delete("Evaluacion/DeleteEvaluacion", {
                data: { evaluacionId: evaluacionId }
            });

            // Remover la evaluación del estado local
            setEvaluaciones(prev => prev.filter(evaluacion => evaluacion.evaluacionId !== evaluacionId));
            
            return response.data;
        } catch (error) {
            console.error("❌ Error al eliminar evaluación:", error);
            
            // Manejo específico de errores
            let errorMessage = "Error al eliminar la evaluación";
            
            if (error.response?.status === 400) {
                errorMessage = "En este momento no se puede eliminar la evaluación. Puede que tenga calificaciones asociadas.";
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    // Función para calcular el porcentaje total usado
    const calcularPorcentajeTotal = useCallback((evaluacionesActuales = []) => {
        return evaluacionesActuales.reduce((total, evaluacion) => {
            return total + (parseFloat(evaluacion.porcentaje) || 0);
        }, 0);
    }, []);

    // Función para validar si se puede agregar un nuevo porcentaje
    const validarPorcentaje = useCallback((nuevoPorcentaje, evaluacionesActuales = [], evaluacionEditandoId = null) => {
        // Si estamos editando, excluir la evaluación actual del cálculo
        const evaluacionesParaCalculo = evaluacionEditandoId 
            ? evaluacionesActuales.filter(evaluacion => evaluacion.evaluacionId !== evaluacionEditandoId)
            : evaluacionesActuales;
            
        const porcentajeTotal = calcularPorcentajeTotal(evaluacionesParaCalculo);
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
        updateEvaluacion,
        deleteEvaluacion,
        calcularPorcentajeTotal,
        validarPorcentaje,
        contarTipoEvaluacion,
        getTipoEvaluacionNombre,
        getTipoEvaluacionDescripcion
    };
};