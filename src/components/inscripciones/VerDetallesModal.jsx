import React from 'react';
import { motion } from "framer-motion";
import { X, Info } from "lucide-react";

export const VerDetallesModal = ({ open, onClose, seccion }) => {
  if (!open) return null;

  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.2 }}
        onClick={handleModalClick}
        className="relative bg-gray-800 bg-opacity-95 backdrop-blur-md shadow-xl rounded-xl p-8 border border-gray-700 w-full max-w-2xl mx-4"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 rounded-full">
                    <Info className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-100">Detalles de la Sección</h2>
                    <p className="text-gray-400">{seccion?.curso?.nombre}</p>
                </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white transition-colors">
                <X className="w-6 h-6" />
            </button>
        </div>

        {/* Course Description */}
        <div className="mb-6 bg-gray-900 bg-opacity-40 rounded-lg p-4 border border-gray-700">
            <h3 className="font-semibold text-lg text-gray-200 mb-2">Descripción del Curso</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
                {seccion?.curso?.descripcion || "No hay descripción disponible para este curso."}
            </p>
        </div>

        {/* Detalles del curso */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mb-8">
            <div className="flex justify-between items-center border-b border-gray-700 py-2">
                <span className="text-gray-400 font-medium">Código:</span>
                <span className="text-gray-200">{seccion?.curso?.codigo}</span>
            </div>
            <div className="flex justify-between items-center border-b border-gray-700 py-2">
                <span className="text-gray-400 font-medium">Créditos:</span>
                <span className="text-gray-200">{seccion?.curso?.creditos}</span>
            </div>
            <div className="flex justify-between items-center border-b border-gray-700 py-2">
                <span className="text-gray-400 font-medium">Grupo:</span>
                <span className="text-gray-200">{seccion?.grupo}</span>
            </div>
            <div className="flex justify-between items-center border-b border-gray-700 py-2">
                <span className="text-gray-400 font-medium">Carrera:</span>
                <span className="text-gray-200">{seccion?.carrera}</span>
            </div>
            {seccion?.horario && (
                <div className="flex justify-between items-center border-b border-gray-700 py-2">
                    <span className="text-gray-400 font-medium">Horario:</span>
                    <span className="text-gray-200">
                        {seccion.horario.dia} {seccion.horario.horaInicio?.slice(0, 5)} - {seccion.horario.horaFin?.slice(0, 5)}
                    </span>
                </div>
            )}
            <div className="flex justify-between items-center border-b border-gray-700 py-2">
                <span className="text-gray-400 font-medium">Cupos:</span>
                <div className="flex items-center space-x-2">
                    <span className={
                        Math.max(0, (seccion.cuposMax || 0) - (seccion.inscritos || 0)) > 0 
                        ? 'text-green-400' 
                        : 'text-red-400'
                    }>
                        {Math.max(0, (seccion.cuposMax || 0) - (seccion.inscritos || 0))}
                    </span>
                    <span> / {seccion.cuposMax || 0}</span>
                </div>
            </div>
            {seccion?.profesor && (
                <div className="md:col-span-2 flex justify-between items-center border-b border-gray-700 py-2">
                    <span className="text-gray-400 font-medium">Profesor:</span>
                    <span className="text-gray-200">
                        {seccion.profesor.nombre}
                        {seccion.profesor.apellido1 && seccion.profesor.apellido1 !== "undefined" ? ` ${seccion.profesor.apellido1}` : ''}
                        {seccion.profesor.apellido2 && seccion.profesor.apellido2 !== "undefined" ? ` ${seccion.profesor.apellido2}` : ''}
                    </span>
                </div>
            )}
        </div>
      </motion.div>
    </div>
  );
};
