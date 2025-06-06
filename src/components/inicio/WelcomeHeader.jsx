import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, Calendar } from "lucide-react";

const WelcomeHeader = ({ userName = "Profesor" }) => {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const getGreeting = () => {
        const hour = currentTime.getHours();
        if (hour < 12) return "Buenos días";
        if (hour < 18) return "Buenas tardes";
        return "Buenas noches";
    };

    const formatTime = (date) => {
        return date.toLocaleTimeString('es-ES', { 
            hour: '2-digit', 
            minute: '2-digit',
            second: '2-digit'
        });
    };

    const formatDate = (date) => {
        return date.toLocaleDateString('es-ES', { 
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-8 border border-gray-700 mb-8"
        >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div className="flex-1">
                    <h1 className="text-4xl font-bold text-gray-100 mb-2">
                        {getGreeting()}, {userName}
                    </h1>
                    <div className="flex items-center text-xl text-gray-400 mb-4">
                        <Calendar className="w-6 h-6 mr-2" />
                        {formatDate(currentTime)}
                    </div>
                    <p className="text-gray-500">
                        Bienvenido al Sistema de Gestión Universitaria
                    </p>
                </div>
                <div className="mt-6 lg:mt-0 text-right">
                    <div className="flex items-center justify-end text-3xl font-mono text-blue-400 mb-2">
                        <Clock className="w-8 h-8 mr-3" />
                        {formatTime(currentTime)}
                    </div>
                    <div className="text-sm text-gray-500">
                        Hora actual del sistema
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default WelcomeHeader;