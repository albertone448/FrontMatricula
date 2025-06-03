import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

const LoadingSpinner = ({ message = "Cargando..." }) => {
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			className="flex flex-col items-center justify-center py-12"
		>
			<div className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-8 border border-gray-700 text-center">
				<motion.div
					animate={{ rotate: 360 }}
					transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
					className="inline-block mb-4"
				>
					<Loader2 className="w-8 h-8 text-blue-500" />
				</motion.div>
				<p className="text-gray-400 text-lg">{message}</p>
			</div>
		</motion.div>
	);
};

export default LoadingSpinner;