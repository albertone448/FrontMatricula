import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Edit, Trash2, Users, ChevronLeft, ChevronRight } from "lucide-react";

const RoleBadge = ({ rol }) => {
	const colorClasses = {
		'Administrador': 'bg-red-800 text-red-100',
		'Profesor': 'bg-yellow-800 text-yellow-100',
		'Estudiante': 'bg-blue-800 text-blue-100'
	};

	return (
		<span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${colorClasses[rol] || 'bg-gray-800 text-gray-100'}`}>
			{rol}
		</span>
	);
};

const StatusBadge = ({ user }) => (
	<div className="flex items-center">
		<span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
			user.activo ? 'bg-green-800 text-green-100' : 'bg-red-800 text-red-100'
		}`}>
			{user.activo ? 'Activo' : 'Inactivo'}
		</span>
		{user.numeroVerificacion && (
			<span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-800 text-orange-100">
				Pendiente verificación
			</span>
		)}
	</div>
);

const UserAvatar = ({ user }) => (
	<div className="flex items-center">
		<div className="flex-shrink-0 h-10 w-10">
			<div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
				{user.nombre.charAt(0)}{user.apellido1.charAt(0)}
			</div>
		</div>
		<div className="ml-4">
			<div className="text-sm font-medium text-gray-100">
				{user.nombre} {user.apellido1} {user.apellido2}
			</div>
			<div className="text-sm text-gray-400">{user.correo}</div>
		</div>
	</div>
);

const UserActions = ({ user, onEdit }) => (
	<div className="flex space-x-2">
		<button 
			onClick={() => onEdit(user)}
			className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
			title="Editar usuario"
		>
			<Edit className="w-4 h-4" />
		</button>
		
	</div>
);

const LoadingTable = () => (
	<div className="flex justify-center items-center py-12">
		<div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
		<span className="ml-3 text-gray-400">Cargando usuarios...</span>
	</div>
);

const EmptyTable = ({ searchTerm }) => (
	<motion.div 
		initial={{ opacity: 0 }}
		animate={{ opacity: 1 }}
		className="text-center py-8"
	>
		<Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
		<p className="text-gray-400">
			{searchTerm ? "No se encontraron usuarios que coincidan con la búsqueda" : "No hay usuarios registrados"}
		</p>
	</motion.div>
);

const Pagination = ({ currentPage, totalPages, onPageChange, totalItems, itemsPerPage }) => {
	const startItem = (currentPage - 1) * itemsPerPage + 1;
	const endItem = Math.min(currentPage * itemsPerPage, totalItems);

	const getPageNumbers = useCallback(() => {
		const pages = [];
		const maxVisible = 5;
		
		if (totalPages <= maxVisible) {
			for (let i = 1; i <= totalPages; i++) {
				pages.push(i);
			}
		} else {
			const start = Math.max(1, currentPage - 2);
			const end = Math.min(totalPages, start + maxVisible - 1);
			
			for (let i = start; i <= end; i++) {
				pages.push(i);
			}
		}
		
		return pages;
	}, [currentPage, totalPages]);

	if (totalPages <= 1) return null;

	return (
		<div className="px-6 py-4 border-t border-gray-700">
			<div className="flex items-center justify-between">
				{/* Información de registros */}
				<div className="text-sm text-gray-400">
					Mostrando {startItem} - {endItem} de {totalItems} usuarios
				</div>

				{/* Controles de paginación */}
				<div className="flex items-center space-x-2">
					{/* Botón anterior */}
					<button
						onClick={() => onPageChange(currentPage - 1)}
						disabled={currentPage === 1}
						className="px-3 py-2 text-sm bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center"
					>
						<ChevronLeft className="w-4 h-4 mr-1" />
						Anterior
					</button>

					{/* Números de página */}
					<div className="flex space-x-1">
						{getPageNumbers().map((page) => (
							<button
								key={page}
								onClick={() => onPageChange(page)}
								className={`px-3 py-2 text-sm rounded-lg transition-colors duration-200 ${
									page === currentPage
										? "bg-blue-600 text-white"
										: "bg-gray-700 text-gray-300 hover:bg-gray-600"
								}`}
							>
								{page}
							</button>
						))}
					</div>

					{/* Botón siguiente */}
					<button
						onClick={() => onPageChange(currentPage + 1)}
						disabled={currentPage === totalPages}
						className="px-3 py-2 text-sm bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center"
					>
						Siguiente
						<ChevronRight className="w-4 h-4 ml-1" />
					</button>
				</div>
			</div>
		</div>
	);
};

