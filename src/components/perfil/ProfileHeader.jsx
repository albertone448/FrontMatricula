import { motion } from "framer-motion";
import { User, Mail, CreditCard, GraduationCap, Shield, RefreshCw } from "lucide-react";

const ProfileHeader = ({ user, loading, onRefresh }) => {
	if (loading) {
		return (
			<div className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl border border-gray-700 p-8 mb-8">
				<div className="flex items-center space-x-6">
					<div className="w-24 h-24 bg-gray-700 rounded-full animate-pulse"></div>
					<div className="flex-1 space-y-3">
						<div className="h-8 bg-gray-700 rounded animate-pulse"></div>
						<div className="h-4 bg-gray-700 rounded w-3/4 animate-pulse"></div>
						<div className="h-4 bg-gray-700 rounded w-1/2 animate-pulse"></div>
					</div>
				</div>
			</div>
		);
	}

	if (!user) {
		return (
			<div className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl border border-gray-700 p-8 mb-8">
				<div className="text-center text-gray-400">
					<User className="w-16 h-16 mx-auto mb-4 opacity-50" />
					<p>No se pudo cargar la información del perfil</p>
				</div>
			</div>
		);
	}

	const getRoleColor = (rol) => {
		switch (rol) {
			case 'Administrador':
				return 'bg-red-500 text-red-100';
			case 'Profesor':
				return 'bg-yellow-500 text-yellow-100';
			case 'Estudiante':
				return 'bg-blue-500 text-blue-100';
			default:
				return 'bg-gray-500 text-gray-100';
		}
	};

	const getRoleIcon = (rol) => {
		switch (rol) {
			case 'Administrador':
				return Shield;
			case 'Profesor':
				return GraduationCap;
			case 'Estudiante':
				return User;
			default:
				return User;
		}
	};

	const RoleIcon = getRoleIcon(user.rol);

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}
			className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl border border-gray-700 p-8 mb-8"
		>
			<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
				<div className="flex items-center space-x-6 mb-6 lg:mb-0">
					{/* Avatar */}
					<div className="relative">
						<div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
							{user.nombre.charAt(0)}{user.apellido1.charAt(0)}
						</div>
						{/* Badge de estado */}
						<div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-gray-800 ${
							user.activo ? 'bg-green-500' : 'bg-red-500'
						}`} title={user.activo ? 'Usuario Activo' : 'Usuario Inactivo'}>
						</div>
					</div>

					{/* Información principal */}
					<div className="flex-1">
						<h1 className="text-3xl font-bold text-gray-100 mb-2">
							{user.nombre} {user.apellido1} {user.apellido2}
						</h1>
						
						<div className="flex flex-wrap items-center gap-3 mb-3">
							{/* Badge del rol */}
							<span className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center ${getRoleColor(user.rol)}`}>
								<RoleIcon className="w-4 h-4 mr-1" />
								{user.rol}
							</span>
							
							{/* Badge de verificación */}
							{user.numeroVerificacion && (
								<span className="px-3 py-1 rounded-full text-sm font-semibold bg-orange-500 text-orange-100">
									Pendiente verificación
								</span>
							)}
						</div>

						<div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm text-gray-400">
							<div className="flex items-center">
								<Mail className="w-4 h-4 mr-2" />
								{user.correo}
							</div>
							<div className="flex items-center">
								<CreditCard className="w-4 h-4 mr-2" />
								{user.identificacion}
							</div>
							{user.carrera && (
								<div className="flex items-center">
									<GraduationCap className="w-4 h-4 mr-2" />
									{user.carrera}
								</div>
							)}
						</div>
					</div>
				</div>

				{/* Botón de actualizar */}
				<div className="flex justify-end">
					<motion.button
						onClick={onRefresh}
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center"
					>
						<RefreshCw className="w-4 h-4 mr-2" />
						Actualizar
					</motion.button>
				</div>
			</div>
		</motion.div>
	);
};

export default ProfileHeader;