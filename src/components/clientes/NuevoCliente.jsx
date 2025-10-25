import { useState } from "react";
import api from "../../api/axios.js";

export default function NuevoCliente({ onClienteCreado }) {
  const [form, setForm] = useState({
    name: "",
    dni: "",
    phone: "",
    email: "",
    balance: 0, // cuenta corriente
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/clientes", {
        name: form.name.trim(),
        dni: form.dni || null,
        phone: form.phone || null,
        email: form.email || null,
        balance: parseFloat(form.balance) || 0,
      });

      if (res.status === 201) {
        alert("Cliente creado correctamente ✅");
        setForm({ name: "", dni: "", phone: "", email: "", balance: 0 });
        if (onClienteCreado) onClienteCreado(res.data);
      }
    } catch (err) {
      console.error(err);
      alert("Error al crear cliente. Verifica los datos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-4 p-4 border rounded shadow-sm">
      <h3 className="text-lg font-semibold mb-3">Nuevo Cliente</h3>

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
          placeholder="Saldo inicial (Cuenta Corriente)"
          className="border px-2 py-1 rounded"
          step="0.01"
        />

        <button
          type="submit"
          disabled={loading}
          className={`px-3 py-1 text-white rounded ${
            loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {loading ? "Guardando..." : "Guardar Cliente"}
        </button>
      </form>
    </div>
  );
}
