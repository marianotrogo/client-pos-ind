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
    if (restante < 0) setError("El total pagado no puede superar el total a pagar.");
    else setError("");

    setResto(restante > 0 ? restante : 0);
  }, [efectivo, digital, total, isCuentaCorriente]);

  const handleConfirm = (print = false) => {
    // ✅ Cuenta corriente
    if (isCuentaCorriente) {
      if (!client?.id) {
        setError("Debe seleccionar un cliente para cobrar a cuenta corriente.");
        return;
      }
      onConfirm({ paymentType: "CCA", paymentDetails: [{ type: "CCA", amount: total }] }, print);
      return;
    }

    // ✅ Pago mixto
    if (isMixto) {
      const totalPagado = Number(efectivo) + Number(digital);
      if (totalPagado.toFixed(2) !== total.toFixed(2)) {
        setError("El total pagado debe coincidir con el total a pagar.");
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

    // ✅ Pago único en efectivo
    if (efectivo.toFixed(2) === total.toFixed(2)) {
      onConfirm({ paymentType: "EFECTIVO", paymentDetails: [{ type: "EFECTIVO", amount: total }] }, print);
      return;
    }

    // ✅ Pago único digital
    if (digital.toFixed(2) === total.toFixed(2) && metodoDigital) {
      onConfirm({ paymentType: metodoDigital, paymentDetails: [{ type: metodoDigital, amount: total }] }, print);
      return;
    }

    setError("Ingrese un monto válido y seleccione un método de pago.");
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white w-[700px] h-[550px] p-6 flex flex-col">
        <div className="flex justify-between items-center border-b pb-2">
          <h2 className="text-xl font-semibold text-gray-800">💰 Cobro de Venta</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-red-500 text-xl">✕</button>
        </div>

        <div className="mt-3 border-b pb-2">
          <p className="text-gray-700 text-sm">
            Cliente: <span className="font-medium">{client?.name || "Consumidor Final"}</span>
          </p>
          <p className="text-lg font-bold text-green-700 mt-1">Total a pagar: ${total.toFixed(2)}</p>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={isMixto}
              onChange={() => { setIsMixto(!isMixto); setIsCuentaCorriente(false); }}
            />
            Pago mixto
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={isCuentaCorriente}
              onChange={() => { setIsCuentaCorriente(!isCuentaCorriente); setIsMixto(false); }}
            />
            Venta a cuenta corriente
          </label>
        </div>

        <div className="grid grid-cols-2 gap-6 mt-5 flex-1">
          <div className="border p-4 bg-gray-50">
            <h3 className="font-semibold mb-3">Pago en efectivo</h3>
            <input
              type="number"
              disabled={isCuentaCorriente}
              className="border p-2 w-full text-right"
              value={efectivo}
              onChange={(e) => setEfectivo(Number(e.target.value) || 0)}
            />
          </div>

          <div className="border p-4 bg-gray-50">
            <h3 className="font-semibold mb-3">Pago digital</h3>
            <div className="flex flex-wrap gap-2 mb-3">
              {digitalMethods.map((m) => (
                <button
                  key={m}
                  disabled={isCuentaCorriente}
                  onClick={() => setMetodoDigital(m)}
                  className={`px-3 py-1 border rounded text-sm ${metodoDigital === m ? "bg-blue-500 text-white" : "hover:bg-gray-100"}`}
                >
                  {m}
                </button>
              ))}
            </div>
            <input
              type="number"
              disabled={isCuentaCorriente}
              className="border p-2 w-full text-right"
              value={digital}
              onChange={(e) => setDigital(Number(e.target.value) || 0)}
            />
          </div>
        </div>

        <div className="mt-3 text-right">
          {error && <p className="text-red-500 text-sm mb-1">{error}</p>}
          {isCuentaCorriente && client?.id && (
            <p className="text-blue-600 text-sm font-medium">
              Se cargará ${total.toFixed(2)} a la cuenta corriente del cliente
            </p>
          )}
          {!isCuentaCorriente && (
            <p className="text-gray-700 text-sm">
              Resto a pagar: <span className={`font-semibold ${resto === 0 ? "text-green-600" : "text-orange-500"}`}>${resto.toFixed(2)}</span>
            </p>
          )}
        </div>

        <div className="flex justify-end gap-3 mt-4 border-t pt-3">
          <button onClick={onClose} className="px-4 py-2 border text-gray-600 hover:bg-gray-100">Cancelar</button>
          <button onClick={() => handleConfirm(false)} className="px-4 py-2 bg-green-500 text-white hover:bg-green-600">Cobrar</button>
          <button onClick={() => handleConfirm(true)} className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600">Cobrar e Imprimir</button>
        </div>
      </div>
    </div>
  );
}
