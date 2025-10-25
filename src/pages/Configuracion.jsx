import { useState, useEffect } from "react";
import axios from "../api/axios.js";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    businessName: "",
    address: "",
    phone: "",
    cuit: "",
    ivaCondition: "",
    headerText: "",
    footerText: "",
    logoUrl: "",
    qrLink: "",
  });

  const [loading, setLoading] = useState(false);

  // 🔹 Cargar configuración al montar
  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const res = await axios.get("/settings");
        if (res.data) setSettings(res.data);
      } catch (err) {
        console.error(err);
        toast.error("No se pudo cargar la configuración");
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("/settings", settings);
      setSettings(res.data);
      toast.success("Configuración guardada correctamente");
    } catch (err) {
      console.error(err);
      toast.error("Error al guardar configuración");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">⚙️ Configuración del Negocio</h1>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow-md">
        <div className="grid grid-cols-2 gap-4">
          <label className="flex flex-col">
            Nombre del negocio
            <input
              type="text"
              name="businessName"
              value={settings.businessName}
              onChange={handleChange}
              className="border p-2 rounded"
              required
            />
          </label>

          <label className="flex flex-col">
            Dirección
            <input
              type="text"
              name="address"
              value={settings.address || ""}
              onChange={handleChange}
              className="border p-2 rounded"
            />
          </label>

          <label className="flex flex-col">
            Teléfono
            <input
              type="text"
              name="phone"
              value={settings.phone || ""}
              onChange={handleChange}
              className="border p-2 rounded"
            />
          </label>

          <label className="flex flex-col">
            CUIT
            <input
              type="text"
              name="cuit"
              value={settings.cuit || ""}
              onChange={handleChange}
              className="border p-2 rounded"
            />
          </label>

          <label className="flex flex-col">
            Condición IVA
            <input
              type="text"
              name="ivaCondition"
              value={settings.ivaCondition || ""}
              onChange={handleChange}
              className="border p-2 rounded"
            />
          </label>

          <label className="flex flex-col">
            URL del logo
            <input
              type="text"
              name="logoUrl"
              value={settings.logoUrl || ""}
              onChange={handleChange}
              className="border p-2 rounded"
            />
          </label>

          <label className="flex flex-col col-span-2">
            Texto Header (Ticket)
            <textarea
              name="headerText"
              value={settings.headerText || ""}
              onChange={handleChange}
              className="border p-2 rounded"
            />
          </label>

          <label className="flex flex-col col-span-2">
            Texto Footer (Ticket)
            <textarea
              name="footerText"
              value={settings.footerText || ""}
              onChange={handleChange}
              className="border p-2 rounded"
            />
          </label>

          <label className="flex flex-col col-span-2">
            Link QR
            <input
              type="text"
              name="qrLink"
              value={settings.qrLink || ""}
              onChange={handleChange}
              className="border p-2 rounded"
            />
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          {loading ? "Guardando..." : "Guardar configuración"}
        </button>
      </form>
    </div>
  );
}
