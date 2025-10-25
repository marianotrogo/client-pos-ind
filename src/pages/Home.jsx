import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const sections = [
    { name: "Ventas", path: "/ventas", icon: "💰" },
    { name: "Productos", path: "/productos", icon: "📦" },
    { name: "Clientes", path: "/clientes", icon: "👥" },
    { name: "Reportes", path: "/reportes", icon: "🧾" },
    { name: "Configuración", path: "/configuracion", icon: "⚙️" },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-semibold mb-10 text-gray-800">
        Panel Principal
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {sections.map((sec) => (
          <button
            key={sec.name}
            onClick={() => navigate(sec.path)}
            className="flex items-center justify-center w-48 h-24 bg-white shadow-sm hover:shadow-md transition-shadow rounded-lg text-lg font-medium text-gray-700 hover:bg-gray-50"
          >
            <span className="text-2xl mr-2">{sec.icon}</span>
            {sec.name}
          </button>
        ))}
      </div>
    </div>
  );
}
