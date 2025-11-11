import { useState } from "react";
import api from "../../api/axios.js";
import dayjs from "dayjs";

export default function Reportes() {
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ from: "", to: "" });
  const [sales, setSales] = useState([]);
  const [summary, setSummary] = useState({
    totalSales: 0,
    totalItems: 0,
    totalCCA: 0,
    totalEFECTIVO: 0,
    totalDIGITAL: 0,
    totalByPayment: {},
  });

  const [selectedSale, setSelectedSale] = useState(null);

  const fetchSales = async (fromDate, toDate) => {
    if (!fromDate || !toDate) {
      alert("Seleccioná ambas fechas o usá 'Corte del día'.");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const params = {};
      if (fromDate) params.from = dayjs(fromDate).startOf("day").toISOString();
      if (toDate) params.to = dayjs(toDate).endOf("day").toISOString();

      const res = await api.get("/sales/report", {
        params,
        headers: { Authorization: `Bearer ${token}` },
      });

      const salesData = Array.isArray(res.data) ? res.data : res.data.sales || [];
      setSales(salesData);

      let totalSales = 0,
        totalItems = 0,
        totalCCA = 0,
        totalEFECTIVO = 0,
        totalDIGITAL = 0,
        totalByPayment = {};

      salesData.forEach((sale) => {
        totalSales += sale.total;
        totalItems += sale.items.reduce((sum, item) => sum + item.qty, 0);

        sale.payments.forEach((p) => {
          if (!totalByPayment[p.type]) totalByPayment[p.type] = 0;
          totalByPayment[p.type] += p.amount;

          if (p.type === "CCA") totalCCA += p.amount;
          else if (p.type === "EFECTIVO") totalEFECTIVO += p.amount;
          else totalDIGITAL += p.amount;
        });
      });

      setSummary({
        totalSales,
        totalItems,
        totalCCA,
        totalEFECTIVO,
        totalDIGITAL,
        totalByPayment,
      });
    } catch (err) {
      console.error("Error al traer ventas:", err);
      alert("Error al traer ventas");
    }
    setLoading(false);
  };

  const corteDelDia = () => {
    const today = dayjs().format("YYYY-MM-DD");
    setFilters({ from: today, to: today });
    fetchSales(today, today);
  };

  const openModal = (sale) => setSelectedSale(sale);
  const closeModal = () => setSelectedSale(null);

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">📊 Reportes de Ventas</h2>

      {/* Filtros */}
      <div className="mb-4 flex flex-wrap gap-2 items-center">
        <input
          type="date"
          value={filters.from}
          onChange={(e) => setFilters((f) => ({ ...f, from: e.target.value }))}
          className="border px-2 py-1 rounded text-sm"
        />
        <input
          type="date"
          value={filters.to}
          onChange={(e) => setFilters((f) => ({ ...f, to: e.target.value }))}
          className="border px-2 py-1 rounded text-sm"
        />
        <button
          onClick={() => fetchSales(filters.from, filters.to)}
          className="bg-blue-500 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-600 transition"
        >
          Filtrar
        </button>
        <button
          onClick={corteDelDia}
          className="bg-purple-500 text-white px-3 py-1.5 rounded text-sm hover:bg-purple-600 transition"
        >
          Corte del día
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-gray-500">Cargando...</p>
      ) : (
        <>
          {/* Dashboard */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 mb-5">
            {[
              { color: "green", label: "Total Ventas", value: summary.totalSales },
              { color: "blue", label: "Productos Vendidos", value: summary.totalItems },
              { color: "yellow", label: "Total CCA", value: summary.totalCCA },
              { color: "red", label: "Total EFECTIVO", value: summary.totalEFECTIVO },
              { color: "purple", label: "Total Digitales", value: summary.totalDIGITAL },
            ].map((c, i) => (
              <div
                key={i}
                className={`bg-${c.color}-100 p-2 rounded-lg shadow-sm text-center`}
              >
                <span className="font-medium text-xs block text-gray-700">
                  {c.label}
                </span>
                <div className="text-base font-semibold truncate">
                  {typeof c.value === "number" ? `$${c.value.toFixed(2)}` : c.value}
                </div>
              </div>
            ))}
          </div>

          {/* Totales dinámicos */}
          {Object.keys(summary.totalByPayment).length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {Object.entries(summary.totalByPayment).map(([type, amount]) => (
                <div
                  key={type}
                  className="bg-gray-100 p-2 rounded-lg shadow-sm text-center w-32"
                >
                  <span className="font-medium text-xs">{type}</span>
                  <div className="text-base font-semibold">${amount.toFixed(2)}</div>
                </div>
              ))}
            </div>
          )}

          {/* Tabla de ventas */}
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 bg-white text-sm">
              <thead className="bg-gray-100 text-xs">
                <tr>
                  <th className="border px-2 py-1 text-left">Fecha</th>
                  <th className="border px-2 py-1 text-left">N° Venta</th>
                  <th className="border px-2 py-1 text-left">Cliente</th>
                  <th className="border px-2 py-1 text-left">Total</th>
                  <th className="border px-2 py-1 text-left">Pagos</th>
                </tr>
              </thead>
              <tbody>
                {sales.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-3 text-gray-500 text-sm">
                      No hay ventas cargadas.
                    </td>
                  </tr>
                ) : (
                  sales.map((s) => (
                    <tr key={s.id} className="hover:bg-gray-50">
                      <td className="border px-2 py-1">
                        {dayjs(s.createdAt).format("DD/MM/YYYY HH:mm")}
                      </td>
                      <td
                        className="border px-2 py-1 cursor-pointer text-blue-600 hover:underline"
                        onClick={() => openModal(s)}
                      >
                        {s.number}
                      </td>
                      <td className="border px-2 py-1 truncate">
                        {s.client ? s.client.name : "Consumidor Final"}
                      </td>
                      <td className="border px-2 py-1">${s.total.toFixed(2)}</td>
                      <td className="border px-2 py-1">
                        {s.payments.map((p, i) => (
                          <div key={i} className="text-xs">
                            {p.type}: ${p.amount.toFixed(2)}
                          </div>
                        ))}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Modal responsive */}
      {selectedSale && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-4 relative overflow-y-auto max-h-[90vh]">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-lg font-bold"
            >
              ✖
            </button>
            <h3 className="text-lg font-semibold mb-3">
              Productos de la venta #{selectedSale.number}
            </h3>
            <div className="space-y-2">
              {selectedSale.items.map((item, i) => (
                <div key={i} className="flex justify-between border-b pb-1">
                  <div className="truncate">
                    {item.description} {item.size ? `(${item.size})` : ""} - {item.code}
                  </div>
                  <div>
                    {item.qty} x ${item.price.toFixed(2)} = ${item.subtotal.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 text-right font-semibold">
              Total: ${selectedSale.total.toFixed(2)}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
