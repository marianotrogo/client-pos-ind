export default function MiniMenu({ seccionActiva, setSeccionActiva }) {
  const botones = [
    { id: "nuevo", label: "Nuevo Producto" },
    { id: "lista", label: "Lista" },
    { id: "inventario", label: "Inventario" },
    { id: "categorias", label: "Categorías" },
  ];

  return (
    <div
      className="
        grid grid-cols-2 sm:flex sm:flex-wrap gap-2
      "
    >
      {botones.map((btn) => (
        <button
          key={btn.id}
          onClick={() => setSeccionActiva(btn.id)}
          className={`w-full sm:w-auto px-4 py-2 text-sm md:text-base font-medium rounded-lg transition 
            ${
              seccionActiva === btn.id
                ? "bg-blue-500 text-white shadow-md"
                : "bg-gray-100 hover:bg-gray-200 text-gray-800"
            }`}
        >
          {btn.label}
        </button>
      ))}
    </div>
  );
}
