import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, AlertCircle, Target, Percent, CheckCircle } from "lucide-react";

const CrearEvaluacionModal = ({ 
    isOpen, 
    onClose, 
    onSuccess, 
    seccionId,
    tiposEvaluacion = [],
    evaluacionesExistentes = [],
    validarPorcentaje,
    contarTipoEvaluacion,
    createEvaluacion
}) => {
    const [formData, setFormData] = useState({
        tipEvaluacionId: "",
        porcentaje: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [validationErrors, setValidationErrors] = useState({});
    const [porcentajeValidation, setPorcentajeValidation] = useState(null);

    // Resetear formulario cuando se abre/cierra el modal
    useEffect(() => {
        if (isOpen) {
            setFormData({
                tipEvaluacionId: "",
                porcentaje: ""
            });
            setValidationErrors({});
            setError("");
            setPorcentajeValidation(null);
        }
    }, [isOpen]);

    // Validar porcentaje en tiempo real
    useEffect(() => {
        if (formData.porcentaje && !isNaN(formData.porcentaje)) {
            const porcentaje = parseInt(formData.porcentaje);
            if (porcentaje > 0 && porcentaje <= 100) {
                const validation = validarPorcentaje(porcentaje, evaluacionesExistentes);
                setPorcentajeValidation(validation);
            } else {
                setPorcentajeValidation(null);
            }
        } else {
            setPorcentajeValidation(null);
        }
    }, [formData.porcentaje, evaluacionesExistentes, validarPorcentaje]);

    // Todos los tipos están disponibles siempre (se pueden repetir)
    const tiposDisponibles = tiposEvaluacion;

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        // Para el porcentaje, solo permitir números enteros del 1 al 100
        if (name === "porcentaje") {
            const numericValue = value.replace(/\D/g, ""); // Solo números
            if (numericValue === "" || (parseInt(numericValue) >= 1 && parseInt(numericValue) <= 100)) {
                setFormData(prev => ({
                    ...prev,
                    [name]: numericValue
                }));
            }
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }

        // Limpiar errores cuando el usuario comience a escribir
        if (validationErrors[name]) {
            setValidationErrors(prev => ({ ...prev, [name]: "" }));
        }
        if (error) setError("");
    };

    const validateForm = () => {
        const errors = {};

        // Validar tipo de evaluación
        if (!formData.tipEvaluacionId) {
            errors.tipEvaluacionId = "Debe seleccionar un tipo de evaluación";
        }

        // Validar porcentaje
        if (!formData.porcentaje) {
            errors.porcentaje = "El porcentaje es requerido";
        } else {
            const porcentaje = parseInt(formData.porcentaje);
            
            if (isNaN(porcentaje) || porcentaje < 1 || porcentaje > 100) {
                errors.porcentaje = "El porcentaje debe ser un número entero entre 1 y 100";
            } else {
                // Validar que no exceda el porcentaje disponible
                const validation = validarPorcentaje(porcentaje, evaluacionesExistentes);
                if (!validation.esValido) {
                    errors.porcentaje = validation.mensaje;
                }
            }
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        setLoading(true);
        setError("");

        try {
            const evaluacionData = {
                seccionId: parseInt(seccionId),
                tipEvaluacionId: parseInt(formData.tipEvaluacionId),
                porcentaje: parseInt(formData.porcentaje)
            };

            await createEvaluacion(evaluacionData);
            
            // Obtener el nombre del tipo de evaluación para el mensaje
            const tipoSeleccionado = tiposEvaluacion.find(t => t.tipEvaluacionId === parseInt(formData.tipEvaluacionId));
            const nombreTipo = tipoSeleccionado ? tipoSeleccionado.nombre : 'Evaluación';
            
            onSuccess(`${nombreTipo} agregada exitosamente con ${formData.porcentaje}% del total.`);
            onClose();
        } catch (error) {
            console.error("❌ Error al crear evaluación:", error);
            setError(error.message || "Error al crear la evaluación");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setFormData({
            tipEvaluacionId: "",
            porcentaje: ""
        });
        setValidationErrors({});
        setError("");
        setPorcentajeValidation(null);
        onClose();
    };

    // Evitar que se cierre el modal cuando se hace clic en el contenido
    const handleModalClick = (e) => {
        e.stopPropagation();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay */}
            <div 
                className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" 
                onClick={handleClose} 
            />
            
            {/* Modal */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                onClick={handleModalClick}
                className="relative bg-gray-800 bg-opacity-95 backdrop-blur-md shadow-xl rounded-xl p-8 border border-gray-700 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto"
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                        <div className="p-3 bg-green-600 rounded-full mr-4">
                            <Target className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-100">Agregar Evaluación</h2>
                            <p className="text-sm text-gray-400">Define una nueva evaluación para el curso</p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-300 transition duration-200"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Información sobre tipos disponibles */}
                <div className="bg-blue-500 bg-opacity-20 border border-blue-500 text-blue-400 px-4 py-3 rounded-lg mb-6">
                    <p className="text-sm">
                        <strong>Tipos de evaluación:</strong> Puedes crear múltiples evaluaciones del mismo tipo si es necesario.
                    </p>
                </div>

                {/* Formulario */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Tipo de Evaluación */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Tipo de Evaluación
                        </label>
                        <select
                            name="tipEvaluacionId"
                            value={formData.tipEvaluacionId}
                            onChange={handleChange}
                            disabled={false}
                            className="w-full px-3 py-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
                        >
                            <option value="">Seleccionar tipo de evaluación</option>
                            {tiposDisponibles.map((tipo) => (
                                <option key={tipo.tipEvaluacionId} value={tipo.tipEvaluacionId}>
                                    {tipo.nombre}
                                </option>
                            ))}
                        </select>
                        {validationErrors.tipEvaluacionId && (
                            <p className="mt-1 text-sm text-red-400 flex items-center">
                                <AlertCircle className="w-4 h-4 mr-1" />
                                {validationErrors.tipEvaluacionId}
                            </p>
                        )}
                        
                        {/* Mostrar descripción del tipo seleccionado */}
                        {formData.tipEvaluacionId && (
                            <div className="mt-2 p-3 bg-gray-700 bg-opacity-50 rounded-lg">
                                <p className="text-xs text-gray-400 mb-1">
                                    {tiposEvaluacion.find(t => t.tipEvaluacionId === parseInt(formData.tipEvaluacionId))?.descripcion}
                                </p>
                                {/* Mostrar cuántas evaluaciones de este tipo ya existen */}
                                {(() => {
                                    const count = contarTipoEvaluacion(parseInt(formData.tipEvaluacionId), evaluacionesExistentes);
                                    return count > 0 ? (
                                        <p className="text-xs text-blue-400">
                                            Ya tienes {count} evaluación{count > 1 ? 'es' : ''} de este tipo
                                        </p>
                                    ) : null;
                                })()}
                            </div>
                        )}
                    </div>

                    {/* Porcentaje */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Porcentaje del Total
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                name="porcentaje"
                                value={formData.porcentaje}
                                onChange={handleChange}
                                placeholder="Ej: 25"
                                maxLength="3"
                                className="w-full px-3 py-3 pr-12 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
                            />
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                <Percent className="w-5 h-5 text-gray-400" />
                            </div>
                        </div>
                        {validationErrors.porcentaje && (
                            <p className="mt-1 text-sm text-red-400 flex items-center">
                                <AlertCircle className="w-4 h-4 mr-1" />
                                {validationErrors.porcentaje}
                            </p>
                        )}
                        
                        {/* Validación en tiempo real del porcentaje */}
                        {porcentajeValidation && (
                            <div className={`mt-2 p-3 rounded-lg border ${
                                porcentajeValidation.esValido 
                                    ? "bg-green-500 bg-opacity-20 border-green-500 text-green-400"
                                    : "bg-red-500 bg-opacity-20 border-red-500 text-red-400"
                            }`}>
                                <div className="flex items-center text-sm">
                                    {porcentajeValidation.esValido ? (
                                        <CheckCircle className="w-4 h-4 mr-2" />
                                    ) : (
                                        <AlertCircle className="w-4 h-4 mr-2" />
                                    )}
                                    <div>
                                        <p className="font-medium">{porcentajeValidation.mensaje}</p>
                                        <p className="text-xs opacity-75 mt-1">
                                            Disponible: {porcentajeValidation.porcentajeDisponible}%
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        <p className="text-xs text-gray-500 mt-2">
                            Ingresa un número entero entre 1 y 100
                        </p>
                    </div>

                    {/* Error general */}
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="bg-red-500 bg-opacity-20 border border-red-500 text-red-400 px-4 py-3 rounded-lg text-sm flex items-center"
                            >
                                <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                                <div>
                                    <p className="font-medium">Error</p>
                                    <p className="text-xs opacity-75 mt-1">{error}</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Información adicional */}
                    <div className="bg-blue-900 bg-opacity-30 border border-blue-700 rounded-lg p-4">
                        <h4 className="text-blue-300 font-medium mb-2 text-sm">Recordatorio:</h4>
                        <div className="text-blue-200 text-xs space-y-1">
                            <p>• El total de todas las evaluaciones debe sumar 100%</p>
                            <p>• Puedes crear múltiples evaluaciones del mismo tipo</p>
                            <p>• Los porcentajes deben ser números enteros</p>
                        </div>
                    </div>

                    {/* Botones */}
                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={loading}
                            className="px-4 py-2 text-gray-400 hover:text-gray-300 transition duration-200 disabled:opacity-50"
                        >
                            Cancelar
                        </button>
                        <motion.button
                            type="submit"
                            disabled={loading || tiposDisponibles.length === 0 || (porcentajeValidation && !porcentajeValidation.esValido)}
                            whileHover={{ scale: loading ? 1 : 1.02 }}
                            whileTap={{ scale: loading ? 1 : 0.98 }}
                            className="font-medium py-3 px-6 rounded-lg transition duration-200 flex items-center bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <>
                                    <Plus className="w-5 h-5 mr-2" />
                                    Agregar Evaluación
                                </>
                            )}
                        </motion.button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default CrearEvaluacionModal;
