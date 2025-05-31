import { useState } from "react";
import { motion } from "framer-motion";
import { UserPlus, AlertCircle } from "lucide-react";

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

	const validateForm = () => {
		if (formData.contrasena.length < 6) {
			setError("La contraseña debe tener al menos 6 caracteres");
			return false;
		}
		return true;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		
		if (!validateForm()) return;

		setLoading(true);
		setError("");

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

export default CreateUserModal;