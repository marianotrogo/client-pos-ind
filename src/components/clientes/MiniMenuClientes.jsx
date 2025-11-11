// src/components/clientes/MiniMenuClientes.jsx
export default function MiniMenuClientes({ onChange, activo }) {
  const opciones = [
    { key: "nuevo", label: "Nuevo Cliente" },
    { key: "lista", label: "Listado Clientes" },
    { key: "saldos", label: "Saldos" },
  ];

  return (
    <div className="grid grid-cols-2 sm:flex gap-2 border-b pb-2">
      {opciones.map((op) => (
        <button
          key={op.key}
          onClick={() => onChange(op.key)}
          className={`px-3 py-2 rounded text-sm font-medium transition-colors
            ${activo === op.key
              ? "bg-blue-500 text-white shadow-md"
              : "bg-gray-100 hover:bg-gray-200 text-gray-800 border"
            }`}
        >
          {op.label}
        </button>
      ))}
    </div>
  );
}
