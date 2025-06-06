import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Loader2 } from "lucide-react";

const CreateSeccionModal = ({ 
    isOpen, 
    onClose, 
    onSuccess, 
    seccionToEdit = null, 
    createSeccion, 
    updateSeccion,
    profesores = [],
    cursos = []
}) => {
    const [formData, setFormData] = useState({
        seccionId: 0,
        usuarioId: "",
        cursoId: "",
        horarioId: "",
        grupo: "", // Cambiado de "Grupo " a ""
        periodo: "",
        carrera: "",
        cuposMax: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [validationErrors, setValidationErrors] = useState({});

    // Horarios disponibles (basados en la información proporcionada)
    const horariosDisponibles = [
        { id: 1, descripcion: "Lunes 08:00 - 11:20" },
        { id: 2, descripcion: "Lunes 13:00 - 16:20" },
        { id: 3, descripcion: "Lunes 17:00 - 20:20" },
        { id: 4, descripcion: "Martes 08:00 - 11:20" },
        { id: 5, descripcion: "Martes 13:00 - 16:20" },
        { id: 6, descripcion: "Martes 17:00 - 20:20" },
        { id: 7, descripcion: "Miércoles 08:00 - 11:20" },
        { id: 8, descripcion: "Miércoles 13:00 - 16:20" },
        { id: 9, descripcion: "Miércoles 17:00 - 20:20" },
        { id: 10, descripcion: "Jueves 08:00 - 11:20" },
        { id: 11, descripcion: "Jueves 13:00 - 16:20" },
        { id: 12, descripcion: "Jueves 17:00 - 20:20" },
        { id: 13, descripcion: "Viernes 08:00 - 11:20" },
        { id: 14, descripcion: "Viernes 13:00 - 16:20" },
        { id: 15, descripcion: "Viernes 17:00 - 20:20" },
        { id: 16, descripcion: "Sábado 08:00 - 11:20" },
        { id: 17, descripcion: "Sábado 13:00 - 16:20" },
        { id: 18, descripcion: "Sábado 17:00 - 20:20" },
        { id: 19, descripcion: "Domingo 08:00 - 11:20" },
        { id: 20, descripcion: "Domingo 13:00 - 16:20" },
        { id: 21, descripcion: "Domingo 17:00 - 20:20" }
    ];

    const carrerasDisponibles = [
        "Administración",
        "Administración con énfasis en Gestión Financiera",
        "Administración Educativa",
        "Antropología",
        "Archivística",
        "Arte",
        "Bibliotecología",
        "Bibliotecología y Documentación",
        "Biología",
        "Biología Marina",
        "Cartografía",
        "Ciencias Actuariales",
        "Ciencias Agrarias",
        "Ciencias Ambientales",
        "Ciencias de la Educación",
        "Ciencias de la Educación con énfasis en Educación Rural",
        "Ciencias del Deporte",
        "Ciencias Forestales",
        "Ciencias Geográficas",
        "Ciencias Geográficas con énfasis en Ordenamiento Territorial",
        "Ciencias Marinas y Costeras",
        "Ciencias Políticas",
        "Comunicación",
        "Contaduría Pública",
        "Cooperativismo",
        "Danza",
        "Desarrollo Comunitario Sustentable",
        "Desarrollo Humano",
        "Desarrollo Rural",
        "Economía",
        "Educación de Adultos",
        "Educación Especial",
        "Educación Física",
        "Educación Rural",
        "Enfermería",
        "Enseñanza de la Filosofía",
        "Enseñanza de la Música",
        "Enseñanza de las Artes Plásticas",
        "Enseñanza de las Ciencias Naturales",
        "Enseñanza de las Matemáticas",
        "Enseñanza de los Estudios Sociales",
        "Enseñanza del Castellano y Literatura",
        "Enseñanza del Francés",
        "Enseñanza del Inglés",
        "Enseñanza del Inglés para III Ciclo y Educación Diversificada",
        "Estudios Interdisciplinarios",
        "Filosofía",
        "Física",
        "Francés",
        "Gestión Ambiental",
        "Gestión de la Información",
        "Gestión de Recursos Humanos",
        "Gestión de Recursos Naturales",
        "Gestión Empresarial del Turismo Sostenible",
        "Historia",
        "Ingeniería Agronómica",
        "Ingeniería en Biotecnología",
        "Ingeniería en Ciencias Forestales",
        "Ingeniería en Sistemas de Información",
        "Ingeniería Hidrológica",
        "Ingeniería Industrial",
        "Ingeniería Informática",
        "Literatura y Lingüística",
        "Manejo de Recursos Naturales",
        "Matemática",
        "Medicina",
        "Medicina Veterinaria",
        "Meteorología",
        "Música",
        "Nutrición Humana",
        "Orientación",
        "Pedagogía con énfasis en Educación Preescolar",
        "Pedagogía con énfasis en I y II Ciclos",
        "Planificación Económica y Social",
        "Producción Audiovisual",
        "Promoción de la Salud",
        "Psicología",
        "Química",
        "Relaciones Internacionales",
        "Salud Ocupacional",
        "Sociología",
        "Teatro",
        "Tecnología Educativa",
        "Tecnologías de Información",
        "Tecnologías en Salud",
        "Terapia Física",
        "Topografía",
        "Trabajo Social",
        "Traducción Francés-Español",
        "Traducción Inglés-Español",
        "Turismo"
    ];

    // Generar periodos disponibles desde 2024 hasta 2040
    const periodosDisponibles = [];
    for (let year = 2024; year <= 2040; year++) {
        periodosDisponibles.push(`${year}-I`);
        periodosDisponibles.push(`${year}-II`);
        periodosDisponibles.push(`${year}-III`);
    }

    // Si hay una sección para editar, llenar el formulario
    useEffect(() => {
        if (seccionToEdit) {
            setFormData({
                seccionId: Number(seccionToEdit.seccionId) || 0,
                usuarioId: String(seccionToEdit.usuarioId) || "",
                cursoId: String(seccionToEdit.cursoId) || "",
                horarioId: String(seccionToEdit.horarioId) || "",
                grupo: seccionToEdit.grupo || "", // Cambiado de "Grupo " a ""
                periodo: seccionToEdit.periodo || "",
                carrera: seccionToEdit.carrera || "",
                cuposMax: String(seccionToEdit.cuposMax) || "",
            });
        } else {
            // Resetear el formulario si no hay sección para editar
            setFormData({
                seccionId: 0,
                usuarioId: "",
                cursoId: "",
                horarioId: "",
                grupo: "", // Cambiado de "Grupo " a ""
                periodo: "",
                carrera: "",
                cuposMax: "",
            });
        }
        // Limpiar errores cuando cambia la sección a editar
        setValidationErrors({});
        setError("");
    }, [seccionToEdit, isOpen]);

    const validateForm = () => {
        const errors = {};

        if (!formData.usuarioId) {
            errors.usuarioId = "Debe seleccionar un profesor";
        }

        if (!formData.cursoId) {
            errors.cursoId = "Debe seleccionar un curso";
        }

        if (!formData.horarioId) {
            errors.horarioId = "Debe seleccionar un horario";
        }

        if (!formData.grupo) { // Cambiado de !formData.grupo.trim() || formData.grupo.trim() === "Grupo"
            errors.grupo = "Debe seleccionar un grupo";
        }

        if (!formData.periodo.trim()) {
            errors.periodo = "El periodo es requerido";
        }

        if (!formData.carrera) {
            errors.carrera = "Debe seleccionar una carrera";
        }

        const cupos = parseInt(formData.cuposMax);
        if (!formData.cuposMax || isNaN(cupos) || cupos <= 0) {
            errors.cuposMax = "Los cupos deben ser un número mayor a 0";
        }
        
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (validationErrors[name]) {
            setValidationErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        setError("");

        try {
            const seccionData = {
                seccionId: formData.seccionId || 0,
                usuarioId: parseInt(formData.usuarioId),
                cursoId: parseInt(formData.cursoId),
                horarioId: parseInt(formData.horarioId),
                grupo: formData.grupo.trim(),
                periodo: formData.periodo.trim(),
                carrera: formData.carrera,
                cuposMax: parseInt(formData.cuposMax)
            };

            if (seccionToEdit) {
                await updateSeccion(seccionData);
            } else {
                await createSeccion(seccionData);
            }

            onSuccess(`Sección ${seccionToEdit ? 'actualizada' : 'creada'} exitosamente`);
            onClose();
        } catch (error) {
            console.error("Error al procesar sección:", error);
            setError(error.response?.data?.message || error.message || "Error al procesar la sección");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl m-4 border border-gray-700 relative max-h-[90vh] overflow-y-auto"
            >
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-100">
                        {seccionToEdit ? "Editar Sección" : "Crear Nueva Sección"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-300 transition-colors duration-200"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Formulario */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Profesor */}
                        <div>
                            <label htmlFor="usuarioId" className="block text-gray-300 text-sm font-medium mb-2">
                                Profesor Asignado
                            </label>
                            <select
                                name="usuarioId"
                                id="usuarioId"
                                value={formData.usuarioId}
                                onChange={handleChange}
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">Seleccionar profesor</option>
                                {profesores.map((profesor) => (
                                    <option key={profesor.usuarioId} value={profesor.usuarioId}>
                                        {profesor.nombre} {profesor.apellido1} {profesor.apellido2}
                                    </option>
                                ))}
                            </select>
                            {validationErrors.usuarioId && (
                                <p className="mt-1 text-sm text-red-400">{validationErrors.usuarioId}</p>
                            )}
                        </div>

                        {/* Curso */}
                        <div>
                            <label htmlFor="cursoId" className="block text-gray-300 text-sm font-medium mb-2">
                                Curso
                            </label>
                            <select
                                name="cursoId"
                                id="cursoId"
                                value={formData.cursoId}
                                onChange={handleChange}
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">Seleccionar curso</option>
                                {cursos.map((curso) => (
                                    <option key={curso.cursoId} value={curso.cursoId}>
                                        {curso.codigo} - {curso.nombre}
                                    </option>
                                ))}
                            </select>
                            {validationErrors.cursoId && (
                                <p className="mt-1 text-sm text-red-400">{validationErrors.cursoId}</p>
                            )}
                        </div>

                        {/* Horario */}
                        <div>
                            <label htmlFor="horarioId" className="block text-gray-300 text-sm font-medium mb-2">
                                Horario
                            </label>
                            <select
                                name="horarioId"
                                id="horarioId"
                                value={formData.horarioId}
                                onChange={handleChange}
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">Seleccionar horario</option>
                                {horariosDisponibles.map((horario) => (
                                    <option key={horario.id} value={horario.id}>
                                        {horario.descripcion}
                                    </option>
                                ))}
                            </select>
                            {validationErrors.horarioId && (
                                <p className="mt-1 text-sm text-red-400">{validationErrors.horarioId}</p>
                            )}
                        </div>

                        {/* Grupo */}
                        <div>
                            <label htmlFor="grupo" className="block text-gray-300 text-sm font-medium mb-2">
                                Grupo
                            </label>
                            <select
                                name="grupo"
                                id="grupo"
                                value={formData.grupo}
                                onChange={handleChange}
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">Seleccionar grupo</option>
                                {Array.from({ length: 10 }, (_, i) => {
                                    const groupNumber = String(i + 1).padStart(2, '0');
                                    return (
                                        <option key={`Grupo ${groupNumber}`} value={`Grupo ${groupNumber}`}>
                                            Grupo {groupNumber}
                                        </option>
                                    );
                                })}
                            </select>
                            {validationErrors.grupo && (
                                <p className="mt-1 text-sm text-red-400">{validationErrors.grupo}</p>
                            )}
                        </div>

                        {/* Periodo */}
                        <div>
                            <label htmlFor="periodo" className="block text-gray-300 text-sm font-medium mb-2">
                                Periodo
                            </label>
                            <select
                                name="periodo"
                                id="periodo"
                                value={formData.periodo}
                                onChange={handleChange}
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">Seleccionar periodo</option>
                                {periodosDisponibles.map((periodo) => (
                                    <option key={periodo} value={periodo}>
                                        {periodo}
                                    </option>
                                ))}
                            </select>
                            {validationErrors.periodo && (
                                <p className="mt-1 text-sm text-red-400">{validationErrors.periodo}</p>
                            )}
                        </div>

                        {/* Carrera */}
                        <div>
                            <label htmlFor="carrera" className="block text-gray-300 text-sm font-medium mb-2">
                                Carrera
                            </label>
                            <select
                                name="carrera"
                                id="carrera"
                                value={formData.carrera}
                                onChange={handleChange}
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">Seleccionar carrera</option>
                                {carrerasDisponibles.map((carrera) => (
                                    <option key={carrera} value={carrera}>
                                        {carrera}
                                    </option>
                                ))}
                            </select>
                            {validationErrors.carrera && (
                                <p className="mt-1 text-sm text-red-400">{validationErrors.carrera}</p>
                            )}
                        </div>

                        {/* Cupos Máximos */}
                        <div>
                            <label htmlFor="cuposMax" className="block text-gray-300 text-sm font-medium mb-2">
                                Cupos Máximos
                            </label>
                            <input
                                type="number"
                                name="cuposMax"
                                id="cuposMax"
                                value={formData.cuposMax}
                                onChange={handleChange}
                                min="1"
                                max="50"
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Ej: 30"
                            />
                            {validationErrors.cuposMax && (
                                <p className="mt-1 text-sm text-red-400">{validationErrors.cuposMax}</p>
                            )}
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="text-red-400 text-sm p-3 bg-red-900/30 border border-red-700 rounded-md">
                            {error}
                        </div>
                    )}

                    {/* Botones */}
                    <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-400 hover:text-gray-300 transition-colors duration-200"
                            disabled={loading}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="w-full sm:w-auto px-6 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors duration-200 flex items-center justify-center disabled:bg-blue-800 disabled:cursor-not-allowed"
                            disabled={loading}
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            ) : null}
                            {seccionToEdit ? "Actualizar Sección" : "Crear Sección"}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default CreateSeccionModal;
