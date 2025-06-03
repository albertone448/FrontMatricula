import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, BookOpen, Users, GraduationCap, ChevronDown, RefreshCw } from "lucide-react";
import HorarioGrid from "./HorarioGrid";
import HorarioStats from "./HorarioStats";

const HorarioProfesor = ({ 
	horarioData, 
	periodosDisponibles = [], 
	periodoSeleccionado, 
	onPeriodoChange, 
	onRefresh 
}) => {
	const [viewMode, setViewMode] = useState("grid"); // "grid" o "list"

	// Validación y valores por defecto para horarioData
	const { secciones = [], message } = horarioData || {};

	// Validación adicional para evitar errores
	if (!horarioData) {
		return (
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-8 border border-gray-700 text-center"
			>
				<Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
				<h2 className="text-2xl font-bold text-gray-100 mb-4">Mi Horario de Clases</h2>
				<p className="text-gray-400 mb-6">Cargando información del horario...</p>
				<button
					onClick={onRefresh}
					className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 flex items-center mx-auto"
				>
					<RefreshCw className="w-4 h-4 mr-2" />
					Actualizar
				</button>
			</motion.div>
		);
	}

	const seccionesPorDia = secciones.reduce((acc, seccion) => {
		const dia = seccion.horario?.dia;
		if (dia) {
			acc[dia] = (acc[dia] || 0) + 1;
		}
		return acc;
	}, {});

	// Calcular estadísticas específicas para profesores
	const stats = {
		totalCursos: secciones.length,
		diasConClases: Object.keys(seccionesPorDia).length,
		horasSemanales: secciones.length * 3.33, // Aproximadamente 3.33 horas por clase
		periodo: periodoSeleccionado || "Sin definir",
		totalEstudiantes: secciones.reduce((sum, seccion) => sum + (seccion.cuposMax || 0), 0),
		cursosUnicos: [...new Set(secciones.map(seccion => seccion.cursoId))].length,
		carrerasAtendidas: [...new Set(secciones.map(seccion => seccion.carrera))].length
	};

	if (message) {
		return (
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-8 border border-gray-700 text-center"
			>
				<Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
				<h2 className="text-2xl font-bold text-gray-100 mb-4">Mi Horario de Clases</h2>
				<p className="text-gray-400 mb-6">{message}</p>
				
				{/* Selector de periodo incluso cuando no hay datos */}
				{periodosDisponibles.length > 0 && (
					<div className="mb-6">
						<label className="block text-sm font-medium text-gray-300 mb-2">
							Seleccionar Periodo:
						</label>
						<div className="relative max-w-xs mx-auto">
							<select
								value={periodoSeleccionado}
								onChange={(e) => onPeriodoChange(e.target.value)}
								className="appearance-none w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 pr-8 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							>
								{periodosDisponibles.map((periodo) => (
									<option key={periodo} value={periodo}>
										{periodo}
									</option>
								))}
							</select>
							<ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
						</div>
					</div>
				)}
				
				<button
					onClick={onRefresh}
					className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 flex items-center mx-auto"
				>
					<RefreshCw className="w-4 h-4 mr-2" />
					Actualizar
				</button>
			</motion.div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Header con título, selector de periodo y controles */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
			>
				<div className="flex-1">
					<h1 className="text-3xl font-bold text-gray-100 mb-2">Mi Horario de Clases</h1>
					
					{/* Selector de periodo */}
					{periodosDisponibles.length > 0 ? (
						<div className="flex items-center gap-3">
							<span className="text-gray-400">Periodo:</span>
							<div className="relative">
								<select
									value={periodoSeleccionado}
									onChange={(e) => onPeriodoChange(e.target.value)}
									className="appearance-none bg-gray-700 border border-gray-600 rounded-lg px-3 py-1 pr-8 text-blue-400 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
								>
									{periodosDisponibles.map((periodo) => (
										<option key={periodo} value={periodo}>
											{periodo}
										</option>
									))}
								</select>
								<ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
							</div>
							{periodosDisponibles.length > 1 && (
								<span className="text-xs text-gray-500">
									({periodosDisponibles.length} periodos disponibles)
								</span>
							)}
						</div>
					) : (
						<p className="text-gray-400">
							Periodo: <span className="text-blue-400 font-medium">{stats.periodo}</span>
						</p>
					)}
				</div>

                
				
				<div className="flex items-center space-x-3">
					{/* Selector de vista */}
					<div className="flex bg-gray-700 rounded-lg p-1">
						<button
							onClick={() => setViewMode("grid")}
							className={`px-3 py-1 rounded text-sm font-medium transition duration-200 ${
								viewMode === "grid"
									? "bg-blue-600 text-white"
									: "text-gray-400 hover:text-gray-300"
							}`}
						>
							Tabla
						</button>
						<button
							onClick={() => setViewMode("list")}
							className={`px-3 py-1 rounded text-sm font-medium transition duration-200 ${
								viewMode === "list"
									? "bg-blue-600 text-white"
									: "text-gray-400 hover:text-gray-300"
							}`}
						>
							Lista
						</button>
					</div>

					{/* Botón de actualizar */}
					<motion.button
						onClick={onRefresh}
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 flex items-center"
					>
						<RefreshCw className="w-4 h-4 mr-2" />
						Actualizar
					</motion.button>
				</div>
			</motion.div>

{/* Vista del horario */}
			{viewMode === "grid" ? (
				<HorarioGrid secciones={secciones} />
			) : (
				<HorarioListProfesor secciones={secciones} />
			)}
			{/* Estadísticas del horario - reutilizar HorarioStats */}
			<HorarioStats stats={stats} seccionesPorDia={seccionesPorDia} />

			{/* Resumen específico del profesor */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.8, duration: 0.5 }}
				className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
			>
				<h3 className="text-lg font-semibold text-gray-100 mb-4">Información Docente Adicional</h3>
				
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{/* Cursos únicos */}
					<div className="bg-gray-700 bg-opacity-50 rounded-lg p-4">
						<h4 className="text-sm font-medium text-gray-400 mb-2">Cursos Únicos</h4>
						<p className="text-lg font-semibold text-green-400">{stats.cursosUnicos}</p>
						<p className="text-xs text-gray-500 mt-1">Diferentes materias</p>
					</div>

					{/* Carreras atendidas */}
					<div className="bg-gray-700 bg-opacity-50 rounded-lg p-4">
						<h4 className="text-sm font-medium text-gray-400 mb-2">Carreras Atendidas</h4>
						<p className="text-lg font-semibold text-purple-400">{stats.carrerasAtendidas}</p>
						<p className="text-xs text-gray-500 mt-1">Diferentes programas</p>
					</div>

					{/* Promedio de estudiantes por sección */}
					<div className="bg-gray-700 bg-opacity-50 rounded-lg p-4">
						<h4 className="text-sm font-medium text-gray-400 mb-2">Prom. Estudiantes</h4>
						<p className="text-lg font-semibold text-yellow-400">
							{stats.totalCursos > 0 ? (stats.totalEstudiantes / stats.totalCursos).toFixed(0) : "0"}
						</p>
						<p className="text-xs text-gray-500 mt-1">Por sección</p>
					</div>
				</div>

				{/* Consejos específicos para profesores */}
				<div className="mt-4 p-4 rounded-lg" style={{
					backgroundColor: (stats.totalCursos || 0) > 6 ? "rgba(239, 68, 68, 0.1)" : 
									 (stats.totalCursos || 0) > 4 ? "rgba(245, 158, 11, 0.1)" : 
									 "rgba(16, 185, 129, 0.1)",
					borderColor: (stats.totalCursos || 0) > 6 ? "#EF4444" : 
								 (stats.totalCursos || 0) > 4 ? "#F59E0B" : 
								 "#10B981",
					borderWidth: "1px"
				}}>
					<h4 className="text-sm font-medium mb-2" style={{
						color: (stats.totalCursos || 0) > 6 ? "#EF4444" : 
							   (stats.totalCursos || 0) > 4 ? "#F59E0B" : 
							   "#10B981"
					}}>
						{(stats.totalCursos || 0) > 6 ? "⚠️ Carga Docente Alta" : 
						 (stats.totalCursos || 0) > 4 ? "📚 Carga Docente Media" : 
						 "✅ Carga Docente Ligera"}
					</h4>
					<p className="text-xs text-gray-400">
						{(stats.totalCursos || 0) > 6 ? 
							`Tienes ${stats.totalCursos} secciones asignadas. Considera organizar bien tu tiempo para preparar clases.` :
						 (stats.totalCursos || 0) > 4 ? 
							`Carga docente equilibrada con ${stats.totalCursos} secciones. Mantén una buena planificación.` :
							`Carga ligera con ${stats.totalCursos} secciones. Podrías considerar actividades adicionales.`
						}
					</p>
					
					{/* Información adicional sobre estudiantes */}
					<div className="mt-2 pt-2 border-t border-opacity-20" style={{
						borderColor: (stats.totalCursos || 0) > 6 ? "#EF4444" : 
									 (stats.totalCursos || 0) > 4 ? "#F59E0B" : 
									 "#10B981"
					}}>
						<p className="text-xs text-blue-400">
							👥 Atiendes un total de {stats.totalEstudiantes} estudiantes en {stats.carrerasAtendidas} carrera{stats.carrerasAtendidas > 1 ? 's' : ''} diferente{stats.carrerasAtendidas > 1 ? 's' : ''}.
						</p>
					</div>
				</div>
			</motion.div>

			
		</div>
	);
};

