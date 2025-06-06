import { motion } from "framer-motion";
import { BookOpen, Clock } from "lucide-react";
import StatCard from "../common/StatCard";
import { useSecciones } from "../../hooks/useSecciones";

const CursoStats = ({ cursos = [], loading }) => {
    const { secciones, loading: seccionesLoading } = useSecciones();

    if (loading || seccionesLoading) {
		return (
			<div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-2 mb-8">
				{[...Array(2)].map((_, i) => (
					<div key={i} className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl border border-gray-700 p-6 animate-pulse">
						<div className="h-4 bg-gray-700 rounded w-1/3 mb-4"></div>
						<div className="h-8 bg-gray-700 rounded w-2/3"></div>
					</div>
				))}
			</div>
		);
	}

	// Calcular cursos activos (los que tienen secciones)
	const cursosActivos = secciones && Array.isArray(secciones) ? 
		new Set(secciones.filter(s => s?.cursoId).map(s => s.cursoId)).size : 
		0;



	const stats = [
		{
			name: "Total Cursos",
			value: cursos.length || 0,
			icon: BookOpen,
			color: "#6366F1"
		},
		{
			name: "Cursos Activos",
			value: cursosActivos,
			icon: Clock,
			color: "#10B981"
		}
	];

	return (
		<motion.div
			className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-2 mb-8"
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
		>
			{stats.map((stat, index) => (
				<StatCard
					key={stat.name}
					name={stat.name}
					value={stat.value}
					icon={stat.icon}
					color={stat.color}
				/>
			))}
		</motion.div>
	);
};

export default CursoStats;