const UsersTable = ({ 
	users, 
	loading, 
	searchTerm, 
	onSearchChange, 
	onEditUser 
}) => {
	const [currentPage, setCurrentPage] = useState(1);
	const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
	const [isSearching, setIsSearching] = useState(false);
	const itemsPerPage = 10;

	// Debounce del término de búsqueda
	useEffect(() => {
		setIsSearching(true);
		const timer = setTimeout(() => {
			setDebouncedSearchTerm(searchTerm);
			setIsSearching(false);
		}, 300);

		return () => clearTimeout(timer);
	}, [searchTerm]);

	// Filtrar usuarios según el término de búsqueda (con debounce)
	const filteredUsers = useMemo(() => {
		if (!debouncedSearchTerm.trim()) return users;
		
		const searchLower = debouncedSearchTerm.toLowerCase();
		return users.filter(user =>
			user.nombre.toLowerCase().includes(searchLower) ||
			user.apellido1.toLowerCase().includes(searchLower) ||
			user.apellido2?.toLowerCase().includes(searchLower) ||
			user.correo.toLowerCase().includes(searchLower) ||
			user.identificacion.includes(debouncedSearchTerm) ||
			user.rol.toLowerCase().includes(searchLower) ||
			user.carrera.toLowerCase().includes(searchLower)
		);
	}, [users, debouncedSearchTerm]);

	// Calcular paginación
	const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
	const startIndex = (currentPage - 1) * itemsPerPage;
	const currentUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

	// Resetear a página 1 cuando cambie el término de búsqueda (con debounce)
	useEffect(() => {
		setCurrentPage(1);
	}, [debouncedSearchTerm]);

	// Resetear a página 1 si la página actual es mayor al total de páginas
	useEffect(() => {
		if (currentPage > totalPages && totalPages > 0) {
			setCurrentPage(1);
		}
	}, [currentPage, totalPages]);

	const handlePageChange = useCallback((page) => {
		setCurrentPage(page);
	}, []);

	const handleSearchChange = useCallback((value) => {
		onSearchChange(value);
	}, [onSearchChange]);

	return (
		<div className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl border border-gray-700">
			{/* Header de la tabla */}
			<div className="p-6 border-b border-gray-700">
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
					<div>
						<h3 className="text-lg font-semibold text-gray-100 mb-1">Lista de Usuarios</h3>
						<p className="text-sm text-gray-400">
							{isSearching ? (
								"Buscando..."
							) : (
								<>
									{filteredUsers.length} {filteredUsers.length === 1 ? 'usuario' : 'usuarios'}
									{debouncedSearchTerm && ` encontrado${filteredUsers.length === 1 ? '' : 's'} para "${debouncedSearchTerm}"`}
									{!debouncedSearchTerm && ` total${filteredUsers.length === 1 ? '' : 'es'}`}
								</>
							)}
						</p>
					</div>
					<div className="relative mt-4 sm:mt-0">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
						<input
							type="text"
							placeholder="Buscar por nombre, apellido, correo, ID, rol o carrera..."
							value={searchTerm}
							onChange={(e) => handleSearchChange(e.target.value)}
							className="pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 w-80"
						/>
					</div>
				</div>
			</div>

			{/* Tabla */}
			<div className="overflow-x-auto">
				{loading ? (
					<LoadingTable />
				) : (
					<AnimatePresence mode="wait">
						{currentUsers.length > 0 ? (
							<motion.div
								key={`table-content-${debouncedSearchTerm}-${currentPage}`}
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								transition={{ duration: 0.2 }}
							>
								<table className="min-w-full divide-y divide-gray-700">
									<thead>
										<tr>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Usuario</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Identificación</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Rol</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Carrera</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Estado</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Acciones</th>
										</tr>
									</thead>
									<tbody className="divide-y divide-gray-700">
										<AnimatePresence>
											{currentUsers.map((user) => (
												<motion.tr
													key={user.usuarioId}
													layout
													initial={{ opacity: 0 }}
													animate={{ opacity: 1 }}
													exit={{ opacity: 0 }}
													transition={{ 
														duration: 0.2,
														ease: "easeOut"
													}}
													className="hover:bg-gray-700 hover:bg-opacity-30 transition-colors duration-200"
												>
													<td className="px-6 py-4 whitespace-nowrap">
														<UserAvatar user={user} />
													</td>
													<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
														{user.identificacion}
													</td>
													<td className="px-6 py-4 whitespace-nowrap">
														<RoleBadge rol={user.rol} />
													</td>
													<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
														{user.carrera}
													</td>
													<td className="px-6 py-4 whitespace-nowrap">
														<StatusBadge user={user} />
													</td>
													<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
														<UserActions 
															user={user} 
															onEdit={onEditUser}
														/>
													</td>
												</motion.tr>
											))}
										</AnimatePresence>
									</tbody>
								</table>
							</motion.div>
						) : (
							<EmptyTable searchTerm={debouncedSearchTerm} />
						)}
					</AnimatePresence>
				)}
			</div>

			{/* Paginación */}
			{!loading && filteredUsers.length > 0 && (
				<Pagination
					currentPage={currentPage}
					totalPages={totalPages}
					onPageChange={handlePageChange}
					totalItems={filteredUsers.length}
					itemsPerPage={itemsPerPage}
				/>
			)}
		</div>
	);
};

export default UsersTable;