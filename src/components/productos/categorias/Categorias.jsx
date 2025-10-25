import { useState } from "react";
import ListaCategorias from "./ListaCategorias.jsx";
import NuevoCategoria from "./NuevoCategorias.jsx";

export default function Categorias() {
  const [seccionActiva, setSeccionActiva] = useState("lista");

  const renderSeccion = () => {
    switch (seccionActiva) {
      case "nuevo":
        return <NuevoCategoria />;
      case "lista":
        return <ListaCategorias />;
      default:
        return <ListaCategorias />;
    }
  };

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setSeccionActiva("nuevo")}
          className={`px-4 py-2 rounded ${
            seccionActiva === "nuevo" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          Crear Categoría
        </button>
        <button
          onClick={() => setSeccionActiva("lista")}
          className={`px-4 py-2 rounded ${
            seccionActiva === "lista" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          Lista de Categorías
        </button>
      </div>

      <div>{renderSeccion()}</div>
    </div>
  );
}
