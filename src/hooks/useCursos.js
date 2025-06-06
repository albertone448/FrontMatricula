import { useState, useCallback } from "react";
import { authUtils } from '../utils/authUtils';
import api from '../services/apiConfig';

export function useCursos() {
	const [cursos, setCursos] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const fetchCursos = useCallback(async () => {
		setLoading(true);
		setError("");
		
		try {
			const token = authUtils.getToken();
			if (!token) {
				throw new Error("Token de autenticación no encontrado");
			}

			const response = await api.get("Curso/GetAllCursos");
			setCursos(response.data);
		} catch (error) {
			console.error("Error fetching cursos:", error);
			setError(error.response?.data?.message || error.message);
		} finally {
			setLoading(false);
		}
	}, []);

	const getCursoById = useCallback(async (cursoId) => {
		setLoading(true);
		setError("");
		
		try {
			const token = authUtils.getToken();
			if (!token) {
				throw new Error("Token de autenticación no encontrado");
			}

			const response = await api.get(`Curso/GetCursoById/${cursoId}`);
			return response.data;
		} catch (error) {
			console.error("Error fetching curso by ID:", error);
			setError(error.response?.data?.message || error.message);
			throw error;
		} finally {
			setLoading(false);
		}
	}, []);

	const createCurso = useCallback(async (cursoData) => {
		setLoading(true);
		setError("");
		
		try {
			const token = authUtils.getToken();
			if (!token) {
				throw new Error("Token de autenticación no encontrado");
			}

			const response = await api.post("Curso/AddCurso", cursoData);
			const newCurso = response.data;
			setCursos(prev => [...prev, newCurso]);
			return newCurso;
		} catch (error) {
			console.error("Error creating curso:", error);
			setError(error.response?.data?.message || error.message);
			throw error;
		} finally {
			setLoading(false);
		}
	}, []);

	const updateCurso = useCallback(async (cursoData) => {
		setLoading(true);
		setError("");
		
		try {
			const token = authUtils.getToken();
			if (!token) {
				throw new Error("Token de autenticación no encontrado");
			}

			const response = await api.put("Curso/UpdateCurso", cursoData);
			
			// Manejar respuesta basada en el status code
			let updatedCurso = null;
			if (response.status === 204) {
				updatedCurso = cursoData;
			} else {
				updatedCurso = response.data;
			}

			// Actualizar la lista de cursos
			await fetchCursos();
			return updatedCurso;
		} catch (error) {
			console.error("Error updating curso:", error);
			setError(error.response?.data?.message || error.message);
			throw error;
		} finally {
			setLoading(false);
		}
	}, []);

	const deleteCurso = useCallback(async (cursoId) => {
		setLoading(true);
		setError("");
		
		try {
			const token = authUtils.getToken();
			if (!token) {
				throw new Error("Token de autenticación no encontrado");
			}

			await api.delete(`Curso/DeleteCurso/${cursoId}`);
			setCursos(prev => prev.filter(c => c.cursoId !== cursoId));
		} catch (error) {
			console.error("Error deleting curso:", error);
			setError(error.response?.data?.message || error.message);
			throw error;
		} finally {
			setLoading(false);
		}
	}, []);

	return {
		cursos,
		loading,
		error,
		fetchCursos,
		getCursoById,
		createCurso,
		updateCurso,
		deleteCurso
	};
}
