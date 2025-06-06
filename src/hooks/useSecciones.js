import { useState, useEffect, useCallback } from 'react';
import { authUtils } from '../utils/authUtils';
import api from '../services/apiConfig';

export const useSecciones = () => {
    const [secciones, setSecciones] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [profesores, setProfesores] = useState([]);
    const [cursos, setCursos] = useState([]);

    // Función para obtener información del profesor
    const fetchProfesorInfo = useCallback(async (usuarioId) => {
        try {
            const response = await api.get(`Usuario/GetUsuarioPorId/${usuarioId}`);
            return response.data;
        } catch (error) {
            console.error(`Error al obtener profesor ${usuarioId}:`, error);
            return null;
        }
    }, []);

    // Función para obtener información del curso
    const fetchCursoInfo = useCallback(async (cursoId) => {
        try {
            const response = await api.get(`Curso/GetCursoById/${cursoId}`);
            return response.data;
        } catch (error) {
            console.error(`Error al obtener curso ${cursoId}:`, error);
            return null;
        }
    }, []);

    // Función para obtener todos los profesores
    const fetchProfesores = useCallback(async () => {
        try {
            const response = await api.get("Usuario/GetTodosLosUsuarios");
            const allUsers = response.data;
            // Filtrar solo los profesores
            const profesoresData = allUsers.filter(user => user.rol === "Profesor");
            setProfesores(profesoresData);
            return profesoresData;
        } catch (error) {
            console.error("Error al obtener profesores:", error);
            return [];
        }
    }, []);

    // Función para obtener todos los cursos
    const fetchCursos = useCallback(async () => {
        try {
            const response = await api.get("Curso/GetAllCursos");
            setCursos(response.data);
            return response.data;
        } catch (error) {
            console.error("Error al obtener cursos:", error);
            return [];
        }
    }, []);

    const fetchSecciones = useCallback(async () => {
        setLoading(true);
        setError("");
        setSuccessMessage("");

        try {
            const token = authUtils.getToken();
            if (!token) {
                throw new Error("Token de autenticación no encontrado");
            }
            
            const response = await api.get("Seccion/GetAllSecciones");
           

            let seccionesData = [];
            
            if (Array.isArray(response.data)) {
                seccionesData = response.data;
            } else if (response.data && typeof response.data === 'object') {
                if (response.data.data && Array.isArray(response.data.data)) {
                    seccionesData = response.data.data;
                } else {
                    console.error("Unexpected API response format:", response.data);
                    setError("Formato de respuesta no válido");
                    return;
                }
            } else {
                console.error("Unexpected API response format:", response.data);
                setError("Formato de respuesta no válido");
                return;
            }

            // Obtener información adicional para cada sección
            const seccionesEnriquecidas = await Promise.all(
                seccionesData.map(async (seccion) => {
                    const [profesorInfo, cursoInfo] = await Promise.all([
                        fetchProfesorInfo(seccion.usuarioId),
                        fetchCursoInfo(seccion.cursoId)
                    ]);

                    return {
                        ...seccion,
                        profesor: profesorInfo,
                        curso: cursoInfo,
                        // Agregar campos calculados para mostrar
                        profesorNombre: profesorInfo ? `${profesorInfo.nombre} ${profesorInfo.apellido1}` : 'Profesor no encontrado',
                        cursoNombre: cursoInfo ? cursoInfo.nombre : 'Curso no encontrado',
                        codigoCurso: cursoInfo ? cursoInfo.codigo : 'N/A'
                    };
                })
            );

            setSecciones(seccionesEnriquecidas);
            
        } catch (error) {
            console.error("Error al obtener secciones:", error);
            setError(error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    }, [fetchProfesorInfo, fetchCursoInfo]);

    const getSeccionById = useCallback(async (seccionId) => {
        setLoading(true);
        setError("");

        try {
            const token = authUtils.getToken();
            if (!token) {
                throw new Error("Token de autenticación no encontrado");
            }

            const response = await api.get(`Seccion/GetSeccionById/${seccionId}`);
            
            // Enriquecer la sección con información adicional
            const seccion = response.data;
            const [profesorInfo, cursoInfo] = await Promise.all([
                fetchProfesorInfo(seccion.usuarioId),
                fetchCursoInfo(seccion.cursoId)
            ]);

            return {
                ...seccion,
                profesor: profesorInfo,
                curso: cursoInfo,
                profesorNombre: profesorInfo ? `${profesorInfo.nombre} ${profesorInfo.apellido1}` : 'Profesor no encontrado',
                cursoNombre: cursoInfo ? cursoInfo.nombre : 'Curso no encontrado',
                codigoCurso: cursoInfo ? cursoInfo.codigo : 'N/A'
            };
        } catch (error) {
            console.error("Error al obtener sección por ID:", error);
            setError(error.response?.data?.message || error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    }, [fetchProfesorInfo, fetchCursoInfo]);

    const createSeccion = useCallback(async (seccionData) => {
        setLoading(true);
        setError("");
        setSuccessMessage("");

        try {
            const token = authUtils.getToken();
            if (!token) {
                throw new Error("Token de autenticación no encontrado");
            }

            const response = await api.post("Seccion/AddSeccion", seccionData);

            setSuccessMessage("Sección creada exitosamente");
            await fetchSecciones(); // Refrescar la lista de secciones
            return response.data;
        } catch (error) {
            console.error("Error al crear sección:", error);
            setError(error.response?.data?.message || error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    }, [fetchSecciones]);

    const updateSeccion = useCallback(async (seccionData) => {
        setLoading(true);
        setError("");
        setSuccessMessage("");

        try {
            const token = authUtils.getToken();
            if (!token) {
                throw new Error("Token de autenticación no encontrado");
            }

            const response = await api.put("Seccion/UpdateSeccion", seccionData);

            setSuccessMessage("Sección actualizada exitosamente");
            await fetchSecciones(); // Refrescar la lista de secciones
            return response.data;
        } catch (error) {
            console.error("Error al actualizar sección:", error);
            setError(error.response?.data?.message || error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    }, [fetchSecciones]);

    const deleteSeccion = useCallback(async (seccionId) => {
        setLoading(true);
        setError("");
        setSuccessMessage("");

        try {
            const token = authUtils.getToken();
            if (!token) {
                throw new Error("Token de autenticación no encontrado");
            }

            await api.delete(`Seccion/DeleteSeccion/${seccionId}`);

            setSuccessMessage("Sección eliminada exitosamente");
            await fetchSecciones(); // Refrescar la lista de secciones
        } catch (error) {
            console.error("Error al eliminar sección:", error);
            setError(error.response?.data?.message || error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    }, [fetchSecciones]);

    // Cargar profesores y cursos cuando se monta el hook
    useEffect(() => {
        fetchProfesores();
        fetchCursos();
    }, [fetchProfesores, fetchCursos]);

    return {
        secciones,
        loading,
        error,
        successMessage,
        profesores,
        cursos,
        fetchSecciones,
        getSeccionById,
        createSeccion,
        updateSeccion,
        deleteSeccion,
        fetchProfesores,
        fetchCursos
    };
};