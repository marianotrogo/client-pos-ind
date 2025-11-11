import { NavLink, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import toast from "react-hot-toast";
import PropTypes from "prop-types";

export default function Sidebar({ open, onClose }) {
  const navigate = useNavigate();

  const links = [
    { name: "Home", path: "/", icon: "🏠" },
    { name: "Ventas", path: "/ventas", icon: "💰" },
    { name: "Productos", path: "/productos", icon: "📦" },
    { name: "Clientes", path: "/clientes", icon: "👥" },
    { name: "Reportes", path: "/reportes", icon: "📊" },
    { name: "Configuración", path: "/configuracion", icon: "⚙️" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Sesión cerrada");
    navigate("/login");
    onClose?.(); // Cierra sidebar si se está en mobile
  };

  return (
    <>
      {/* 🔹 Overlay oscuro (solo visible en mobile cuando está abierto) */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/40 z-30 transition-opacity duration-300 md:hidden ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* 🔸 Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-40 
          flex flex-col p-5 transition-transform duration-300 
          ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* 🔹 Logo / título */}
        <h2 className="text-2xl font-bold mb-8 text-blue-600 tracking-tight">
          POS Tienda
        </h2>

        {/* 🔸 Navegación */}
        <nav className="flex flex-col gap-1 flex-grow">
          {links.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 p-3 rounded-lg text-gray-700 transition-all duration-200 
                hover:bg-blue-50 hover:text-blue-700 
                ${
                  isActive
                    ? "bg-blue-100 text-blue-800 font-semibold shadow-inner"
                    : ""
                }`
              }
            >
              <span className="text-lg">{link.icon}</span>
              <span className="text-sm font-medium">{link.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* 🔻 Cerrar sesión */}
        <div className="border-t border-gray-200 pt-4 mt-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 p-3 rounded-lg text-gray-700 w-full transition-all 
              hover:bg-red-50 hover:text-red-600"
          >
            <LogOut size={18} />
            <span className="text-sm font-medium">Cerrar sesión</span>
          </button>
        </div>
      </aside>
    </>
  );
}

Sidebar.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
