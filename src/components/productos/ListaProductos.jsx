import { useEffect, useState, useMemo } from "react";
import api from "../../api/axios.js";
import EditarProducto from "./EditarProducto.jsx";

export default function ListaProductos() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [productoEdit, setProductoEdit] = useState(null);

  const fetchProducts = async () => {
    try {
      const res = await api.get("/productos");
      setProductos(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filtered = useMemo(() => {
    return productos
      .filter(
        (p) =>
          p.code.toLowerCase().includes(search.toLowerCase()) ||
          p.description.toLowerCase().includes(search.toLowerCase())
      )
      .sort((a, b) =>
        a.code.localeCompare(b.code, undefined, { numeric: true })
      );
  }, [productos, search]);

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar este producto?")) return;
    try {
      await api.delete(`/productos/${id}`);
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-4">
      {/* 🔍 Barra de búsqueda */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Buscar por código o nombre..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 flex-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
        />
      </div>

      {/* ⏳ Cargando */}
      {loading ? (
        <p className="text-gray-500 text-sm">Cargando productos...</p>
      ) : filtered.length === 0 ? (
        <p className="text-gray-500 text-sm">No se encontraron productos.</p>
      ) : (
        <>
          {/* 💻 Tabla (solo desktop y tablet) */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full border-collapse border border-gray-200 text-sm">
              <thead>
                <tr className="bg-gray-100 text-gray-700">
                  <th className="border p-2 text-left">Código</th>
                  <th className="border p-2 text-left">Descripción</th>
                  <th className="border p-2 text-left">Categoría</th>
                  <th className="border p-2 text-left">Costo</th>
                  <th className="border p-2 text-left">Precio</th>
                  <th className="border p-2 text-left">Stock</th>
                  <th className="border p-2 text-left">Acciones</th>
                </tr>
              </thead>
              <tbody className="text-xs">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="border px-2 py-1">{p.code}</td>
                    <td className="border px-2 py-1">{p.description}</td>
                    <td className="border px-2 py-1">
                      {p.category?.name || "-"}
                    </td>
                    <td className="border px-2 py-1">
                      ${p.cost?.toFixed(2) ?? "-"}
                    </td>
                    <td className="border px-2 py-1">
                      ${p.price.toFixed(2)}
                    </td>
                    <td className="border px-2 py-1">
                      {(p.variants || [])
                        .map((v) => `${v.size}: ${v.stock}`)
                        .join(" | ")}
                    </td>
                    <td className="border px-2 py-1 flex gap-1">
                      <button
                        className="bg-blue-500 text-white px-2 py-0.5 rounded hover:bg-blue-600 text-xs"
                        onClick={() => setProductoEdit(p)}
                      >
                        Editar
                      </button>
                      <button
                        className="bg-red-500 text-white px-2 py-0.5 rounded hover:bg-red-600 text-xs"
                        onClick={() => handleDelete(p.id)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 📱 Vista móvil */}
          <div className="sm:hidden space-y-3">
            {filtered.map((p) => (
              <div
                key={p.id}
                className="border rounded-lg p-3 bg-white shadow-sm"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs text-gray-500">{p.code}</p>
                    <p className="font-medium text-gray-800">
                      {p.description}
                    </p>
                    <p className="text-xs text-gray-600">
                      {p.category?.name || "Sin categoría"}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <button
                      className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600"
                      onClick={() => setProductoEdit(p)}
                    >
                      ✏️
                    </button>
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                      onClick={() => handleDelete(p.id)}
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                <div className="mt-2 text-xs text-gray-700">
                  <p>
                    <span className="font-semibold">Costo:</span> $
                    {p.cost?.toFixed(2) ?? "-"}
                  </p>
                  <p>
                    <span className="font-semibold">Precio:</span> $
                    {p.price.toFixed(2)}
                  </p>
                  <p>
                    <span className="font-semibold">Stock:</span>{" "}
                    {(p.variants || [])
                      .map((v) => `${v.size}: ${v.stock}`)
                      .join(" | ")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {productoEdit && (
        <EditarProducto
          producto={productoEdit}
          onClose={() => {
            setProductoEdit(null);
            fetchProducts();
          }}
        />
      )}
    </div>
  );
}
