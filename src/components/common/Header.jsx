import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, User, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Header = ({ title }) => {
	const [showDropdown, setShowDropdown] = useState(false);
	const navigate = useNavigate();
	
	// Obtener datos del usuario del localStorage
	const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
	const nombreCompleto = `${usuario.nombre || ""} ${usuario.apellido1 || ""}`.trim() || "Usuario";

	const handleLogout = () => {
		// Limpiar localStorage
			localStorage.removeItem("isAuthenticated");
			localStorage.removeItem("usuario");
			localStorage.removeItem("usuarioId");
			localStorage.removeItem("pendingUserId");
			localStorage.removeItem("userEmail");
			localStorage.removeItem("token");
		
		// Redirigir al login
		navigate("/login");
	};

	return (
		<header className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg border-b border-gray-700 relative z-[9999]'>
			<div className='max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center'>
				<h1 className='text-2xl font-semibold text-gray-100'>{title}</h1>
				
				{/* User Menu */}
				<div className="relative z-[10000]">
					<button
						onClick={() => setShowDropdown(!showDropdown)}
						className="flex items-center space-x-3 text-gray-300 hover:text-gray-100 transition duration-200 focus:outline-none relative z-[10001]"
					>
						<div className="flex items-center space-x-2">
							<div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
								<User className="w-5 h-5 text-white" />
							</div>
							<div className="hidden md:block">
								<p className="text-sm font-medium">{nombreCompleto}</p>
								<p className="text-xs text-gray-400">{usuario.rol || "Usuario"}</p>
							</div>
						</div>
						<ChevronDown 
							className={`w-4 h-4 transition-transform duration-200 ${
								showDropdown ? "rotate-180" : ""
							}`} 
						/>
					</button>

					{/* Dropdown Menu */}
					<AnimatePresence>
						{showDropdown && (
							<motion.div
								initial={{ opacity: 0, y: -10 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -10 }}
								transition={{ duration: 0.2 }}
								className="absolute right-0 mt-2 w-48 bg-gray-800 bg-opacity-95 backdrop-blur-md rounded-lg shadow-2xl border border-gray-700 z-[10002]"
								style={{ zIndex: 10002 }}
							>
								<div className="py-2">
									{/* User Info */}
									<div className="px-4 py-2 border-b border-gray-700">
										<p className="text-sm font-medium text-gray-100">{nombreCompleto}</p>
										<p className="text-xs text-gray-400">{usuario.correo}</p>
									</div>
									
									{/* Menu Items */}
									<button
										onClick={() => {
											setShowDropdown(false);
											navigate("/perfil");
										}}
										className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-gray-100 transition duration-200 flex items-center"
									>
										<User className="w-4 h-4 mr-2" />
										Mi Perfil
									</button>
									
									<button
										onClick={() => {
											setShowDropdown(false);
											handleLogout();
										}}
										className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 hover:text-red-300 transition duration-200 flex items-center"
									>
										<LogOut className="w-4 h-4 mr-2" />
										Cerrar Sesión
									</button>
								</div>
							</motion.div>
						)}
					</AnimatePresence>
				</div>
			</div>
			
			{/* Overlay para cerrar dropdown al hacer click fuera */}
			{showDropdown && (
				<div 
					className="fixed inset-0 z-[9998]" 
					onClick={() => setShowDropdown(false)}
					style={{ zIndex: 9998 }}
				/>
			)}
		</header>
	);
};

export default Header;