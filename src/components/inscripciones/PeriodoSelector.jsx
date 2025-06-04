const ChevronDown = () => (
    <svg
        className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
    >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
);

export const PeriodoSelector = ({
    periodosDisponibles,
    periodoSeleccionado,
    onPeriodoChange,
}) => {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
                <span className="text-gray-400">Periodo:</span>
                <div className="relative">
                    <select
                        value={periodoSeleccionado}
                        onChange={(e) => onPeriodoChange(e.target.value)}
                        className="appearance-none bg-gray-700 border border-gray-600 rounded-lg px-3 py-1 pr-8 text-blue-400 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    >
                        {periodosDisponibles.map((periodo) => (
                            <option key={periodo} value={periodo}>
                                {periodo}
                            </option>
                        ))}
                    </select>
                    <ChevronDown />
                </div>
                {periodosDisponibles.length > 1 && (
                    <span className="text-xs text-gray-500">
                        ({periodosDisponibles.length} periodos disponibles)
                    </span>
                )}
            </div>
        </div>
    );
};
