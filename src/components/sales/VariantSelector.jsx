export default function VariantSelector({ product, onAdd, type }) {
  if (!product) return null;

  return (
    <table className="w-full text-sm border mt-2">
      <thead className="bg-gray-100">
        <tr>
          <th>Talle</th>
          <th>Stock</th>
          <th>Precio</th>
          <th>Agregar</th>
        </tr>
      </thead>
      <tbody>
        {product.variants.map((v) => (
          <tr key={v.id} className="border-b">
            <td className="py-1 px-2">{v.size}</td>
            <td className="py-1 px-2">{v.stock}</td>
            <td className="py-1 px-2">${product.price?.toFixed(2) ?? "—"}</td>
            <td className="py-1 px-2 text-center">
              <button
                className={`px-2 py-1 rounded text-xs ${
                  type === "in" ? "bg-green-500 text-white" : "bg-red-500 text-white"
                }`}
                onClick={() => onAdd(product, v, type)}
              >
                Agregar
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
