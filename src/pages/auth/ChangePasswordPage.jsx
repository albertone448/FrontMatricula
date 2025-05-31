import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Lock, CheckCircle, AlertCircle, Key, ArrowLeft } from "lucide-react";
import Header from "../../components/common/Header";
import { usePasswordChange } from "../../hooks/usePasswordChange";

const PasswordField = ({ 
	label, 
	name, 
	value, 
	onChange, 
	placeholder, 
	error,
	showPassword,
	onTogglePassword 
}) => (
	<div>
		<label className="block text-sm font-medium text-gray-300 mb-2">
			{label}
		</label>
		<div className="relative">
			<Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
			<input
				type={showPassword ? "text" : "password"}
				name={name}
				value={value}
				onChange={onChange}
				autoComplete="off"
				className={`w-full pl-10 pr-12 py-4 bg-gray-700 border rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 transition duration-200 text-lg ${
					error 
						? "border-red-500 focus:ring-red-500" 
						: "border-gray-600 focus:ring-blue-500 focus:border-transparent"
				}`}
				placeholder={placeholder}
			/>
			<button
				type="button"
				onClick={onTogglePassword}
				className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition duration-200"
			>
				{showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
			</button>
		</div>
		{error && (
			<p className="text-red-400 text-sm mt-2 flex items-center">
				<AlertCircle className="w-4 h-4 mr-2" />
				{error}
			</p>
		)}
	</div>
);

const ChangePasswordPage = () => {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		contrasenaActual: "",
		contrasenaNueva: "",
		confirmarContrasena: ""
	});
	
	const [showPasswords, setShowPasswords] = useState({
		actual: false,
		nueva: false,
		confirmar: false
	});
	
	const [validationErrors, setValidationErrors] = useState({});
	const { changePassword, loading, error, success, clearMessages } = usePasswordChange();

	// Manejar éxito - redirigir al perfil después de 3 segundos
	useEffect(() => {
		if (success) {
			setTimeout(() => {
				navigate("/perfil", {
					state: { 
						message: "Contraseña cambiada exitosamente" 
					}
				});
			}, 3000);
		}
	}, [success, navigate]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		
		setFormData(prev => ({
			...prev,
			[name]: value
		}));
		
		// Limpiar errores de validación del campo específico
		if (validationErrors[name]) {
			setValidationErrors(prev => ({
				...prev,
				[name]: ""
			}));
		}
		
		// Limpiar mensaje de error del API
		if (error) {
			clearMessages();
		}
	};

	const togglePasswordVisibility = (field) => {
		setShowPasswords(prev => ({
			...prev,
			[field]: !prev[field]
		}));
	};

	const validateForm = () => {
		const errors = {};

		// Validar contraseña actual
		if (!formData.contrasenaActual.trim()) {
			errors.contrasenaActual = "La contraseña actual es requerida";
		}

		// Validar nueva contraseña
		if (!formData.contrasenaNueva.trim()) {
			errors.contrasenaNueva = "La nueva contraseña es requerida";
		} else if (formData.contrasenaNueva.length < 6) {
			errors.contrasenaNueva = "La nueva contraseña debe tener al menos 6 caracteres";
		} else if (formData.contrasenaNueva === formData.contrasenaActual) {
			errors.contrasenaNueva = "La nueva contraseña debe ser diferente a la actual";
		}

		// Validar confirmación de contraseña
		if (!formData.confirmarContrasena.trim()) {
			errors.confirmarContrasena = "Debe confirmar la nueva contraseña";
		} else if (formData.contrasenaNueva !== formData.confirmarContrasena) {
			errors.confirmarContrasena = "Las contraseñas no coinciden";
		}

		setValidationErrors(errors);
		return Object.keys(errors).length === 0;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		
		if (!validateForm()) return;

		await changePassword(
			formData.contrasenaActual,
			formData.contrasenaNueva
		);
	};

	const handleGoBack = () => {
		navigate("/perfil");
	};

	return (
		<div className='flex-1 overflow-auto relative z-10'>
			<div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
				<Header title={"Cambiar Contraseña"} />

				<main className='max-w-2xl mx-auto py-8 px-4 lg:px-8'>
					{/* Botón volver */}
					<motion.button
						onClick={handleGoBack}
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						className="mb-6 flex items-center text-gray-400 hover:text-gray-300 transition duration-200"
					>
						<ArrowLeft className="w-5 h-5 mr-2" />
						Volver al perfil
					</motion.button>

					{/* Contenedor principal */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
						className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-xl rounded-xl p-8 border border-gray-700"
					>
						{/* Header */}
						<div className="text-center mb-8">
							<div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-full mb-6">
								<Key className="w-10 h-10 text-white" />
							</div>
							<h1 className="text-3xl font-bold text-gray-100 mb-3">Cambiar Contraseña</h1>
							<p className="text-gray-400 text-lg">Actualiza tu contraseña de acceso al sistema</p>
						</div>

						{/* Mensaje de éxito */}
						<AnimatePresence>
							{success && (
								<motion.div
									initial={{ opacity: 0, y: -10 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -10 }}
									className="bg-green-500 bg-opacity-20 border border-green-500 text-green-400 px-6 py-4 rounded-lg mb-8 text-center"
								>
									<CheckCircle className="w-8 h-8 mx-auto mb-3" />
									<p className="font-semibold text-lg">¡Contraseña actualizada exitosamente!</p>
									<p className="text-sm opacity-75 mt-2">Redirigiendo al perfil en unos segundos...</p>
								</motion.div>
							)}
						</AnimatePresence>

						{/* Mensaje de error del API */}
						<AnimatePresence>
							{error && (
								<motion.div
									initial={{ opacity: 0, y: -10 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -10 }}
									className="bg-red-500 bg-opacity-20 border border-red-500 text-red-400 px-6 py-4 rounded-lg mb-8 flex items-start"
								>
									<AlertCircle className="w-6 h-6 mr-3 flex-shrink-0 mt-0.5" />
									<div>
										<p className="font-semibold">Error al cambiar contraseña</p>
										<p className="text-sm opacity-75 mt-1">{error}</p>
									</div>
								</motion.div>
							)}
						</AnimatePresence>

						{/* Formulario */}
						<form onSubmit={handleSubmit} className="space-y-8">
							{/* Contraseña actual */}
							<PasswordField
								label="Contraseña Actual"
								name="contrasenaActual"
								value={formData.contrasenaActual}
								onChange={handleChange}
								placeholder="Ingresa tu contraseña actual"
								error={validationErrors.contrasenaActual}
								showPassword={showPasswords.actual}
								onTogglePassword={() => togglePasswordVisibility('actual')}
							/>

							{/* Nueva contraseña */}
							<PasswordField
								label="Nueva Contraseña"
								name="contrasenaNueva"
								value={formData.contrasenaNueva}
								onChange={handleChange}
								placeholder="Ingresa tu nueva contraseña"
								error={validationErrors.contrasenaNueva}
								showPassword={showPasswords.nueva}
								onTogglePassword={() => togglePasswordVisibility('nueva')}
							/>

							{/* Confirmar nueva contraseña */}
							<PasswordField
								label="Confirmar Nueva Contraseña"
								name="confirmarContrasena"
								value={formData.confirmarContrasena}
								onChange={handleChange}
								placeholder="Confirma tu nueva contraseña"
								error={validationErrors.confirmarContrasena}
								showPassword={showPasswords.confirmar}
								onTogglePassword={() => togglePasswordVisibility('confirmar')}
							/>

							{/* Información de seguridad */}
							<div className="bg-blue-900 bg-opacity-30 border border-blue-700 rounded-lg p-6">
								<h4 className="text-blue-300 font-semibold mb-3 text-lg">Consejos de seguridad:</h4>
								<ul className="text-blue-200 space-y-2">
									<li className="flex items-start">
										<span className="text-blue-400 mr-2">•</span>
										Usa al menos 6 caracteres
									</li>
									<li className="flex items-start">
										<span className="text-blue-400 mr-2">•</span>
										Combina letras mayúsculas, minúsculas, números y símbolos
									</li>
									<li className="flex items-start">
										<span className="text-blue-400 mr-2">•</span>
										No uses información personal como fechas de nacimiento
									</li>
									<li className="flex items-start">
										<span className="text-blue-400 mr-2">•</span>
										No reutilices contraseñas de otras cuentas
									</li>
								</ul>
							</div>

							{/* Botones */}
							<div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6">
								<button
									type="button"
									onClick={handleGoBack}
									disabled={loading || success}
									className="px-6 py-3 text-gray-400 hover:text-gray-300 transition duration-200 disabled:opacity-50 font-medium"
								>
									Cancelar
								</button>
								<motion.button
									type="submit"
									disabled={loading || success}
									whileHover={{ scale: success ? 1 : 1.02 }}
									whileTap={{ scale: success ? 1 : 0.98 }}
									className={`font-semibold py-4 px-8 rounded-lg transition duration-200 flex items-center justify-center text-lg min-w-[200px] ${
										success 
											? "bg-green-600 text-white cursor-default"
											: "bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white"
									}`}
								>
									{loading ? (
										<div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
									) : success ? (
										<>
											<CheckCircle className="w-6 h-6 mr-3" />
											Completado
										</>
									) : (
										<>
											<Key className="w-6 h-6 mr-3" />
											Cambiar Contraseña
										</>
									)}
								</motion.button>
							</div>
						</form>
					</motion.div>
				</main>
			</div>
		</div>
	);
};

export default ChangePasswordPage;