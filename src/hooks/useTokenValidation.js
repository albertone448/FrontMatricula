import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authUtils } from '../utils/authUtils';

export const useTokenValidation = () => {
    const navigate = useNavigate();

    const validateToken = useCallback(async () => {
        try {
            const token = authUtils.getToken();
            
            if (!token) {
                console.log('❌ No hay token disponible');
                throw new Error('No token found');
            }

            console.log('🔍 Validando token...');

            // Llamar a tu endpoint específico
            const response = await fetch('http://localhost:5276/api/Usuario/ValidateToken', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }   
            });

            if (!response.ok) {
                console.log('❌ Token inválido - Respuesta HTTP:', response.status);
                throw new Error(`HTTP ${response.status}`);
            }

            const data = await response.json();
            console.log('📡 Respuesta de validación:', data);

            // Verificar la respuesta específica de tu API
            if (data.valid === true) {
                console.log('✅ Token válido para usuario:', data.userId);
                return true;
            } else {
                console.log('❌ Token marcado como inválido por el servidor');
                throw new Error('Token marked as invalid');
            }

        } catch (error) {
            console.error('❌ Error en validación de token:', error.message);
            
            // Token inválido - limpiar todo y redirigir
            console.log('🧹 Limpiando localStorage y redirigiendo al login...');
            
            // Limpiar todos los datos de autenticación
            authUtils.logout();
            
            // Redirigir al login reemplazando la historia para evitar volver atrás
            navigate('/login', { replace: true });
            
            return false;
        }
    }, [navigate]);

    return { validateToken };
};