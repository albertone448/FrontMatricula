import { useState, useCallback } from "react";

export function useCursos() {
	const [cursos, setCursos] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const fetchCursos = useCallback(async () => {
		setLoading(true);
		setError("");
		
		try {
			const response = await fetch("http://localhost:5276/api/Curso/GetAllCursos", {
				method: "GET",
				headers: {
					"Accept": "application/json"
				}
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json();
			setCursos(data);
		} catch (error) {
			console.error("Error fetching cursos:", error);
			setError(error.message);
		} finally {
			setLoading(false);
		}
	}, []);

const getCursoById = useCallback(async (cursoId) => {
        setLoading(true);
        setError("");
        
        try {
            const response = await fetch(`http://localhost:5276/api/Curso/GetCursoById/${cursoId}`, {
                method: "GET",
                headers: {
                    "Accept": "application/json"
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const curso = await response.json();
            return curso;
        } catch (error) {
            console.error("Error fetching curso by ID:", error);
            setError(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);
    
    

	const createCurso = useCallback(async (cursoData) => {
		setLoading(true);
		setError("");
		
		try {
			const response = await fetch("http://localhost:5276/api/Curso/AddCurso", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Accept": "application/json"
				},
				body: JSON.stringify(cursoData)
               
			});
            alert("Curso Data:", JSON.stringify(cursoData))
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const newCurso = await response.json();
			setCursos(prev => [...prev, newCurso]);
			return newCurso;
		} catch (error) {
			console.error("Error creating curso:", error);
			setError(error.message);
			throw error;
		} finally {
			setLoading(false);
		}
	}, []);

	const updateCurso = useCallback(async (cursoId, cursoData) => {
		setLoading(true);
		setError("");
		
		try {
			const response = await fetch(`http://localhost:5276/api/Curso/UpdateCurso/${cursoId}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					"Accept": "application/json"
				},
				body: JSON.stringify(cursoData)
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const updatedCurso = await response.json();
			setCursos(prev => prev.map(c => c.cursoId === cursoId ? updatedCurso : c));
			return updatedCurso;
		} catch (error) {
			console.error("Error updating curso:", error);
			setError(error.message);
			throw error;
		} finally {
			setLoading(false);
		}
	}, []);

	const deleteCurso = useCallback(async (cursoId) => {
		setLoading(true);
		setError("");
		
		try {
			const response = await fetch(`http://localhost:5276/api/Curso/DeleteCurso/${cursoId}`, {
				method: "DELETE",
				headers: {
					"Accept": "application/json"
				}
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			setCursos(prev => prev.filter(c => c.cursoId !== cursoId));
		} catch (error) {
			console.error("Error deleting curso:", error);
			setError(error.message);
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
