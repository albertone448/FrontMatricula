import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import {RefreshCw, ShieldX, Home} from "lucide-react";

const InscripcionesPage = () => {
    const navigate = useNavigate();
    const { userRole, currentUser, loading: roleLoading } = useUserRole();
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

    // Wrapper for handleInscribirMateria to inject user's career
    const handleInscribirMateriaWrapper = (seccionId, nombreCurso) => {
        // The hook's handleInscribirMateria now expects userCarrera as the third argument.
        // user.carrera comes from the useProfile hook.
        handleInscribirMateria(seccionId, nombreCurso, user?.carrera);
    };

    const handleGoHome = () => {
		navigate("/");
	};

    // Verificar si el usuario es estudiante
    if (userRole !== "Estudiante") {
        return (
            <div className='flex-1 overflow-auto relative z-10 bg-gray-900'>
                <Header title="Acceso Denegado" />
                <main className='max-w-4xl mx-auto py-6 px-4 lg:px-8'>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center"
                    >
                        <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-xl rounded-xl p-12 border border-gray-700">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                                className="inline-flex items-center justify-center w-24 h-24 bg-red-600 rounded-full mb-8"
                            >
                                <ShieldX className="w-12 h-12 text-white" />
                            </motion.div>
                            <h1 className="text-4xl font-bold text-red-400 mb-6">
                                Acceso Denegado
                            </h1>
                            <p className="text-xl text-gray-300 mb-4">
                                No tienes permisos para acceder a esta página
                            </p>
                            <div className="bg-gray-700 bg-opacity-50 rounded-lg p-6 mb-8">
                                <h3 className="text-lg font-semibold text-gray-200 mb-3">
                                    Información de tu cuenta:
                                </h3>
                                <div className="space-y-2 text-gray-400">
                                    <p><strong>Usuario:</strong> {currentUser?.nombre} {currentUser?.apellido1}</p>
                                    <p><strong>Rol actual:</strong> <span className="text-yellow-400">{userRole}</span></p>
                                    <p><strong>Correo:</strong> {currentUser?.correo}</p>
                                </div>
                            </div>
                            <div className="bg-blue-900 bg-opacity-30 border border-blue-700 rounded-lg p-6 mb-8">
                                <h3 className="text-lg font-semibold text-blue-300 mb-3">
                                    ¿Por qué no puedo acceder?
                                </h3>
                                <p className="text-blue-200 text-sm leading-relaxed">
                                    La página de <strong>Inscripción de Materias</strong> está restringida exclusivamente 
                                    para usuarios con rol de <strong className="text-green-400">Estudiante</strong>. 
                                    Tu rol actual es <strong className="text-yellow-400">{userRole}</strong>, 
                                    por lo que no tienes los permisos necesarios para acceder a esta funcionalidad.
                                </p>
                            </div>
                            <motion.button
                                onClick={handleGoHome}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition duration-200 flex items-center mx-auto"
                            >
                                <Home className="w-5 h-5 mr-2" />
                                Volver al Inicio
                            </motion.button>
                            <div className="mt-8 text-sm text-gray-500">
                                <p>Si crees que esto es un error, contacta al administrador del sistema.</p>
                            </div>
                        </div>
                    </motion.div>
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
                        profesor={inscripcionParaRetiro.profesor} // Added profesor prop
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
                    handleInscribirMateria={handleInscribirMateriaWrapper} // Use the wrapper function
                    handleRetirarMateria={handleRetirarMateria}
                />

              
            </main>
        </div>
    );
};

export default InscripcionesPage;
