import { motion } from "framer-motion";
import { Calendar, Clock } from "lucide-react";

const HorarioItemCard = ({ item, index }) => {
    const getDayAbbreviation = (day) => {
        const days = {
            'Lunes': 'LUN',
            'Martes': 'MAR',
            'Miércoles': 'MIÉ',
            'Jueves': 'JUE',
            'Viernes': 'VIE',
            'Sábado': 'SÁB',
            'Domingo': 'DOM'
        };
        return days[day] || day?.substring(0, 3).toUpperCase() || 'N/A';
    };

    const getTimeColor = (horaInicio) => {
        if (!horaInicio) return "bg-gray-600";
        const hour = parseInt(horaInicio.split(':')[0]);
        if (hour < 12) return "bg-blue-500";
        if (hour < 17) return "bg-green-500";
        return "bg-purple-500";
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05, duration: 0.2 }}
            className="flex items-center p-2.5 bg-gray-700 bg-opacity-60 rounded-lg shadow-md hover:bg-opacity-80 transition-all duration-150"
        >
            <div className={`w-10 h-10 ${getTimeColor(item.horario?.horaInicio)} rounded-md flex items-center justify-center mr-2.5 flex-shrink-0`}>
                <span className="text-white font-bold text-[10px]">
                    {getDayAbbreviation(item.horario?.dia)}
                </span>
            </div>
            <div className="flex-1 min-w-0">
                <h4 className="text-gray-100 font-medium text-xs truncate" title={item.curso?.nombre}>
                    {item.curso?.nombre || 'Curso Desconocido'}
                </h4>
                <div className="flex items-center text-[11px] text-gray-400 space-x-1 mt-0.5">
                    <Clock className="w-2.5 h-2.5 flex-shrink-0" />
                    <span className="truncate">
                        {item.horario ?
                            `${item.horario.horaInicio?.slice(0, 5)} - ${item.horario.horaFin?.slice(0, 5)}` :
                            'Sin horario'}
                    </span>
                </div>
                <div className="text-[10px] text-gray-500 mt-0.5 truncate">
                    {item.grupo} ({item.curso?.codigo})
                </div>
            </div>
        </motion.div>
    );
};

const MiniHorarioInscripciones = ({ seccionesInscritas, loading }) => {
    const seccionesOrdenadas = [...seccionesInscritas].sort((a, b) => {
        const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
        const diaA = a.horario?.dia || '';
        const diaB = b.horario?.dia || '';
        const indexA = diasSemana.indexOf(diaA);
        const indexB = diasSemana.indexOf(diaB);

        if (indexA !== indexB) return indexA - indexB;
        
        const horaA = a.horario?.horaInicio || '00:00';
        const horaB = b.horario?.horaInicio || '00:00';
        return horaA.localeCompare(horaB);
    });

    if (loading) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-gray-800 bg-opacity-40 backdrop-blur-sm shadow-lg rounded-xl p-4 border border-gray-700 mb-6"
            >
                <div className="flex justify-center items-center h-24">
                    <div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                    <span className="ml-2 text-gray-400 text-sm">Cargando horario...</span>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-800 bg-opacity-40 backdrop-blur-sm shadow-lg rounded-xl p-4 border border-gray-700 mb-6"
        >
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-200 flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-blue-400" />
                    Mi Horario (Selección Actual)
                </h3>
            </div>

            {seccionesOrdenadas.length === 0 ? (
                <div className="text-center py-4">
                    <Calendar className="w-10 h-10 text-gray-500 mx-auto mb-2" />
                    <p className="text-gray-400 text-sm">
                        Aún no has inscrito ninguna materia para este periodo.
                    </p>
                </div>
            ) : (
                <div className="space-y-2 max-h-[200px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent pr-1">
                    {seccionesOrdenadas.map((seccion, index) => (
                        <HorarioItemCard
                            key={`${seccion.seccionId}-${index}`}
                            item={seccion}
                            index={index}
                        />
                    ))}
                </div>
            )}
        </motion.div>
    );
};

export default MiniHorarioInscripciones;
