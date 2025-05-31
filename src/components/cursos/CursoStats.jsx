import { motion } from "framer-motion";
import { BookOpen, Users, Clock, GraduationCap } from "lucide-react";
import StatCard from "../common/StatCard";

const CursoStats = ({ cursos = [], loading }) => {
	if (loading) {
		return (
			<div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
				{[...Array(4)].map((_, i) => (
					<div key={i} className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl border border-gray-700 p-6 animate-pulse">
						<div className="h-4 bg-gray-700 rounded w-1/3 mb-4"></div>
						<div className="h-8 bg-gray-700 rounded w-2/3"></div>
					</div>
				))}
			</div>
		);
	}

	const stats = [
		{
			name: "Total Cursos",
			value: cursos.length,
			icon: BookOpen,
			color: "#6366F1"
		},
		{
			name: "Cursos Activos",
			value: cursos.filter(curso => curso.estado === "Activo").length,
			icon: Clock,
			color: "#10B981"
		},
		{
			name: "Estudiantes Matriculados",
			value: "0", // Este valor debería venir de la API
			icon: Users,
			color: "#F59E0B"
		},
		{
			name: "Carreras",
			value: "0", // Este valor debería venir de la API
			icon: GraduationCap,
			color: "#EF4444"
		}
	];

	return (
		<motion.div
			className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
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
