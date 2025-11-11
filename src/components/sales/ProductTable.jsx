export default function ProductsTable({
  products,
  onRemove,
  isExchangeMode = false,
  onToggleReturn,
}) {
  const handleQtyChange = (variantId, qty) => {
    const event = new CustomEvent("updateQty", {
      detail: { variantId, qty },
    });
    window.dispatchEvent(event);
  };

  return (
    <div className="w-full mt-3">
      {/* 🌐 Tabla (desktop/tablet) */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full border text-xs leading-tight">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-1.5 py-1 text-left">Código</th>
              <th className="px-1.5 py-1 text-left">Descripción</th>
              <th className="px-1.5 py-1">Talle</th>
              <th className="px-1.5 py-1">Cant.</th>
              <th className="px-1.5 py-1">Precio</th>
              <th className="px-1.5 py-1">Subtotal</th>
              <th className="px-1.5 py-1"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr
                key={p.variantId}
                className={`${
                  isExchangeMode && p.isReturn ? "bg-red-100" : ""
                }`}
              >
                <td className="px-1.5 py-0.5">{p.code}</td>
                <td className="px-1.5 py-0.5 truncate max-w-[200px]">
                  {p.description}
                </td>
                <td className="px-1.5 py-0.5 text-center">{p.size}</td>
                <td className="px-1.5 py-0.5 text-center">
                  <input
                    type="number"
                    min="1"
                    value={p.qty}
                    onChange={(e) =>
                      handleQtyChange(p.variantId, parseInt(e.target.value))
                    }
                    className="w-12 border p-0.5 text-center rounded text-xs"
                  />
                </td>
                <td className="px-1.5 py-0.5 text-center">
                  ${p.price.toFixed(2)}
                </td>
                <td className="px-1.5 py-0.5 text-center">
                  ${p.subtotal.toFixed(2)}
                </td>
                <td className="px-1 py-0.5 flex items-center justify-end gap-1">
                  {isExchangeMode && (
                    <input
                      type="checkbox"
                      checked={p.isReturn || false}
                      onChange={() => onToggleReturn(p.variantId)}
                      className="accent-red-500 cursor-pointer scale-90"
                      title="Marcar como producto devuelto"
                    />
                  )}
                  <button
                    className="text-red-500 hover:text-red-700 text-sm"
                    onClick={() => onRemove(p.variantId)}
                  >
                    ✕
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 📱 Vista móvil (cards) */}
      <div className="sm:hidden space-y-2">
        {products.map((p) => (
          <div
            key={p.variantId}
            className={`border rounded-md p-2 shadow-sm bg-white ${
              isExchangeMode && p.isReturn ? "bg-red-50 border-red-200" : ""
            }`}
          >
            <div className="flex justify-between items-center">
              <div className="text-[13px]">
                <p className="text-gray-500">{p.code}</p>
                <p className="font-medium text-gray-800 truncate max-w-[200px]">
                  {p.description}
                </p>
                <p className="text-gray-600">Talle: {p.size}</p>
              </div>
              <button
                className="text-red-500 hover:text-red-700 text-base"
                onClick={() => onRemove(p.variantId)}
              >
                ✕
              </button>
            </div>

            <div className="flex justify-between items-center mt-1">
              <div className="flex items-center gap-1">
                <label className="text-xs text-gray-600">Cant.:</label>
                <input
                  type="number"
                  min="1"
                  value={p.qty}
                  onChange={(e) =>
                    handleQtyChange(p.variantId, parseInt(e.target.value))
                  }
                  className="w-12 border p-0.5 text-center rounded text-xs"
                />
              </div>
              <p className="text-xs text-gray-700">
                ${p.price.toFixed(2)} x {p.qty}
              </p>
            </div>

            <div className="flex justify-between items-center mt-1 border-t pt-1">
              <p className="font-semibold text-gray-800 text-xs">
                Subtotal: ${p.subtotal.toFixed(2)}
              </p>
              {isExchangeMode && (
                <label className="flex items-center gap-1 text-xs text-red-600">
                  <input
                    type="checkbox"
                    checked={p.isReturn || false}
                    onChange={() => onToggleReturn(p.variantId)}
                    className="accent-red-500 scale-90"
                  />
                  Devuelto
                </label>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
