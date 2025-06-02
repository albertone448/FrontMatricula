import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2 } from "lucide-react";

const CreateSeccionModal = ({ isOpen, onClose, onSuccess, seccionToEdit = null, createSeccion, updateSeccion }) => {
    const [formData, setFormData] = useState({
        seccionId: 0,
        usuarioId: 0, // Changed: Initialize as number
        cursoId: 0,   // Changed: Initialize as number
        horarioId: 0, // Changed: Initialize as number
        grupo : "",
        periodo : "",
        carrera: "",
        cuposMax : 0,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [validationErrors, setValidationErrors] = useState({});
      // Si hay una sección para editar, llenar el formulario
    useEffect(() => {
        if (seccionToEdit) {
            console.log('Editing seccion:', seccionToEdit);
            // Asegurarse de que todos los campos numéricos sean números
            setFormData({
                seccionId: Number(seccionToEdit.seccionId) || 0,
                usuarioId: Number(seccionToEdit.usuarioId) || 0,
                cursoId: Number(seccionToEdit.cursoId) || 0,
                horarioId: Number(seccionToEdit.horarioId) || 0,
                grupo: seccionToEdit.grupo || "",
                periodo: seccionToEdit.periodo || "",
                carrera: seccionToEdit.carrera || "",
                cuposMax: Number(seccionToEdit.cuposMax) || 0,
            });
        } else {
            console.log('Creating new seccion');
            // Resetear el formulario si no hay sección para editar
            setFormData({
                seccionId: 0,
                usuarioId: 0,
                cursoId: 0,
                horarioId: 0,
                grupo: "",
                periodo: "",
                carrera: "",
                cuposMax: 0,
            });
        }
        // Limpiar errores cuando cambia la sección a editar
        setValidationErrors({});
        setError("");
    }, [seccionToEdit]);

    const validateForm = () => {
        const errors = {};

        // Updated validation for numeric IDs
        if (!formData.usuarioId || formData.usuarioId === 0) {
            errors.usuarioId = "El ID de usuario es requerido";
        }

        if (!formData.cursoId || formData.cursoId === 0) {
            errors.cursoId = "El ID de curso es requerido";
        }

        if (!formData.horarioId || formData.horarioId === 0) {
            errors.horarioId = "El ID de horario es requerido";
        }

        if (!formData.grupo.trim()) {
            errors.grupo = "El grupo es requerido";
        }

        if (!formData.periodo.trim()) {
            errors.periodo = "El periodo es requerido";
        }

        if (!formData.carrera.trim()) {
            errors.carrera = "La carrera es requerida";
        }

        if (formData.cuposMax === undefined || formData.cuposMax === null || formData.cuposMax <= 0) {
            errors.cuposMax = "Los cupos deben ser un número mayor a 0";
        }
        
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    }
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Limpiar error específico cuando el usuario empiece a escribir
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
            // Asegurarse de que los ID sean números o null
            const seccionData = {
                ...formData,
                seccionId: formData.seccionId || 0,
                usuarioId: parseInt(formData.usuarioId) || 0,
                cursoId: parseInt(formData.cursoId) || 0,
                horarioId: parseInt(formData.horarioId) || 0,
                cuposMax: parseInt(formData.cuposMax) || 0
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
            setError(error.response?.data?.message || "Error al procesar la sección");
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
				className="bg-gray-800 rounded-lg p-6 w-full max-w-lg m-4 border border-gray-700 relative"
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
				<form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                    {/* Usuario ID */}
                    <div>
                        <label htmlFor="usuarioId" className="block text-gray-300 text-sm font-medium mb-2">
                            ID de Usuario
                        </label>
                        <input
                            type="number"
                            name="usuarioId"
                            id="usuarioId"
                            value={formData.usuarioId}
                            onChange={handleChange}
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Ej: 1"
                        />
                        {validationErrors.usuarioId && (
                            <p className="mt-1 text-sm text-red-400">{validationErrors.usuarioId}</p>
                        )}
                    </div>

                    {/* Curso ID */}
                    <div>
                        <label htmlFor="cursoId" className="block text-gray-300 text-sm font-medium mb-2">
                            ID de Curso
                        </label>
                        <input
                            type="number"
                            name="cursoId"
                            id="cursoId"
                            value={formData.cursoId}
                            onChange={handleChange}
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Ej: 101"
                        />
                        {validationErrors.cursoId && (
                            <p className="mt-1 text-sm text-red-400">{validationErrors.cursoId}</p>
                        )}
                    </div>

                    {/* Horario ID */}
                    <div>
                        <label htmlFor="horarioId" className="block text-gray-300 text-sm font-medium mb-2">
                            ID de Horario
                        </label>
                        <input
                            type="number"
                            name="horarioId"
                            id="horarioId"
                            value={formData.horarioId}
                            onChange={handleChange}
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Ej: 201"
                        />
                        {validationErrors.horarioId && (
                            <p className="mt-1 text-sm text-red-400">{validationErrors.horarioId}</p>
                        )}
                    </div>

                    {/* Grupo */}
                    <div>
                        <label htmlFor="grupo" className="block text-gray-300 text-sm font-medium mb-2">
                            Grupo
                        </label>
                        <input
                            type="text"
                            name="grupo"
                            id="grupo"
                            value={formData.grupo}
                            onChange={handleChange}
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Ej: A1"
                        />
                        {validationErrors.grupo && (
                            <p className="mt-1 text-sm text-red-400">{validationErrors.grupo}</p>
                        )}
                    </div>

                    {/* Periodo */}
                    <div>
                        <label htmlFor="periodo" className="block text-gray-300 text-sm font-medium mb-2">
                            Periodo
                        </label>
                        <input
                            type="text"
                            name="periodo"
                            id="periodo"
                            value={formData.periodo}
                            onChange={handleChange}
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Ej: 2025-1"
                        />
                        {validationErrors.periodo && (
                            <p className="mt-1 text-sm text-red-400">{validationErrors.periodo}</p>
                        )}
                    </div>

                    {/* Carrera */}
                    <div>
                        <label htmlFor="carrera" className="block text-gray-300 text-sm font-medium mb-2">
                            Carrera
                        </label>
                        <input
                            type="text"
                            name="carrera"
                            id="carrera"
                            value={formData.carrera}
                            onChange={handleChange}
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Ej: Ingeniería de Software"
                        />
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
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Ej: 30"
                        />
                        {validationErrors.cuposMax && (
                            <p className="mt-1 text-sm text-red-400">{validationErrors.cuposMax}</p>
                        )}
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
							className="w-full sm:w-auto px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors duration-200 flex items-center justify-center"
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


















