import { motion } from "framer-motion";
import { BookOpen, CreditCard, Calendar, Target } from "lucide-react";

const StatCard = ({ name, icon: Icon, value, color, subtitle, loading }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-200"
    >
        <div className="flex items-center">
            <div 
                className="p-3 rounded-lg bg-opacity-20"
                style={{ backgroundColor: `${color}20` }}
            >
                <Icon 
                    className="w-6 h-6" 
                    style={{ color: color }} 
                />
            </div>
            <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-400">{name}</p>
                <p className="text-2xl font-bold text-gray-100">
                    {loading ? (
                        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                        value
                    )}
                </p>
                {subtitle && (
                    <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
                )}
            </div>
        </div>
    </motion.div>
);

const EstudianteStatsCards = ({ seccionesCount, creditosInscritos, periodoActual, loading }) => {
    const stats = [
        {
            name: "Materias Inscritas",
            icon: BookOpen,
            value: loading ? "..." : seccionesCount,
            color: "#6366F1",
            subtitle: `Periodo ${periodoActual}`
        },
        {
            name: "Créditos Totales",
            icon: CreditCard,
            value: loading ? "..." : creditosInscritos,
            color: "#10B981",
            subtitle: `de 18 máximo`
        },
        {
            name: "Periodo Actual",
            icon: Calendar,
            value: loading ? "..." : periodoActual,
            color: "#F59E0B",
            subtitle: "Activo"
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
            {stats.map((stat, index) => (
                <motion.div
                    key={stat.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                >
                    <StatCard
                        name={stat.name}
                        icon={stat.icon}
                        value={stat.value}
                        color={stat.color}
                        subtitle={stat.subtitle}
                        loading={loading}
                    />
                </motion.div>
            ))}
        </div>
    );
};

export default EstudianteStatsCards;