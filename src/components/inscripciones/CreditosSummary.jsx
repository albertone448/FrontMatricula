import { motion } from "framer-motion";

export const CreditosSummary = ({ totalCreditos }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-6"
        >
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-gray-100 mb-1">
                        Créditos Inscritos
                    </h3>
                    <p className="text-gray-400 text-sm">
                        Máximo permitido: 18 créditos por periodo
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-2xl font-bold text-blue-400">
                        {totalCreditos}
                    </p>
                    <p className="text-sm text-gray-400">
                        de 18 créditos
                    </p>
                </div>
            </div>
            {/* Barra de progreso */}
            <div className="mt-4">
                <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                        className={`h-2 rounded-full transition-all duration-500 ${
                            totalCreditos > 15 ? "bg-yellow-500" :
                            totalCreditos > 12 ? "bg-blue-500" :
                            "bg-green-500"
                        }`}
                        style={{ width: `${(totalCreditos / 18) * 100}%` }}
                    ></div>
                </div>
            </div>
        </motion.div>
    );
};
