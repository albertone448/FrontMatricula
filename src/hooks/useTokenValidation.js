import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authUtils } from '../utils/authUtils';

export const useTokenValidation = () => {
    const navigate = useNavigate();

    const validateToken = useCallback(async () => {
        try {
            const token = authUtils.getToken();
            
            if (!token) {
                
                throw new Error('No token found');
            }

            

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
                
                throw new Error(`HTTP ${response.status}`);
            }

            const data = await response.json();
            

            // Verificar la respuesta específica de tu API
            if (data.valid === true) {
            
                return true;
            } else {
            
                throw new Error('Token marked as invalid');
            }

        } catch (error) {
            console.error('❌ Error en validación de token:', error.message);
            
            // Token inválido - limpiar todo y redirigir
            
            
            // Limpiar todos los datos de autenticación
            authUtils.logout();
            
            // Redirigir al login reemplazando la historia para evitar volver atrás
            navigate('/login', { replace: true });
            
            return false;
        }
    }, [navigate]);

    return { validateToken };
};