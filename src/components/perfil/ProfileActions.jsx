import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
	Edit, 
	Key, 
	Download, 
	LogOut, 
	Mail,
	Shield
} from "lucide-react";

const ActionCard = ({ icon: Icon, title, description, onClick, color, delay, disabled = false }) => (
	<motion.div
		initial={{ opacity: 0, scale: 0.95 }}
		animate={{ opacity: 1, scale: 1 }}
		transition={{ delay, duration: 0.3 }}
		className={`bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl border border-gray-700 overflow-hidden ${
			disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-600 cursor-pointer'
		}`}
		whileHover={!disabled ? { scale: 1.02 } : {}}
		whileTap={!disabled ? { scale: 0.98 } : {}}
		onClick={disabled ? undefined : onClick}
	>
		<div className="p-6">
			<div className="flex items-start space-x-4">
				<div className={`p-3 ${color} bg-opacity-20 rounded-lg flex-shrink-0`}>
					<Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
				</div>
				<div className="flex-1 min-w-0">
					<h3 className="text-lg font-semibold text-gray-100 mb-2">{title}</h3>
					<p className="text-sm text-gray-400 leading-relaxed">{description}</p>
				</div>
			</div>
		</div>
	</motion.div>
);

const ProfileActions = ({ user, onEditProfile, onDownloadData }) => {
	const navigate = useNavigate();

	if (!user) return null;

	const handleEditProfile = () => {
		onEditProfile?.();
	};

	const handleChangePassword = () => {
		navigate("/cambiar-contrasena");
	};

	const handleDownloadData = () => {
		// Crear objeto con datos del usuario
		const userData = {
			nombre: user.nombre,
			apellido1: user.apellido1,
			apellido2: user.apellido2,
			identificacion: user.identificacion,
			rol: user.rol,
			carrera: user.carrera,
			correo: user.correo,
			activo: user.activo,
			fechaDescarga: new Date().toISOString()
		};

		// Crear archivo JSON
		const dataStr = JSON.stringify(userData, null, 2);
		const dataBlob = new Blob([dataStr], { type: 'application/json' });
		
		// Crear enlace de descarga
		const url = URL.createObjectURL(dataBlob);
		const link = document.createElement('a');
		link.href = url;
		link.download = `perfil_${user.nombre}_${user.apellido1}.json`;
		
		// Triggear descarga
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		
		// Limpiar URL
		URL.revokeObjectURL(url);
		
		onDownloadData?.();
	};

	const handleSendVerification = () => {
		// Aquí puedes implementar la lógica para reenviar verificación
		alert('Funcionalidad de reenvío de verificación - Por implementar');
	};

	const handleLogout = () => {
		if (window.confirm('¿Estás seguro de que deseas cerrar sesión?')) {
			// Limpiar localStorage
			localStorage.removeItem("isAuthenticated");
			localStorage.removeItem("usuario");
			localStorage.removeItem("usuarioId");
			localStorage.removeItem("pendingUserId");
			localStorage.removeItem("userEmail");
			
			// Redirigir al login
			navigate('/login');
		}
	};

	const actions = [
		{
			icon: Edit,
			title: "Editar Perfil",
			description: "Actualiza tu información personal, correo electrónico y otros datos del perfil.",
			onClick: handleEditProfile,
			color: "bg-blue-500",
			delay: 0.1
		},
		{
			icon: Key,
			title: "Cambiar Contraseña",
			description: "Modifica tu contraseña actual por una nueva para mantener tu cuenta segura.",
			onClick: handleChangePassword,
			color: "bg-green-500",
			delay: 0.2
		},
		{
			icon: Download,
			title: "Descargar Datos",
			description: "Descarga una copia de tu información personal en formato JSON.",
			onClick: handleDownloadData,
			color: "bg-purple-500",
			delay: 0.3
		}
	];

	// Agregar acción de reenviar verificación si está pendiente
	if (user.numeroVerificacion) {
		actions.push({
			icon: Mail,
			title: "Reenviar Verificación",
			description: "Envía nuevamente el código de verificación a tu correo electrónico.",
			onClick: handleSendVerification,
			color: "bg-orange-500",
			delay: 0.4
		});
	}

	// Agregar acción de logout
	actions.push({
		icon: LogOut,
		title: "Cerrar Sesión",
		description: "Sal de tu cuenta de forma segura. Tendrás que iniciar sesión nuevamente.",
		onClick: handleLogout,
		color: "bg-red-500",
		delay: actions.length * 0.1 + 0.1
	});

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3, delay: 0.2 }}
			className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl border border-gray-700 p-6"
		>
			<div className="mb-6">
				<h2 className="text-xl font-bold text-gray-100 mb-2">Acciones de Perfil</h2>
				<p className="text-sm text-gray-400">
					Gestiona tu cuenta y configuración personal.
				</p>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
				{actions.map((action, index) => (
					<ActionCard
						key={index}
						icon={action.icon}
						title={action.title}
						description={action.description}
						onClick={action.onClick}
						color={action.color}
						delay={action.delay}
					/>
				))}
			</div>
		</motion.div>
	);
};

export default ProfileActions;