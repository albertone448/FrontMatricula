import { motion } from "framer-motion";
import { AlertCircle, RefreshCw } from "lucide-react";

const ErrorMessage = ({ message, onRetry }) => {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-8 border border-gray-700 text-center"
		>
			<div className="flex flex-col items-center">
				<motion.div
					initial={{ scale: 0 }}
					animate={{ scale: 1 }}
					transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
					className="inline-flex items-center justify-center w-16 h-16 bg-red-600 bg-opacity-20 rounded-full mb-4"
				>
					<AlertCircle className="w-8 h-8 text-red-400" />
				</motion.div>
				
				<h3 className="text-xl font-bold text-red-400 mb-3">
					Error al cargar el horario
				</h3>
				
				<p className="text-gray-400 mb-6 max-w-md">
					{message}
				</p>
				
				{onRetry && (
					<motion.button
						onClick={onRetry}
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition duration-200 flex items-center"
					>
						<RefreshCw className="w-5 h-5 mr-2" />
						Intentar de nuevo
					</motion.button>
				)}
			</div>
		</motion.div>
	);
};

export default ErrorMessage;