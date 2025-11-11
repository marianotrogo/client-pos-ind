import { useState } from "react";
import MiniMenu from "../components/productos/MiniMenu.jsx";
import NuevoProducto from "../components/productos/NuevoProducto.jsx";
import ListaProductos from "../components/productos/ListaProductos.jsx";
import Inventario from "../components/productos/Inventario.jsx";
import Categorias from "../components/productos/categorias/Categorias.jsx";

export default function Productos() {
  const [seccionActiva, setSeccionActiva] = useState("lista");

  const renderSeccion = () => {
    switch (seccionActiva) {
      case "nuevo":
        return <NuevoProducto />;
      case "lista":
        return <ListaProductos />;
      case "inventario":
        return <Inventario />;
      case "categorias":
        return <Categorias />;
      default:
        return <ListaProductos />;
    }
  };

  return (
    <div className="p-4 md:p-6">
      {/* 🏷️ Título */}
      <h1 className="text-xl md:text-2xl font-bold mb-4 text-gray-800">
        Productos
      </h1>

      {/* 📱 Mini menú adaptado */}
      <div className="overflow-x-auto -mx-2 px-2">
        <div className="flex sm:justify-start gap-2 sm:gap-4 w-max sm:w-auto">
          <MiniMenu
            seccionActiva={seccionActiva}
            setSeccionActiva={setSeccionActiva}
          />
        </div>
      </div>

      {/* 📦 Contenido */}
      <div className="mt-4">{renderSeccion()}</div>
    </div>
  );
}
