import { useState } from "react";
import { motion } from "framer-motion";
import { Search,Edit,Trash2, ChevronLeft, ChevronRight } from "lucide-react";

const CursosTable = ({ cursos = [], loading, searchTerm, onSearchChange, onEditCurso, onDeleteCurso, userPermissions }) => {
	const [currentPage, setCurrentPage] = useState(1);
	const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
	const [isSearching, setIsSearching] = useState(false);
	const itemsPerPage = 10;

	// Debounce para la búsqueda
	useState(() => {
		setIsSearching(true);
		const timer = setTimeout(() => {
			setDebouncedSearchTerm(searchTerm);
			setIsSearching(false);
		}, 300);
		return () => clearTimeout(timer);
	}, [searchTerm]);

	// Filtrar cursos
	const filteredCursos = cursos.filter(curso =>
		curso.nombre.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
		curso.codigo.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
	);

	// Calcular paginación
	const totalPages = Math.ceil(filteredCursos.length / itemsPerPage);
	const currentCursos = filteredCursos.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);

	// Loading state
	if (loading) {
		return (
			<div className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl border border-gray-700 p-6">
				<div className="animate-pulse space-y-4">
					<div className="h-8 bg-gray-700 rounded w-1/4"></div>
					<div className="space-y-3">
						{[...Array(5)].map((_, index) => (
							<div key={index} className="h-10 bg-gray-700 rounded"></div>
						))}
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl border border-gray-700">
			{/* Header de la tabla */}
			<div className="p-6 border-b border-gray-700">
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
					<div>
						<h3 className="text-lg font-semibold text-gray-100 mb-1">Lista de Cursos</h3>
						<p className="text-sm text-gray-400">
							{isSearching ? (
								"Buscando..."
							) : (
								<>
									Mostrando {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredCursos.length)} de {filteredCursos.length} cursos
								</>
							)}
						</p>
					</div>
					<div className="mt-4 sm:mt-0 relative">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
						<input
							type="text"
							value={searchTerm}
							onChange={(e) => onSearchChange(e.target.value)}
							placeholder="Buscar curso..."
							className="pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 w-80"
						/>
					</div>
				</div>
			</div>

			{/* Tabla */}
			<div className="overflow-x-auto">
				<table className="min-w-full divide-y divide-gray-700">
					<thead>
						<tr>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Código</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Nombre</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Créditos</th>
							{userPermissions.canManageCourses && (
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Acciones</th>
							)}
						</tr>
					</thead>
					<tbody className="divide-y divide-gray-700">
						{currentCursos.map((curso) => (
							<motion.tr
								key={curso.cursoId}
								layout
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								className="hover:bg-gray-700 hover:bg-opacity-30 transition-colors duration-200"
							>                                <td className="px-6 py-4 whitespace-nowrap text-gray-100">{curso.codigo}</td>
								<td className="px-6 py-4 whitespace-nowrap text-gray-100">{curso.nombre}</td>
								<td className="px-6 py-4 whitespace-nowrap text-gray-300">{curso.creditos}</td>								{userPermissions.canManageCourses && (
									<td className="px-6 py-4 whitespace-nowrap text-sm">
										<div className="flex items-center space-x-3">
											<button
												onClick={() => onEditCurso(curso)}
												className="text-indigo-400 hover:text-indigo-300 p-1 rounded hover:bg-indigo-400 hover:bg-opacity-20 transition-colors"
											>
												<Edit className="w-4 h-4" />
											</button>
											<button
												onClick={() => onDeleteCurso(curso)}
												className="text-red-400 hover:text-red-300 p-1 rounded hover:bg-red-400 hover:bg-opacity-20 transition-colors"
											>
												<Trash2 className="w-4 h-4" />
											</button>
										</div>
									</td>
								)}
                                
							</motion.tr>
						))}
					</tbody>
				</table>
			</div>

			{/* Paginación */}
			{totalPages > 1 && (
				<div className="px-6 py-4 border-t border-gray-700">
					<div className="flex items-center justify-between">
						<button
							onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
							disabled={currentPage === 1}
							className="px-3 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 disabled:opacity-50"
						>
							<ChevronLeft className="w-5 h-5" />
						</button>
						<div className="flex space-x-2">
							{[...Array(totalPages)].map((_, i) => (
								<button
									key={i}
									onClick={() => setCurrentPage(i + 1)}
									className={`px-3 py-2 rounded-lg ${
										currentPage === i + 1
											? "bg-blue-600 text-white"
											: "bg-gray-700 text-gray-300 hover:bg-gray-600"
									}`}
								>
									{i + 1}
								</button>
							))}
						</div>
						<button
							onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
							disabled={currentPage === totalPages}
							className="px-3 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 disabled:opacity-50"
						>
							<ChevronRight className="w-5 h-5" />
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default CursosTable;
