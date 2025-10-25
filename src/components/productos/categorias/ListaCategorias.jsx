import { useEffect, useState } from "react";
import api from "../../../api/axios.js";

export default function ListaCategorias() {
  const [categorias, setCategorias] = useState([]);
  const [search, setSearch] = useState("");

  const fetchCategories = async () => {
    try {
      const res = await api.get("/categorias");
      setCategorias(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const filtered = categorias.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar esta categoría?")) return;
    try {
      await api.delete(`/categories/${id}`);
      fetchCategories();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <input
        placeholder="Buscar categoría..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="border px-2 py-1 mb-2"
      />
      <ul>
        {filtered.map(c => (
          <li key={c.id} className="flex justify-between items-center border p-2 mb-1">
            {c.name}
            <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => handleDelete(c.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
