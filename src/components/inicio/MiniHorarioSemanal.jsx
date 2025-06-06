import { motion } from "framer-motion";
import { Calendar, Clock, BookOpen, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HorarioItem = ({ item, index }) => {
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
        return days[day] || day.substring(0, 3).toUpperCase();
    };

    const getTimeColor = (horaInicio) => {
        if (!horaInicio) return "bg-gray-600";
        
        const hour = parseInt(horaInicio.split(':')[0]);
        if (hour < 12) return "bg-blue-600";
        if (hour < 17) return "bg-green-600";
        return "bg-purple-600";
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
            className="flex items-center p-3 bg-gray-700 bg-opacity-50 rounded-lg hover:bg-opacity-70 transition-all duration-200"
        >
            <div className={`w-12 h-12 ${getTimeColor(item.horario?.horaInicio)} rounded-lg flex items-center justify-center mr-3 flex-shrink-0`}>
                <span className="text-white font-bold text-xs">
                    {getDayAbbreviation(item.horario?.dia || 'N/A')}
                </span>
            </div>
            
            <div className="flex-1 min-w-0">
                <h4 className="text-gray-100 font-medium truncate">
                    {item.codigoCurso || `C${item.cursoId}`}
                </h4>
                <div className="flex items-center text-sm text-gray-400 space-x-2">
                    <Clock className="w-3 h-3 flex-shrink-0" />
                    <span className="truncate">
                        {item.horario ? 
                            `${item.horario.horaInicio?.slice(0, 5)} - ${item.horario.horaFin?.slice(0, 5)}` : 
                            'Sin horario'
                        }
                    </span>
                </div>
                <div className="flex items-center text-xs text-gray-500 mt-1">
                    <span className="truncate">{item.grupo}</span>
                </div>
            </div>
        </motion.div>
    );
};

const MiniHorarioSemanal = ({ secciones, loading }) => {
    const navigate = useNavigate();

    const handleVerHorarioCompleto = () => {
        navigate("/horarios");
    };

    // Ordenar secciones por día de la semana y hora
    const seccionesOrdenadas = [...secciones].sort((a, b) => {
        const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
        
        const diaA = a.horario?.dia || '';
        const diaB = b.horario?.dia || '';
        
        const indexA = diasSemana.indexOf(diaA);
        const indexB = diasSemana.indexOf(diaB);
        
        if (indexA !== indexB) {
            return indexA - indexB;
        }
        
        // Si son el mismo día, ordenar por hora
        const horaA = a.horario?.horaInicio || '00:00';
        const horaB = b.horario?.horaInicio || '00:00';
        
        return horaA.localeCompare(horaB);
    });

    if (loading) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
            >
                <div className="flex justify-center items-center h-32">
                    <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="ml-3 text-gray-400">Cargando horario...</span>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
        >
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-100 flex items-center">
                    <Calendar className="w-6 h-6 mr-2 text-green-400" />
                    Mi Horario Semanal
                </h2>
                <motion.button
                    onClick={handleVerHorarioCompleto}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded-lg transition duration-200 flex items-center"
                >
                    <Eye className="w-4 h-4 mr-1" />
                    Ver Completo
                </motion.button>
            </div>

            {seccionesOrdenadas.length === 0 ? (
                <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-gray-100 mb-2">
                        Sin horario asignado
                    </h3>
                    <p className="text-gray-400">
                        No se encontraron clases programadas para esta semana.
                    </p>
                </div>
            ) : (
                <div className="space-y-3 max-h-[190px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent pr-1">

                    {seccionesOrdenadas.map((seccion, index) => (
                        <HorarioItem 
                            key={`${seccion.seccionId}-${index}`} 
                            item={seccion} 
                            index={index}
                        />
                    ))}
                </div>
            )}

            {seccionesOrdenadas.length > 0 && (
                <div className="mt-6 pt-4 border-t border-gray-700">
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                            <div className="text-lg font-bold text-blue-400">
                                {seccionesOrdenadas.filter(s => s.horario?.horaInicio && parseInt(s.horario.horaInicio.split(':')[0]) < 12).length}
                            </div>
                            <div className="text-xs text-gray-400">Matutinas</div>
                        </div>
                        <div>
                            <div className="text-lg font-bold text-green-400">
                                {seccionesOrdenadas.filter(s => s.horario?.horaInicio && parseInt(s.horario.horaInicio.split(':')[0]) >= 12 && parseInt(s.horario.horaInicio.split(':')[0]) < 17).length}
                            </div>
                            <div className="text-xs text-gray-400">Vespertinas</div>
                        </div>
                        <div>
                            <div className="text-lg font-bold text-purple-400">
                                {seccionesOrdenadas.filter(s => s.horario?.horaInicio && parseInt(s.horario.horaInicio.split(':')[0]) >= 17).length}
                            </div>
                            <div className="text-xs text-gray-400">Nocturnas</div>
                        </div>
                    </div>
                </div>
            )}
        </motion.div>
    );
};

export default MiniHorarioSemanal;