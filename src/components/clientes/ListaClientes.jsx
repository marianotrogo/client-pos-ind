import { useEffect, useState } from "react";
import api from "../../api/axios.js";
import EditarCliente from "./EditarClientes.jsx";
import toast from "react-hot-toast";

export default function ListaClientes() {
  const [clientes, setClientes] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [clienteEdit, setClienteEdit] = useState(null);

  const fetchClientes = async () => {
    try {
      const res = await api.get("/clientes");
      setClientes(res.data);
    } catch (err) {
      console.error("Error al obtener clientes:", err);
      toast.error("Error al cargar los clientes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar este cliente?")) return;
    try {
      await api.delete(`/clientes/${id}`);
      toast.success("Cliente eliminado correctamente 🗑️");
      fetchClientes();
    } catch (err) {
      console.error(err);
      toast.error("Error al eliminar cliente");
    }
  };

  const filtered = clientes
    .filter((c) =>
      [c.name, c.dni, c.phone]
        .filter(Boolean)
        .some((v) => v.toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="p-4">
      {/* 🔍 Buscador */}
      <div className="mb-4 flex items-center gap-2">
        <input
          type="text"
          placeholder="Buscar por nombre, DNI o teléfono..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded w-full sm:max-w-md focus:ring-2 focus:ring-blue-400 outline-none"
        />
      </div>

      {/* 💾 Contenido */}
      {loading ? (
        <p>Cargando clientes...</p>
      ) : filtered.length === 0 ? (
        <p>No hay clientes que coincidan con la búsqueda.</p>
      ) : (
        <>
          {/* 💻 Tabla en escritorio */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 text-sm">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="border p-2">Nombre</th>
                  <th className="border p-2">DNI</th>
                  <th className="border p-2">Teléfono</th>
                  <th className="border p-2">Email</th>
                  <th className="border p-2">Saldo</th>
                  <th className="border p-2">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="border p-2">{c.name}</td>
                    <td className="border p-2">{c.dni || "-"}</td>
                    <td className="border p-2">{c.phone || "-"}</td>
                    <td className="border p-2">{c.email || "-"}</td>
                    <td
                      className={`border p-2 text-right ${
                        c.balance > 0
                          ? "text-red-600 font-semibold"
                          : "text-green-600"
                      }`}
                    >
                      ${c.balance.toFixed(2)}
                    </td>
                    <td className="border p-2 flex gap-2">
                      <button
                        className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition text-xs"
                        onClick={() => setClienteEdit(c)}
                      >
                        Editar
                      </button>
                      <button
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition text-xs"
                        onClick={() => handleDelete(c.id)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 📱 Versión mobile en cards */}
          <div className="sm:hidden grid grid-cols-1 gap-3">
            {filtered.map((c) => (
              <div
                key={c.id}
                className="border rounded-lg p-3 shadow-sm bg-white flex flex-col gap-1"
              >
                <p className="font-semibold text-gray-800">{c.name}</p>
                <p className="text-sm text-gray-600">
                  <strong>DNI:</strong> {c.dni || "-"}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Tel:</strong> {c.phone || "-"}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Email:</strong> {c.email || "-"}
                </p>
                <p
                  className={`text-sm font-semibold ${
                    c.balance > 0 ? "text-red-600" : "text-green-600"
                  }`}
                >
                  Saldo: ${c.balance.toFixed(2)}
                </p>
                <div className="flex gap-2 mt-2">
                  <button
                    className="flex-1 bg-blue-500 text-white py-1 rounded text-sm hover:bg-blue-600"
                    onClick={() => setClienteEdit(c)}
                  >
                    Editar
                  </button>
                  <button
                    className="flex-1 bg-red-500 text-white py-1 rounded text-sm hover:bg-red-600"
                    onClick={() => handleDelete(c.id)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* 🧩 Modal de edición */}
      {clienteEdit && (
        <EditarCliente
          clienteId={clienteEdit.id}
          onClienteActualizado={() => {
            setClienteEdit(null);
            fetchClientes();
          }}
        />
      )}
    </div>
  );
}
