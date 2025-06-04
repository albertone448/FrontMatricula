import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useUserRole } from "../contexts/UserRoleContext";
import Header from "../components/common/Header";
import LoadingSpinner from "../components/horarios/LoadingSpinner";
import ErrorMessage from "../components/horarios/ErrorMessage";
import { ConfirmRetirarModal } from "../components/inscripciones/ConfirmRetirarModal";
import { useInscripciones } from "../hooks/useInscripciones";
import { useProfile } from "../hooks/useProfile";
import { CreditosSummary } from "../components/inscripciones/CreditosSummary";
import { InscripcionesFilter } from "../components/inscripciones/InscripcionesFilter";
import { SeccionesTable } from "../components/inscripciones/SeccionesTable";
import { PeriodoSelector } from "../components/inscripciones/PeriodoSelector";

const InscripcionesPage = () => {
    const { userRole, loading: roleLoading } = useUserRole();
    const { user } = useProfile();
    const [searchTerm, setSearchTerm] = useState("");
    const [filterDia, setFilterDia] = useState("");
    const [filterHorario, setFilterHorario] = useState("");
	const [filterCarrera, setFilterCarrera] = useState("");

    const {
        loading,
        error,
        successMessage,
        periodosDisponibles,
        periodoSeleccionado,
        seccionesDisponibles,
        totalCreditos,
        modalRetirarOpen,
        seccionSeleccionada,
        setPeriodosDisponibles,
        setPeriodoSeleccionado,
        setModalRetirarOpen,
        setSeccionSeleccionada,
        fetchPeriodosDisponibles,
        fetchSeccionesDisponibles,
        handleInscribirMateria,
        handleRetirarMateria,
        handleConfirmRetiro,
        handlePeriodoChange,
        handleRefresh
    } = useInscripciones();

    // Cargar datos cuando el componente se monte
    useEffect(() => {
        if (!roleLoading && userRole === "Estudiante") {
            fetchPeriodosDisponibles().then(periodos => {
                setPeriodosDisponibles(periodos);
                if (periodos.length > 0) {
                    const periodoReciente = periodos[0];
                    setPeriodoSeleccionado(periodoReciente);
                    fetchSeccionesDisponibles(periodoReciente);
                } else {
                    fetchSeccionesDisponibles();
                }
            });
            if (user && user.carrera) {
                setFilterCarrera(user.carrera);
            }
        }
    }, [roleLoading, userRole, user]);

    // Función para filtrar secciones
    const seccionesFiltradas = seccionesDisponibles.filter(seccion => {
        const matchSearch = searchTerm === "" || 
            seccion.curso?.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            seccion.curso?.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
            seccion.grupo.toLowerCase().includes(searchTerm.toLowerCase());

        const matchDia = filterDia === "" || seccion.horario?.dia === filterDia;
        
        const horarioSeccion = seccion.horario ? 
            `${seccion.horario.horaInicio.slice(0, 5)} - ${seccion.horario.horaFin.slice(0, 5)}` : "";
        const matchHorario = filterHorario === "" || horarioSeccion === filterHorario;
		const matchCarrera = filterCarrera === "" || seccion.carrera === filterCarrera;

        return matchSearch && matchDia && matchHorario && matchCarrera;
    });

    // Verificar si el usuario es estudiante
    if (userRole !== "Estudiante") {
        return (
            <div className='flex-1 overflow-auto relative z-10'>
                <Header title='Inscripciones' />
                <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
                    <div className="bg-red-500 bg-opacity-10 border border-red-500 rounded-lg p-4 text-center">
                        <h2 className="text-xl font-bold text-red-500 mb-2">Acceso Denegado</h2>
                        <p className="text-gray-400">Esta página solo está disponible para estudiantes.</p>
                    </div>
                </main>
            </div>
        );
    }

    if (roleLoading) {
        return (
            <div className='flex-1 overflow-auto relative z-10'>
                <Header title='Inscripciones' />
                <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
                    <LoadingSpinner message="Verificando permisos..." />
                </main>
            </div>
        );
    }

    return (
        <div className='flex-1 overflow-auto relative z-10'>
            <Header title='Inscripciones' />
            <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
                <ConfirmRetirarModal
                    open={modalRetirarOpen}
                    onClose={() => {
                        setModalRetirarOpen(false);
                        setSeccionSeleccionada(null);
                    }}
                    onConfirm={handleConfirmRetiro}
                    seccion={seccionSeleccionada}
                />

                {loading && <LoadingSpinner message="Cargando secciones disponibles..." />}
                
                {error && (
                    <ErrorMessage 
                        message={error} 
                        onRetry={handleRefresh}
                    />
                )}

                {successMessage && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-green-500 bg-opacity-10 border border-green-500 rounded-lg p-4 mb-6"
                    >                    <p className="text-green-400 text-center">{successMessage}</p>
                    </motion.div>
                )}

                {periodosDisponibles.length > 0 && (
                    <PeriodoSelector
                        periodosDisponibles={periodosDisponibles}
                        periodoSeleccionado={periodoSeleccionado}
                        onPeriodoChange={handlePeriodoChange}
                    />
                )}

                <CreditosSummary totalCreditos={totalCreditos} />

                <InscripcionesFilter
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    filterDia={filterDia}
                    setFilterDia={setFilterDia}
                    filterHorario={filterHorario}
                    setFilterHorario={setFilterHorario}
					filterCarrera={filterCarrera}
					setFilterCarrera={setFilterCarrera}
                />

                {!loading && !error && seccionesFiltradas.length === 0 && (
                    <div className="text-center py-8">
                        <p className="text-gray-400">
                            {seccionesDisponibles.length === 0 
                                ? "No hay secciones disponibles para este periodo"
                                : "No se encontraron secciones que coincidan con los filtros"}
                        </p>
                    </div>
                )}

                <SeccionesTable
                    secciones={seccionesFiltradas}
                    loading={loading}
                    handleInscribirMateria={handleInscribirMateria}
                    handleRetirarMateria={handleRetirarMateria}
                />

                {modalRetirarOpen && seccionSeleccionada && (
                    <ConfirmRetirarModal
                        open={modalRetirarOpen}
                        onClose={() => setModalRetirarOpen(false)}
                        onConfirm={() => {
                            handleRetirarMateria(seccionSeleccionada.inscripcionId, seccionSeleccionada.curso.nombre);
                            setModalRetirarOpen(false);
                        }}
                        curso={seccionSeleccionada.curso}
                        horario={seccionSeleccionada.horario}
                        grupo={seccionSeleccionada.grupo}
                    />
                )}
            </main>
        </div>
    );
};

export default InscripcionesPage;