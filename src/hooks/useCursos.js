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
	
	
		const updateCurso = useCallback(async (cursoData) => {
	setLoading(true);
	setError("");
	
	try {
		console.log('Actualizando curso:', {cursoData});
		const response = await fetch(`http://localhost:5276/api/Curso/UpdateCurso`, {
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

		// Manejar respuesta basada en el status code
		let updatedCurso = null;
		
		if (response.status === 204) {
			// Status 204 (No Content) - actualización exitosa sin contenido
			console.log('Curso actualizado exitosamente (204 No Content)');
			updatedCurso = cursoData; // Retornar los datos enviados
		} else {
			// Otros códigos de éxito (200, 201, etc.) con contenido JSON
			updatedCurso = await response.json();
		}

		// Actualizar la lista de cursos con el curso actualizado
		await fetchCursos(); // Recargar todos los cursos para asegurar datos frescos
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
