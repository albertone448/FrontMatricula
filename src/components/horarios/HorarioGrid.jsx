import { motion } from "framer-motion";
import { Clock, BookOpen, Users, MapPin, Code } from "lucide-react";

const HorarioGrid = ({ secciones = [] }) => {
	// Definir los horarios y días - incluir sábado y domingo
	const diasSemana = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
	const horariosDisponibles = [
		{ inicio: "08:00:00", fin: "11:20:00", label: "08:00 - 11:20" },
		{ inicio: "13:00:00", fin: "16:20:00", label: "13:00 - 16:20" },
		{ inicio: "17:00:00", fin: "20:20:00", label: "17:00 - 20:20" }
	];

	// Crear una matriz de horarios
	const crearMatrizHorarios = () => {
		const matriz = {};
		
		// Inicializar matriz vacía
		diasSemana.forEach(dia => {
			matriz[dia] = {};
			horariosDisponibles.forEach(horario => {
				matriz[dia][horario.label] = null;
			});
		});

		// Llenar la matriz con las secciones del estudiante
		secciones.forEach(seccion => {
			if (seccion.horario) {
				const dia = seccion.horario.dia;
				const inicio = seccion.horario.horaInicio;
				const fin = seccion.horario.horaFin;
				
				// Encontrar el slot de horario correspondiente
				const horarioSlot = horariosDisponibles.find(h => 
					h.inicio === inicio && h.fin === fin
				);
				
				if (horarioSlot && matriz[dia]) {
					matriz[dia][horarioSlot.label] = seccion;
				}
			}
		});

		return matriz;
	};

	const matrizHorarios = crearMatrizHorarios();

	// Función para truncar texto
	const truncateText = (text, maxLength) => {
		if (!text) return '';
		return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
	};

	// Componente para cada celda del horario
	const CeldaHorario = ({ seccion, dia, horario }) => {
		if (!seccion) {
			return (
				<div className="h-28 bg-gray-800 bg-opacity-30 border border-gray-700 rounded-lg flex items-center justify-center">
					<span className="text-gray-500 text-sm">Libre</span>
				</div>
			);
		}

		// Colores diferentes para cada curso
		const colores = [
			"bg-blue-500",
			"bg-green-500", 
			"bg-purple-500",
			"bg-red-500",
			"bg-yellow-500",
			"bg-indigo-500",
			"bg-pink-500",
			"bg-orange-500"
		];
		
		const colorIndex = seccion.cursoId % colores.length;
		const colorClass = colores[colorIndex];

		// Ahora obtenemos los datos del curso correctamente
		const nombreCurso = seccion.curso?.nombre || `Curso ${seccion.cursoId}`;
		const codigoCurso = seccion.curso?.codigo || `C${seccion.cursoId}`;

		return (
			<motion.div
				initial={{ opacity: 0, scale: 0.9 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: 0.3 }}
				className={`h-28 ${colorClass} bg-opacity-20 border-2 border-opacity-60 rounded-lg p-2 cursor-pointer hover:bg-opacity-30 transition-all duration-200`}
				style={{ borderColor: `${colorClass.replace('bg-', '')}` }}
				title={`${nombreCurso} | ${codigoCurso} | Grupo: ${seccion.grupo} | Sección: ${seccion.seccionId}`}
			>
				<div className="h-full flex flex-col justify-between">
					{/* Información principal del curso */}
					<div className="flex-1">
						<div className="flex items-center mb-1">
							<BookOpen className="w-3 h-3 mr-1 text-white flex-shrink-0" />
							<span className="text-xs font-semibold text-white truncate">
								{truncateText(codigoCurso, 8)}
							</span>
						</div>
						
						{/* Nombre del curso */}
						<div className="text-xs text-gray-100 font-medium mb-1 leading-tight">
							{truncateText(nombreCurso, 16)}
						</div>
						
						{/* Grupo */}
						<div className="text-xs text-gray-200 truncate">
							{seccion.grupo}
						</div>
					</div>
					
					{/* Información adicional */}
					<div className="flex items-center justify-between mt-1">
						<div className="flex items-center">
							<Users className="w-3 h-3 mr-1 text-gray-300" />
							<span className="text-xs text-gray-300">{seccion.cuposMax}</span>
						</div>
						<span className="text-xs text-gray-300">S{seccion.seccionId}</span>
					</div>
				</div>
			</motion.div>
		);
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
		>
			<div className="mb-6">
				<h2 className="text-2xl font-bold text-gray-100 mb-2 flex items-center">
					<Clock className="w-6 h-6 mr-2 text-blue-400" />
					Horario Semanal
				</h2>
				<p className="text-gray-400">Vista en cuadrícula de tus clases</p>
			</div>

			{/* Tabla de horarios */}
			<div className="overflow-x-auto">
				<div className="min-w-full">
					{/* Header de la tabla */}
					<div className="grid grid-cols-8 gap-2 mb-4">
						{/* Columna de horarios */}
						<div className="bg-gray-700 bg-opacity-50 rounded-lg p-3 text-center">
							<span className="text-sm font-semibold text-gray-300">Horario</span>
						</div>
						
						{/* Columnas de días */}
						{diasSemana.map(dia => (
							<div key={dia} className={`bg-gray-700 bg-opacity-50 rounded-lg p-3 text-center ${
								dia === "Sábado" || dia === "Domingo" ? "bg-opacity-30" : ""
							}`}>
								<span className={`text-sm font-semibold ${
									dia === "Sábado" || dia === "Domingo" ? "text-gray-400" : "text-gray-300"
								}`}>
									{dia === "Miércoles" ? "Miér." : dia === "Sábado" ? "Sáb." : dia === "Domingo" ? "Dom." : dia}
								</span>
							</div>
						))}
					</div>

					{/* Filas de horarios */}
					{horariosDisponibles.map(horario => (
						<div key={horario.label} className="grid grid-cols-8 gap-2 mb-2">
							{/* Celda de horario */}
							<div className="bg-gray-700 bg-opacity-30 rounded-lg p-2 flex items-center justify-center">
								<span className="text-xs text-gray-400 text-center leading-tight">
									{horario.label}
								</span>
							</div>
							
							{/* Celdas de días */}
							{diasSemana.map(dia => (
								<CeldaHorario
									key={`${dia}-${horario.label}`}
									seccion={matrizHorarios[dia][horario.label]}
									dia={dia}
									horario={horario.label}
								/>
							))}
						</div>
					))}
				</div>
			</div>

			{/* Leyenda mejorada con nombres de cursos */}
			{secciones.length > 0 && (
				<div className="mt-6 p-4 bg-gray-700 bg-opacity-30 rounded-lg">
					<h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center">
						<Code className="w-4 h-4 mr-2" />
						Mis Cursos:
					</h3>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
						{secciones.map(seccion => {
							const colores = [
								"bg-blue-500",
								"bg-green-500", 
								"bg-purple-500",
								"bg-red-500",
								"bg-yellow-500",
								"bg-indigo-500",
								"bg-pink-500",
								"bg-orange-500"
							];
							const colorIndex = seccion.cursoId % colores.length;
							const colorClass = colores[colorIndex];

							const nombreCurso = seccion.curso?.nombre || `Curso ${seccion.cursoId}`;
							const codigoCurso = seccion.curso?.codigo || `C${seccion.cursoId}`;

							return (
								<div key={seccion.seccionId} className="flex items-center p-2 bg-gray-600 bg-opacity-30 rounded">
									<div className={`w-3 h-3 ${colorClass} rounded mr-3 flex-shrink-0`}></div>
									<div className="flex-1 min-w-0">
										<div className="text-xs font-medium text-gray-200 truncate">
											{codigoCurso} - {nombreCurso}
										</div>
										<div className="text-xs text-gray-400">
											{seccion.grupo} • Sección {seccion.seccionId}
										</div>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			)}

			
		</motion.div>
	);
};

export default HorarioGrid;