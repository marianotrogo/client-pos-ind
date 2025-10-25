// src/pages/Clientes.jsx
import { useState } from "react";
import MiniMenuClientes from "../components/clientes/MiniMenuClientes.jsx";
import NuevoCliente from "../components/clientes/NuevoCliente.jsx";
import ListaClientes from "../components/clientes/ListaClientes.jsx";
import SaldosClientes from "../components/clientes/SaldosClientes.jsx";

export default function Clientes() {
  const [seccion, setSeccion] = useState("lista");

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-3">Gestión de Clientes</h2>
      <MiniMenuClientes onChange={setSeccion} activo={seccion} />

      <div className="mt-4">
        {seccion === "nuevo" && <NuevoCliente />}
        {seccion === "lista" && <ListaClientes />}
        {seccion === "saldos" && <SaldosClientes />}
      </div>
    </div>
  );
}
