import { motion } from "framer-motion";
import { 
	Calendar, 
	CheckCircle, 
	Clock, 
	User,
	Mail,
	Shield,
	GraduationCap,
	AlertCircle
} from "lucide-react";

const StatCard = ({ icon: Icon, title, value, description, color, delay }) => (
	<motion.div
		initial={{ opacity: 0, y: 20 }}
		animate={{ opacity: 1, y: 0 }}
		transition={{ delay, duration: 0.3 }}
		className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
	>
		<div className="flex items-center">
			<div className={`p-3 ${color} bg-opacity-20 rounded-lg`}>
				<Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
			</div>
			<div className="ml-4 flex-1">
				<p className="text-sm font-medium text-gray-400">{title}</p>
				<p className="text-2xl font-bold text-gray-100">{value}</p>
				{description && (
					<p className="text-xs text-gray-500 mt-1">{description}</p>
				)}
			</div>
		</div>
	</motion.div>
);

const ProfileStats = ({ user, loading }) => {
	if (loading) {
		return (
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
				{[...Array(4)].map((_, index) => (
					<div key={index} className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700">
						<div className="flex items-center">
							<div className="w-12 h-12 bg-gray-700 rounded-lg animate-pulse"></div>
							<div className="ml-4 flex-1 space-y-2">
								<div className="h-4 bg-gray-700 rounded animate-pulse"></div>
								<div className="h-6 bg-gray-700 rounded animate-pulse"></div>
							</div>
						</div>
					</div>
				))}
			</div>
		);
	}

	if (!user) return null;

	// Calcular fecha de registro (simulada - puedes ajustarla según tu API)
	const registrationDate = new Date().toLocaleDateString('es-ES', {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});

	// Estadísticas del perfil
	const stats = [
		{
			icon: User,
			title: "Tipo de Usuario",
			value: user.rol,
			description: user.rol === 'Administrador' ? 'Acceso total al sistema' : 
						user.rol === 'Profesor' ? 'Gestión académica' : 'Acceso estudiantil',
			color: "bg-blue-500",
			delay: 0.1
		},
		{
			icon: user.activo ? CheckCircle : Clock,
			title: "Estado",
			value: user.activo ? "Activo" : "Inactivo",
			description: user.activo ? "Cuenta verificada y activa" : "Cuenta inactiva",
			color: user.activo ? "bg-green-500" : "bg-red-500",
			delay: 0.2
		},
		{
			icon: Calendar,
			title: "Miembro desde",
			value: registrationDate,
			description: "Fecha de registro en el sistema",
			color: "bg-purple-500",
			delay: 0.3
		}
	];

	// Solo mostrar verificación si NO está verificado
	if (user.numeroVerificacion) {
		stats.push({
			icon: AlertCircle,
			title: "Verificación",
			value: "Pendiente",
			description: "Revisa tu correo electrónico",
			color: "bg-orange-500",
			delay: 0.4
		});
	}

	// Solo mostrar carrera si existe y no es "N/A"
	if (user.carrera && user.carrera.trim() !== "" && user.carrera.toUpperCase() !== "N/A") {
		stats.push({
			icon: GraduationCap,
			title: "Carrera",
			value: user.carrera.length > 20 ? `${user.carrera.substring(0, 30)}` : user.carrera,
			color: "bg-indigo-500",
			delay: stats.length * 0.1 + 0.1
		});
	}

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
			{stats.map((stat, index) => (
				<StatCard
					key={index}
					icon={stat.icon}
					title={stat.title}
					value={stat.value}
					description={stat.description}
					color={stat.color}
					delay={stat.delay}
				/>
			))}
		</div>
	);
};

export default ProfileStats;