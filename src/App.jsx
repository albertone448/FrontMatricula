import { Route, Routes, Navigate } from "react-router-dom";

import Sidebar from "./components/common/Sidebar";
import ProtectedRoute from "./components/common/ProtectedRoute";
import TokenValidator from "./components/common/TokenValidator"; // ✅ Nueva importación
import { UserRoleProvider } from "./contexts/UserRoleContext";

// Páginas principales (protegidas)
import InicioPage from "./pages/InicioPage";
import CursosPage from "./pages/CursosPage";
import SeccionesPage from "./pages/SeccionesPage";
import SeccionDetailPage from "./components/secciones/SeccionDetailPage";
import EvaluacionDetailPage from "./components/secciones/EvaluacionDetailPage";
import HorariosPage from "./pages/HorariosPage";
import InscripcionesPage from "./pages/InscripcionesPage";
import UsuariosPage from "./pages/UsuariosPage";
import PerfilPage from "./pages/PerfilPage";
import ChangePasswordPage from "./pages/auth/ChangePasswordPage";
import PlantillasPage from "./pages/PlantillasPage";

// Páginas de autenticación (públicas)
import LoginPage from "./pages/auth/LoginPage";
import VerifyCodePage from "./pages/auth/VerifyCodePage";

function App() {
	const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

	return (
		<div className='flex h-screen bg-gray-900 text-gray-100 overflow-hidden'>
			<Routes>
				{/* Rutas de autenticación (públicas) */}
				<Route 
					path='/login' 
					element={
						isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />
					} 
				/>
				<Route 
					path='/verify-code' 
					element={
						isAuthenticated ? <Navigate to="/" replace /> : <VerifyCodePage />
					} 
				/>

				{/* Rutas protegidas con validación de token */}
				<Route 
					path='/*' 
					element={
						<ProtectedRoute>
							<TokenValidator> {/* ✅ Wrapper de validación de token */}
								<UserRoleProvider>
									{/* BG */}
									<div className='fixed inset-0 z-0'>
										<div className='absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-80' />
										<div className='absolute inset-0 backdrop-blur-sm' />
									</div>

									<Sidebar />
									<Routes>
										<Route path='/' element={<InicioPage />} />
										<Route path='/cursos' element={<CursosPage />} />
										<Route path='/secciones' element={<SeccionesPage />} />
										<Route path='/secciones/:seccionId' element={<SeccionDetailPage />} />
										<Route path='/secciones/:seccionId/evaluaciones/:evaluacionId' element={<EvaluacionDetailPage />} />
										<Route path='/horarios' element={<HorariosPage />} />
										<Route path='/inscripciones' element={<InscripcionesPage />} />
										<Route path='/usuarios' element={<UsuariosPage />} />
										<Route path='/perfil' element={<PerfilPage />} />
										<Route path='/cambiar-contrasena' element={<ChangePasswordPage />} />
										<Route path='/plantillas' element={<PlantillasPage />} />
										{/* Ruta por defecto para rutas no encontradas */}
										<Route path='*' element={<Navigate to="/" replace />} />
									</Routes>
								</UserRoleProvider>
							</TokenValidator>
						</ProtectedRoute>
					} 
				/>
			</Routes>
		</div>
	);
}

export default App;