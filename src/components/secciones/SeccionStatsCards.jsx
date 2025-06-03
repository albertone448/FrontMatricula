import { motion } from "framer-motion";
import { Users, BookOpen, GraduationCap, Calendar } from "lucide-react";
import StatCard from "../common/StatCard";

const SeccionStatsCards = ({ secciones, loading }) => {
    // Calcular estadísticas más relevantes para secciones
    const stats = {
        total: secciones?.length || 0,
        cursosUnicos: secciones ? [...new Set(secciones.map(s => s.cursoId))].length : 0,
        profesoresAsignados: secciones ? [...new Set(secciones.map(s => s.usuarioId))].length : 0,
        periodosActivos: secciones ? [...new Set(secciones.map(s => s.periodo))].length : 0,
        cuposTotales: secciones ? secciones.reduce((sum, s) => sum + (s.cuposMax || 0), 0) : 0
    };

    return (
        <motion.div
            className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <StatCard
                name="Total Secciones"
                icon={Users}
                value={loading ? "..." : stats.total}
                color="#6366F1"
            />
            <StatCard
                name="Cursos Ofertados"
                icon={BookOpen}
                value={loading ? "..." : stats.cursosUnicos}
                color="#10B981"
            />
            <StatCard
                name="Profesores Activos"
                icon={GraduationCap}
                value={loading ? "..." : stats.profesoresAsignados}
                color="#F59E0B"
            />
            <StatCard
                name="Periodos Activos"
                icon={Calendar}
                value={loading ? "..." : stats.periodosActivos}
                color="#EF4444"
            />
        </motion.div>
    );
};

export default SeccionStatsCards;