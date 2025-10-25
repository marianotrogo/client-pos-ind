import { useEffect, useState } from "react";
import api from "../../api/axios.js";
import toast from "react-hot-toast";

export default function SaldosClientes() {
  const [clientes, setClientes] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [historial, setHistorial] = useState({});
  const [loading, setLoading] = useState(true);

  // Estado del modal de pago
  const [showModal, setShowModal] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [montoPago, setMontoPago] = useState("");
  const [metodoPago, setMetodoPago] = useState("");

  // Trae clientes con saldo
  const fetchClientes = async () => {
    try {
      const res = await api.get("/clientes");
      setClientes(res.data.filter((c) => c.balance > 0));
    } catch (err) {
      console.error(err);
      toast.error("Error al cargar clientes");
    } finally {
      setLoading(false);
    }
  };

  // Trae historial de pagos de un cliente
  const fetchHistorial = async (clienteId) => {
    try {
      const res = await api.get(`/clientes/${clienteId}/historial`);
      setHistorial((prev) => ({ ...prev, [clienteId]: res.data }));
    } catch (err) {
      console.error(err);
      toast.error("Error al cargar historial");
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  const toggleExpand = (id) => {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
      if (!historial[id]) fetchHistorial(id);
    }
  };

  // Abrir modal de pago
  const handlePagoClick = (cliente) => {
    setSelectedCliente(cliente);
    setMontoPago("");
    setMetodoPago("");
    setShowModal(true);
  };

  // Registrar pago
  const handleConfirmPago = async () => {
    if (!montoPago || parseFloat(montoPago) <= 0) {
      toast.error("Ingrese un monto válido");
      return;
    }
    if (!metodoPago) {
      toast.error("Seleccione un método de pago");
      return;
    }

    try {
      await api.post(`/clientes/${selectedCliente.id}/pago`, {
        amount: parseFloat(montoPago),
        method: metodoPago,
      });
      toast.success("Pago registrado ✅");
      setShowModal(false);
      fetchClientes();
      fetchHistorial(selectedCliente.id);
    } catch (err) {
      console.error(err);
      toast.error("Error al registrar pago");
    }
  };

  if (loading) return <p>Cargando clientes con saldo...</p>;

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-3">Clientes con Cuenta Corriente</h3>
      {clientes.length === 0 ? (
        <p>No hay clientes con saldo pendiente.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 text-sm">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="border p-2">Nombre</th>
                <th className="border p-2">DNI</th>
                <th className="border p-2">Saldo Pendiente</th>
                <th className="border p-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((c) => (
                <tr key={c.id}>
                  <td
                    className="border p-2 cursor-pointer"
                    onClick={() => toggleExpand(c.id)}
                  >
                    {c.name}
                  </td>
                  <td className="border p-2">{c.dni || "-"}</td>
                  <td className="border p-2 text-right text-red-600 font-semibold">
                    ${c.balance.toFixed(2)}
                  </td>
                  <td className="border p-2">
                    <button
                      className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                      onClick={() => handlePagoClick(c)}
                    >
                      Registrar Pago
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {expandedId && historial[expandedId] && (
            <div className="mt-4 border p-3 rounded bg-gray-50">
              <h4 className="font-semibold mb-2">
                Historial de pagos de {clientes.find((c) => c.id === expandedId).name}
              </h4>
              {historial[expandedId].length === 0 ? (
                <p>No hay pagos registrados.</p>
              ) : (
                <table className="w-full text-sm border-collapse border border-gray-200">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border p-1 text-left">Fecha</th>
                      <th className="border p-1 text-left">Monto</th>
                      <th className="border p-1 text-left">Método</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historial[expandedId].map((p) => (
                      <tr key={p.id}>
                        <td className="border p-1">
                          {new Date(p.createdAt).toLocaleDateString()}
                        </td>
                        <td className="border p-1">${p.amount.toFixed(2)}</td>
                        <td className="border p-1">{p.method || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      )}

      {/* MODAL DE PAGO */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80">
            <h2 className="text-lg font-semibold mb-4">
              Registrar pago de {selectedCliente?.name}
            </h2>

            <label className="block mb-2 text-sm font-medium">Importe a pagar</label>
            <input
              type="number"
              value={montoPago}
              onChange={(e) => setMontoPago(e.target.value)}
              className="w-full border rounded px-2 py-1 mb-4 focus:ring focus:ring-blue-300"
              placeholder="Ingrese el monto"
            />

            <label className="block mb-2 text-sm font-medium">Método de pago</label>
            <div className="flex gap-2 mb-4">
              {["Efectivo", "Transferencia", "Crédito"].map((m) => (
                <button
                  key={m}
                  onClick={() => setMetodoPago(m)}
                  className={`flex-1 py-2 rounded font-medium ${
                    metodoPago === m
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmPago}
                className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
