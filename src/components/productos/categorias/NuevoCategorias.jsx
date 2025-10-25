import { useState } from "react";
import api from "../../../api/axios.js";

export default function NuevoCategoria() {
  const [name, setName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/categorias", { name });
      alert("Categoría creada");
      setName("");
    } catch (err) {
      console.error(err);
      alert("Error al crear categoría");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 max-w-sm">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nombre de la categoría"
        className="border px-2 py-1"
      />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Guardar Categoría
      </button>
    </form>
  );
}
