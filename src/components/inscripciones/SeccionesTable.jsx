import { motion } from "framer-motion";
import { BookOpen, Eye } from "lucide-react";

export const SeccionesTable = ({ 
    secciones, 
    loading, 
    handleInscribirMateria, 
    handleRetirarMateria,
    handleVerDetalles
}) => {
    // Sort sections: enrolled first, then by course name
    const sortedSecciones = [...secciones].sort((a, b) => {
        // Primary sort: enrolled status (true comes before false)
        if (a.inscrito && !b.inscrito) return -1;
        if (!a.inscrito && b.inscrito) return 1;

        // Secondary sort: by course name (alphabetical)
        const nameA = a.curso?.nombre?.toLowerCase() || '';
        const nameB = b.curso?.nombre?.toLowerCase() || '';
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;

        // Tertiary sort: by group (alphabetical/numerical)
        const groupA = a.grupo?.toLowerCase() || '';
        const groupB = b.grupo?.toLowerCase() || '';
        if (groupA < groupB) return -1;
        if (groupA > groupB) return 1;

        return 0;
    });

    return (
        <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl border border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-700 bg-opacity-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                Curso
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                Horario
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                Profesor
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                Grupo
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                Carrera
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                Cupos
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                Créditos
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                Estado
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700 bg-gray-800 bg-opacity-50">
                        {sortedSecciones.map((seccion) => (
                            <motion.tr
                                key={seccion.seccionId}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className={`hover:bg-gray-700 hover:bg-opacity-30 transition-colors duration-200 ${
                                    seccion.inscrito ? 'bg-blue-900 bg-opacity-10' : ''
                                }`}
                            >

                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <div>
                                        <BookOpen className="w-4 h-4 text-blue-400 mr-2" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-gray-100">
                                            {seccion.curso.nombre}
                                        </div>
                                        <div className="text-sm text-gray-400">
                                            {seccion.curso.codigo}
                                        </div>
                                    </div>
                                </div>
                            </td>

                            {/* Horario */}
                            <td className="px-6 py-4 whitespace-nowrap">
                                {seccion.horario ? (
                                    <div>
                                        <div className="text-sm text-blue-400">
                                            {seccion.horario.dia}
                                        </div>
                                        <div className="text-sm text-gray-400">
                                            {seccion.horario.horaInicio.slice(0, 5)} - {seccion.horario.horaFin.slice(0, 5)}
                                        </div>
                                    </div>
                                ) : (
                                    <span className="text-yellow-500 text-sm">Horario no asignado</span>
                                )}
                            </td>

                            {/* Profesor */}
                            <td className="px-6 py-4 text-sm text-gray-300 max-w-xs break-words">
                                {seccion.profesor ? `${seccion.profesor.nombre} ${seccion.profesor.apellido1}` : 'No asignado'}
                            </td>

                            {/* Grupo */}
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                {seccion.grupo}
                            </td>

                            {/* Carrera */}
                            <td className="px-6 py-4 max-w-xs break-words">
                                <div className="text-sm text-gray-300">
                                    {seccion.carrera || 'Sin asignar'}
                                </div>
                            </td>

                            {/* Cupos */}
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                <span className={
                                    Math.max(0, (seccion.cuposMax || 0) - (seccion.inscritos || 0)) > 0 
                                    ? 'text-green-400' 
                                    : 'text-red-400'
                                }>
                                    {Math.max(0, (seccion.cuposMax || 0) - (seccion.inscritos || 0))}
                                </span>
                                <span> / {seccion.cuposMax || 0}</span>
                            </td>

                            {/* Créditos */}
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                {seccion.curso.creditos}
                            </td>

                            {/* Estado */}
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    seccion.inscrito
                                        ? 'bg-blue-900 text-blue-200'
                                        : 'bg-gray-700 text-gray-200'
                                }`}>
                                    {seccion.inscrito ? 'Inscrito' : 'Disponible'}
                                </span>
                            </td>

                            {/* Acciones */}
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <div className="flex items-center justify-end space-x-2">
                                    <button
                                        onClick={() => handleVerDetalles(seccion)}
                                        title="Ver detalles"
                                        className="p-2 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white transition duration-200"
                                    >
                                        <Eye className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => seccion.inscrito 
                                            ? handleRetirarMateria(seccion.inscripcionId, seccion.curso, seccion.horario, seccion.grupo) 
                                            : handleInscribirMateria(seccion.seccionId, seccion.curso.nombre)
                                        }
                                        disabled={loading || (seccion.inscrito && seccion.tieneNotas)}
                                        title={seccion.inscrito && seccion.tieneNotas ? "No se puede retirar una materia con notas" : (seccion.inscrito ? "Retirar materia" : "Inscribir materia")}
                                        className={`w-24 text-center px-3 py-1.5 rounded-lg font-medium transition duration-200 
                                            ${loading ? "opacity-50 cursor-not-allowed " : ""}
                                            ${(seccion.inscrito && seccion.tieneNotas) 
                                                ? "bg-gray-500 text-gray-300 cursor-not-allowed opacity-70" 
                                                : seccion.inscrito 
                                                    ? "bg-red-600 hover:bg-red-700 text-white" 
                                                    : "bg-blue-600 hover:bg-blue-700 text-white"
                                        }`}
                                    >
                                        {loading ? "..." : 
                                        seccion.inscrito ? "Retirar" : "Inscribir"}
                                    </button>
                                </div>
                            </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
