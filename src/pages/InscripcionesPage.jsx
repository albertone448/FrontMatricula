import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useUserRole } from "../contexts/UserRoleContext";
import Header from "../components/common/Header";
import LoadingSpinner from "../components/horarios/LoadingSpinner";
import { ConfirmRetirarModal } from "../components/inscripciones/ConfirmRetirarModal";
import { useInscripciones } from "../hooks/useInscripciones";
import { useProfile } from "../hooks/useProfile";
import { CreditosSummary } from "../components/inscripciones/CreditosSummary";
import { InscripcionesFilter } from "../components/inscripciones/InscripcionesFilter";
import { SeccionesTable } from "../components/inscripciones/SeccionesTable";
import { PeriodoSelector } from "../components/inscripciones/PeriodoSelector";
import {RefreshCw} from "lucide-react";

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
        inscripcionParaRetiro, // Changed from seccionSeleccionada
        setPeriodosDisponibles,
        setPeriodoSeleccionado,
        setModalRetirarOpen,
        setInscripcionParaRetiro, // Changed from setSeccionSeleccionada
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
                {inscripcionParaRetiro && (
                    <ConfirmRetirarModal
                        open={modalRetirarOpen}
                        onClose={() => {
                            setModalRetirarOpen(false);
                            setInscripcionParaRetiro(null); // Changed from setSeccionSeleccionada
                        }}
                        onConfirm={handleConfirmRetiro}
                        // Pass specific details from inscripcionParaRetiro to the modal
                        // Assuming ConfirmRetirarModal expects props like curso, horario, grupo
                        curso={inscripcionParaRetiro.curso} 
                        horario={inscripcionParaRetiro.horario}
                        grupo={inscripcionParaRetiro.grupo}
                        // If ConfirmRetirarModal expects the whole object, you might pass it as a prop e.g., inscripcionData={inscripcionParaRetiro}
                    />
                )}

                {loading && <LoadingSpinner message="Cargando secciones disponibles..." />}
                
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-red-500 bg-opacity-10 border border-red-500 rounded-lg p-4 mb-6"
                    >
                        <p className={`text-red-400 text-center ${handleRefresh ? 'mb-3' : ''}`}>{error}</p>
                        {handleRefresh && (
                            <div className="text-center"> {/* This div centers the button */}
                                <label
                                    onClick={handleRefresh}
                                    className="px-4 py-2 text-sm  hover:bg-opacity-40 text-red-200 hover:text-red-100 rounded-md transition-colors duration-150"
                                >
                                    <div className="flex items-center justify-center space-x-5">
										<RefreshCw className="w-4 h-4 mr-2"> </RefreshCw>
										Intentar de nuevo
									</div>
                                </label>
                            </div>
                        )}
                    </motion.div>
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

              
            </main>
        </div>
    );
};

export default InscripcionesPage;