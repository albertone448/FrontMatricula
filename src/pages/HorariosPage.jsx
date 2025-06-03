import { useState, useEffect } from "react";
import Header from "../components/common/Header";
import { useUserRole } from "../contexts/UserRoleContext";
import { authUtils } from "../utils/authUtils";
import api from "../services/apiConfig";
import HorarioEstudiante from "../components/horarios/HorarioEstudiante";
import LoadingSpinner from "../components/horarios/LoadingSpinner";
import ErrorMessage from "../components/horarios/ErrorMessage";

const HorariosPage = () => {
	const { userRole, loading: roleLoading } = useUserRole();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [horarioData, setHorarioData] = useState(null);
	const [periodosDisponibles, setPeriodosDisponibles] = useState([]);
	const [periodoSeleccionado, setPeriodoSeleccionado] = useState("");

	// Función para obtener todos los periodos disponibles del estudiante
	const fetchPeriodosDisponibles = async () => {
		try {
			const userId = authUtils.getUserId();
			if (!userId) return [];

			console.log("🔍 Obteniendo periodos disponibles para usuario:", userId);

			// Obtener todas las inscripciones del estudiante
			const inscripcionesResponse = await api.get(`Inscripcion/GetInscripcionesPorUsuario?id=${userId}`);
			const inscripciones = inscripcionesResponse.data;

			if (!inscripciones || inscripciones.length === 0) {
				return [];
			}

			// Obtener secciones para extraer periodos únicos
			const seccionesPromises = inscripciones.map(inscripcion => 
				api.get(`Seccion/GetSeccionById/${inscripcion.seccionId}`)
			);
			
			const seccionesResponses = await Promise.all(seccionesPromises);
			const secciones = seccionesResponses.map(response => response.data);

			// Extraer periodos únicos
			const periodos = [...new Set(secciones.map(seccion => seccion.periodo).filter(Boolean))];
			console.log("📅 Periodos disponibles:", periodos);

			return periodos.sort().reverse(); // Más recientes primero
		} catch (error) {
			console.error("❌ Error obteniendo periodos:", error);
			return [];
		}
	};

	// Función para obtener los datos del horario del estudiante por periodo
	const fetchHorarioEstudiante = async (periodo = null) => {
		try {
			setLoading(true);
			setError("");

			const userId = authUtils.getUserId();
			if (!userId) {
				throw new Error("No se encontró el ID del usuario");
			}

			console.log("🔍 Obteniendo horario para usuario:", userId, "periodo:", periodo);

			// 1. Obtener inscripciones del estudiante
			const inscripcionesResponse = await api.get(`Inscripcion/GetInscripcionesPorUsuario?id=${userId}`);
			const inscripciones = inscripcionesResponse.data;
			
			console.log("📝 Inscripciones obtenidas:", inscripciones);

			if (!inscripciones || inscripciones.length === 0) {
				setHorarioData({ 
					secciones: [], 
					horarios: [], 
					cursos: [],
					message: "No tienes inscripciones activas" 
				});
				return;
			}

			// 2. Obtener detalles de cada sección
			const seccionesPromises = inscripciones.map(inscripcion => 
				api.get(`Seccion/GetSeccionById/${inscripcion.seccionId}`)
			);
			
			const seccionesResponses = await Promise.all(seccionesPromises);
			let secciones = seccionesResponses.map(response => response.data);
			
			// 3. Filtrar por periodo si se especifica
			if (periodo) {
				secciones = secciones.filter(seccion => seccion.periodo === periodo);
				console.log(`📚 Secciones filtradas por periodo ${periodo}:`, secciones);
			} else {
				console.log("📚 Todas las secciones obtenidas:", secciones);
			}

			if (secciones.length === 0) {
				setHorarioData({ 
					secciones: [], 
					horarios: [], 
					cursos: [],
					message: periodo ? `No tienes clases en el periodo ${periodo}` : "No se encontraron secciones" 
				});
				return;
			}

			// 4. Obtener todos los horarios
			const horariosResponse = await api.get("Horario/GetAllHorarios");
			const todosLosHorarios = horariosResponse.data;
			
			console.log("⏰ Horarios obtenidos:", todosLosHorarios);

			// 5. Obtener información detallada de cada curso por separado
			console.log("📖 Obteniendo información de cursos...");
			const cursosPromises = secciones.map(seccion => 
				api.get(`Curso/GetCursoById/${seccion.cursoId}`)
			);
			
			const cursosResponses = await Promise.all(cursosPromises);
			const cursos = cursosResponses.map(response => response.data);
			
			console.log("📖 Cursos obtenidos individualmente:", cursos);

			// 6. Procesar y organizar los datos con información completa
			const horariosProcesados = secciones.map((seccion, index) => {
				const horario = todosLosHorarios.find(h => h.horarioId === seccion.horarioId);
				const curso = cursos[index];
				const inscripcion = inscripciones.find(i => i.seccionId === seccion.seccionId);
				
				console.log(`🔍 Sección ${seccion.seccionId} - Curso:`, curso);
				
				return {
					...seccion,
					horario,
					curso,
					inscripcionId: inscripcion.inscripcionId
				};
			}).filter(item => item.horario && item.curso);

			console.log("✅ Horarios procesados con cursos:", horariosProcesados);

			setHorarioData({
				secciones: horariosProcesados,
				horarios: todosLosHorarios,
				cursos: cursos,
				message: horariosProcesados.length === 0 ? "No se encontraron horarios asignados para este periodo" : null
			});

		} catch (error) {
			console.error("❌ Error obteniendo horario del estudiante:", error);
			setError(error.response?.data?.message || error.message || "Error al cargar el horario");
		} finally {
			setLoading(false);
		}
	};

	// Cargar datos cuando el componente se monte y el rol esté disponible
	useEffect(() => {
		if (!roleLoading && userRole === "Estudiante") {
			// Primero cargar los periodos disponibles
			fetchPeriodosDisponibles().then(periodos => {
				setPeriodosDisponibles(periodos);
				
				// Si hay periodos, seleccionar el más reciente por defecto
				if (periodos.length > 0) {
					const periodoReciente = periodos[0];
					setPeriodoSeleccionado(periodoReciente);
					fetchHorarioEstudiante(periodoReciente);
				} else {
					// Si no hay periodos, cargar todo
					fetchHorarioEstudiante();
				}
			});
		} else if (!roleLoading && userRole) {
			setLoading(false);
		}
	}, [roleLoading, userRole]);

	// Función para manejar el cambio de periodo
	const handlePeriodoChange = (nuevoPeriodo) => {
		setPeriodoSeleccionado(nuevoPeriodo);
		fetchHorarioEstudiante(nuevoPeriodo);
	};

	// Función para refrescar los datos
	const handleRefresh = () => {
		if (userRole === "Estudiante") {
			// Refrescar periodos disponibles y recargar el periodo actual
			fetchPeriodosDisponibles().then(periodos => {
				setPeriodosDisponibles(periodos);
				fetchHorarioEstudiante(periodoSeleccionado);
			});
		}
	};

	// Loading state mientras se verifica el rol
	if (roleLoading) {
		return (
			<div className='flex-1 overflow-auto relative z-10'>
				<Header title='Horarios' />
				<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
					<LoadingSpinner message="Verificando permisos..." />
				</main>
			</div>
		);
	}

	return (
		<div className='flex-1 overflow-auto relative z-10'>
			<Header title='Horarios' />

			<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
				{/* Contenido específico por rol */}
				{userRole === "Estudiante" && (
					<>
						{loading && <LoadingSpinner message="Cargando tu horario..." />}
						
						{error && (
							<ErrorMessage 
								message={error} 
								onRetry={handleRefresh}
							/>
						)}
						
						{!loading && !error && horarioData && (
							<HorarioEstudiante 
								horarioData={horarioData}
								periodosDisponibles={periodosDisponibles}
								periodoSeleccionado={periodoSeleccionado}
								onPeriodoChange={handlePeriodoChange}
								onRefresh={handleRefresh}
							/>
						)}

						{/* Mostrar componente incluso si horarioData es null pero no hay loading ni error */}
						{!loading && !error && !horarioData && (
							<HorarioEstudiante 
								horarioData={{ secciones: [], message: "No se pudieron cargar los datos del horario" }}
								periodosDisponibles={periodosDisponibles}
								periodoSeleccionado={periodoSeleccionado}
								onPeriodoChange={handlePeriodoChange}
								onRefresh={handleRefresh}
							/>
						)}
					</>
				)}

				{/* Placeholder para otros roles */}
				{userRole === "Profesor" && (
					<div className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-8 border border-gray-700 text-center">
						<h2 className="text-2xl font-bold text-gray-100 mb-4">Horario del Profesor</h2>
						<p className="text-gray-400">Próximamente: Vista de horarios para profesores</p>
					</div>
				)}

				{userRole === "Administrador" && (
					<div className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-8 border border-gray-700 text-center">
						<h2 className="text-2xl font-bold text-gray-100 mb-4">Gestión de Horarios</h2>
						<p className="text-gray-400">Próximamente: Vista administrativa de horarios</p>
					</div>
				)}

				{!userRole && (
					<div className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-8 border border-gray-700 text-center">
						<h2 className="text-2xl font-bold text-red-400 mb-4">Error de Autenticación</h2>
						<p className="text-gray-400">No se pudo determinar tu rol de usuario</p>
					</div>
				)}
			</main>
		</div>
	);
};

export default HorariosPage;