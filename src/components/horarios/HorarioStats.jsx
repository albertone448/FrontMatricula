import { motion } from "framer-motion";
import { BookOpen, Calendar, Clock, TrendingUp, BarChart3 } from "lucide-react";
import StatCard from "../common/StatCard";

const HorarioStats = ({ stats, seccionesPorDia }) => {
	const statsConfig = [
		{
			name: "Total de Cursos",
			value: stats.totalCursos,
			icon: BookOpen,
			color: "#6366F1",
			delay: 0.1
		},
		{
			name: "Días con Clases",
			value: stats.diasConClases,
			icon: Calendar,
			color: "#10B981",
			delay: 0.2
		},
		{
			name: "Horas Semanales",
			value: `${stats.horasSemanales.toFixed(1)}h`,
			icon: Clock,
			color: "#F59E0B",
			delay: 0.3
		},
		{
			name: "Carga Académica",
			value: stats.totalCursos > 5 ? "Alta" : stats.totalCursos > 3 ? "Media" : "Baja",
			icon: TrendingUp,
			color: stats.totalCursos > 5 ? "#EF4444" : stats.totalCursos > 3 ? "#F59E0B" : "#10B981",
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
					>
						<StatCard
							name={stat.name}
							value={stat.value}
							icon={stat.icon}
							color={stat.color}
						/>
					</motion.div>
				))}
			</motion.div>

			{/* Distribución por días */}
			{Object.keys(seccionesPorDia).length > 0 && (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.5, duration: 0.5 }}
					className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
				>
					<h3 className="text-lg font-semibold text-gray-100 mb-6 flex items-center">
						<BarChart3 className="w-5 h-5 mr-2 text-blue-400" />
						Distribución por Días
					</h3>

					<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
						{["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"].map((dia, index) => {
							const clases = seccionesPorDia[dia] || 0;
							const porcentaje = stats.totalCursos > 0 ? (clases / stats.totalCursos) * 100 : 0;
							
							return (
								<motion.div
									key={dia}
									initial={{ opacity: 0, scale: 0.9 }}
									animate={{ opacity: 1, scale: 1 }}
									transition={{ delay: 0.6 + index * 0.1, duration: 0.3 }}
									className="text-center"
								>
									<div className="bg-gray-700 bg-opacity-50 rounded-lg p-4 mb-2">
										<div className="text-2xl font-bold text-gray-100 mb-1">
											{clases}
										</div>
										<div className="text-xs text-gray-400">
											clases
										</div>
									</div>
									
									<div className="text-sm font-medium text-gray-300 mb-2">
										{dia}
									</div>
									
									<div className="w-full bg-gray-700 rounded-full h-2">
										<motion.div
											initial={{ width: 0 }}
											animate={{ width: `${porcentaje}%` }}
											transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
											className="bg-blue-500 h-2 rounded-full"
											style={{ 
												backgroundColor: clases > 0 ? "#3B82F6" : "#6B7280" 
											}}
										/>
									</div>
								</motion.div>
							);
						})}
					</div>
				</motion.div>
			)}

			{/* Resumen de la carga académica */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.7, duration: 0.5 }}
				className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
			>
				<h3 className="text-lg font-semibold text-gray-100 mb-4">Resumen Académico</h3>
				
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					{/* Periodo actual */}
					<div className="bg-gray-700 bg-opacity-50 rounded-lg p-4">
						<h4 className="text-sm font-medium text-gray-400 mb-2">Periodo Actual</h4>
						<p className="text-lg font-semibold text-blue-400">{stats.periodo}</p>
					</div>

					{/* Promedio de clases por día */}
					<div className="bg-gray-700 bg-opacity-50 rounded-lg p-4">
						<h4 className="text-sm font-medium text-gray-400 mb-2">Promedio por Día</h4>
						<p className="text-lg font-semibold text-green-400">
							{stats.diasConClases > 0 ? (stats.totalCursos / stats.diasConClases).toFixed(1) : "0"} clases
						</p>
					</div>

					{/* Tiempo libre estimado */}
					<div className="bg-gray-700 bg-opacity-50 rounded-lg p-4">
						<h4 className="text-sm font-medium text-gray-400 mb-2">Tiempo Libre Semanal</h4>
						<p className="text-lg font-semibold text-yellow-400">
							{(45 - stats.horasSemanales).toFixed(1)}h
						</p>
						<p className="text-xs text-gray-500 mt-1">
							De 45h académicas totales
						</p>
					</div>
				</div>

				{/* Consejos basados en la carga académica */}
				<div className="mt-4 p-4 rounded-lg" style={{
					backgroundColor: stats.totalCursos > 5 ? "rgba(239, 68, 68, 0.1)" : 
									 stats.totalCursos > 3 ? "rgba(245, 158, 11, 0.1)" : 
									 "rgba(16, 185, 129, 0.1)",
					borderColor: stats.totalCursos > 5 ? "#EF4444" : 
								 stats.totalCursos > 3 ? "#F59E0B" : 
								 "#10B981",
					borderWidth: "1px"
				}}>
					<h4 className="text-sm font-medium mb-2" style={{
						color: stats.totalCursos > 5 ? "#EF4444" : 
							   stats.totalCursos > 3 ? "#F59E0B" : 
							   "#10B981"
					}}>
						{stats.totalCursos > 5 ? "⚠️ Carga Alta" : 
						 stats.totalCursos > 3 ? "📚 Carga Media" : 
						 "✅ Carga Ligera"}
					</h4>
					<p className="text-xs text-gray-400">
						{stats.totalCursos > 5 ? 
							"Tienes una carga académica alta. Considera organizar bien tu tiempo de estudio." :
						 stats.totalCursos > 3 ? 
							"Carga académica equilibrada. Mantén una buena rutina de estudio." :
							"Carga académica ligera. Podrías considerar agregar más cursos si es posible."
						}
					</p>
				</div>
			</motion.div>
		</div>
	);
};

export default HorarioStats