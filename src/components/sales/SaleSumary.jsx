export default function SaleSummary({
  subtotal,
  discount,
  surcharge,
  total,
  onDiscountChange,
  onSurchargeChange,
  products = [],
}) {
  // Formateador de moneda argentina
  const formatCurrency = (value) =>
    value.toLocaleString("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 2,
    });

  // 🧮 Calcular diferencia si hay productos marcados como devolución (cambio)
  const calculateDifference = () => {
    if (!products.length) return 0;

    const returns = products
      .filter((p) => p.isReturn)
      .reduce((acc, p) => acc + p.subtotal, 0);

    const newProducts = products
      .filter((p) => !p.isReturn)
      .reduce((acc, p) => acc + p.subtotal, 0);

    return newProducts - returns;
  };

  const difference = calculateDifference();

  return (
    <div className="border p-4 w-64 space-y-3 bg-white rounded-md shadow-sm">
      <p className="text-sm text-gray-600">Subtotal:</p>
      <p className="font-semibold">{formatCurrency(subtotal)}</p>

      <div>
        <label className="text-sm text-gray-700">Descuento (%):</label>
        <input
          type="number"
          value={discount}
          min="0"
          max="100"
          onChange={(e) => onDiscountChange(parseFloat(e.target.value) || 0)}
          className="border p-1 w-full text-right"
        />
      </div>

      <div>
        <label className="text-sm text-gray-700">Recargo (%):</label>
        <input
          type="number"
          value={surcharge}
          min="0"
          max="100"
          onChange={(e) => onSurchargeChange(parseFloat(e.target.value) || 0)}
          className="border p-1 w-full text-right"
        />
      </div>

      <hr />

      <div className="text-right">
        <p className="text-sm text-gray-600">Total:</p>
        <p className="text-xl font-bold text-green-700">
          {formatCurrency(total)}
        </p>
      </div>

      {/* 🆕 Mostrar diferencia solo si el modo cambio está activo */}
      {difference !== 0 && (
        <div
          className={`text-right border-t pt-2 mt-2 ${
            difference > 0 ? "text-green-600" : "text-red-600"
          }`}
        >
          <p className="text-sm font-medium">
            {difference > 0 ? "A pagar:" : "A favor del cliente:"}
          </p>
          <p className="text-lg font-semibold">
            {formatCurrency(Math.abs(difference))}
          </p>
        </div>
      )}
    </div>
  );
}
