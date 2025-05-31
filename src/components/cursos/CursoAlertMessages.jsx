import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, CheckCircle } from "lucide-react";

const CursoAlertMessages = ({ successMessage, errorMessage, onClearSuccess, onRetry }) => {
	return (
		<AnimatePresence>
			{successMessage && (
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -20 }}
					className="bg-green-500 bg-opacity-20 border border-green-500 text-green-400 px-4 py-3 rounded-lg text-sm flex items-center mb-6"
				>
					<CheckCircle className="w-5 h-5 mr-3" />
					<div className="flex-1">{successMessage}</div>
					<button
						onClick={onClearSuccess}
						className="ml-3 text-green-400 hover:text-green-300 transition-colors duration-200"
					>
						×
					</button>
				</motion.div>
			)}

			{errorMessage && (
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -20 }}
					className="bg-red-500 bg-opacity-20 border border-red-500 text-red-400 px-4 py-3 rounded-lg text-sm flex items-center mb-6"
				>
					<AlertCircle className="w-5 h-5 mr-3" />
					<div className="flex-1">
						<p className="font-medium">Error al cargar los cursos</p>
						<p className="text-sm opacity-75">{errorMessage}</p>
					</div>
					{onRetry && (
						<button
							onClick={onRetry}
							className="ml-3 text-red-400 hover:text-red-300 transition-colors duration-200"
						>
							Reintentar
						</button>
					)}
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export default CursoAlertMessages;
