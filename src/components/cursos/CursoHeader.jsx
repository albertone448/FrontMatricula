import { motion } from "framer-motion";
import { Plus, RefreshCw } from "lucide-react";

const CursoHeader = ({ onCreateCurso, onRefresh, loading, userPermissions }) => {
	return (
		<div className="mb-8">
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h1 className="text-2xl font-bold text-gray-100 mb-2">Catálogo de Cursos</h1>
					<p className="text-gray-400">Explora y gestiona los cursos disponibles</p>
				</div>
				<div className="flex items-center space-x-3 mt-4 sm:mt-0">
					<motion.button
						onClick={onRefresh}
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						disabled={loading}
						className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-800 text-white font-medium py-2 px-4 rounded-lg transition duration-200 flex items-center"
					>
						<RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
						Actualizar
					</motion.button>
					
					{userPermissions.canManageCourses && (
						<motion.button
							onClick={onCreateCurso}
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition duration-200 flex items-center"
						>
							<Plus className="w-5 h-5 mr-2" />
							Crear Curso
						</motion.button>
					)}
				</div>
			</div>
		</div>
	);
};

export default CursoHeader;
