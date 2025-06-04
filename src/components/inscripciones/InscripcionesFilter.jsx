const diasSemana = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
const horariosDisponibles = [
    "08:00 - 11:20",
    "13:00 - 16:20",
    "17:00 - 20:20"
];

export const InscripcionesFilter = ({ 
    searchTerm, 
    setSearchTerm, 
    filterDia, 
    setFilterDia, 
    filterHorario, 
    setFilterHorario 
}) => {
    return (
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
            {/* Búsqueda */}
            <div className="relative flex-1">
                <input
                    type="text"
                    placeholder="Buscar por nombre del curso, código o grupo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
            </div>

            {/* Filtro por día */}
            <div className="w-full lg:w-48">
                <select
                    value={filterDia}
                    onChange={(e) => setFilterDia(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                    <option value="">Todos los días</option>
                    {diasSemana.map(dia => (
                        <option key={dia} value={dia}>{dia}</option>
                    ))}
                </select>
            </div>

            {/* Filtro por horario */}
            <div className="w-full lg:w-48">
                <select
                    value={filterHorario}
                    onChange={(e) => setFilterHorario(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                    <option value="">Todos los horarios</option>
                    {horariosDisponibles.map(horario => (
                        <option key={horario} value={horario}>{horario}</option>
                    ))}
                </select>
            </div>

            {/* Botón para limpiar filtros */}
            {(searchTerm || filterDia || filterHorario) && (
                <button
                    onClick={() => {
                        setSearchTerm("");
                        setFilterDia("");
                        setFilterHorario("");
                    }}
                    className="w-full lg:w-auto px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition duration-200"
                >
                    Limpiar filtros
                </button>
            )}
        </div>
    );
};
