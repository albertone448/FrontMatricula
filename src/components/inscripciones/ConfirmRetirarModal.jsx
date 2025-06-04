import React from 'react';
import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";

export const ConfirmRetirarModal = ({ open, onClose, onConfirm, curso, horario, grupo }) => {
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
        className="relative bg-gray-800 bg-opacity-95 backdrop-blur-md shadow-xl rounded-xl p-8 border border-gray-700 w-full max-w-md mx-4"
      >
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-600 rounded-full mb-4">
            <AlertTriangle className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-100 mb-2">Confirmar Retiro</h2>
          <p className="text-gray-400">¿Está seguro que desea retirar esta materia?</p>
        </div>

        {/* Detalles del curso */}
        <div className="bg-gray-900 bg-opacity-50 rounded-lg p-4 mb-6 space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-400">Nombre:</span>
            <span className="text-gray-200 font-medium">{curso?.nombre}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Código:</span>
            <span className="text-gray-200">{curso?.codigo}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Créditos:</span>
            <span className="text-gray-200">{curso?.creditos}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Grupo:</span>
            <span className="text-gray-200">{grupo}</span>
          </div>
          {horario && (
            <div className="flex justify-between">
              <span className="text-gray-400">Horario:</span>
              <span className="text-gray-200">
                {horario.dia} {horario.horaInicio?.slice(0, 5)} - {horario.horaFin?.slice(0, 5)}
              </span>
            </div>
          )}
        </div>

        {/* Advertencia */}
        <div className="bg-red-900 bg-opacity-30 border border-red-700 rounded-lg p-4 mb-6">
          <p className="text-red-300 text-sm">
            Esta acción no se puede deshacer. El retiro de la materia es permanente.
          </p>
        </div>

        {/* Botones */}
        <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-400 hover:text-gray-300 transition-colors duration-200"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="w-full sm:w-auto px-6 py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors duration-200 flex items-center justify-center"
          >
            Confirmar Retiro
          </button>
        </div>
      </motion.div>
    </div>
  );
};