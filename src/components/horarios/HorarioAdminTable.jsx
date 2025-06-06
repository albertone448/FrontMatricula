import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Calendar, Clock, ChevronLeft, ChevronRight, BookOpen, Users, RefreshCw } from "lucide-react";

const HorarioAdminTable = ({ horarios = [], secciones = [], cursos = [], loading, onRefresh }) => {
	const [currentPage, setCurrentPage] = useState(1);
	const [searchTerm, setSearchTerm] = useState("");
	const [filterDia, setFilterDia] = useState("");
	const [filterHorario, setFilterHorario] = useState("");
	const [filterPeriodo, setFilterPeriodo] = useState("");
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

	// Crear datos combinados de horarios con secciones y cursos
	const datosCompletos = useMemo(() => {
		// Filtrar secciones que tienen horario asignado
		const seccionesConHorario = secciones.filter(seccion => seccion.horarioId);
		
		return seccionesConHorario.map(seccion => {
			const horario = horarios.find(h => h.horarioId === seccion.horarioId);
			const curso = cursos.find(c => c.cursoId === seccion.cursoId);
			
			return {
				seccionId: seccion.seccionId,
				horarioId: seccion.horarioId,
				dia: horario?.dia || "Sin asignar",
				horaInicio: horario?.horaInicio || "00:00:00",
				horaFin: horario?.horaFin || "00:00:00",
				horario: horario ? `${horario.horaInicio.slice(0,5)} - ${horario.horaFin.slice(0,5)}` : "Sin horario",
				codigoCurso: curso?.codigo || `C${seccion.cursoId}`,
				nombreCurso: curso?.nombre || `Curso ${seccion.cursoId}`,
				creditosCurso: curso?.creditos || 0,
				grupo: seccion.grupo,
				periodo: seccion.periodo,
				carrera: seccion.carrera,
				cuposMax: seccion.cuposMax,
				usuarioId: seccion.usuarioId
			};
		});
	}, [horarios, secciones, cursos]);

	// Obtener valores únicos para filtros
	const diasUnicos = [...new Set(datosCompletos.map(item => item.dia))].sort();
	const horariosUnicos = [...new Set(datosCompletos.map(item => item.horario))].sort();
	const periodosUnicos = [...new Set(datosCompletos.map(item=>item.periodo))].sort();

	// Filtrar datos según búsqueda y filtros
	const datosFiltrados = useMemo(() => {
		let resultado = datosCompletos;

		// Filtro por término de búsqueda
		if (debouncedSearchTerm.trim()) {
			const searchLower = debouncedSearchTerm.toLowerCase();
			resultado = resultado.filter(item =>
				item.codigoCurso.toLowerCase().includes(searchLower) ||
				item.nombreCurso.toLowerCase().includes(searchLower) ||
				item.grupo.toLowerCase().includes(searchLower) ||
				item.periodo.toLowerCase().includes(searchLower) ||
				item.carrera.toLowerCase().includes(searchLower) ||
				item.dia.toLowerCase().includes(searchLower)
			);
		}

		// Filtro por día
		if (filterDia) {
			resultado = resultado.filter(item => item.dia === filterDia);
		}

		// Filtro por horario
		if (filterHorario) {
			resultado = resultado.filter(item => item.horario === filterHorario);
		}

		if (filterPeriodo)
			{
				resultado=resultado.filter(item => item.periodo === filterPeriodo);
			}

		// Ordenar por día de la semana y luego por hora
		const ordenDias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
		resultado.sort((a, b) => {
			const ordenA = ordenDias.indexOf(a.dia);
			const ordenB = ordenDias.indexOf(b.dia);
			
			if (ordenA !== ordenB) {
				return ordenA - ordenB;
			}
			
			return a.horaInicio.localeCompare(b.horaInicio);
		});

		return resultado;
	}, [datosCompletos, debouncedSearchTerm, filterDia, filterHorario,filterPeriodo]);

	// Calcular paginación
	const totalPages = Math.ceil(datosFiltrados.length / itemsPerPage);
	const startIndex = (currentPage - 1) * itemsPerPage;
	const currentItems = datosFiltrados.slice(startIndex, startIndex + itemsPerPage);

	// Resetear a página 1 cuando cambien los filtros
	useEffect(() => {
		setCurrentPage(1);
	}, [debouncedSearchTerm, filterDia, filterHorario,filterPeriodo]);

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
		setSearchTerm(value);
	}, []);

	const clearFilters = () => {
		setSearchTerm("");
		setFilterDia("");
		setFilterHorario("");
		setFilterPeriodo("");
	};

	// Componente de carga
	const LoadingTable = () => (
		<div className="flex justify-center items-center py-12">
			<div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
			<span className="ml-3 text-gray-400">Cargando horarios...</span>
		</div>
	);

	// Componente de tabla vacía
	const EmptyTable = () => (
		<motion.div 
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			className="text-center py-8"
		>
			<Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
			<p className="text-gray-400">
				{debouncedSearchTerm || filterDia || filterHorario|| filterPeriodo? 
					"No se encontraron horarios que coincidan con los filtros" : 
					"No hay horarios configurados"
				}
			</p>
		</motion.div>
	);

	// Componente de paginación
	const Pagination = () => {
		const startItem = (currentPage - 1) * itemsPerPage + 1;
		const endItem = Math.min(currentPage * itemsPerPage, datosFiltrados.length);

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
					<div className="text-sm text-gray-400">
						Mostrando {startItem} - {endItem} de {datosFiltrados.length} horarios
					</div>

					<div className="flex items-center space-x-2">
						<button
							onClick={() => handlePageChange(currentPage - 1)}
							disabled={currentPage === 1}
							className="px-3 py-2 text-sm bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center"
						>
							<ChevronLeft className="w-4 h-4 mr-1" />
							Anterior
						</button>

						<div className="flex space-x-1">
							{getPageNumbers().map((page) => (
								<button
									key={page}
									onClick={() => handlePageChange(page)}
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

						<button
							onClick={() => handlePageChange(currentPage + 1)}
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

	return (
		<div className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl border border-gray-700">
			{/* Header de la tabla con filtros */}
			<div className="p-6 border-b border-gray-700">
				<div className="flex flex-col space-y-4">
					{/* Título y descripción */}
					<div className="flex justify-between items-start">
						<div>
							<h3 className="text-lg font-semibold text-gray-100 mb-1 flex items-center">
								<Calendar className="w-5 h-5 mr-2 text-blue-400" />
								Todos los Horarios del Sistema
							</h3>
							<p className="text-sm text-gray-400">
								{isSearching ? (
									"Buscando..."
								) : (
									<>
										{datosFiltrados.length} {datosFiltrados.length === 1 ? 'horario' : 'horarios'}
										{(debouncedSearchTerm || filterDia || filterHorario || filterPeriodo) && ` encontrado${datosFiltrados.length === 1 ? '' : 's'}`}
										{!debouncedSearchTerm && !filterDia && !filterHorario && !filterPeriodo && ` total${datosFiltrados.length === 1 ? '' : 'es'}`}
									</>
								)}
							</p>
						</div>
						{onRefresh && (
							<motion.button
								onClick={onRefresh}
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
								className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 flex items-center"
							>
								<RefreshCw className="w-4 h-4 mr-2" />
								Actualizar
							</motion.button>
						)}
					</div>

					{/* Barra de búsqueda y filtros */}
					<div className="flex flex-col lg:flex-row gap-4">
						{/* Búsqueda */}
						<div className="relative flex-1">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
							<input
								type="text"
								placeholder="Buscar por curso, código, grupo, periodo, carrera o día..."
								value={searchTerm}
								onChange={(e) => handleSearchChange(e.target.value)}
								className="pl-10 pr-4 py-2 w-full bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
							/>
						</div>

						{/* Filtros */}
						<div className="flex gap-3">
							<div className="relative">
								<select
									value={filterDia}
									onChange={(e) => setFilterDia(e.target.value)}
									className="appearance-none bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 pr-8 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[120px]"
								>
									<option value="">Todos los días</option>
									{diasUnicos.map((dia) => (
										<option key={dia} value={dia}>{dia}</option>
									))}
								</select>
							</div>

							<div className="relative">
								<select
									value={filterHorario}
									onChange={(e) => setFilterHorario(e.target.value)}
									className="appearance-none bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 pr-8 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[140px]"
								>
									<option value="">Todos los horarios</option>
									{horariosUnicos.map((horario) => (
										<option key={horario} value={horario}>{horario}</option>
									))}
								</select>
							</div>
							<div className="relative">
							<select
								value={filterPeriodo}
								onChange={(e)=>setFilterPeriodo(e.target.value)}
								className="appearance-none bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 pr-8 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[140px]"
								>
									<option value="">Todos los Periodos</option>
									{periodosUnicos.map((periodo) => (
										<option key={periodo} value={periodo}>{periodo}</option>
									))}
								</select>
							</div>

							

							{(searchTerm || filterDia || filterHorario || filterPeriodo) && (
								<button
									onClick={clearFilters}
									className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 text-sm"
								>
									Limpiar
								</button>
							)}
						</div>
					</div>
				</div>
			</div>

			{/* Tabla */}
			<div className="overflow-x-auto">
				{loading ? (
					<LoadingTable />
				) : (
					<AnimatePresence mode="wait">
						{currentItems.length > 0 ? (
							<motion.div
								key={`table-content-${debouncedSearchTerm}-${filterDia}-${filterHorario}-${filterPeriodo}${currentPage}`}
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								transition={{ duration: 0.2 }}
							>
								<table className="min-w-full divide-y divide-gray-700">
									<thead>
										<tr>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
												Día
											</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
												Horario
											</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
												Curso
											</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
												Sección
											</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
												Carrera
											</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
												Periodo
											</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
												Cupos
											</th>
										</tr>
									</thead>
									<tbody className="divide-y divide-gray-700">
										<AnimatePresence>
											{currentItems.map((item) => (
												<motion.tr
													key={`${item.seccionId}-${item.horarioId}`}
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
													{/* Día */}
													<td className="px-6 py-4 whitespace-nowrap">
														<div className="flex items-center">
															<Calendar className="w-4 h-4 mr-2 text-blue-400" />
															<span className="text-sm font-medium text-gray-300">
																{item.dia}
															</span>
														</div>
													</td>

													{/* Horario */}
													<td className="px-6 py-4 whitespace-nowrap">
														<div className="flex items-center">
															<Clock className="w-4 h-4 mr-2 text-green-400" />
															<span className="text-sm text-gray-300">
																{item.horario}
															</span>
														</div>
													</td>

													{/* Curso */}
													<td className="px-6 py-4 whitespace-nowrap">
														<div className="flex items-center">
															<BookOpen className="w-4 h-4 mr-2 text-purple-400" />
															<div>
																<div className="text-sm font-medium text-gray-100">
																	{item.codigoCurso}
																</div>
																<div className="text-xs text-gray-400 max-w-xs truncate">
																	{item.nombreCurso}
																</div>
																{item.creditosCurso > 0 && (
																	<div className="text-xs text-blue-400">
																		{item.creditosCurso} créditos
																	</div>
																)}
															</div>
														</div>
													</td>

													{/* Sección */}
													<td className="px-6 py-4 whitespace-nowrap">
														<div>
															<div className="text-sm font-medium text-gray-100">
																Grupo {item.grupo}
															</div>
															<div className="text-xs text-gray-400">
																Sección #{item.seccionId}
															</div>
														</div>
													</td>

													{/* Carrera */}
													<td className="px-6 py-4 whitespace-nowrap">
														<div className="text-sm text-gray-300 max-w-xs">
															<div className="truncate" title={item.carrera}>
																{item.carrera}
															</div>
														</div>
													</td>

													{/* Periodo */}
													<td className="px-6 py-4 whitespace-nowrap">
														<span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-800 text-blue-100">
															{item.periodo}
														</span>
													</td>

													{/* Cupos */}
													<td className="px-6 py-4 whitespace-nowrap">
														<div className="flex items-center">
															<Users className="w-4 h-4 mr-2 text-yellow-400" />
															<span className="text-sm font-medium text-gray-300">
																{item.cuposMax}
															</span>
														</div>
													</td>
												</motion.tr>
											))}
										</AnimatePresence>
									</tbody>
								</table>
							</motion.div>
						) : (
							<EmptyTable />
						)}
					</AnimatePresence>
				)}
			</div>

			{/* Paginación */}
			{!loading && datosFiltrados.length > 0 && <Pagination />}
		</div>
	);
};

export default HorarioAdminTable;