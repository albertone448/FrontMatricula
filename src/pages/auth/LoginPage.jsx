import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, LogIn, CheckCircle, AlertCircle, UserCheck } from "lucide-react";

const LoginPage = () => {
	const [formData, setFormData] = useState({
		correo: "",
		contrasena: ""
	});
	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState(false);
	const navigate = useNavigate();
	const location = useLocation();

	// Mensaje de éxito desde la verificación
	const verificationMessage = location.state?.message;

	// Mostrar mensaje de verificación si viene desde verify-code
	useEffect(() => {
		if (verificationMessage) {
			setSuccess(true);
			setTimeout(() => setSuccess(false), 5000); // Ocultar después de 5 segundos
		}
	}, [verificationMessage]);

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value
		});
		// Limpiar mensajes cuando el usuario empiece a escribir
		if (error) setError("");
		if (success) setSuccess(false);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError("");
		setSuccess(false);

		// Validaciones básicas
		if (!formData.correo.trim()) {
			setError("El correo es requerido");
			setLoading(false);
			return;
		}

		if (!formData.contrasena.trim()) {
			setError("La contraseña es requerida");
			setLoading(false);
			return;
		}

		try {
			const response = await fetch("http://localhost:5276/api/Usuario/Login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Accept": "application/json",
				},
				body: JSON.stringify(formData),
			});

			const data = await response.json();

			if (response.ok && data.estado === 1) {
				// Mostrar mensaje de éxito
				setSuccess(true);
				
				// Guardar datos del usuario en localStorage
				localStorage.setItem("usuario", JSON.stringify(data.usuario));
				localStorage.setItem("isAuthenticated", "true");
				
				// Esperar 2 segundos antes de redirigir
				setTimeout(() => {
					navigate("/");
				}, 2000);
			} else {
				// Si las credenciales son incorrectas
				setError(data.mensaje || "Credenciales incorrectas");
			}
		} catch (error) {
			setError("Error de conexión. Verifique que el servidor esté activo.");
			console.error("Error:", error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen w-full flex items-center justify-center bg-gray-900 px-4">
			{/* Fondo con gradiente */}
			<div className="fixed inset-0 z-0">
				<div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-80" />
				<div className="absolute inset-0 backdrop-blur-sm" />
			</div>

			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="relative z-10 w-full max-w-md mx-auto"
			>
				<div className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-xl rounded-xl p-8 border border-gray-700 w-full">
					{/* Mensaje de verificación exitosa */}
					{verificationMessage && success && (
						<motion.div
							initial={{ opacity: 0, y: -10 }}
							animate={{ opacity: 1, y: 0 }}
							className="bg-green-500 bg-opacity-20 border border-green-500 text-green-400 px-4 py-3 rounded-lg text-sm flex items-center mb-6"
						>
							<CheckCircle className="w-5 h-5 mr-2" />
							<div>
								<p className="font-medium">¡Cuenta verificada!</p>
								<p className="text-xs opacity-75 mt-1">{verificationMessage}</p>
							</div>
						</motion.div>
					)}

					{/* Header */}
					<div className="text-center mb-8">
						<motion.div
							initial={{ scale: 0 }}
							animate={{ scale: 1 }}
							transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
							className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-full mb-6"
						>
							<LogIn className="w-10 h-10 text-white" />
						</motion.div>
						<h2 className="text-4xl font-bold text-gray-100 mb-3">Iniciar Sesión</h2>
						<p className="text-gray-400 text-lg">Accede a tu cuenta del sistema de matrícula</p>
					</div>

					{/* Formulario */}
					<form onSubmit={handleSubmit} className="space-y-8">
						{/* Campo Email */}
						<div>
							<label className="block text-base font-medium text-gray-300 mb-3">
								Correo Electrónico
							</label>
							<div className="relative">
								<Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
								<input
									type="email"
									name="correo"
									value={formData.correo}
									onChange={handleChange}
									required
									className="w-full pl-12 pr-4 py-4 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 text-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
									placeholder="correo@ejemplo.com"
								/>
							</div>
						</div>

						{/* Campo Contraseña */}
						<div>
							<label className="block text-base font-medium text-gray-300 mb-3">
								Contraseña
							</label>
							<div className="relative">
								<Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
								<input
									type={showPassword ? "text" : "password"}
									name="contrasena"
									value={formData.contrasena}
									onChange={handleChange}
									required
									className="w-full pl-12 pr-14 py-4 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 text-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
									placeholder="••••••••"
								/>
								<button
									type="button"
									onClick={() => setShowPassword(!showPassword)}
									className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition duration-200"
								>
									{showPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
								</button>
							</div>
						</div>

						{/* Mensaje de Error */}
						{error && (
							<motion.div
								initial={{ opacity: 0, y: -10 }}
								animate={{ opacity: 1, y: 0 }}
								className="bg-red-500 bg-opacity-20 border border-red-500 text-red-400 px-4 py-3 rounded-lg text-sm flex items-start"
							>
								<AlertCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
								<div>
									<p className="font-medium">Error:</p>
									<p>{error}</p>
								</div>
							</motion.div>
						)}

						{/* Mensaje de Éxito */}
						{success && !verificationMessage && (
							<motion.div
								initial={{ opacity: 0, y: -10 }}
								animate={{ opacity: 1, y: 0 }}
								className="bg-green-500 bg-opacity-20 border border-green-500 text-green-400 px-4 py-3 rounded-lg text-sm flex items-center"
							>
								<CheckCircle className="w-5 h-5 mr-2" />
								<div>
									<p className="font-medium">¡Inicio de sesión exitoso!</p>
									<p className="text-xs opacity-75 mt-1">Redirigiendo al dashboard...</p>
								</div>
							</motion.div>
						)}

						{/* Opción de verificación siempre visible */}
						<div className="text-center">
							<p className="text-gray-400 text-sm mb-3">¿Ya tienes cuenta pero no puedes acceder?</p>
							<Link
								to="/verify-code"
								className="inline-flex items-center text-purple-400 hover:text-purple-300 font-medium transition duration-200"
							>
								<UserCheck className="w-4 h-4 mr-2" />
								Verificar mi cuenta
							</Link>
						</div>

						{/* Botón Submit */}
						<motion.button
							type="submit"
							disabled={loading || success}
							whileHover={{ scale: success ? 1 : 1.02 }}
							whileTap={{ scale: success ? 1 : 0.98 }}
							className={`w-full font-semibold py-4 px-6 rounded-lg transition duration-200 flex items-center justify-center text-lg mt-8 ${
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
									Éxito - Redirigiendo...
								</>
							) : (
								<>
									<LogIn className="w-6 h-6 mr-3" />
									Iniciar Sesión
								</>
							)}
						</motion.button>
					</form>

					{/* Info administrativa */}
					<div className="mt-8 text-center">
						<div className="bg-gray-700 bg-opacity-50 rounded-lg p-4">
							<p className="text-gray-400 text-sm">
								<strong>Sistema de Gestión Académica</strong>
							</p>
							<p className="text-gray-500 text-xs mt-1">
								Si no tienes cuenta, contacta al administrador del sistema
							</p>
						</div>
					</div>
				</div>
			</motion.div>
		</div>
	);
};

export default LoginPage;