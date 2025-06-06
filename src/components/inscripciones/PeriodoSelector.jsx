import { useEffect } from 'react';

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

// Función para calcular el periodo actual basado en la fecha real
const calcularPeriodoActual = () => {
    const ahora = new Date();
    const año = ahora.getFullYear();
    const mes = ahora.getMonth() + 1; // getMonth() devuelve 0-11

    let periodo;
    if (mes >= 1 && mes <= 4) {
        periodo = "I";
    } else if (mes >= 5 && mes <= 8) {
        periodo = "II";
    } else {
        periodo = "III";
    }

    return `${año}-${periodo}`;
};

export const PeriodoSelector = ({
    periodosDisponibles,
    periodoSeleccionado,
    onPeriodoChange,
}) => {
    // Efecto para seleccionar automáticamente el periodo actual si existe
    useEffect(() => {
        // Solo ejecutar si hay periodos disponibles y no hay uno ya seleccionado
        if (periodosDisponibles.length > 0 && !periodoSeleccionado) {
            const periodoActual = calcularPeriodoActual();
            
            console.log('📅 Periodo actual calculado:', periodoActual);
            console.log('📅 Periodos disponibles:', periodosDisponibles);
            
            // Verificar si el periodo actual existe en los periodos disponibles
            const periodoEncontrado = periodosDisponibles.find(p => p === periodoActual);
            
            if (periodoEncontrado) {
                console.log('✅ Periodo actual encontrado, seleccionando:', periodoEncontrado);
                onPeriodoChange(periodoEncontrado);
            } else {
                // Si el periodo actual no existe, seleccionar el más reciente (primero en la lista)
                console.log('⚠️ Periodo actual no encontrado, seleccionando el más reciente:', periodosDisponibles[0]);
                onPeriodoChange(periodosDisponibles[0]);
            }
        }
    }, [periodosDisponibles, periodoSeleccionado, onPeriodoChange]);

    // Función para determinar si un periodo es el actual
    const esPeriodoActual = (periodo) => {
        const periodoActual = calcularPeriodoActual();
        return periodo === periodoActual;
    };

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
                                {esPeriodoActual(periodo) ? ' (Actual)' : ''}
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
                {/* Indicador visual del periodo actual */}
                {esPeriodoActual(periodoSeleccionado) && (
                    <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                        Actual
                    </span>
                )}
            </div>
        </div>
    );
};