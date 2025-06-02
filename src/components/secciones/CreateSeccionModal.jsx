import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2 } from "lucide-react";

const CreateSeccionModal = ({ isOpen, onClose, onSuccess, seccionToEdit = null, createSeccion, updateSeccion }) => {
    const [formData, setFormData] = useState({
        seccionId: 0,
        usuarioId: "",
        cursoId: "",
        horarioId: "",
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

        if (!formData.usuarioId.trim()) {
            errors.usuarioId = "El usuario es requerido";
        }

        if (!formData.cursoId.trim()) {
            errors.cursoId = "El curso es requerido";
        }

        if (!formData.horarioId.trim()) {
            errors.horarioId = "El horario es requerido";
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

        if (!formData.cuposMax || formData.cuposMax <= 0) {
            errors.cuposMax = "Los cupos deben ser mayor a 0";
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
						{cursoToEdit ? "Editar Curso" : "Crear Nuevo Curso"}
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
					{/* Código */}
					<div>
						<label className="block text-gray-300 text-sm font-medium mb-2">
							Código del Curso
						</label>
						<input
							type="text"
							name="codigo"
							value={formData.codigo}
							onChange={handleChange}
							className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							placeholder="Ej: MAT101"
						/>
						{validationErrors.codigo && (
							<p className="mt-1 text-sm text-red-400">{validationErrors.codigo}</p>
						)}
					</div>

					{/* Nombre */}
					<div>
						<label className="block text-gray-300 text-sm font-medium mb-2">
							Nombre del Curso
						</label>
						<input
							type="text"
							name="nombre"
							value={formData.nombre}
							onChange={handleChange}
							className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							placeholder="Ej: Matemáticas I"
						/>
						{validationErrors.nombre && (
							<p className="mt-1 text-sm text-red-400">{validationErrors.nombre}</p>
						)}
					</div>

					{/* Créditos */}
					<div>
						<label className="block text-gray-300 text-sm font-medium mb-2">
							Créditos
						</label>
						<select
						
							name="creditos"
							value={formData.creditos}
							onChange={handleChange}
							className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
							<option value="" disabled>Seleccione créditos</option>
							{[3, 4, 5, 6, 7, 8, 9].map((credito) => (
								<option key={credito} value={credito}>
									{credito} Crédito{credito > 1 ? "s" : ""}
								</option>
							))}
							
						</select>

							
						
						
						{validationErrors.creditos && (
							<p className="mt-1 text-sm text-red-400">{validationErrors.creditos}</p>
						)}
						
					</div>

					

					{/* Descripción */}
					<div>
						<label className="block text-gray-300 text-sm font-medium mb-2">
							Descripción
						</label>
						<textarea
							name="descripcion"
							value={formData.descripcion}
							onChange={handleChange}
							rows="3"
							className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
							placeholder="Describe el contenido del curso..."
						/>
					</div>

					{/* Error general */}
					{error && (
						<div className="text-red-400 text-sm bg-red-400 bg-opacity-10 border border-red-400 rounded-lg px-4 py-3">
							{error}
						</div>
					)}

					{/* Botones */}
					<div className="flex justify-end space-x-3 pt-4">
						<button
							type="button"
							onClick={onClose}
							className="px-4 py-2 text-gray-400 hover:text-gray-300 transition-colors duration-200"
						>
							Cancelar
						</button>
						<button
							type="submit"
							disabled={loading}
							className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[100px]"
						>
							{loading ? (
								<Loader2 className="w-5 h-5 animate-spin" />
							) : cursoToEdit ? (
								"Actualizar"
							) : (
								"Crear"
							)}
						</button>
					</div>
				</form>
			</motion.div>
		</div>
	);
};

export default CreateSeccionModal;


















