import { useState, useEffect, useCallback } from 'react';
import { authUtils } from '../utils/authUtils';
import api from '../services/apiConfig';

export const useSecciones = () => {    const [secciones, setSecciones] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

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
            console.log("API response:", response);
            console.log("API response data:", response.data);
            console.log("API response type:", typeof response.data);

            if (Array.isArray(response.data)) {
                console.log("Data is an array, setting directly");
                setSecciones(response.data);
            } else if (response.data && typeof response.data === 'object') {
                console.log("Data is an object:", Object.keys(response.data));
                if (response.data.data && Array.isArray(response.data.data)) {
                    console.log("Using nested data array");
                    setSecciones(response.data.data);
                } else {
                    console.error("Unexpected API response format:", response.data);
                    setError("Formato de respuesta no válido");
                }
            } else {
                console.error("Unexpected API response format:", response.data);
                setError("Formato de respuesta no válido");
            }
        } catch (error) {
            console.error("Error al obtener secciones:", error);
            setError(error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    }, []);

    const getSeccionById = useCallback(async (seccionId) => {
        setLoading(true);
        setError("");

        try {
            const token = authUtils.getToken();
            if (!token) {
                throw new Error("Token de autenticación no encontrado");
            }

            const response = await api.get(`Seccion/GetSeccionById/${seccionId}`);

            return response.data;
        } catch (error) {
            console.error("Error al obtener sección por ID:", error);
            setError(error.response?.data?.message || error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    }   , []);

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
    }, []);

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
    }, []);

    const deleteSeccion = useCallback(async (seccionData) => {
        setLoading(true);
        setError("");
        setSuccessMessage("");

        try {
            const token = authUtils.getToken();
            if (!token) {
                throw new Error("Token de autenticación no encontrado");
            }

            await api.delete(`Seccion/DeleteSeccion/`,seccionData );

            setSuccessMessage("Sección eliminada exitosamente");
            await fetchSecciones(); // Refrescar la lista de secciones
        } catch (error) {
            console.error("Error al eliminar sección:", error);
            setError(error.response?.data?.message || error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);
    return {
        secciones,
        loading,
        error,
        successMessage,
        fetchSecciones,
        getSeccionById,
        createSeccion,
        updateSeccion,
        deleteSeccion
    };
}