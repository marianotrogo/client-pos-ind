// src/pages/Clientes.jsx
import { useState } from "react";
import MiniMenuClientes from "../components/clientes/MiniMenuClientes.jsx";
import NuevoCliente from "../components/clientes/NuevoCliente.jsx";
import ListaClientes from "../components/clientes/ListaClientes.jsx";
import SaldosClientes from "../components/clientes/SaldosClientes.jsx";

export default function Clientes() {
  const [seccion, setSeccion] = useState("lista");

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 className="text-xl font-semibold text-gray-800">Gestión de Clientes</h2>
      </div>

      {/* Mini menú responsive */}
      <div className="mt-4">
        <MiniMenuClientes onChange={setSeccion} activo={seccion} />
      </div>

      {/* Contenido dinámico */}
      <div className="mt-6 bg-white rounded-lg shadow p-4 sm:p-6 overflow-x-auto">
        {seccion === "nuevo" && <NuevoCliente />}
        {seccion === "lista" && <ListaClientes />}
        {seccion === "saldos" && <SaldosClientes />}
      </div>
    </div>
  );
}