// Componente para estadísticas específicas de profesores
const HorarioStatsProfesor = ({ stats, seccionesPorDia }) => {
	const statsConfig = [
		{
			name: "Secciones Asignadas",
			value: stats.totalCursos,
			icon: BookOpen,
			color: "#6366F1",
			delay: 0.1
		},
		{
			name: "Cursos Únicos",
			value: stats.cursosUnicos,
			icon: GraduationCap,
			color: "#10B981",
			delay: 0.2
		},
		{
			name: "Total Estudiantes",
			value: stats.totalEstudiantes,
			icon: Users,
			color: "#F59E0B",
			delay: 0.3
		},
		{
			name: "Horas Semanales",
			value: `${stats.horasSemanales.toFixed(1)}h`,
			icon: Clock,
			color: "#EF4444",
			delay: 0.4
		}
	];

	return (
		<div className="space-y-6">
			{/* Estadísticas principales */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
			>
				{statsConfig.map((stat, index) => (
					<motion.div
						key={stat.name}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: stat.delay, duration: 0.3 }}
						className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
					>
						<div className="flex items-center">
							<div className={`p-3 rounded-lg flex-shrink-0`} style={{ backgroundColor: `${stat.color}20` }}>
								<stat.icon className="w-6 h-6" style={{ color: stat.color }} />
							</div>
							<div className="ml-4 flex-1">
								<p className="text-sm font-medium text-gray-400">{stat.name}</p>
								<p className="text-2xl font-bold text-gray-100">{stat.value}</p>
							</div>
						</div>
					</motion.div>
				))}
			</motion.div>

			{/* Resumen específico del profesor */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.6, duration: 0.5 }}
				className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
			>
				<h3 className="text-lg font-semibold text-gray-100 mb-4">Resumen Docente</h3>
				
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
					{/* Periodo actual */}
					<div className="bg-gray-700 bg-opacity-50 rounded-lg p-4">
						<h4 className="text-sm font-medium text-gray-400 mb-2">Periodo Actual</h4>
						<p className="text-lg font-semibold text-blue-400">{stats.periodo}</p>
					</div>

					{/* Carga promedio por día */}
					<div className="bg-gray-700 bg-opacity-50 rounded-lg p-4">
						<h4 className="text-sm font-medium text-gray-400 mb-2">Promedio por Día</h4>
						<p className="text-lg font-semibold text-green-400">
							{stats.diasConClases > 0 ? (stats.totalCursos / stats.diasConClases).toFixed(1) : "0"} secciones
						</p>
					</div>

					{/* Carreras atendidas */}
					<div className="bg-gray-700 bg-opacity-50 rounded-lg p-4">
						<h4 className="text-sm font-medium text-gray-400 mb-2">Carreras</h4>
						<p className="text-lg font-semibold text-purple-400">
							{stats.carrerasAtendidas} carreras
						</p>
					</div>

					{/* Promedio de estudiantes por sección */}
					<div className="bg-gray-700 bg-opacity-50 rounded-lg p-4">
						<h4 className="text-sm font-medium text-gray-400 mb-2">Prom. Estudiantes</h4>
						<p className="text-lg font-semibold text-yellow-400">
							{stats.totalCursos > 0 ? (stats.totalEstudiantes / stats.totalCursos).toFixed(0) : "0"} por sección
						</p>
					</div>
				</div>

				{/* Distribución por días - igual que estudiantes */}
				{Object.keys(seccionesPorDia).length > 0 && (
					<div className="mt-6">
						<h4 className="text-sm font-medium text-gray-400 mb-3 flex items-center">
							<Calendar className="w-4 h-4 mr-2 text-blue-400" />
							Distribución Semanal
						</h4>
						<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
							{["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"].map((dia, index) => {
								const clases = seccionesPorDia[dia] || 0;
								const porcentaje = stats.totalCursos > 0 ? (clases / stats.totalCursos) * 100 : 0;
								const esFinDeSemana = dia === "Sábado" || dia === "Domingo";
								
								return (
									<motion.div
										key={dia}
										initial={{ opacity: 0, scale: 0.9 }}
										animate={{ opacity: 1, scale: 1 }}
										transition={{ delay: 0.7 + index * 0.1, duration: 0.3 }}
										className="text-center"
									>
										<div className={`bg-gray-700 bg-opacity-50 rounded-lg p-4 mb-2 ${
											esFinDeSemana ? "bg-opacity-30 border border-gray-600" : ""
										}`}>
											<div className={`text-2xl font-bold mb-1 ${
												esFinDeSemana && clases === 0 ? "text-gray-500" : "text-gray-100"
											}`}>
												{clases}
											</div>
											<div className="text-xs text-gray-400">
												secciones
											</div>
										</div>
										
										<div className={`text-sm font-medium mb-2 ${
											esFinDeSemana ? "text-gray-400" : "text-gray-300"
										}`}>
											{dia === "Miércoles" ? "Miér." : dia === "Sábado" ? "Sáb." : dia === "Domingo" ? "Dom." : dia}
										</div>
										
										<div className="w-full bg-gray-700 rounded-full h-2">
											<motion.div
												initial={{ width: 0 }}
												animate={{ width: `${porcentaje}%` }}
												transition={{ delay: 0.9 + index * 0.1, duration: 0.5 }}
												className="h-2 rounded-full"
												style={{ 
													backgroundColor: clases > 0 ? 
														(esFinDeSemana ? "#8B5CF6" : "#3B82F6") : 
														"#6B7280" 
												}}
											/>
										</div>
										
										{esFinDeSemana && clases > 0 && (
											<div className="text-xs text-purple-400 mt-1">
												Fin de semana
											</div>
										)}
									</motion.div>
								);
							})}
						</div>
					</div>
				)}
			</motion.div>
		</div>
	);
};

