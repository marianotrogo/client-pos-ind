// src/components/clientes/MiniMenuClientes.jsx
export default function MiniMenuClientes({ onChange, activo }) {
  const opciones = [
    { key: "nuevo", label: "Nuevo Cliente" },
    { key: "lista", label: "Listado Clientes" },
    { key: "saldos", label: "Saldos" },
  ];

  return (
    <div className="flex gap-2 border-b pb-2">
      {opciones.map((op) => (
        <button
          key={op.key}
          onClick={() => onChange(op.key)}
          className={`px-3 py-1 border rounded text-sm ${
            activo === op.key ? "bg-blue-500 text-white" : "bg-white"
          }`}
        >
          {op.label}
        </button>
      ))}
    </div>
  );
}
