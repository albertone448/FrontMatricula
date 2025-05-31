import { motion } from "framer-motion";
import { CheckCircle, AlertCircle, RefreshCw } from "lucide-react";

const SuccessAlert = ({ message, onClose }) => (
	<motion.div
		initial={{ opacity: 0, y: -20 }}
		animate={{ opacity: 1, y: 0 }}
		className="bg-green-500 bg-opacity-20 border border-green-500 text-green-400 px-4 py-3 rounded-lg text-sm flex items-center mb-6"
	>
		<CheckCircle className="w-5 h-5 mr-2" />
		<div className="flex-1">
			<p className="font-medium">¡Usuario creado exitosamente!</p>
			<p className="text-xs opacity-75 mt-1">{message}</p>
		</div>
		{onClose && (
			<button
				onClick={onClose}
				className="ml-2 text-green-300 hover:text-green-200 transition duration-200"
			>
				<span className="text-xl">&times;</span>
			</button>
		)}
	</motion.div>
);

const ErrorAlert = ({ message, onRetry }) => (
	<motion.div
		initial={{ opacity: 0, y: -20 }}
		animate={{ opacity: 1, y: 0 }}
		className="bg-red-500 bg-opacity-20 border border-red-500 text-red-400 px-4 py-3 rounded-lg text-sm flex items-center mb-6"
	>
		<AlertCircle className="w-5 h-5 mr-2" />
		<div className="flex-1">
			<p className="font-medium">Error al cargar datos</p>
			<p className="text-xs opacity-75 mt-1">{message}</p>
		</div>
		{onRetry && (
			<button
				onClick={onRetry}
				className="ml-auto text-red-300 hover:text-red-200 transition duration-200"
			>
				<RefreshCw className="w-4 h-4" />
			</button>
		)}
	</motion.div>
);

const AlertMessages = ({ 
	successMessage, 
	errorMessage, 
	onClearSuccess, 
	onRetry 
}) => {
	return (
		<>
			{successMessage && (
				<SuccessAlert 
					message={successMessage} 
					onClose={onClearSuccess}
				/>
			)}
			{errorMessage && (
				<ErrorAlert 
					message={errorMessage} 
					onRetry={onRetry}
				/>
			)}
		</>
	);
};

export default AlertMessages;