// Componente para vista de lista específica para profesores
const HorarioListProfesor = ({ secciones = [] }) => {
	// Agrupar por día
	const seccionesPorDia = secciones.reduce((acc, seccion) => {
		const dia = seccion.horario?.dia;
		if (dia) {
			if (!acc[dia]) acc[dia] = [];
			acc[dia].push(seccion);
		}
		return acc;
	}, {});

	// Ordenar días
	const diasOrdenados = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
	
	return (
		<div className="grid gap-6">
			{diasOrdenados.map(dia => {
				const seccionesDelDia = seccionesPorDia[dia];
				if (!seccionesDelDia) return null;

				return (
					<motion.div
						key={dia}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
					>
						<h3 className="text-xl font-bold text-gray-100 mb-4 flex items-center">
							<Calendar className="w-5 h-5 mr-2 text-blue-400" />
							{dia}
						</h3>
						
						<div className="space-y-3">
							{seccionesDelDia
								.sort((a, b) => a.horario.horaInicio.localeCompare(b.horario.horaInicio))
								.map(seccion => {
									const nombreCurso = seccion.curso?.nombre || `Curso ${seccion.cursoId}`;
									const codigoCurso = seccion.curso?.codigo || `C${seccion.cursoId}`;
									
									return (
										<div
											key={seccion.seccionId}
											className="bg-gray-700 bg-opacity-50 rounded-lg p-4 border border-gray-600 hover:bg-opacity-70 transition-all duration-200"
										>
											<div className="flex items-start justify-between">
												<div className="flex-1">
													<h4 className="font-semibold text-gray-100 mb-2 flex items-center">
														<BookOpen className="w-5 h-5 mr-2 text-green-400" />
														<div>
															<span className="text-lg">{nombreCurso}</span>
															<span className="text-sm text-blue-400 ml-2">({codigoCurso})</span>
														</div>
													</h4>
													<div className="space-y-1 mb-3">
														<p className="text-sm text-gray-400">
															<span className="font-medium">Grupo:</span> {seccion.grupo} • 
															<span className="font-medium"> Sección:</span> {seccion.seccionId}
														</p>
														<p className="text-sm text-gray-400">
															<span className="font-medium">Carrera:</span> {seccion.carrera}
														</p>
														{seccion.curso?.descripcion && (
															<p className="text-xs text-gray-500 italic">
																{seccion.curso.descripcion}
															</p>
														)}
													</div>
													<div className="flex items-center text-sm text-gray-300">
														<Clock className="w-4 h-4 mr-1 text-blue-400" />
														{seccion.horario.horaInicio.slice(0, 5)} - {seccion.horario.horaFin.slice(0, 5)}
													</div>
												</div>
												<div className="text-right space-y-2">
													<div className="flex items-center text-sm text-gray-400">
														<Users className="w-4 h-4 mr-1" />
														{seccion.cuposMax} cupos
													</div>
													{seccion.curso?.creditos && (
														<div className="text-xs text-purple-400 font-medium">
															{seccion.curso.creditos} créditos
														</div>
													)}
													{/* Botón para ver estudiantes inscritos */}
													<button className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded transition duration-200">
														Ver estudiantes
													</button>
												</div>
											</div>
										</div>
									);
								})}
						</div>
					</motion.div>
				);
			})}
		</div>
	);
};

export default HorarioProfesor;