import { useEffect, useState } from "react";
import api from "../../api/axios.js";

export default function Reportes() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    from: "",
    to: "",
    userId: "",
    clientId: "",
    status: "",
  });
  const [summary, setSummary] = useState({ totalSales: 0, totalItems: 0 });

  const fetchSales = async () => {
    setLoading(true);
    try {
      const params = { ...filters };
      const res = await api.get("/sales/report", { params });
      setSales(res.data.sales);
      setSummary({ totalSales: res.data.totalSales, totalItems: res.data.totalItems });
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => { fetchSales(); }, []);

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Reportes de Ventas</h2>

      {/* 🔹 Filtros */}
      <div className="mb-4 flex flex-wrap gap-2">
        <input type="date" value={filters.from} onChange={e => setFilters(f => ({ ...f, from: e.target.value }))} className="border px-2 py-1 rounded" />
        <input type="date" value={filters.to} onChange={e => setFilters(f => ({ ...f, to: e.target.value }))} className="border px-2 py-1 rounded" />
        <input type="text" placeholder="Usuario ID" value={filters.userId} onChange={e => setFilters(f => ({ ...f, userId: e.target.value }))} className="border px-2 py-1 rounded" />
        <input type="text" placeholder="Cliente ID" value={filters.clientId} onChange={e => setFilters(f => ({ ...f, clientId: e.target.value }))} className="border px-2 py-1 rounded" />
        <select value={filters.status} onChange={e => setFilters(f => ({ ...f, status: e.target.value }))} className="border px-2 py-1 rounded">
          <option value="">Todos</option>
          <option value="COMPLETED">Completadas</option>
          <option value="PENDING">Pendientes</option>
          <option value="CANCELLED">Canceladas</option>
        </select>
        <button onClick={fetchSales} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">Filtrar</button>
      </div>

      {/* 🔹 Resumen */}
      <div className="mb-4">
        <span className="mr-4 font-semibold">Total Ventas: ${summary.totalSales.toFixed(2)}</span>
        <span className="font-semibold">Total Items: {summary.totalItems}</span>
      </div>

      {/* 🔹 Tabla */}
      {loading ? <p>Cargando...</p> :
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-200 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2 text-left">#</th>
              <th className="border p-2 text-left">Fecha</th>
              <th className="border p-2 text-left">Usuario</th>
              <th className="border p-2 text-left">Cliente</th>
              <th className="border p-2 text-left">Total</th>
              <th className="border p-2 text-left">Estado</th>
              <th className="border p-2 text-left">Pago</th>
            </tr>
          </thead>
          <tbody className="text-xs">
            {sales.map(s => (
              <tr key={s.id} className="hover:bg-gray-50">
                <td className="border px-2 py-1">{s.number}</td>
                <td className="border px-2 py-1">{new Date(s.createdAt).toLocaleString()}</td>
                <td className="border px-2 py-1">{s.user.name}</td>
                <td className="border px-2 py-1">{s.client?.name || "-"}</td>
                <td className="border px-2 py-1">${s.total.toFixed(2)}</td>
                <td className="border px-2 py-1">{s.status}</td>
                <td className="border px-2 py-1">{s.paymentType}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>}
    </div>
  );
}
