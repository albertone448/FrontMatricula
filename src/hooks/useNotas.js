import { useState, useCallback } from 'react';
import { authUtils } from '../utils/authUtils';
import api from '../services/apiConfig';

export const useNotas = () => {
    const [notas, setNotas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Función para obtener todas las notas de una sección
    const fetchNotasPorSeccion = useCallback(async (seccionId) => {
        setLoading(true);
        setError("");

        try {
            const token = authUtils.getToken();
            if (!token) {
                throw new Error("Token de autenticación no encontrado");
            }

            const response = await api.get(`Nota/GetNotasPorSeccion/${seccionId}`);

            setNotas(response.data);
            return response.data;
        } catch (error) {
            console.error("❌ Error al obtener notas:", error);

            // ✅ ARREGLO: Si es 404, significa que no hay notas, no es un error real
            if (error.response?.status === 404) {
                
                const emptyNotas = [];
                setNotas(emptyNotas);
                return emptyNotas;
            }
            
            const errorMessage = error.response?.data?.message || error.message || "Error al cargar las notas";
            setError(errorMessage);
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    // Función para obtener inscripciones de una sección
    const fetchInscripcionesPorSeccion = useCallback(async (seccionId) => {
        try {
            const token = authUtils.getToken();
            if (!token) {
                throw new Error("Token de autenticación no encontrado");
            }

            const response = await api.get(`Inscripcion/ListarUsuariosPorSeccion?id=${seccionId}`);

            return response.data;
        } catch (error) {
            console.error("❌ Error al obtener inscripciones:", error);
            throw error;
        }
    }, []);

    // Función para obtener información de un usuario
    const fetchUsuarioPorId = useCallback(async (usuarioId) => {
        try {
            const token = authUtils.getToken();
            if (!token) {
                throw new Error("Token de autenticación no encontrado");
            }

            const response = await api.get(`Usuario/GetUsuarioPorId/${usuarioId}`);
            return response.data;
        } catch (error) {
            console.error(`❌ Error al obtener usuario ${usuarioId}:`, error);
            throw error;
        }
    }, []);

    // Función para actualizar una nota existente
    const updateNota = useCallback(async (notaData) => {
        setLoading(true);
        setError("");

        try {
            const token = authUtils.getToken();
            if (!token) {
                throw new Error("Token de autenticación no encontrado");
            }

            const response = await api.put("Nota/UpdateNota", notaData);

            // Actualizar la nota en el estado local
            setNotas(prev => prev.map(nota => 
                nota.notaId === notaData.notaId 
                    ? { ...nota, total: notaData.total }
                    : nota
            ));
            
            return response.data;
        } catch (error) {
            console.error("❌ Error al actualizar nota:", error);
            const errorMessage = error.response?.data?.message || error.message || "Error al actualizar la nota";
            setError(errorMessage);
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    // Función para crear una nueva nota
    const createNota = useCallback(async (notaData) => {
        setLoading(true);
        setError("");

        try {
            const token = authUtils.getToken();
            if (!token) {
                throw new Error("Token de autenticación no encontrado");
            }

           

            // Usar el endpoint correcto para crear nota
            const response = await api.post("Nota/CrearNota", {
                evaluacionId: notaData.evaluacionId,
                inscripcionId: notaData.inscripcionId,
                total: notaData.total
            });
            
            

            // Agregar la nueva nota al estado local
            const nuevaNota = {
                notaId: response.data.notaId || Date.now(), // En caso de que no venga el ID
                evaluacionId: notaData.evaluacionId,
                inscripcionId: notaData.inscripcionId,
                total: notaData.total
            };
            setNotas(prev => [...prev, nuevaNota]);
            
            return response.data;
        } catch (error) {
            console.error("❌ Error al crear nota:", error);
            const errorMessage = error.response?.data?.message || error.message || "Error al crear la nota";
            setError(errorMessage);
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    // ✨ NUEVA FUNCIÓN: Guardar nota (crear o actualizar automáticamente)
    const saveNota = useCallback(async (notaData, seccionId, evaluacionId) => {
        setLoading(true);
        setError("");

        try {
            const token = authUtils.getToken();
            if (!token) {
                throw new Error("Token de autenticación no encontrado");
            }

            // Determinar si debe crear o actualizar basado en si tiene notaId y si es > 0
            const isNewNota = !notaData.notaId || notaData.notaId === 0;
            
            if (isNewNota) {
            

                // Crear nueva nota
                const response = await api.post("Nota/CrearNota", {
                    evaluacionId: notaData.evaluacionId,
                    inscripcionId: notaData.inscripcionId,
                    total: notaData.total
                });


                // ✨ SOLUCIÓN: Refrescar los datos para obtener el notaId real
                // Obtener todas las notas actualizadas de la sección
                const notasActualizadas = await fetchNotasPorSeccion(seccionId);
                
                // Encontrar la nota recién creada para este estudiante y evaluación
                const notaCreada = notasActualizadas.find(nota => 
                    nota.evaluacionId === notaData.evaluacionId && 
                    nota.inscripcionId === notaData.inscripcionId
                );

                const notaIdReal = notaCreada ? notaCreada.notaId : (response.data.notaId || response.data.id);

                return {
                    ...response.data,
                    isNew: true,
                    notaId: notaIdReal, // Usar el ID real de la base de datos
                    total: notaData.total,
                    evaluacionId: notaData.evaluacionId,
                    inscripcionId: notaData.inscripcionId
                };
            } else {
                

                // Actualizar nota existente
                const response = await api.put("Nota/UpdateNota", {
                    notaId: notaData.notaId,
                    evaluacionId: notaData.evaluacionId,
                    inscripcionId: notaData.inscripcionId,
                    total: notaData.total
                });

                

                // Actualizar la nota en el estado local
                setNotas(prev => prev.map(nota => 
                    nota.notaId === notaData.notaId 
                        ? { ...nota, total: notaData.total }
                        : nota
                ));
                
                return {
                    ...response.data,
                    isNew: false,
                    notaId: notaData.notaId,
                    total: notaData.total,
                    evaluacionId: notaData.evaluacionId,
                    inscripcionId: notaData.inscripcionId
                };
            }
        } catch (error) {
            console.error("❌ Error al guardar nota:", error);
            const errorMessage = error.response?.data?.message || error.message || "Error al guardar la nota";
            setError(errorMessage);
            throw error;
        } finally {
            setLoading(false);
        }
    }, [fetchNotasPorSeccion]);

    // Función para obtener estudiantes con sus notas para una evaluación específica
    const fetchEstudiantesConNotas = useCallback(async (seccionId, evaluacionId) => {
        setLoading(true);
        setError("");

        try {
            

            // 1. Obtener inscripciones de la sección
            const inscripciones = await fetchInscripcionesPorSeccion(seccionId);
            
            // 2. Obtener todas las notas de la sección - ✅ ARREGLO: Manejar 404
            let todasLasNotas = [];
            try {
                todasLasNotas = await fetchNotasPorSeccion(seccionId);
            } catch (notasError) {
                // Si hay error obteniendo notas y no es 404, re-lanzar el error
                if (notasError.response?.status !== 404) {
                    throw notasError;
                }
                // Si es 404, continuar con array vacío (ya manejado en fetchNotasPorSeccion)
               
                todasLasNotas = [];
            }
            
            // 3. Filtrar notas de la evaluación específica
            const notasEvaluacion = todasLasNotas.filter(nota => nota.evaluacionId === evaluacionId);

            // 4. Obtener usuarios únicos de las inscripciones
            const usuariosUnicos = [...new Map(inscripciones.map(ins => [ins.usuarioId, ins])).values()];

            // 5. Obtener información completa de cada usuario
            const usuariosPromises = usuariosUnicos.map(inscripcion => 
                fetchUsuarioPorId(inscripcion.usuarioId)
            );
            
            const usuarios = await Promise.all(usuariosPromises);

            // 6. Combinar información de estudiantes con sus notas
            const estudiantesConNotas = usuariosUnicos.map((inscripcion, index) => {
                const usuario = usuarios[index];
                const nota = notasEvaluacion.find(n => n.inscripcionId === inscripcion.inscripcionId);
                
                return {
                    inscripcionId: inscripcion.inscripcionId,
                    usuarioId: inscripcion.usuarioId,
                    usuario: usuario,
                    nota: nota || null, // null si no tiene nota asignada
                    nombreCompleto: `${usuario.nombre} ${usuario.apellido1} ${usuario.apellido2 || ''}`.trim(),
                    identificacion: usuario.identificacion,
                    correo: usuario.correo
                };
            });

            // 7. Ordenar por nombre
            estudiantesConNotas.sort((a, b) => a.nombreCompleto.localeCompare(b.nombreCompleto));

           

            return estudiantesConNotas;
        } catch (error) {
            console.error("❌ Error al obtener estudiantes con notas:", error);
            const errorMessage = error.response?.data?.message || error.message || "Error al cargar estudiantes";
            setError(errorMessage);
            throw error;
        } finally {
            setLoading(false);
        }
    }, [fetchInscripcionesPorSeccion, fetchNotasPorSeccion, fetchUsuarioPorId]);

    return {
        notas,
        loading,
        error,
        fetchNotasPorSeccion,
        fetchInscripcionesPorSeccion,
        fetchUsuarioPorId,
        fetchEstudiantesConNotas,
        updateNota,
        createNota,
        saveNota // ✨ Nueva función que maneja crear o actualizar automáticamente
    };
};