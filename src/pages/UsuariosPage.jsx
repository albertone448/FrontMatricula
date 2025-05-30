import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Header from "../components/common/Header";
import { UserPlus, Users, Search, Edit, Trash2, CheckCircle, AlertCircle, RefreshCw } from "lucide-react";

// Componente Modal para crear usuario
const CreateUserModal = ({ isOpen, onClose, onSuccess }) => {
	const [formData, setFormData] = useState({
		nombre: "",
		apellido1: "",
		apellido2: "",
		identificacion: "",
		rol: "Estudiante",
		carrera: "",
		correo: "",
		contrasena: ""
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const roles = ["Estudiante", "Profesor", "Administrador"];
	const carreras = [
		"Ingeniería Informática",
		"Ingeniería Industrial",
		"Ingeniería Civil",
		"Administración de Empresas",
		"Contaduría Pública",
		"Derecho",
		"Psicología",
		"Medicina"
	];

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value
		});
		if (error) setError("");
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError("");

		// Validaciones
		if (formData.contrasena.length < 6) {
			setError("La contraseña debe tener al menos 6 caracteres");
			setLoading(false);
			return;
		}

		try {
			const response = await fetch("http://localhost:5276/api/Usuario/AddUsuario", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});

			const data = await response.json();

			if (response.ok) {
				// Éxito - mostrar mensaje y cerrar modal
				onSuccess(`Usuario ${formData.nombre} ${formData.apellido1} creado exitosamente. Se envió código de verificación a ${formData.correo}`);
				handleClose();
			} else {
				setError(data.mensaje || "Error al crear usuario");
			}
		} catch (error) {
			setError("Error de conexión. Intente nuevamente.");
			console.error("Error:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleClose = () => {
		setFormData({
			nombre: "",
			apellido1: "",
			apellido2: "",
			identificacion: "",
			rol: "Estudiante",
			carrera: "",
			correo: "",
			contrasena: ""
		});
		setError("");
		onClose();
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			{/* Overlay */}
			<div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={handleClose} />
			
			{/* Modal */}
			<motion.div
				initial={{ opacity: 0, scale: 0.9 }}
				animate={{ opacity: 1, scale: 1 }}
				exit={{ opacity: 0, scale: 0.9 }}
				className="relative bg-gray-800 bg-opacity-95 backdrop-blur-md shadow-xl rounded-xl p-8 border border-gray-700 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
			>
				{/* Header */}
				<div className="text-center mb-6">
					<div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-full mb-4">
						<UserPlus className="w-8 h-8 text-white" />
					</div>
					<h2 className="text-2xl font-bold text-gray-100 mb-2">Crear Nuevo Usuario</h2>
					<p className="text-gray-400">Complete los datos del nuevo usuario</p>
				</div>

				{/* Formulario */}
				<form onSubmit={handleSubmit} className="space-y-6">
					{/* Nombres */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-medium text-gray-300 mb-2">Nombre</label>
							<input
								type="text"
								name="nombre"
								value={formData.nombre}
								onChange={handleChange}
								required
								className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
								placeholder="Nombre"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-300 mb-2">Primer Apellido</label>
							<input
								type="text"
								name="apellido1"
								value={formData.apellido1}
								onChange={handleChange}
								required
								className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
								placeholder="Primer apellido"
							/>
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-medium text-gray-300 mb-2">Segundo Apellido</label>
							<input
								type="text"
								name="apellido2"
								value={formData.apellido2}
								onChange={handleChange}
								className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
								placeholder="Segundo apellido (opcional)"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-300 mb-2">Identificación</label>
							<input
								type="text"
								name="identificacion"
								value={formData.identificacion}
								onChange={handleChange}
								required
								className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
								placeholder="Cédula o ID"
							/>
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-medium text-gray-300 mb-2">Rol</label>
							<select
								name="rol"
								value={formData.rol}
								onChange={handleChange}
								className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
							>
								{roles.map((rol) => (
									<option key={rol} value={rol}>{rol}</option>
								))}
							</select>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-300 mb-2">Carrera</label>
							<select
								name="carrera"
								value={formData.carrera}
								onChange={handleChange}
								required
								className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
							>
								<option value="">Seleccionar carrera</option>
								{carreras.map((carrera) => (
									<option key={carrera} value={carrera}>{carrera}</option>
								))}
							</select>
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-medium text-gray-300 mb-2">Correo Electrónico</label>
							<input
								type="email"
								name="correo"
								value={formData.correo}
								onChange={handleChange}
								required
								className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
								placeholder="correo@ejemplo.com"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-300 mb-2">Contraseña Temporal</label>
							<input
								type="password"
								name="contrasena"
								value={formData.contrasena}
								onChange={handleChange}
								required
								className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
								placeholder="Mínimo 6 caracteres"
							/>
						</div>
					</div>

					{/* Error */}
					{error && (
						<motion.div
							initial={{ opacity: 0, y: -10 }}
							animate={{ opacity: 1, y: 0 }}
							className="bg-red-500 bg-opacity-20 border border-red-500 text-red-400 px-4 py-3 rounded-lg text-sm flex items-center"
						>
							<AlertCircle className="w-5 h-5 mr-2" />
							{error}
						</motion.div>
					)}

					{/* Botones */}
					<div className="flex justify-end space-x-3 pt-4">
						<button
							type="button"
							onClick={handleClose}
							className="px-4 py-2 text-gray-400 hover:text-gray-300 transition duration-200"
						>
							Cancelar
						</button>
						<motion.button
							type="submit"
							disabled={loading}
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							className="bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:cursor-not-allowed text-white font-medium py-2 px-6 rounded-lg transition duration-200 flex items-center"
						>
							{loading ? (
								<div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
							) : (
								<>
									<UserPlus className="w-5 h-5 mr-2" />
									Crear Usuario
								</>
							)}
						</motion.button>
					</div>
				</form>
			</motion.div>
		</div>
	);
};

// Componente principal
const UsuariosPage = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [successMessage, setSuccessMessage] = useState("");
	const [searchTerm, setSearchTerm] = useState("");
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	// Cargar usuarios al montar el componente
	useEffect(() => {
		fetchUsers();
	}, []);

	const fetchUsers = async () => {
		setLoading(true);
		setError("");
		try {
			const response = await fetch("http://localhost:5276/api/Usuario/GetTodosLosUsuarios", {
				method: "GET",
				headers: {
					"Accept": "application/json",
				},
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json();
			setUsers(data);
		} catch (error) {
			setError("Error al cargar los usuarios. Verifique la conexión con el servidor.");
			console.error("Error:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleCreateSuccess = (message) => {
		setSuccessMessage(message);
		setTimeout(() => setSuccessMessage(""), 5000);
		// Recargar la lista de usuarios después de crear uno nuevo
		fetchUsers();
	};

	const filteredUsers = users.filter(user =>
		user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
		user.apellido1.toLowerCase().includes(searchTerm.toLowerCase()) ||
		user.correo.toLowerCase().includes(searchTerm.toLowerCase()) ||
		user.identificacion.includes(searchTerm)
	);

	// Calcular estadísticas en tiempo real
	const totalUsers = users.length;
	const activeUsers = users.filter(u => u.activo).length;
	const students = users.filter(u => u.rol === 'Estudiante').length;
	const professors = users.filter(u => u.rol === 'Profesor').length;

	return (
		<div className='flex-1 overflow-auto relative z-10 bg-gray-900'>
			<Header title={"Gestión de Usuarios"} />

			<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
				{/* Mensaje de éxito */}
				{successMessage && (
					<motion.div
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						className="bg-green-500 bg-opacity-20 border border-green-500 text-green-400 px-4 py-3 rounded-lg text-sm flex items-center mb-6"
					>
						<CheckCircle className="w-5 h-5 mr-2" />
						<div>
							<p className="font-medium">¡Usuario creado exitosamente!</p>
							<p className="text-xs opacity-75 mt-1">{successMessage}</p>
						</div>
					</motion.div>
				)}

				{/* Mensaje de error */}
				{error && (
					<motion.div
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						className="bg-red-500 bg-opacity-20 border border-red-500 text-red-400 px-4 py-3 rounded-lg text-sm flex items-center mb-6"
					>
						<AlertCircle className="w-5 h-5 mr-2" />
						<div>
							<p className="font-medium">Error al cargar datos</p>
							<p className="text-xs opacity-75 mt-1">{error}</p>
						</div>
						<button
							onClick={fetchUsers}
							className="ml-auto text-red-300 hover:text-red-200 transition duration-200"
						>
							<RefreshCw className="w-4 h-4" />
						</button>
					</motion.div>
				)}

				{/* Header de la página */}
				<div className="mb-8">
					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
						<div>
							<h1 className="text-2xl font-bold text-gray-100 mb-2">Usuarios del Sistema</h1>
							<p className="text-gray-400">Gestiona los usuarios registrados en el sistema</p>
						</div>
						<div className="flex items-center space-x-3 mt-4 sm:mt-0">
							<motion.button
								onClick={fetchUsers}
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
								disabled={loading}
								className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-800 text-white font-medium py-2 px-4 rounded-lg transition duration-200 flex items-center"
							>
								<RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
								Actualizar
							</motion.button>
							<motion.button
								onClick={() => setIsModalOpen(true)}
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
								className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition duration-200 flex items-center"
							>
								<UserPlus className="w-5 h-5 mr-2" />
								Crear Usuario
							</motion.button>
						</div>
					</div>
				</div>

				{/* Estadísticas */}
				<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.1 }}
						className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
					>
						<div className="flex items-center">
							<div className="p-2 bg-blue-500 bg-opacity-20 rounded-lg">
								<Users className="w-6 h-6 text-blue-400" />
							</div>
							<div className="ml-4">
								<p className="text-sm font-medium text-gray-400">Total Usuarios</p>
								<p className="text-2xl font-bold text-gray-100">{loading ? '...' : totalUsers}</p>
							</div>
						</div>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2 }}
						className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
					>
						<div className="flex items-center">
							<div className="p-2 bg-green-500 bg-opacity-20 rounded-lg">
								<CheckCircle className="w-6 h-6 text-green-400" />
							</div>
							<div className="ml-4">
								<p className="text-sm font-medium text-gray-400">Activos</p>
								<p className="text-2xl font-bold text-gray-100">{loading ? '...' : activeUsers}</p>
							</div>
						</div>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.3 }}
						className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
					>
						<div className="flex items-center">
							<div className="p-2 bg-purple-500 bg-opacity-20 rounded-lg">
								<Users className="w-6 h-6 text-purple-400" />
							</div>
							<div className="ml-4">
								<p className="text-sm font-medium text-gray-400">Estudiantes</p>
								<p className="text-2xl font-bold text-gray-100">{loading ? '...' : students}</p>
							</div>
						</div>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.4 }}
						className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
					>
						<div className="flex items-center">
							<div className="p-2 bg-yellow-500 bg-opacity-20 rounded-lg">
								<Users className="w-6 h-6 text-yellow-400" />
							</div>
							<div className="ml-4">
								<p className="text-sm font-medium text-gray-400">Profesores</p>
								<p className="text-2xl font-bold text-gray-100">{loading ? '...' : professors}</p>
							</div>
						</div>
					</motion.div>
				</div>

				{/* Tabla de usuarios */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.5 }}
					className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl border border-gray-700"
				>
					{/* Header de la tabla */}
					<div className="p-6 border-b border-gray-700">
						<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
							<h3 className="text-lg font-semibold text-gray-100 mb-4 sm:mb-0">Lista de Usuarios</h3>
							<div className="relative">
								<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
								<input
									type="text"
									placeholder="Buscar usuarios..."
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									className="pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
								/>
							</div>
						</div>
					</div>

					{/* Tabla */}
					<div className="overflow-x-auto">
						{loading ? (
							<div className="flex justify-center items-center py-12">
								<div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
								<span className="ml-3 text-gray-400">Cargando usuarios...</span>
							</div>
						) : (
							<table className="min-w-full divide-y divide-gray-700">
								<thead>
									<tr>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Usuario</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Identificación</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Rol</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Carrera</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Estado</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Acciones</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-gray-700">
									{filteredUsers.map((user) => (
										<motion.tr
											key={user.usuarioId}
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											transition={{ duration: 0.3 }}
											className="hover:bg-gray-700 hover:bg-opacity-30 transition duration-200"
										>
											<td className="px-6 py-4 whitespace-nowrap">
												<div className="flex items-center">
													<div className="flex-shrink-0 h-10 w-10">
														<div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
															{user.nombre.charAt(0)}{user.apellido1.charAt(0)}
														</div>
													</div>
													<div className="ml-4">
														<div className="text-sm font-medium text-gray-100">
															{user.nombre} {user.apellido1} {user.apellido2}
														</div>
														<div className="text-sm text-gray-400">{user.correo}</div>
													</div>
												</div>
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
												{user.identificacion}
											</td>
											<td className="px-6 py-4 whitespace-nowrap">
												<span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
													user.rol === 'Administrador' ? 'bg-red-800 text-red-100' :
													user.rol === 'Profesor' ? 'bg-yellow-800 text-yellow-100' :
													'bg-blue-800 text-blue-100'
												}`}>
													{user.rol}
												</span>
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
												{user.carrera}
											</td>
											<td className="px-6 py-4 whitespace-nowrap">
												<div className="flex items-center">
													<span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
														user.activo ? 'bg-green-800 text-green-100' : 'bg-red-800 text-red-100'
													}`}>
														{user.activo ? 'Activo' : 'Inactivo'}
													</span>
													{user.numeroVerificacion && (
														<span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-800 text-orange-100">
															Pendiente verificación
														</span>
													)}
												</div>
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
												<div className="flex space-x-2">
													<button className="text-blue-400 hover:text-blue-300 transition duration-200">
														<Edit className="w-4 h-4" />
													</button>
													<button className="text-red-400 hover:text-red-300 transition duration-200">
														<Trash2 className="w-4 h-4" />
													</button>
												</div>
											</td>
										</motion.tr>
									))}
								</tbody>
							</table>
						)}
					</div>

					{!loading && filteredUsers.length === 0 && (
						<div className="text-center py-8">
							<Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
							<p className="text-gray-400">
								{searchTerm ? "No se encontraron usuarios que coincidan con la búsqueda" : "No hay usuarios registrados"}
							</p>
						</div>
					)}
				</motion.div>
			</main>

			{/* Modal */}
			<CreateUserModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onSuccess={handleCreateSuccess}
			/>
		</div>
	);
};

export default UsuariosPage;