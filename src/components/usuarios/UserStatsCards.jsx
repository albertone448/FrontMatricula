import { motion } from "framer-motion";
import { Users, CheckCircle } from "lucide-react";

const StatCard = ({ icon: Icon, title, value, color, delay, loading }) => (
	<motion.div
		initial={{ opacity: 0, y: 20 }}
		animate={{ opacity: 1, y: 0 }}
		transition={{ delay }}
		className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
	>
		<div className="flex items-center">
			<div className={`p-2 ${color} bg-opacity-20 rounded-lg`}>
				<Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
			</div>
			<div className="ml-4">
				<p className="text-sm font-medium text-gray-400">{title}</p>
				<p className="text-2xl font-bold text-gray-100">
					{loading ? '...' : value}
				</p>
			</div>
		</div>
	</motion.div>
);

const UserStatsCards = ({ users, loading }) => {
	const stats = {
		total: users.length,
		active: users.filter(u => u.activo).length,
		students: users.filter(u => u.rol === 'Estudiante').length,
		professors: users.filter(u => u.rol === 'Profesor').length
	};

	const statsConfig = [
		{
			icon: Users,
			title: "Total Usuarios",
			value: stats.total,
			color: "bg-blue-500",
			delay: 0.1
		},
		{
			icon: CheckCircle,
			title: "Activos",
			value: stats.active,
			color: "bg-green-500",
			delay: 0.2
		},
		{
			icon: Users,
			title: "Estudiantes",
			value: stats.students,
			color: "bg-purple-500",
			delay: 0.3
		},
		{
			icon: Users,
			title: "Profesores",
			value: stats.professors,
			color: "bg-yellow-500",
			delay: 0.4
		}
	];

	return (
		<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
			{statsConfig.map((stat, index) => (
				<StatCard
					key={index}
					icon={stat.icon}
					title={stat.title}
					value={stat.value}
					color={stat.color}
					delay={stat.delay}
					loading={loading}
				/>
			))}
		</div>
	);
};

export default UserStatsCards;