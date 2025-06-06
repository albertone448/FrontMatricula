import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, RefreshCw } from "lucide-react";
import Header from "../components/common/Header";
import { useUserRole } from "../contexts/UserRoleContext";
import { useProfesorDashboard } from "../hooks/useProfesorDashboard";

// Componentes de inicio para profesor
import WelcomeHeader from "../components/inicio/WelcomeHeader";
import ProfesorStatsCards from "../components/inicio/ProfesorStatsCards";
import MisSeccionesResumen from "../components/inicio/MisSeccionesResumen";
import MiniHorarioSemanal from "../components/inicio/MiniHorarioSemanal";

const ProfesorDashboard = () => {
    const { currentUser } = useUserRole();
    const {
        secciones,
        loading,
        error,
        seccionesCount,
        estudiantesCount,
        periodoActual,
        refreshData
    } = useProfesorDashboard();

    const nombreCompleto = currentUser ? 
        `${currentUser.nombre} ${currentUser.apellido1}`.trim() : 
        "Profesor";

    return (
        <div className="space-y-8">
            {/* Mensaje de error */}
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-red-500 bg-opacity-20 border border-red-500 text-red-400 px-4 py-3 rounded-lg text-sm flex items-center"
                    >
                        <AlertCircle className="w-5 h-5 mr-2" />
                        <div className="flex-1">
                            <p className="font-medium">Error al cargar datos</p>
                            <p className="text-xs opacity-75 mt-1">{error}</p>
                        </div>
                        <button
                            onClick={refreshData}
                            className="ml-2 text-red-300 hover:text-red-200 transition-colors duration-200"
                        >
                            <RefreshCw className="w-4 h-4" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header de bienvenida */}
            <WelcomeHeader userName={nombreCompleto} />

            {/* Tarjetas de estadísticas */}
            <ProfesorStatsCards
                seccionesCount={seccionesCount}
                estudiantesCount={estudiantesCount}
                periodoActual={periodoActual}
                loading={loading}
            />

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* Resumen de mis secciones */}
                <MisSeccionesResumen
                    secciones={secciones}
                    loading={loading}
                />

                {/* Mini horario semanal */}
                <MiniHorarioSemanal
                    secciones={secciones}
                    loading={loading}
                />
            </div>
        </div>
    );
};

const GeneralDashboard = () => {
    return (
        <div className="space-y-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-8 border border-gray-700 text-center"
            >
                <h2 className="text-2xl font-bold text-gray-100 mb-4">
                    Bienvenido al Sistema de Gestión Universitaria
                </h2>
                <p className="text-gray-400">
                    Dashboard general para estudiantes y administradores estará disponible próximamente.
                </p>
            </motion.div>
        </div>
    );
};

const InicioPage = () => {
    const { userRole, loading: roleLoading } = useUserRole();

    if (roleLoading) {
        return (
            <div className='flex-1 overflow-auto relative z-10'>
                <Header title='Inicio' />
                <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
                    <div className="flex justify-center items-center h-96">
                        <div className="text-center">
                            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-gray-400 text-lg">Cargando dashboard...</p>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className='flex-1 overflow-auto relative z-10'>
            <Header title='Inicio' />

            <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
                {/* Dashboard específico según el rol */}
                {userRole === "Profesor" ? (
                    <ProfesorDashboard />
                ) : (
                    <GeneralDashboard />
                )}
            </main>
        </div>
    );
};

export default InicioPage;