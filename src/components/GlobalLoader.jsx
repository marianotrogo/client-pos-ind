import { motion } from "framer-motion";

export default function GlobalLoader({ serverError = false }) {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-50 text-center p-4">
      {/* Logo o nombre del sistema */}
      <motion.h1
        className="text-2xl font-semibold text-blue-600 mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
      >
        Iniciando sistema...
      </motion.h1>

      {/* Spinner */}
      <motion.div
        className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mb-3"
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1 }}
      />

      {serverError && (
        <p className="text-gray-600 text-sm mt-2 animate-pulse">
          Servidor no disponible, reintentando conexión...
        </p>
      )}
    </div>
  );
}
