import { Route, Routes } from "react-router-dom";

import Sidebar from "./components/common/Sidebar";

import InicioPage from "./pages/InicioPage";
import CursosPage from "./pages/CursosPage";
import SeccionesPage from "./pages/SeccionesPage";
import HorariosPage from "./pages/HorariosPage";
import InscripcionesPage from "./pages/InscripcionesPage";
import UsuariosPage from "./pages/UsuariosPage";
import PerfilPage from "./pages/PerfilPage";
import PlantillasPage from "./pages/PlantillasPage";

function App() {
	return (
		<div className='flex h-screen bg-gray-900 text-gray-100 overflow-hidden'>
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
				<Route path='/horarios' element={<HorariosPage />} />
				<Route path='/inscripciones' element={<InscripcionesPage />} />
				<Route path='/usuarios' element={<UsuariosPage />} />
				<Route path='/perfil' element={<PerfilPage />} />
				<Route path='/plantillas' element={<PlantillasPage />} />
			</Routes>
		</div>
	);
}

export default App;
