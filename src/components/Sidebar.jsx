import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const links = [
    { name: "Home", path: "/", icon: "🏠" },
    { name: "Ventas", path: "/ventas", icon: "💰" },
    { name: "Productos", path: "/productos", icon: "📦" },
    { name: "Clientes", path: "/clientes", icon: "👥" },
    { name: "Reportes", path: "/reportes", icon: "📊" },
    { name: "Configuración", path: "/configuracion", icon: "⚙️" },
  ];

  return (
    <aside className="w-60 bg-white h-screen shadow-lg fixed top-0 left-0 flex flex-col p-4">
      <h2 className="text-2xl font-extrabold mb-6 text-blue-600">POS Tienda</h2>
      <nav className="flex flex-col gap-2">
        {links.map((link, idx) => (
          <NavLink
            key={link.name}
            to={link.path}
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-lg text-gray-700 transition-colors duration-200 
              hover:bg-blue-100 hover:text-blue-700 ${
                isActive ? "bg-blue-200 font-semibold text-blue-800" : ""
              }`
            }
          >
            <span className="w-8 h-8 flex items-center justify-center bg-blue-50 rounded-full text-lg">
              {link.icon}
            </span>
            <span className="text-sm font-medium">{link.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Opcional: divider */}
      <div className="mt-auto border-t border-gray-200 pt-4">
        <NavLink
          to="/configuracion"
          className={({ isActive }) =>
            `flex items-center gap-3 p-3 rounded-lg text-gray-700 transition-colors duration-200 
            hover:bg-blue-100 hover:text-blue-700 ${
              isActive ? "bg-blue-200 font-semibold text-blue-800" : ""
            }`
          }
        >
          <span className="w-8 h-8 flex items-center justify-center bg-blue-50 rounded-full text-lg">⚙️</span>
          <span className="text-sm font-medium">Configuración</span>
        </NavLink>
      </div>
    </aside>
  );
}
