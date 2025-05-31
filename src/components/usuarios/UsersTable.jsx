import { motion } from "framer-motion";
import { Search, Edit, Trash2, Users } from "lucide-react";

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

const UserActions = ({ user, onEdit, onDelete }) => (
	<div className="flex space-x-2">
		<button 
			onClick={() => onEdit(user)}
			className="text-blue-400 hover:text-blue-300 transition duration-200"
			title="Editar usuario"
		>
			<Edit className="w-4 h-4" />
		</button>
		<button 
			onClick={() => onDelete(user)}
			className="text-red-400 hover:text-red-300 transition duration-200"
			title="Eliminar usuario"
		>
			<Trash2 className="w-4 h-4" />
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
	<div className="text-center py-8">
		<Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
		<p className="text-gray-400">
			{searchTerm ? "No se encontraron usuarios que coincidan con la búsqueda" : "No hay usuarios registrados"}
		</p>
	</div>
);

const UsersTable = ({ 
	users, 
	loading, 
	searchTerm, 
	onSearchChange, 
	onEditUser, 
	onDeleteUser 
}) => {
	const filteredUsers = users.filter(user =>
		user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
		user.apellido1.toLowerCase().includes(searchTerm.toLowerCase()) ||
		user.correo.toLowerCase().includes(searchTerm.toLowerCase()) ||
		user.identificacion.includes(searchTerm)
	);

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.5 }}
			className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl border border-gray-700"
		>
			{/* Header de la tabla */}
			<div className="p-6 border-b border-gray-700">
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
					<h3 className="text-lg font-semibold text-gray-100 mb-4 sm:mb-0">Lista de Usuarios</h3>
					<div className="relative">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
						<input
							type="text"
							placeholder="Buscar usuarios..."
							value={searchTerm}
							onChange={(e) => onSearchChange(e.target.value)}
							className="pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
						/>
					</div>
				</div>
			</div>

			{/* Tabla */}
			<div className="overflow-x-auto">
				{loading ? (
					<LoadingTable />
				) : (
					<>
						{filteredUsers.length > 0 ? (
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
									{filteredUsers.map((user) => (
										<motion.tr
											key={user.usuarioId}
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											transition={{ duration: 0.3 }}
											className="hover:bg-gray-700 hover:bg-opacity-30 transition duration-200"
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
													onDelete={onDeleteUser}
												/>
											</td>
										</motion.tr>
									))}
								</tbody>
							</table>
						) : (
							<EmptyTable searchTerm={searchTerm} />
						)}
					</>
				)}
			</div>
		</motion.div>
	);
};

export default UsersTable;