import { useState, useEffect } from "react";
import Header from "../components/common/Header";
import { useUserRole } from "../contexts/UserRoleContext";
import { authUtils } from "../utils/authUtils";
import api from "../services/apiConfig";
import HorarioEstudiante from "../components/horarios/HorarioEstudiante";
import HorarioProfesor from "../components/horarios/HorarioProfesor";
import LoadingSpinner from "../components/horarios/LoadingSpinner";
import ErrorMessage from "../components/horarios/ErrorMessage";
import HorarioAdminTable from "../components/horarios/HorarioAdminTable";
import { motion } from "framer-motion"; // ✅ Agregar esta línea
import { PeriodoSelector } from "../components/inscripciones/PeriodoSelector";

const HorariosPage = () => {
	const { userRole, loading: roleLoading } = useUserRole();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [horarioData, setHorarioData] = useState(null);
	const [periodosDisponibles, setPeriodosDisponibles] = useState([]);
	const [periodoSeleccionado, setPeriodoSeleccionado] = useState("");
	const [todosLosHorarios, setTodosLosHorarios] = useState([]);
	const [todasLasSecciones, setTodasLasSecciones] = useState([]);
	const [todosLosCursos, setTodosLosCursos] = useState([]);

	// Función para obtener todos los periodos disponibles del estudiante
	const fetchPeriodosDisponiblesEstudiante = async () => {
		try {
			const userId = authUtils.getUserId();
			if (!userId) return [];

			console.log("🔍 Obteniendo periodos disponibles para estudiante:", userId);

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
			console.log("📅 Periodos disponibles (estudiante):", periodos);

			return periodos.sort().reverse(); // Más recientes primero
		} catch (error) {
			console.error("❌ Error obteniendo periodos del estudiante:", error);
			return [];
		}
	};


	// Agregar esta función para cargar datos de administrador:
	const fetchDatosAdmin = async () => {
		try {
			setLoading(true);
			setError("");

			console.log("🔍 Cargando todos los datos para administrador...");

			// Cargar horarios, secciones y cursos en paralelo
			const [horariosResponse, seccionesResponse, cursosResponse] = await Promise.all([
				api.get("Horario/GetAllHorarios"),
				api.get("Seccion/GetAllSecciones"),
				api.get("Curso/GetAllCursos")
			]);

			setTodosLosHorarios(horariosResponse.data);
			setTodasLasSecciones(seccionesResponse.data);
			setTodosLosCursos(cursosResponse.data);

			console.log("✅ Datos de administrador cargados:", {
				horarios: horariosResponse.data.length,
				secciones: seccionesResponse.data.length,
				cursos: cursosResponse.data.length
			});

		} catch (error) {
			console.error("❌ Error cargando datos de administrador:", error);
			setError(error.response?.data?.message || error.message || "Error al cargar los datos");
		} finally {
			setLoading(false);
		}
	};



	// Función para obtener todos los periodos disponibles del profesor
	const fetchPeriodosDisponiblesProfesor = async () => {
		try {
			const userId = authUtils.getUserId();
			if (!userId) return [];

			console.log("🔍 Obteniendo periodos disponibles para profesor:", userId);

			// Obtener todas las secciones
			const seccionesResponse = await api.get("Seccion/GetAllSecciones");
			const todasLasSecciones = seccionesResponse.data;

			// Filtrar las secciones del profesor
			const seccionesDelProfesor = todasLasSecciones.filter(seccion => seccion.usuarioId === userId);

			if (!seccionesDelProfesor || seccionesDelProfesor.length === 0) {
				return [];
			}

			// Extraer periodos únicos
			const periodos = [...new Set(seccionesDelProfesor.map(seccion => seccion.periodo).filter(Boolean))];
			console.log("📅 Periodos disponibles (profesor):", periodos);

			return periodos.sort().reverse(); // Más recientes primero
		} catch (error) {
			console.error("❌ Error obteniendo periodos del profesor:", error);
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

			console.log("🔍 Obteniendo horario para estudiante:", userId, "periodo:", periodo);

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

			console.log("✅ Horarios procesados con cursos (estudiante):", horariosProcesados);

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

	// Función para obtener los datos del horario del profesor por periodo
	const fetchHorarioProfesor = async (periodo = null) => {
		try {
			setLoading(true);
			setError("");

			const userId = authUtils.getUserId();
			if (!userId) {
				throw new Error("No se encontró el ID del usuario");
			}

			console.log("🔍 Obteniendo horario para profesor:", userId, "periodo:", periodo);

			// 1. Obtener todas las secciones
			const seccionesResponse = await api.get("Seccion/GetAllSecciones");
			const todasLasSecciones = seccionesResponse.data;
			
			console.log("📝 Todas las secciones obtenidas:", todasLasSecciones);

			// 2. Filtrar las secciones del profesor
			let seccionesDelProfesor = todasLasSecciones.filter(seccion => seccion.usuarioId === userId);
			
			console.log("👨‍🏫 Secciones del profesor:", seccionesDelProfesor);

			if (!seccionesDelProfesor || seccionesDelProfesor.length === 0) {
				setHorarioData({ 
					secciones: [], 
					horarios: [], 
					cursos: [],
					message: "No tienes secciones asignadas" 
				});
				return;
			}

			// 3. Filtrar por periodo si se especifica
			if (periodo) {
				seccionesDelProfesor = seccionesDelProfesor.filter(seccion => seccion.periodo === periodo);
				console.log(`📚 Secciones filtradas por periodo ${periodo}:`, seccionesDelProfesor);
			}

			if (seccionesDelProfesor.length === 0) {
				setHorarioData({ 
					secciones: [], 
					horarios: [], 
					cursos: [],
					message: periodo ? `No tienes secciones asignadas en el periodo ${periodo}` : "No se encontraron secciones asignadas" 
				});
				return;
			}

			// 4. Obtener todos los horarios
			const horariosResponse = await api.get("Horario/GetAllHorarios");
			const todosLosHorarios = horariosResponse.data;
			
			console.log("⏰ Horarios obtenidos:", todosLosHorarios);

			// 5. Obtener información detallada de cada curso por separado
			console.log("📖 Obteniendo información de cursos...");
			const cursosPromises = seccionesDelProfesor.map(seccion => 
				api.get(`Curso/GetCursoById/${seccion.cursoId}`)
			);
			
			const cursosResponses = await Promise.all(cursosPromises);
			const cursos = cursosResponses.map(response => response.data);
			
			console.log("📖 Cursos obtenidos individualmente:", cursos);

			// 6. Procesar y organizar los datos con información completa
			const horariosProcesados = seccionesDelProfesor.map((seccion, index) => {
				const horario = todosLosHorarios.find(h => h.horarioId === seccion.horarioId);
				const curso = cursos[index];
				
				console.log(`🔍 Sección ${seccion.seccionId} - Curso:`, curso);
				
				return {
					...seccion,
					horario,
					curso
				};
			}).filter(item => item.horario && item.curso);

			console.log("✅ Horarios procesados con cursos para profesor:", horariosProcesados);

			setHorarioData({
				secciones: horariosProcesados,
				horarios: todosLosHorarios,
				cursos: cursos,
				message: horariosProcesados.length === 0 ? "No se encontraron horarios asignados para este periodo" : null
			});

		} catch (error) {
			console.error("❌ Error obteniendo horario del profesor:", error);
			setError(error.response?.data?.message || error.message || "Error al cargar el horario");
		} finally {
			setLoading(false);
		}
	};

	// Cargar datos cuando el componente se monte y el rol esté disponible
	useEffect(() => {
		if (!roleLoading && userRole) {
			if (userRole === "Estudiante") {
				// Lógica para estudiantes
				fetchPeriodosDisponiblesEstudiante().then(periodos => {
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
			} else if (userRole === "Profesor") {
				// Lógica para profesores
				fetchPeriodosDisponiblesProfesor().then(periodos => {
					setPeriodosDisponibles(periodos);
					
					// Si hay periodos, seleccionar el más reciente por defecto
					if (periodos.length > 0) {
						const periodoReciente = periodos[0];
						setPeriodoSeleccionado(periodoReciente);
						fetchHorarioProfesor(periodoReciente);
					} else {
						// Si no hay periodos, cargar todo
						fetchHorarioProfesor();
					}
				});
			} else if (userRole === "Administrador") {
				// Lógica para administradores
				fetchDatosAdmin();
			} else {
				// Para administradores u otros roles
				setLoading(false);
			}
		}
	}, [roleLoading, userRole]);

	// Función para manejar el cambio de periodo
	const handlePeriodoChange = (nuevoPeriodo) => {
		setPeriodoSeleccionado(nuevoPeriodo);
		
		if (userRole === "Estudiante") {
			fetchHorarioEstudiante(nuevoPeriodo);
		} else if (userRole === "Profesor") {
			fetchHorarioProfesor(nuevoPeriodo);
		}
	};

	// Función para refrescar los datos
	const handleRefresh = () => {
		if (userRole === "Estudiante") {
			// Refrescar periodos disponibles y recargar el periodo actual
			fetchPeriodosDisponiblesEstudiante().then(periodos => {
				setPeriodosDisponibles(periodos);
				fetchHorarioEstudiante(periodoSeleccionado);
			});
		} else if (userRole === "Profesor") {
			// Refrescar periodos disponibles y recargar el periodo actual
			fetchPeriodosDisponiblesProfesor().then(periodos => {
				setPeriodosDisponibles(periodos);
				fetchHorarioProfesor(periodoSeleccionado);
			});
		}	else if (userRole === "Administrador") {
			fetchDatosAdmin();
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
				{/* Contenido para estudiantes */}
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

				{/* Contenido para profesores */}
				{userRole === "Profesor" && (
					<>
						{loading && <LoadingSpinner message="Cargando horario de clases..." />}
						
						{error && (
							<ErrorMessage 
								message={error} 
								onRetry={handleRefresh}
							/>
						)}
						
						{!loading && !error && horarioData && (
							<HorarioProfesor 
								horarioData={horarioData}
								periodosDisponibles={periodosDisponibles}
								periodoSeleccionado={periodoSeleccionado}
								onPeriodoChange={handlePeriodoChange}
								onRefresh={handleRefresh}
							/>
						)}

						{/* Mostrar componente incluso si horarioData es null pero no hay loading ni error */}
						{!loading && !error && !horarioData && (
							<HorarioProfesor 
								horarioData={{ secciones: [], message: "No se pudieron cargar los datos del horario" }}
								periodosDisponibles={periodosDisponibles}
								periodoSeleccionado={periodoSeleccionado}
								onPeriodoChange={handlePeriodoChange}
								onRefresh={handleRefresh}
							/>
						)}
					</>
				)}

				{/* Contenido para administradores */}
				{userRole === "Administrador" && (
					<>
						{loading && <LoadingSpinner message="Cargando todos los horarios..." />}
						
						{error && (
							<ErrorMessage 
								message={error} 
								onRetry={handleRefresh}
							/>
						)}
						
						{!loading && !error && (
							<div className="space-y-6">
								{/* Header para administradores */}
								<motion.div
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
								>
									<div>
										<h1 className="text-3xl font-bold text-gray-100 mb-2">Gestión de Horarios</h1>
										<p className="text-gray-400">
											Vista administrativa de todos los horarios del sistema
										</p>
									</div>
								</motion.div>

								{/* Tabla de horarios */}
								<HorarioAdminTable
									horarios={todosLosHorarios}
									secciones={todasLasSecciones}
									cursos={todosLosCursos}
									loading={loading}
									onRefresh={handleRefresh}
								/>
							</div>
						)}
					</>
				)}

				{/* Error de autenticación */}
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