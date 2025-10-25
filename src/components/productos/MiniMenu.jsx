export default function MiniMenu({ seccionActiva, setSeccionActiva }) {
    const botones = [
        { id: "nuevo", label: "Nuevo Producto" },
        { id: "lista", label: "Lista" },
        { id: "inventario", label: "Inventario" },
        { id: "categorias", label: "Categorias" },
    ];

    return (
        <div className="flex gap-2">
            {botones.map((btn) => (
                <button
                    key={btn.id}
                    onClick={() => setSeccionActiva(btn.id)}
                    className={`px-4 py-2 rounded ${seccionActiva === btn.id ? "bg-blue-500 text-white" : "bg-gray-200"
                        }`}
                >
                    {btn.label}
                </button>
            ))}
        </div>
    );
}
