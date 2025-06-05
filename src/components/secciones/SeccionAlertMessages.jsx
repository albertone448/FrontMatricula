import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertCircle, RefreshCw } from "lucide-react";

const SuccessAlert = ({ message, onClose }) => (
    <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="bg-green-500 bg-opacity-20 border border-green-500 text-green-400 px-4 py-3 rounded-lg text-sm flex items-center mb-6"
    >
        <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0" />
        <div className="flex-1 min-w-0">
            <p className="font-medium">¡Operación exitosa!</p>
            <p className="text-xs opacity-75 mt-1 break-words">{message}</p>
        </div>
        {onClose && (
            <button
                onClick={onClose}
                className="ml-2 text-green-300 hover:text-green-200 transition-colors duration-200 flex-shrink-0"
                aria-label="Cerrar alerta"
            >
                <span className="text-xl leading-none">&times;</span>
            </button>
        )}
    </motion.div>
);

const ErrorAlert = ({ message, onRetry }) => (
    <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="bg-red-500 bg-opacity-20 border border-red-500 text-red-400 px-4 py-3 rounded-lg text-sm flex items-center mb-6"
    >
        <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
        <div className="flex-1 min-w-0">
            <p className="font-medium">Error al cargar datos</p>
            <p className="text-xs opacity-75 mt-1 break-words">{message}</p>
        </div>
        {onRetry && (
            <button
                onClick={onRetry}
                className="ml-auto text-red-300 hover:text-red-200 transition-colors duration-200 flex-shrink-0"
                aria-label="Reintentar"
            >
                <RefreshCw className="w-4 h-4" />
            </button>
        )}
    </motion.div>
);

const SeccionAlertMessages = ({ 
    successMessage, 
    errorMessage, 
    onClearSuccess, 
    onRetry 
}) => {
    return (
        <AnimatePresence mode="wait">
            {successMessage && (
                <SuccessAlert 
                    key="success"
                    message={successMessage} 
                    onClose={onClearSuccess}
                />
            )}
            {errorMessage && (
                <ErrorAlert 
                    key="error"
                    message={errorMessage} 
                    onRetry={onRetry}
                />
            )}
        </AnimatePresence>
    );
};

export default SeccionAlertMessages;