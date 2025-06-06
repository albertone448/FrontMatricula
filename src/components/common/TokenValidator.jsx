import { useEffect, useRef } from 'react';
import { useTokenValidation } from '../../hooks/useTokenValidation';

const TokenValidator = ({ children }) => {
    const { validateToken } = useTokenValidation();
    const intervalRef = useRef(null);

    useEffect(() => {
        

        // Función para ejecutar validación
        const executeValidation = async () => {
            try {
                await validateToken();
            } catch (error) {
                // El error ya se maneja en el hook, aquí solo registramos
          
            }
        };

        // Validar inmediatamente al montar el componente
        executeValidation();

        // Configurar validación periódica cada 5 minutos
        intervalRef.current = setInterval(() => {
          
            executeValidation();
        }, 5 * 60 * 1000); // 5 minutos

        // Cleanup: limpiar interval al desmontar
        return () => {
            if (intervalRef.current) {
          
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [validateToken]);

    // Renderizar los children normalmente
    // Si el token es inválido, el hook ya manejará la redirección
    return children;
};

export default TokenValidator;