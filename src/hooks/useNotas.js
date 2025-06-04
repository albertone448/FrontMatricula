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

            console.log(`🔍 Obteniendo notas para sección ${seccionId}`);

            const response = await api.get(`Nota/GetNotasPorSeccion/${seccionId}`);
            
            console.log('✅ Notas obtenidas:', response.data);

            setNotas(response.data);
            return response.data;
        } catch (error) {
            console.error("❌ Error al obtener notas:", error);
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

            console.log(`🔍 Obteniendo inscripciones para sección ${seccionId}`);

            const response = await api.get(`Inscripcion/ListarUsuariosPorSeccion?id=${seccionId}`);
            
            console.log('✅ Inscripciones obtenidas:', response.data);

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

            console.log('🔄 Actualizando nota:', notaData);

            const response = await api.put("Nota/UpdateNota", notaData);
            
            console.log('✅ Nota actualizada exitosamente:', response.data);

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

            console.log('📝 Creando nota:', notaData);

            const response = await api.post("Nota/AddNota", notaData);
            
            console.log('✅ Nota creada exitosamente:', response.data);

            // Agregar la nueva nota al estado local
            setNotas(prev => [...prev, response.data]);
            
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

    // Función para obtener estudiantes con sus notas para una evaluación específica
    const fetchEstudiantesConNotas = useCallback(async (seccionId, evaluacionId) => {
        setLoading(true);
        setError("");

        try {
            console.log(`🔍 Obteniendo estudiantes con notas para sección ${seccionId}, evaluación ${evaluacionId}`);

            // 1. Obtener inscripciones de la sección
            const inscripciones = await fetchInscripcionesPorSeccion(seccionId);
            
            // 2. Obtener todas las notas de la sección
            const todasLasNotas = await fetchNotasPorSeccion(seccionId);
            
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

            console.log('✅ Estudiantes con notas procesados:', estudiantesConNotas);

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
        createNota
    };
};