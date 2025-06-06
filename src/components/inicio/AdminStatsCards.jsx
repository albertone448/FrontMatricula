import { motion } from "framer-motion";
import { Users, GraduationCap, BookOpen, Calendar } from "lucide-react";

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

const AdminStatsCards = ({ 
    totalEstudiantes, 
    totalProfesores, 
    seccionesActivas, 
    periodoActual, 
    loading 
}) => {
    const stats = [
        {
            name: "Total Estudiantes",
            icon: GraduationCap,
            value: loading ? "..." : totalEstudiantes,
            color: "#6366F1",
            subtitle: "Usuarios activos en el sistema"
        },
        {
            name: "Total Profesores",
            icon: Users,
            value: loading ? "..." : totalProfesores,
            color: "#10B981",
            subtitle: "Docentes registrados"
        },
        {
            name: "Secciones Activas",
            icon: BookOpen,
            value: loading ? "..." : seccionesActivas,
            color: "#F59E0B",
            subtitle: `Periodo ${periodoActual}`
        },
        {
            name: "Periodo Actual",
            icon: Calendar,
            value: loading ? "..." : periodoActual,
            color: "#EF4444",
            subtitle: "Calculado automáticamente"
        }
    ];

    return (
        <div className="grid grid-cols-2 gap-6 mb-8">
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

// Asegurarse de que la exportación por defecto esté presente
export default AdminStatsCards;