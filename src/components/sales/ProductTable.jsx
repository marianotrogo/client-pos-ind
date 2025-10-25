export default function ProductsTable({ products, onRemove, isExchangeMode = false, onToggleReturn }) {
  const handleQtyChange = (variantId, qty) => {
    const event = new CustomEvent("updateQty", {
      detail: { variantId, qty },
    });
    window.dispatchEvent(event);
  };

  return (
    <table className="w-full border mt-3 text-sm">
      <thead className="bg-gray-100">
        <tr>
          <th>Código</th>
          <th>Descripción</th>
          <th>Talle</th>
          <th>Cant.</th>
          <th>Precio</th>
          <th>Subtotal</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {products.map((p) => (
          <tr
            key={p.variantId}
            className={`${isExchangeMode && p.isReturn ? "bg-red-100" : ""}`}
          >
            <td>{p.code}</td>
            <td>{p.description}</td>
            <td>{p.size}</td>
            <td>
              <input
                type="number"
                min="1"
                value={p.qty}
                onChange={(e) =>
                  handleQtyChange(p.variantId, parseInt(e.target.value))
                }
                className="w-16 border p-1 text-center"
              />
            </td>
            <td>${p.price.toFixed(2)}</td>
            <td>${p.subtotal.toFixed(2)}</td>
            <td className="flex items-center gap-1 justify-end">
              {isExchangeMode && (
                <input
                  type="checkbox"
                  checked={p.isReturn || false}
                  onChange={() => onToggleReturn(p.variantId)}
                  className="accent-red-500 cursor-pointer"
                  title="Marcar como producto devuelto"
                />
              )}
              <button
                className="text-red-500 hover:text-red-700"
                onClick={() => onRemove(p.variantId)}
              >
                ✕
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
