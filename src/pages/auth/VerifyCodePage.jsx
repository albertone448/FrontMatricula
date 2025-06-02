import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Mail, RefreshCw, CheckCircle, User, AlertCircle } from "lucide-react";
import { authUtils } from "../../utils/authUtils";

const VerifyCodePage = () => {
	const [code, setCode] = useState("");
	const [email, setEmail] = useState("");
	const [userId, setUserId] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState(false);
	const [resendLoading, setResendLoading] = useState(false);
	const [step, setStep] = useState(1); // 1: Ingresar email, 2: Ingresar código
	const navigate = useNavigate();
	const location = useLocation();
	
	// Datos que pueden venir del registro
	const emailFromState = location.state?.email || localStorage.getItem("userEmail") || "";
	const message = location.state?.message || "";

	useEffect(() => {
		// Si viene del registro con email
		if (emailFromState) {
			setEmail(emailFromState);
			setStep(2); // Ir directo a verificar código
		}
		// Si no, empezar pidiendo el email
	}, [emailFromState]);

	const handleCodeChange = (e) => {
		const value = e.target.value.replace(/\D/g, ""); // Solo números
		if (value.length <= 6) {
			setCode(value);
		}
		if (error) setError("");
	};

	const handleEmailSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError("");

		if (!email.trim()) {
			setError("El correo es requerido");
			setLoading(false);
			return;
		}

		try {
			// Preparar headers - incluir token si está disponible
			const headers = {
				"Accept": "application/json",
			};

			// Agregar token si el usuario está logueado (opcional para esta operación)
			const token = authUtils.getToken();
			if (token) {
				headers["Authorization"] = `Bearer ${token}`;
			}

			console.log('🔍 Buscando usuario por email:', email);

			// Buscar usuario por email para obtener el ID
			const response = await fetch("http://localhost:5276/api/Usuario/GetTodosLosUsuarios", {
				method: "GET",
				headers: headers,
			});

			console.log('📡 Respuesta GetTodosLosUsuarios:', {
				status: response.status,
				ok: response.ok
			});

			// Verificar si es error de autenticación (401)
			if (response.status === 401) {
				// En este caso no es crítico porque es verificación de cuenta
				// Pero podríamos limpiar localStorage por si hay datos corruptos
				console.log('⚠️ Token inválido o expirado al buscar usuarios, continuando sin autenticación');
				authUtils.logout();
			}

			if (response.ok) {
				const users = await response.json();
				const user = users.find(u => u.correo.toLowerCase() === email.toLowerCase());
				
				console.log('👤 Usuario encontrado:', user ? 'Sí' : 'No');
				
				if (user) {
					if (user.activo) {
						setError("Esta cuenta ya está verificada. Puedes iniciar sesión directamente.");
						setLoading(false);
						return;
					}
					
					setUserId(user.usuarioId.toString());
					localStorage.setItem("pendingUserId", user.usuarioId.toString());
					localStorage.setItem("userEmail", email);
					setStep(2);
				} else {
					setError("No se encontró una cuenta con este correo electrónico.");
				}
			} else {
				const errorText = await response.text();
				console.error('❌ Error en GetTodosLosUsuarios:', {
					status: response.status,
					statusText: response.statusText,
					body: errorText
				});
				setError("Error al verificar el correo. Intente nuevamente.");
			}
		} catch (error) {
			setError("Error de conexión. Intente nuevamente.");
			console.error("Error:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError("");

		if (code.length !== 6) {
			setError("El código debe tener 6 dígitos");
			setLoading(false);
			return;
		}

		const currentUserId = userId || localStorage.getItem("pendingUserId");
		if (!currentUserId) {
			setError("No se encontró información del usuario. Intente nuevamente.");
			setLoading(false);
			return;
		}

		try {
			console.log('🔐 Verificando código para usuario:', currentUserId);

			// Este endpoint NO requiere token de autorización
			const response = await fetch("http://localhost:5276/api/Usuario/VerificarUsuario", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Accept": "application/json",
				},
				body: JSON.stringify({
					usuarioId: parseInt(currentUserId),
					numeroVerificacion: parseInt(code)
				}),
			});

			console.log('📡 Respuesta VerificarUsuario:', {
				status: response.status,
				ok: response.ok
			});

			const data = await response.json();
			console.log('📄 Datos de respuesta:', data);

			if (response.ok && data.estado === 1) {
				setSuccess(true);
				// Limpiar datos temporales
				localStorage.removeItem("pendingUserId");
				localStorage.removeItem("userEmail");
				
				console.log('✅ Verificación exitosa, redirigiendo al login...');
				
				// Esperar un momento para mostrar el mensaje de éxito y redirigir
				setTimeout(() => {
					navigate("/login", { 
						state: { 
							message: "Cuenta verificada exitosamente. Ya puedes iniciar sesión." 
						}
					});
				}, 2000);
			} else {
				setError(data.mensaje || "Código de verificación incorrecto");
			}
		} catch (error) {
			setError("Error de conexión. Intente nuevamente.");
			console.error("Error:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleResendCode = async () => {
		setResendLoading(true);
		setError("");

		try {
			console.log('🔄 Reenviando código de verificación...');

			const currentUserId = userId || localStorage.getItem("pendingUserId");
			if (!currentUserId) {
				setError("No se encontró información del usuario para reenviar el código.");
				setResendLoading(false);
				return;
			}

			// Aquí implementarías el endpoint real para reenviar código
			// Por ejemplo: /api/Usuario/ReenviarCodigoVerificacion
			// Por ahora simularemos la acción ya que no tienes ese endpoint

			// Simular delay de API
			await new Promise(resolve => setTimeout(resolve, 1500));
			
			// Simular respuesta exitosa
			console.log('✅ Código reenviado (simulado)');
			setError(""); // Limpiar errores
			
			// Mostrar mensaje de éxito temporal
			const successMsg = `Código reenviado exitosamente a ${email}`;
			setError(successMsg);
			setTimeout(() => setError(""), 4000);

			// En un caso real, llamarías algo como:
			/*
			const response = await fetch("http://localhost:5276/api/Usuario/ReenviarCodigoVerificacion", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Accept": "application/json",
				},
				body: JSON.stringify({
					usuarioId: parseInt(currentUserId),
					correo: email
				}),
			});

			const data = await response.json();
			if (response.ok && data.estado === 1) {
				setError("Código reenviado exitosamente");
				setTimeout(() => setError(""), 3000);
			} else {
				setError(data.mensaje || "Error al reenviar el código");
			}
			*/

		} catch (error) {
			setError("Error al reenviar el código");
			console.error("Error reenviando código:", error);
		} finally {
			setResendLoading(false);
		}
	};

	if (success) {
		return (
			<div className="min-h-screen w-full flex items-center justify-center bg-gray-900 px-4">
				<div className="fixed inset-0 z-0">
					<div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-80" />
					<div className="absolute inset-0 backdrop-blur-sm" />
				</div>

				<motion.div
					initial={{ opacity: 0, scale: 0.8 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 0.5 }}
					className="relative z-10 w-full max-w-md mx-auto"
				>
					<div className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-xl rounded-xl p-8 border border-gray-700 text-center w-full">
						<motion.div
							initial={{ scale: 0 }}
							animate={{ scale: 1 }}
							transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
							className="inline-flex items-center justify-center w-20 h-20 bg-green-600 rounded-full mb-6"
						>
							<CheckCircle className="w-10 h-10 text-white" />
						</motion.div>
						<h2 className="text-3xl font-bold text-gray-100 mb-4">¡Verificación Exitosa!</h2>
						<p className="text-gray-400 mb-6 text-lg">Tu cuenta ha sido verificada correctamente. Serás redirigido al inicio de sesión...</p>
						<div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin mx-auto" />
					</div>
				</motion.div>
			</div>
		);
	}

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
					{/* Header */}
					<div className="text-center mb-8">
						<motion.div
							initial={{ scale: 0 }}
							animate={{ scale: 1 }}
							transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
							className="inline-flex items-center justify-center w-20 h-20 bg-purple-600 rounded-full mb-6"
						>
							{step === 1 ? <User className="w-10 h-10 text-white" /> : <Shield className="w-10 h-10 text-white" />}
						</motion.div>
						<h2 className="text-4xl font-bold text-gray-100 mb-3">
							{step === 1 ? "Verificar Cuenta" : "Ingresar Código"}
						</h2>
						<p className="text-gray-400 text-lg">
							{step === 1 
								? "Ingresa tu correo para buscar tu cuenta" 
								: "Ingresa el código de verificación de 6 dígitos"
							}
						</p>
						{step === 2 && email && (
							<div className="flex items-center justify-center bg-gray-700 bg-opacity-50 rounded-lg p-4 mt-4">
								<Mail className="w-6 h-6 text-gray-400 mr-3" />
								<span className="text-gray-300 font-medium text-lg">{email}</span>
							</div>
						)}
						{message && (
							<p className="text-sm text-green-400 mt-3">{message}</p>
						)}
					</div>

					{/* Paso 1: Ingresar Email */}
					{step === 1 && (
						<form onSubmit={handleEmailSubmit} className="space-y-8">
							<div>
								<label className="block text-base font-medium text-gray-300 mb-3">
									Correo Electrónico
								</label>
								<div className="relative">
									<Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
									<input
										type="email"
										value={email}
										onChange={(e) => {
											setEmail(e.target.value);
											if (error) setError("");
										}}
										required
										className="w-full pl-12 pr-4 py-4 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 text-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
										placeholder="correo@ejemplo.com"
									/>
								</div>
								<p className="text-sm text-gray-500 mt-3">
									Ingresa el correo asociado a tu cuenta
								</p>
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

							{/* Botón Submit */}
							<motion.button
								type="submit"
								disabled={loading}
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
								className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-lg transition duration-200 flex items-center justify-center text-lg"
							>
								{loading ? (
									<div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
								) : (
									<>
										<User className="w-6 h-6 mr-3" />
										Buscar Cuenta
									</>
								)}
							</motion.button>
						</form>
					)}

					{/* Paso 2: Ingresar Código */}
					{step === 2 && (
						<form onSubmit={handleSubmit} className="space-y-8">
							<div>
								<label className="block text-base font-medium text-gray-300 mb-3 text-center">
									Código de Verificación
								</label>
								<input
									type="text"
									value={code}
									onChange={handleCodeChange}
									maxLength={6}
									required
									className="w-full px-4 py-6 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 text-center text-3xl font-mono tracking-widest"
									placeholder="000000"
									autoComplete="one-time-code"
								/>
								<p className="text-sm text-gray-500 text-center mt-3">
									Ingrese el código de 6 dígitos que recibió por correo
								</p>
							</div>

							{/* Mensaje de Error */}
							{error && (
								<motion.div
									initial={{ opacity: 0, y: -10 }}
									animate={{ opacity: 1, y: 0 }}
									className={`px-4 py-3 rounded-lg text-sm ${
										error.includes("exitosamente") 
											? "bg-green-500 bg-opacity-20 border border-green-500 text-green-400"
											: "bg-red-500 bg-opacity-20 border border-red-500 text-red-400"
									}`}
								>
									{error}
								</motion.div>
							)}

							{/* Botón Submit */}
							<motion.button
								type="submit"
								disabled={loading || code.length !== 6}
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
								className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-lg transition duration-200 flex items-center justify-center text-lg"
							>
								{loading ? (
									<div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
								) : (
									<>
										<Shield className="w-6 h-6 mr-3" />
										Verificar Código
									</>
								)}
							</motion.button>

							{/* Opciones adicionales */}
							<div className="text-center space-y-4">
								{/* Reenviar código */}
								<div>
									<p className="text-gray-400 text-sm mb-2">¿No recibiste el código?</p>
									<button
										type="button"
										onClick={handleResendCode}
										disabled={resendLoading}
										className="text-purple-400 hover:text-purple-300 font-medium transition duration-200 flex items-center justify-center mx-auto disabled:cursor-not-allowed disabled:opacity-50"
									>
										{resendLoading ? (
											<div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin mr-2" />
										) : (
											<RefreshCw className="w-4 h-4 mr-2" />
										)}
										Reenviar código
									</button>
								</div>

								{/* Cambiar email */}
								<div>
									<button
										type="button"
										onClick={() => {
											setStep(1);
											setCode("");
											setError("");
										}}
										className="text-gray-400 hover:text-gray-300 font-medium transition duration-200"
									>
										Cambiar correo electrónico
									</button>
								</div>
							</div>
						</form>
					)}

					{/* Volver al login */}
					<div className="mt-8 text-center border-t border-gray-700 pt-6">
						<p className="text-gray-400 text-sm">
							¿Quieres volver al inicio?{" "}
							<Link 
								to="/login" 
								className="text-purple-400 hover:text-purple-300 font-medium transition duration-200"
							>
								Ir al Login
							</Link>
						</p>
					</div>
				</div>
			</motion.div>
		</div>
	);
};

export default VerifyCodePage;