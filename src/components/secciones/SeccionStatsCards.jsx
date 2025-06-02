import { motion } from "framer-motion";
import { Users, CheckCircle, Clock, XCircle } from "lucide-react";
import StatCard from "../common/StatCard";

const SeccionStatsCards = ({ secciones, loading }) => {
    const stats = {
        total: secciones?.length || 0,
        activas: secciones?.filter(seccion => seccion.estado === "Activa").length || 0,
        pendientes: secciones?.filter(seccion => seccion.estado === "Pendiente").length || 0,
        inactivas: secciones?.filter(seccion => seccion.estado === "Inactiva").length || 0,
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
                name="Secciones Activas"
                icon={CheckCircle}
                value={loading ? "..." : stats.activas}
                color="#10B981"
            />
            <StatCard
                name="Secciones Pendientes"
                icon={Clock}
                value={loading ? "..." : stats.pendientes}
                color="#F59E0B"
            />
            <StatCard
                name="Secciones Inactivas"
                icon={XCircle}
                value={loading ? "..." : stats.inactivas}
                color="#EF4444"
            />
        </motion.div>
    );
};

export default SeccionStatsCards;
