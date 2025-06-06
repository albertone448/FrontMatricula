import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Lock, CheckCircle, AlertCircle, Key } from "lucide-react";
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
				className={`w-full pl-10 pr-12 py-3 bg-gray-700 border rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 transition duration-200 ${
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
			<p className="text-red-400 text-xs mt-1 flex items-center">
				<AlertCircle className="w-3 h-3 mr-1" />
				{error}
			</p>
		)}
	</div>
);

const ChangePasswordModal = ({ isOpen, onClose, onSuccess }) => {
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

	// Limpiar formulario cuando se abre/cierra el modal
	useEffect(() => {
		if (isOpen) {
			setFormData({
				contrasenaActual: "",
				contrasenaNueva: "",
				confirmarContrasena: ""
			});
			setValidationErrors({});
			setShowPasswords({
				actual: false,
				nueva: false,
				confirmar: false
			});
			clearMessages();
		}
	}, [isOpen, clearMessages]);

	// Manejar éxito
	useEffect(() => {
		if (success) {
			setTimeout(() => {
				onSuccess?.("Contraseña cambiada exitosamente");
				handleClose();
			}, 2000);
		}
	}, [success, onSuccess]);

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

		const result = await changePassword(
			formData.contrasenaActual,
			formData.contrasenaNueva
		);
	};

	const handleClose = () => {
		setFormData({
			contrasenaActual: "",
			contrasenaNueva: "",
			confirmarContrasena: ""
		});
		setValidationErrors({});
		setShowPasswords({
			actual: false,
			nueva: false,
			confirmar: false
		});
		clearMessages();
		onClose();
	};

	// Evitar que se cierre el modal cuando se hace clic en el formulario
	const handleModalClick = (e) => {
		e.stopPropagation();
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-[9999] flex items-center justify-center">
			{/* Overlay */}
			<div 
				className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" 
				onClick={handleClose} 
			/>
			
			{/* Modal */}
			<motion.div
				initial={{ opacity: 0, scale: 0.9 }}
				animate={{ opacity: 1, scale: 1 }}
				exit={{ opacity: 0, scale: 0.9 }}
				transition={{ duration: 0.2 }}
				onClick={handleModalClick}
				className="relative bg-gray-800 bg-opacity-95 backdrop-blur-md shadow-xl rounded-xl p-8 border border-gray-700 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto"
			>
				{/* Header */}
				<div className="text-center mb-6">
					<div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
						<Key className="w-8 h-8 text-white" />
					</div>
					<h2 className="text-2xl font-bold text-gray-100 mb-2">Cambiar Contraseña</h2>
					<p className="text-gray-400">Actualiza tu contraseña de acceso</p>
				</div>

				{/* Formulario */}
				<form onSubmit={handleSubmit} className="space-y-6">
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

					{/* Debug info - remove in production */}
					{process.env.NODE_ENV === 'development' && (
						<div className="bg-gray-700 p-2 rounded text-xs">
							<p>Debug - Form data:</p>
							<pre>{JSON.stringify(formData, null, 2)}</pre>
						</div>
					)}

					{/* Mensaje de error del API */}
					<AnimatePresence>
						{error && (
							<motion.div
								initial={{ opacity: 0, y: -10 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -10 }}
								className="bg-red-500 bg-opacity-20 border border-red-500 text-red-400 px-4 py-3 rounded-lg text-sm flex items-center"
							>
								<AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
								<div>
									<p className="font-medium">Error</p>
									<p className="text-xs opacity-75 mt-1">{error}</p>
								</div>
							</motion.div>
						)}
					</AnimatePresence>

					{/* Mensaje de éxito */}
					<AnimatePresence>
						{success && (
							<motion.div
								initial={{ opacity: 0, y: -10 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -10 }}
								className="bg-green-500 bg-opacity-20 border border-green-500 text-green-400 px-4 py-3 rounded-lg text-sm flex items-center"
							>
								<CheckCircle className="w-5 h-5 mr-2" />
								<div>
									<p className="font-medium">¡Contraseña actualizada!</p>
									<p className="text-xs opacity-75 mt-1">Tu contraseña se ha cambiado exitosamente</p>
								</div>
							</motion.div>
						)}
					</AnimatePresence>

					{/* Información de seguridad */}
					<div className="bg-blue-900 bg-opacity-30 border border-blue-700 rounded-lg p-4">
						<h4 className="text-blue-300 font-medium mb-2">Consejos de seguridad:</h4>
						<ul className="text-blue-200 text-xs space-y-1">
							<li>• Usa al menos 6 caracteres</li>
							<li>• Combina letras, números y símbolos</li>
							<li>• No uses información personal</li>
							<li>• No reutilices contraseñas anteriores</li>
						</ul>
					</div>

					{/* Botones */}
					<div className="flex justify-end space-x-3 pt-4">
						<button
							type="button"
							onClick={handleClose}
							disabled={loading}
							className="px-4 py-2 text-gray-400 hover:text-gray-300 transition duration-200 disabled:opacity-50"
						>
							Cancelar
						</button>
						<motion.button
							type="submit"
							disabled={loading || success}
							whileHover={{ scale: success ? 1 : 1.02 }}
							whileTap={{ scale: success ? 1 : 0.98 }}
							className={`font-medium py-3 px-6 rounded-lg transition duration-200 flex items-center ${
								success 
									? "bg-green-600 text-white cursor-default"
									: "bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white"
							}`}
						>
							{loading ? (
								<div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
							) : success ? (
								<>
									<CheckCircle className="w-5 h-5 mr-2" />
									Completado
								</>
							) : (
								<>
									<Key className="w-5 h-5 mr-2" />
									Cambiar Contraseña
								</>
							)}
						</motion.button>
					</div>
				</form>
			</motion.div>
		</div>
	);
};

export default ChangePasswordModal;
