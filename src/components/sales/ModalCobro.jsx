import { useState, useEffect } from "react";

export default function ModalCobro({ total, client, onClose, onConfirm }) {
  const [isMixto, setIsMixto] = useState(false);
  const [isCuentaCorriente, setIsCuentaCorriente] = useState(false);
  const [efectivo, setEfectivo] = useState(0);
  const [digital, setDigital] = useState(0);
  const [metodoDigital, setMetodoDigital] = useState("");
  const [resto, setResto] = useState(total);
  const [error, setError] = useState("");

  const digitalMethods = ["TRANSFERENCIA", "TARJETA"];

  useEffect(() => {
    if (isCuentaCorriente) {
      setEfectivo(0);
      setDigital(0);
      setMetodoDigital("");
      setResto(0);
      setError("");
      return;
    }

    const totalPagado = Number(efectivo) + Number(digital);
    const restante = total - totalPagado;
    if (restante < 0) setError("El total pagado no puede superar el total.");
    else setError("");

    setResto(restante > 0 ? restante : 0);
  }, [efectivo, digital, total, isCuentaCorriente]);

  const handleConfirm = (print = false) => {
    if (isCuentaCorriente) {
      if (!client?.id) {
        setError("Debe seleccionar un cliente para cuenta corriente.");
        return;
      }
      onConfirm(
        { paymentType: "CCA", paymentDetails: [{ type: "CCA", amount: total }] },
        print
      );
      return;
    }

    if (isMixto) {
      const totalPagado = Number(efectivo) + Number(digital);
      if (totalPagado.toFixed(2) !== total.toFixed(2)) {
        setError("El total pagado debe coincidir con el total.");
        return;
      }
      if (!metodoDigital) {
        setError("Seleccione un método digital.");
        return;
      }
      const details = [
        { type: "EFECTIVO", amount: efectivo },
        { type: metodoDigital, amount: digital },
      ];
      onConfirm({ paymentType: "MIXTO", paymentDetails: details }, print);
      return;
    }

    if (efectivo.toFixed(2) === total.toFixed(2)) {
      onConfirm(
        { paymentType: "EFECTIVO", paymentDetails: [{ type: "EFECTIVO", amount: total }] },
        print
      );
      return;
    }

    if (digital.toFixed(2) === total.toFixed(2) && metodoDigital) {
      onConfirm(
        { paymentType: metodoDigital, paymentDetails: [{ type: metodoDigital, amount: total }] },
        print
      );
      return;
    }

    setError("Ingrese un monto válido o seleccione un método de pago.");
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 p-2 sm:p-0">
      <div className="bg-white w-full sm:w-[640px] h-auto sm:h-[520px] rounded-lg shadow-xl flex flex-col p-4 sm:p-6">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-2">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">💰 Cobro de Venta</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-red-500 text-lg">
            ✕
          </button>
        </div>

        {/* Info cliente */}
        <div className="mt-3 border-b pb-2 text-sm sm:text-base">
          <p className="text-gray-700">
            Cliente: <span className="font-medium">{client?.name || "Consumidor Final"}</span>
          </p>
          <p className="text-green-700 font-bold mt-1 text-lg">
            Total a pagar: ${total.toFixed(2)}
          </p>
        </div>

        {/* Opciones */}
        <div className="mt-3 flex justify-between text-sm">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isMixto}
              onChange={() => {
                setIsMixto(!isMixto);
                setIsCuentaCorriente(false);
              }}
            />
            Pago mixto
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isCuentaCorriente}
              onChange={() => {
                setIsCuentaCorriente(!isCuentaCorriente);
                setIsMixto(false);
              }}
            />
            Cuenta corriente
          </label>
        </div>

        {/* Métodos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 flex-1 text-sm">
          <div className="border rounded-md p-3 bg-gray-50">
            <h3 className="font-semibold mb-2">Efectivo</h3>
            <input
              type="number"
              disabled={isCuentaCorriente}
              className="border p-1.5 w-full text-right rounded text-sm"
              value={efectivo}
              onChange={(e) => setEfectivo(Number(e.target.value) || 0)}
            />
          </div>

          <div className="border rounded-md p-3 bg-gray-50">
            <h3 className="font-semibold mb-2">Digital</h3>
            <div className="flex flex-wrap gap-2 mb-2">
              {["TRANSFERENCIA", "TARJETA"].map((m) => (
                <button
                  key={m}
                  disabled={isCuentaCorriente}
                  onClick={() => setMetodoDigital(m)}
                  className={`px-2.5 py-1 rounded border text-xs sm:text-sm transition ${
                    metodoDigital === m
                      ? "bg-blue-500 text-white border-blue-500"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
            <input
              type="number"
              disabled={isCuentaCorriente}
              className="border p-1.5 w-full text-right rounded text-sm"
              value={digital}
              onChange={(e) => setDigital(Number(e.target.value) || 0)}
            />
          </div>
        </div>

        {/* Estado y errores */}
        <div className="mt-2 text-right text-sm">
          {error && <p className="text-red-500 mb-1">{error}</p>}
          {isCuentaCorriente && client?.id && (
            <p className="text-blue-600">
              Se cargará ${total.toFixed(2)} a la cuenta corriente del cliente
            </p>
          )}
          {!isCuentaCorriente && (
            <p className="text-gray-700">
              Resto a pagar:{" "}
              <span
                className={`font-semibold ${
                  resto === 0 ? "text-green-600" : "text-orange-500"
                }`}
              >
                ${resto.toFixed(2)}
              </span>
            </p>
          )}
        </div>

        {/* Botones */}
        <div className="flex flex-wrap justify-end gap-2 mt-4 border-t pt-3">
          <button
            onClick={onClose}
            className="px-3 py-1.5 border rounded text-gray-600 hover:bg-gray-100 text-sm"
          >
            Cancelar
          </button>
          <button
            onClick={() => handleConfirm(false)}
            className="px-3 py-1.5 rounded bg-green-500 text-white hover:bg-green-600 text-sm"
          >
            Cobrar
          </button>
          <button
            onClick={() => handleConfirm(true)}
            className="px-3 py-1.5 rounded bg-blue-500 text-white hover:bg-blue-600 text-sm"
          >
            Cobrar e Imprimir
          </button>
        </div>
      </div>
    </div>
  );
}
