import { useState, useCallback, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../components/common/Header";
import { useProfile } from "../hooks/useProfile";
import ProfileHeader from "../components/perfil/ProfileHeader";
import ProfileStats from "../components/perfil/ProfileStats";
import ProfileActions from "../components/perfil/ProfileActions";


const PerfilPage = () => {
	const location = useLocation();
	const { user, loading, error, fetchProfile, updateProfile } = useProfile();
	const [successMessage, setSuccessMessage] = useState("");
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [editMessage, setEditMessage] = useState(""); // Added for edit message

	// Verificar si viene mensaje de éxito desde cambio de contraseña
	useEffect(() => {
		if (location.state?.message) {
			setSuccessMessage(location.state.message);
			setTimeout(() => setSuccessMessage(''), 5000);
			
			// Limpiar el state para que no se muestre de nuevo al recargar
			window.history.replaceState({}, document.title);
		}
	}, [location.state]);

	const handleRefresh = useCallback(() => {
		fetchProfile();
	}, [fetchProfile]);

	const handleEditProfile = useCallback(() => {
		// confirm("por favor contactar a nuestro equipo de soporte si hay erroress con los detalles del perfil")
		setEditMessage("Por favor, contactar a nuestro equipo de soporte si hay errores con los detalles del perfil.");
		setTimeout(() => setEditMessage(''), 5000); // Auto-clear after 5 seconds
	}, []);

	const handleUpdateSuccess = useCallback((message) => {
		setSuccessMessage(message);
		fetchProfile();
		setIsEditModalOpen(false);
		setTimeout(() => setSuccessMessage(''), 5000);
	}, [fetchProfile]);

	const handleDownloadData = useCallback(() => {
		setSuccessMessage('Datos descargados exitosamente');
		setTimeout(() => setSuccessMessage(''), 3000);
	}, []);

	const clearSuccessMessage = useCallback(() => {
		setSuccessMessage('');
	}, []);

	const clearEditMessage = useCallback(() => { // Added to clear edit message
		setEditMessage('');
	}, []);

	return (
		<div className='flex-1 overflow-auto relative z-10'>
			<div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
				<Header title={"Perfil"} />

				<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
					{/* Mensaje de éxito */}
					<AnimatePresence>
						{successMessage && (
							<motion.div
								initial={{ opacity: 0, y: -20 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -20 }}
								className="bg-green-500 bg-opacity-20 border border-green-500 text-green-400 px-4 py-3 rounded-lg text-sm flex items-center mb-6"
							>
								<div className="flex-1">
									<p className="font-medium">{successMessage}</p>
								</div>
								<button
									onClick={clearSuccessMessage}
									className="ml-2 text-green-300 hover:text-green-200 transition-colors duration-200"
								>
									<span className="text-xl">&times;</span>
								</button>
							</motion.div>
						)}
					</AnimatePresence>

					{/* Mensaje de error */}
					<AnimatePresence>
						{error && (
							<motion.div
								initial={{ opacity: 0, y: -20 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -20 }}
								className="bg-red-500 bg-opacity-20 border border-red-500 text-red-400 px-4 py-3 rounded-lg text-sm flex items-center mb-6"
							>
								<div className="flex-1">
									<p className="font-medium">Error al cargar el perfil</p>
									<p className="text-xs opacity-75 mt-1">{error}</p>
								</div>
								<button
									onClick={handleRefresh}
									className="ml-2 text-red-300 hover:text-red-200 transition-colors duration-200"
								>
									Reintentar
								</button>
							</motion.div>
						)}
					</AnimatePresence>

					{/* Mensaje de edición */}
					<AnimatePresence>
						{editMessage && (
							<motion.div
								initial={{ opacity: 0, y: -20 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -20 }}
								className="bg-blue-500 bg-opacity-20 border border-blue-500 text-blue-400 px-4 py-3 rounded-lg text-sm flex items-center mb-6" // Using blue for informational
							>
								<div className="flex-1">
									<p className="font-medium">{editMessage}</p>
								</div>
								<button
									onClick={clearEditMessage}
									className="ml-2 text-blue-300 hover:text-blue-200 transition-colors duration-200"
								>
									<span className="text-xl">&times;</span>
								</button>
							</motion.div>
						)}
					</AnimatePresence>

					{/* Header del perfil */}
					<ProfileHeader 
						user={user} 
						loading={loading} 
						onRefresh={handleRefresh}
					/>

					{/* Estadísticas del perfil */}
					<ProfileStats 
						user={user} 
						loading={loading} 
					/>

					{/* Acciones del perfil */}
					{!loading && user && (
						<ProfileActions
							user={user}
							onEditProfile={handleEditProfile}
							onDownloadData={handleDownloadData}
						/>
					)}

					{/* Estado de carga */}
					{loading && !user && (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							className="flex justify-center items-center py-12"
						>
							<div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
							<span className="ml-3 text-gray-400">Cargando perfil...</span>
						</motion.div>
					)}
				</main>

				
			</div>
		</div>
	);
};

export default PerfilPage;
