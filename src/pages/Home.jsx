import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Home() {
  const navigate = useNavigate();

  const sections = [
    { name: "Ventas", path: "/ventas", icon: "💰", color: "from-green-400 to-emerald-500" },
    { name: "Productos", path: "/productos", icon: "📦", color: "from-blue-400 to-blue-600" },
    { name: "Clientes", path: "/clientes", icon: "👥", color: "from-purple-400 to-indigo-500" },
    { name: "Reportes", path: "/reportes", icon: "📊", color: "from-amber-400 to-orange-500" },
    { name: "Configuración", path: "/configuracion", icon: "⚙️", color: "from-gray-400 to-gray-600" },
  ];

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-50 py-10 px-4 md:px-8">
      {/* 🔹 Título */}
      <h1 className="text-2xl md:text-3xl font-bold mb-8 text-gray-800 text-center">
        Panel Principal
      </h1>

      {/* 🔸 Grid adaptable */}
      <div
        className="
          grid 
          grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 
          gap-4 w-full max-w-5xl
        "
      >
        {sections.map((sec) => (
          <motion.button
            key={sec.name}
            onClick={() => navigate(sec.path)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className={`
              flex flex-col items-center justify-center 
              py-6 rounded-2xl text-white font-semibold shadow-md 
              bg-gradient-to-br ${sec.color} 
              hover:shadow-lg active:shadow-inner 
              focus:outline-none select-none
            `}
          >
            <span className="text-4xl mb-2 drop-shadow-sm">{sec.icon}</span>
            <span className="text-sm sm:text-base">{sec.name}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
