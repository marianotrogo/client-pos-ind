import { useState, useEffect } from "react";
import api from "../../api/axios.js";

export default function EditarCliente({ clienteId, onClienteActualizado }) {
  const [form, setForm] = useState({
    name: "",
    dni: "",
    phone: "",
    email: "",
    balance: 0, // agregamos balance para la cuenta corriente
  });

  const [loading, setLoading] = useState(false);
  const [cargandoDatos, setCargandoDatos] = useState(true);

  // Cargar datos del cliente al montar el componente
  useEffect(() => {
    const fetchCliente = async () => {
      try {
        const res = await api.get(`/clientes/${clienteId}`);
        setForm({
          name: res.data.name || "",
          dni: res.data.dni || "",
          phone: res.data.phone || "",
          email: res.data.email || "",
          balance: res.data.balance || 0,
        });
      } catch (error) {
        console.error("Error al cargar cliente:", error);
        alert("No se pudo cargar el cliente.");
      } finally {
        setCargandoDatos(false);
      }
    };

    if (clienteId) fetchCliente();
  }, [clienteId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.put(`/clientes/${clienteId}`, {
        name: form.name.trim(),
        dni: form.dni || null,
        phone: form.phone || null,
        email: form.email || null,
        balance: parseFloat(form.balance) || 0, // enviar balance actualizado
      });

      if (res.status === 200) {
        alert("Cliente actualizado correctamente ✅");
        if (onClienteActualizado) onClienteActualizado();
      }
    } catch (err) {
      console.error(err);
      alert("Error al actualizar el cliente. Verifica los datos.");
    } finally {
      setLoading(false);
    }
  };

  if (cargandoDatos) {
    return <p className="text-center mt-4">Cargando datos del cliente...</p>;
  }

  return (
    <div className="max-w-md mx-auto mt-4 p-4 border rounded shadow-sm">
      <h3 className="text-lg font-semibold mb-3">Editar Cliente</h3>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Nombre del cliente"
          required
          className="border px-2 py-1 rounded"
        />

        <input
          type="text"
          name="dni"
          value={form.dni}
          onChange={handleChange}
          placeholder="DNI (opcional)"
          className="border px-2 py-1 rounded"
        />

        <input
          type="text"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Teléfono (opcional)"
          className="border px-2 py-1 rounded"
        />

        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email (opcional)"
          className="border px-2 py-1 rounded"
        />

        <input
          type="number"
          name="balance"
          value={form.balance}
          onChange={handleChange}
          placeholder="Saldo de cuenta corriente"
          className="border px-2 py-1 rounded"
          step="0.01"
        />

        <button
          type="submit"
          disabled={loading}
          className={`px-3 py-1 text-white rounded ${
            loading ? "bg-gray-400" : "bg-green-500 hover:bg-green-600"
          }`}
        >
          {loading ? "Actualizando..." : "Guardar Cambios"}
        </button>
      </form>
    </div>
  );
}
