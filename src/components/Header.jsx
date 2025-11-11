import { Menu } from "lucide-react"; // ✅ Ícono moderno
import PropTypes from "prop-types";

export default function Header({ title, onToggleSidebar }) {
  return (
    <header
      className="
        bg-white shadow-md h-16 flex items-center justify-between 
        px-4 sm:px-6 fixed top-0 left-0 right-0 z-20 
        md:ml-64 transition-all duration-300
      "
    >
      
      <button
        onClick={onToggleSidebar}
        className="md:hidden p-2 rounded-lg hover:bg-gray-100 active:bg-gray-200"
      >
        <Menu className="w-6 h-6 text-gray-700" />
      </button>

     
      <h1 className="text-lg sm:text-xl font-semibold text-gray-800 truncate">
        {title}
      </h1>

      
      <div className="w-6" /> 
    </header>
  );
}

Header.propTypes = {
  title: PropTypes.string.isRequired,
  onToggleSidebar: PropTypes.func, // callback del botón
};
