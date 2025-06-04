import { motion } from "framer-motion";
import { Users, BookOpen, GraduationCap, Calendar } from "lucide-react";
import StatCard from "../common/StatCard";
import { useUserRole } from "../../contexts/UserRoleContext";
import { authUtils } from "../../utils/authUtils";

const SeccionStatsCards = ({ secciones, loading }) => {
    const { userRole } = useUserRole();
    const userId = authUtils.getUserId();

    // Filtrar secciones según el rol del usuario
    const seccionesFiltradas = userRole === "Profesor" 
        ? secciones.filter(s => s.usuarioId === userId)
        : secciones;

    // Calcular estadísticas más relevantes para secciones
    const stats = {
        total: seccionesFiltradas?.length || 0,
        cursosUnicos: seccionesFiltradas ? [...new Set(seccionesFiltradas.map(s => s.cursoId))].length : 0,
        profesoresAsignados: seccionesFiltradas ? [...new Set(seccionesFiltradas.map(s => s.usuarioId))].length : 0,
        periodosActivos: seccionesFiltradas ? [...new Set(seccionesFiltradas.map(s => s.periodo))].length : 0,
        cuposTotales: seccionesFiltradas ? seccionesFiltradas.reduce((sum, s) => sum + (s.cuposMax || 0), 0) : 0,
        carrerasAtendidas: seccionesFiltradas ? [...new Set(seccionesFiltradas.map(s => s.carrera))].length : 0
    };

    // Configuración de tarjetas según el rol
    const getStatsConfig = () => {
        if (userRole === "Profesor") {
            return [
                {
                    name: "Mis Secciones",
                    icon: Users,
                    value: loading ? "..." : stats.total,
                    color: "#6366F1"
                },
                {
                    name: "Cursos Únicos",
                    icon: BookOpen,
                    value: loading ? "..." : stats.cursosUnicos,
                    color: "#10B981"
                },
                {
                    name: "Total Estudiantes",
                    icon: GraduationCap,
                    value: loading ? "..." : stats.cuposTotales,
                    color: "#F59E0B"
                },
                {
                    name: "Carreras Atendidas",
                    icon: Calendar,
                    value: loading ? "..." : stats.carrerasAtendidas,
                    color: "#EF4444"
                }
            ];
        } else {
            // Para administradores (vista completa)
            return [
                {
                    name: "Total Secciones",
                    icon: Users,
                    value: loading ? "..." : stats.total,
                    color: "#6366F1"
                },
                {
                    name: "Cursos Ofertados",
                    icon: BookOpen,
                    value: loading ? "..." : stats.cursosUnicos,
                    color: "#10B981"
                },
                {
                    name: "Profesores Activos",
                    icon: GraduationCap,
                    value: loading ? "..." : stats.profesoresAsignados,
                    color: "#F59E0B"
                },
                {
                    name: "Periodos Activos",
                    icon: Calendar,
                    value: loading ? "..." : stats.periodosActivos,
                    color: "#EF4444"
                }
            ];
        }
    };

    const statsConfig = getStatsConfig();

    return (
        <motion.div
            className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {statsConfig.map((stat, index) => (
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
                    />
                </motion.div>
            ))}
        </motion.div>
    );
};

export default SeccionStatsCards;