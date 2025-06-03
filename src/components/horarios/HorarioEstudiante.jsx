import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, BookOpen, MapPin, RefreshCw, Users, GraduationCap, ChevronDown } from "lucide-react";
import HorarioGrid from "./HorarioGrid";
import HorarioStats from "./HorarioStats";

const HorarioEstudiante = ({ 
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
				<h2 className="text-2xl font-bold text-gray-100 mb-4">Mi Horario</h2>
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

	// Calcular estadísticas
	const stats = {
		totalCursos: secciones.length,
		diasConClases: Object.keys(seccionesPorDia).length,
		horasSemanales: secciones.length * 3.33, // Aproximadamente 3.33 horas por clase
		periodo: periodoSeleccionado || "Sin definir"
	};

	if (message) {
		return (
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-8 border border-gray-700 text-center"
			>
				<Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
				<h2 className="text-2xl font-bold text-gray-100 mb-4">Mi Horario</h2>
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
					<h1 className="text-3xl font-bold text-gray-100 mb-2">Mi Horario</h1>
					
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

			{/* Estadísticas del horario */}
			<HorarioStats stats={stats} seccionesPorDia={seccionesPorDia} />

			{/* Vista del horario */}
			{viewMode === "grid" ? (
				<HorarioGrid secciones={secciones} />
			) : (
				<HorarioList secciones={secciones} />
			)}
		</div>
	);
};

// Componente para vista de lista
const HorarioList = ({ secciones = [] }) => {
	// Agrupar por día
	const seccionesPorDia = secciones.reduce((acc, seccion) => {
		const dia = seccion.horario?.dia;
		if (dia) {
			if (!acc[dia]) acc[dia] = [];
			acc[dia].push(seccion);
		}
		return acc;
	}, {});

	// Ordenar días - incluir sábado y domingo
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
													<div className="flex items-center text-sm text-gray-400">
														<GraduationCap className="w-4 h-4 mr-1" />
														<span className="text-xs">{seccion.carrera}</span>
													</div>
													{seccion.curso?.creditos && (
														<div className="text-xs text-purple-400 font-medium">
															{seccion.curso.creditos} créditos
														</div>
													)}
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

export default HorarioEstudiante;