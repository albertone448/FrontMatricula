import { useState } from "react";
import { motion } from "framer-motion";
import { UserPlus, AlertCircle } from "lucide-react";
import { authUtils } from "../../utils/authUtils";
import api from "../../services/apiConfig";

const CreateUserModal = ({ isOpen, onClose, onSuccess }) => {
	const [formData, setFormData] = useState({
		nombre: "",
		apellido1: "",
		apellido2: "",
		identificacion: "",
		rol: "Estudiante",
		carrera: "",
		correo: ""
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const roles = ["Estudiante", "Profesor", "Administrador"];
	const carreras = [
		// FACULTAD DE CIENCIAS EXACTAS Y NATURALES
		"Química",
		"Matemática",
		"Física",
		"Biología",
		"Ciencias Actuariales",
		"Ingeniería Informática",
		"Tecnologías de Información",
		
		// FACULTAD DE CIENCIAS SOCIALES
		"Sociología",
		"Psicología",
		"Trabajo Social",
		"Planificación Económica y Social",
		"Administración",
		"Economía",
		"Relaciones Internacionales",
		"Ciencias Políticas",
		"Gestión de Recursos Humanos",
		"Bibliotecología y Documentación",
		"Archivística",
		
		// FACULTAD DE FILOSOFÍA Y LETRAS
		"Filosofía",
		"Historia",
		"Literatura y Lingüística",
		"Inglés",
		"Francés",
		"Traducción Inglés-Español",
		"Traducción Francés-Español",
		"Comunicación",
		"Producción Audiovisual",
		"Ciencias Geográficas",
		"Antropología",
		"Arte",
		"Música",
		"Danza",
		"Teatro",
		
		// FACULTAD DE CIENCIAS DE LA SALUD
		"Medicina Veterinaria",
		"Medicina",
		"Enfermería",
		"Salud Ocupacional",
		"Nutrición Humana",
		"Promoción de la Salud",
		"Ciencias del Deporte",
		"Terapia Física",
		"Tecnologías en Salud",
		
		// FACULTAD DE CIENCIAS DE LA TIERRA Y EL MAR
		"Ingeniería en Ciencias Forestales",
		"Ciencias Forestales",
		"Ingeniería Agronómica",
		"Ciencias Agrarias",
		"Medicina Veterinaria",
		"Biología Marina",
		"Ciencias Marinas y Costeras",
		"Gestión de Recursos Naturales",
		"Desarrollo Rural",
		"Ingeniería en Biotecnología",
		"Ciencias Ambientales",
		"Gestión Ambiental",
		"Ingeniería Hidrológica",
		"Meteorología",
		"Ciencias Geográficas con énfasis en Ordenamiento Territorial",
		
		// CENTRO DE INVESTIGACIÓN Y DOCENCIA EN EDUCACIÓN (CIDE)
		"Pedagogía con énfasis en Educación Preescolar",
		"Pedagogía con énfasis en I y II Ciclos",
		"Enseñanza del Inglés",
		"Enseñanza del Francés",
		"Enseñanza de las Matemáticas",
		"Enseñanza de las Ciencias Naturales",
		"Enseñanza de los Estudios Sociales",
		"Enseñanza del Castellano y Literatura",
		"Enseñanza de la Filosofía",
		"Educación Física",
		"Enseñanza de la Música",
		"Enseñanza de las Artes Plásticas",
		"Orientación",
		"Educación Especial",
		"Administración Educativa",
		"Bibliotecología",
		"Tecnología Educativa",
		"Educación Rural",
		"Educación de Adultos",
		
		// SEDE REGIONAL BRUNCA
		"Administración con énfasis en Gestión Financiera",
		"Ingeniería Industrial",
		"Turismo",
		"Enseñanza del Inglés para III Ciclo y Educación Diversificada",
		"Ciencias Forestales",
		"Gestión Empresarial del Turismo Sostenible",
		
		// SEDE REGIONAL CHOROTEGA
		"Gestión Empresarial del Turismo Sostenible",
		"Administración",
		"Contaduría Pública",
		"Ingeniería en Sistemas de Información",
		"Ciencias Forestales",
		"Ingeniería Agronómica",
		
		// SEDE REGIONAL PACÍFICO CENTRAL
		"Ciencias Marinas y Costeras",
		"Ingeniería en Ciencias Forestales",
		"Gestión Empresarial del Turismo Sostenible",
		"Ciencias de la Educación con énfasis en Educación Rural",
		
		// SEDE REGIONAL HUETAR NORTE
		"Administración",
		"Gestión Empresarial del Turismo Sostenible",
		"Ingeniería en Sistemas de Información",
		"Ciencias Forestales",
		"Ingeniería Agronómica",
		"Ciencias de la Educación",
		
		// SEDE REGIONAL HUETAR ATLÁNTICA
		"Administración",
		"Ingeniería en Sistemas de Información",
		"Ciencias Forestales",
		"Turismo",
		"Enseñanza del Inglés",
		
		// SEDE INTERUNIVERSITARIA DE ALAJUELA
		"Ingeniería Industrial",
		"Administración",
		"Contaduría Pública",
		
		// PROGRAMAS ESPECIALES Y OTROS
		"Topografía",
		"Cartografía",
		"Manejo de Recursos Naturales",
		"Desarrollo Humano",
		"Estudios Interdisciplinarios",
		"Gestión de la Información",
		"Cooperativismo",
		"Desarrollo Comunitario Sustentable"
	];

	const handleChange = (e) => {
		const { name, value } = e.target;
		
		// Si es el campo identificación, solo permitir números
		if (name === "identificacion") {
			const numericValue = value.replace(/\D/g, ""); // Remover todo lo que no sea dígito
			if (numericValue.length <= 12) { // Máximo 12 dígitos
				setFormData({
					...formData,
					[name]: numericValue
				});
			}
			if (error) setError("");
			return;
		}
		
		// Si cambia el rol a Administrador, limpiar la carrera
		if (name === "rol" && value === "Administrador") {
			setFormData({
				...formData,
				[name]: value,
				carrera: "" // Limpiar carrera para administradores
			});
		} else {
			setFormData({
				...formData,
				[name]: value
			});
		}
		
		if (error) setError("");
	};

	const validateForm = () => {
		// Validaciones básicas
		if (!formData.nombre.trim()) {
			setError("El nombre es requerido");
			return false;
		}
		if (!formData.apellido1.trim()) {
			setError("El primer apellido es requerido");
			return false;
		}
		if (!formData.identificacion.trim()) {
			setError("La identificación es requerida");
			return false;
		}
		
		// Validar identificación: solo números entre 9 y 12 dígitos
		const identificacionRegex = /^\d{9,12}$/;
		if (!identificacionRegex.test(formData.identificacion)) {
			setError("La identificación debe contener entre 9 y 12 dígitos numéricos");
			return false;
		}
		
		if (!formData.correo.trim()) {
			setError("El correo es requerido");
			return false;
		}
		
		// Solo validar carrera si no es administrador
		if (formData.rol !== "Administrador" && !formData.carrera) {
			setError("La carrera es requerida");
			return false;
		}
		
		// Validar formato de email
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(formData.correo)) {
			setError("El formato del correo no es válido");
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
			// Verificar que tengamos token de autorización
			const token = authUtils.getToken();
			if (!token) {
				setError("No se encontró token de autenticación. Por favor, inicie sesión nuevamente.");
				setLoading(false);
				return;
			}

			// Agregar una contraseña temporal que será reemplazada después de la verificación
			const dataToSend = {
				...formData,
				contrasena: "TempPassword123!" // Contraseña temporal que será reemplazada
			};

			// Si es administrador, NO enviar campo carrera (eliminarlo del objeto)
			if (formData.rol === "Administrador") {
				delete dataToSend.carrera;
			}

			const response = await api.post('Usuario/AddUsuario', dataToSend);

			onSuccess(`Usuario ${formData.nombre} ${formData.apellido1} creado exitosamente. Se envió código de verificación a ${formData.correo}. Al verificar su cuenta, recibirá una contraseña automática por correo.`);
			handleClose();

		} catch (error) {
			console.error('❌ Error creating user:', error);
			
			// Manejo de errores mejorado
			let errorMessage = "Error de conexión. Intente nuevamente.";
			
			if (error.response?.data?.mensaje) {
				errorMessage = error.response.data.mensaje;
			} else if (error.response?.data?.message) {
				errorMessage = error.response.data.message;
			} else if (error.response?.status === 401) {
				errorMessage = "Sesión expirada. Por favor, inicie sesión nuevamente.";
			} else if (error.message && !error.message.includes("Failed to fetch")) {
				errorMessage = error.message;
			}
			
			setError(errorMessage);
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
			correo: ""
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
					<div className="mt-2 p-3 bg-blue-500 bg-opacity-20 border border-blue-500 rounded-lg">
						<p className="text-blue-300 text-sm">
							<strong>Nota:</strong> El usuario recibirá un código de verificación por correo. 
							Al verificar su cuenta, se generará automáticamente una contraseña segura.
						</p>
					</div>
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
								maxLength="12"
								className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
								placeholder="Ejemplo: 123456789"
							/>
							<p className="text-xs text-gray-500 mt-1">
								Solo números, entre 9 y 12 dígitos
							</p>
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
								required={formData.rol !== "Administrador"}
								disabled={formData.rol === "Administrador"}
								className={`w-full px-3 py-2 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200 ${
									formData.rol === "Administrador" 
										? "bg-gray-600 cursor-not-allowed opacity-50" 
										: "bg-gray-700"
								}`}
							>
								<option value="">
									{formData.rol === "Administrador" ? "No aplica para administradores" : "Seleccionar carrera"}
								</option>
								{formData.rol !== "Administrador" && carreras.map((carrera) => (
									<option key={carrera} value={carrera}>{carrera}</option>
								))}
							</select>
							{formData.rol === "Administrador" && (
								<p className="text-xs text-gray-500 mt-1">
									Los administradores del sistema no requieren carrera
								</p>
							)}
						</div>
					</div>

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
						<p className="text-xs text-gray-500 mt-1">
							Se enviará un código de verificación a este correo
						</p>
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
