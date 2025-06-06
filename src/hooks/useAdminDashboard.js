import { useState, useEffect, useCallback } from 'react';
import { authUtils } from '../utils/authUtils';
import api from '../services/apiConfig';

export const useAdminDashboard = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [totalEstudiantes, setTotalEstudiantes] = useState(0);
    const [totalProfesores, setTotalProfesores] = useState(0);
    const [seccionesActivas, setSeccionesActivas] = useState(0);
    const [periodoActual, setPeriodoActual] = useState("");

    // Función para calcular el periodo actual basado en la fecha real
    const calcularPeriodoActual = useCallback(() => {
        const ahora = new Date();
        const año = ahora.getFullYear();
        const mes = ahora.getMonth() + 1; // getMonth() devuelve 0-11

        let periodo;
        if (mes >= 1 && mes <= 4) {
            periodo = "I";
        } else if (mes >= 5 && mes <= 8) {
            periodo = "II";
        } else {
            periodo = "III";
        }

        return `${año}-${periodo}`;
    }, []);

    // Función para obtener estadísticas del administrador
    const fetchAdminStats = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const token = authUtils.getToken();
            if (!token) {
                throw new Error("Token de autenticación no encontrado");
            }

            console.log("🔍 Obteniendo estadísticas de administrador...");

            // Calcular periodo actual
            const periodoCalculado = calcularPeriodoActual();
            setPeriodoActual(periodoCalculado);
            console.log("📅 Periodo actual calculado:", periodoCalculado);

            // Realizar todas las peticiones en paralelo para mejor rendimiento
            const [usuariosResponse, seccionesResponse] = await Promise.all([
                api.get("Usuario/GetTodosLosUsuarios"),
                api.get("Seccion/GetAllSecciones")
            ]);

            console.log("👥 Usuarios obtenidos:", usuariosResponse.data.length);
            console.log("📚 Secciones obtenidas:", seccionesResponse.data.length);

            // Procesar usuarios
            const todosLosUsuarios = usuariosResponse.data;
            const estudiantes = todosLosUsuarios.filter(usuario => usuario.rol === "Estudiante");
            const profesores = todosLosUsuarios.filter(usuario => usuario.rol === "Profesor");

            console.log("🎓 Estudiantes encontrados:", estudiantes.length);
            console.log("👨‍🏫 Profesores encontrados:", profesores.length);

            // Procesar secciones del periodo actual
            const todasLasSecciones = seccionesResponse.data;
            const seccionesDelPeriodoActual = todasLasSecciones.filter(
                seccion => seccion.periodo === periodoCalculado
            );

            console.log("📖 Secciones del periodo actual:", seccionesDelPeriodoActual.length);

            // Actualizar estados
            setTotalEstudiantes(estudiantes.length);
            setTotalProfesores(profesores.length);
            setSeccionesActivas(seccionesDelPeriodoActual.length);

            console.log("✅ Estadísticas de administrador cargadas:", {
                estudiantes: estudiantes.length,
                profesores: profesores.length,
                seccionesActivas: seccionesDelPeriodoActual.length,
                periodo: periodoCalculado
            });

        } catch (error) {
            console.error("❌ Error al cargar estadísticas de administrador:", error);
            setError(error.message || "Error al cargar las estadísticas del sistema");
        } finally {
            setLoading(false);
        }
    }, [calcularPeriodoActual]);

    // Función para refrescar los datos
    const refreshData = useCallback(() => {
        fetchAdminStats();
    }, [fetchAdminStats]);

    // Cargar datos al montar el hook
    useEffect(() => {
        fetchAdminStats();
    }, [fetchAdminStats]);

    return {
        loading,
        error,
        totalEstudiantes,
        totalProfesores,
        seccionesActivas,
        periodoActual,
        refreshData
    };
};