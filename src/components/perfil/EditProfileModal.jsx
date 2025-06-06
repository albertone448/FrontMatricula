import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Loader2, User, Mail } from "lucide-react";

const EditProfileModal = ({
    isOpen,
    onClose,
    onSuccess,
    userToEdit,
    updateUser
}) => {
    const [formData, setFormData] = useState({
        nombre: "",
        apellido1: "",
        apellido2: "",
        email: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [validationErrors, setValidationErrors] = useState({});

    useEffect(() => {
        if (userToEdit) {
            setFormData({
                nombre: userToEdit.nombre || "",
                apellido1: userToEdit.apellido1 || "",
                apellido2: userToEdit.apellido2 || "",
                email: userToEdit.email || ""
            });
        }
        setValidationErrors({});
        setError("");
    }, [userToEdit, isOpen]);

    const validateForm = () => {
        const errors = {};
        if (!formData.nombre.trim()) errors.nombre = "El nombre es requerido";
        if (!formData.apellido1.trim()) errors.apellido1 = "El primer apellido es requerido";
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
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
            const userData = {
                usuarioId: userToEdit.usuarioId,
                nombre: formData.nombre.trim(),
                apellido1: formData.apellido1.trim(),
                apellido2: formData.apellido2.trim(),
            };

            await updateUser(userData);
            onSuccess("Perfil actualizado exitosamente");
            onClose();
        } catch (error) {
            console.error("Error al actualizar el perfil:", error);
            setError(error.response?.data?.message || error.message || "Error al actualizar el perfil");
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
                className="bg-gray-800 rounded-lg p-6 w-full max-w-lg m-4 border border-gray-700 relative max-h-[90vh] overflow-y-auto"
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-100">Editar Perfil</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-300 transition-colors duration-200">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6">
                        <div>
                            <label htmlFor="nombre" className="block text-gray-300 text-sm font-medium mb-2">Nombre</label>
                            <div className="relative">
                                <User className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input type="text" name="nombre" id="nombre" value={formData.nombre} onChange={handleChange} className="w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Tu nombre" />
                            </div>
                            {validationErrors.nombre && <p className="mt-1 text-sm text-red-400">{validationErrors.nombre}</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="apellido1" className="block text-gray-300 text-sm font-medium mb-2">Primer Apellido</label>
                                <input type="text" name="apellido1" id="apellido1" value={formData.apellido1} onChange={handleChange} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Primer apellido" />
                                {validationErrors.apellido1 && <p className="mt-1 text-sm text-red-400">{validationErrors.apellido1}</p>}
                            </div>
                            <div>
                                <label htmlFor="apellido2" className="block text-gray-300 text-sm font-medium mb-2">Segundo Apellido</label>
                                <input type="text" name="apellido2" id="apellido2" value={formData.apellido2} onChange={handleChange} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Segundo apellido" />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-gray-300 text-sm font-medium mb-2">Correo Electrónico</label>
                            <div className="relative">
                                <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input type="email" name="email" id="email" value={formData.email} readOnly className="w-full pl-10 pr-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-400 cursor-not-allowed" />
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="text-red-400 text-sm p-3 bg-red-900/30 border border-red-700 rounded-md">
                            {error}
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-gray-400 hover:text-gray-300 transition-colors duration-200" disabled={loading}>
                            Cancelar
                        </button>
                        <button type="submit" className="w-full sm:w-auto px-6 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors duration-200 flex items-center justify-center disabled:bg-blue-800 disabled:cursor-not-allowed" disabled={loading}>
                            {loading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : null}
                            Actualizar Perfil
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default EditProfileModal;
