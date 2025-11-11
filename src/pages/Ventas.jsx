import { useState, useEffect } from "react";
import axios from "../api/axios.js";
import ClientSearch from "../components/sales/ClientSearch";
import ProductsTable from "../components/sales/ProductTable";
import SaleSummary from "../components/sales/SaleSumary";
import ExchangeButton from "../components/sales/ExchangeButton";
import ProductModal from "../components/sales/ProductModal";
import ModalCobro from "../components/sales/ModalCobro.jsx";
import { printTicket } from "../utils/printTicket.js";
import toast from "react-hot-toast";

export default function SalesPage() {
  const [client, setClient] = useState(null);
  const [products, setProducts] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [surcharge, setSurcharge] = useState(0);
  const [total, setTotal] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [userId] = useState(1);
  const [isExchangeMode, setIsExchangeMode] = useState(false);
  const [showCobroModal, setShowCobroModal] = useState(false);

  useEffect(() => {
    const totalIngresos = products
      .filter((p) => p.isReturn)
      .reduce((acc, p) => acc + p.price * p.qty, 0);

    const totalEgresos = products
      .filter((p) => !p.isReturn)
      .reduce((acc, p) => acc + p.price * p.qty, 0);

    const sub = totalEgresos - totalIngresos;
    const discountAmount = sub * (discount / 100);
    const surchargeAmount = sub * (surcharge / 100);
    const totalCalculado = sub - discountAmount + surchargeAmount;

    setSubtotal(sub);
    setTotal(totalCalculado);
  }, [products, discount, surcharge]);

  useEffect(() => {
    const handleUpdateQty = (e) => {
      const { variantId, qty } = e.detail;
      setProducts((prev) =>
        prev.map((p) =>
          p.variantId === variantId
            ? { ...p, qty, subtotal: p.price * qty }
            : p
        )
      );
    };
    window.addEventListener("updateQty", handleUpdateQty);
    return () => window.removeEventListener("updateQty", handleUpdateQty);
  }, []);

  const handleAddProduct = (product) => {
    const exists = products.find((p) => p.variantId === product.variantId);
    if (exists) {
      const updated = products.map((p) =>
        p.variantId === product.variantId
          ? { ...p, qty: p.qty + 1, subtotal: (p.qty + 1) * p.price }
          : p
      );
      setProducts(updated);
    } else {
      setProducts([...products, { ...product, subtotal: product.price }]);
    }
  };

  const handleRemoveProduct = (variantId) => {
    setProducts(products.filter((p) => p.variantId !== variantId));
  };

  const handleToggleReturn = (variantId) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.variantId === variantId) {
          const newIsReturn = !p.isReturn;
          return { ...p, isReturn: newIsReturn };
        }
        return p;
      })
    );
  };

  const handleConfirmSale = async (paymentData, print = false) => {
    const isExchange = products.some((p) => p.isReturn);
    if (products.length === 0) {
      toast.error("Agrega productos antes de confirmar la venta");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Usuario no autenticado");
      return;
    }

    const itemsPayload = products.map((p) => ({
      productId: Number(p.id),
      variantId: Number(p.variantId),
      code: p.code,
      description: p.description,
      size: p.size,
      price: p.price,
      qty: p.qty,
      subtotal: p.subtotal,
      isReturn: p.isReturn || false,
    }));

    const payload = {
      clientId: client?.id ? Number(client.id) : null,
      userId: Number(userId),
      subtotal,
      discount,
      surcharge,
      total,
      paymentType: paymentData.paymentType,
      paymentDetails: paymentData.paymentDetails || [],
      items: itemsPayload,
      isExchange,
    };

    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.post("/sales", payload, config);

      if (print) {
        printTicket({ ...res.data.sale, isExchange });
      }

      toast.success(isExchange ? "🔄 Cambio registrado correctamente" : "✅ Venta registrada correctamente");

      // Reset
      setClient(null);
      setProducts([]);
      setDiscount(0);
      setSurcharge(0);
      setSubtotal(0);
      setTotal(0);
      setShowCobroModal(false);
    } catch (error) {
      console.error("Error creando venta:", error);
      toast.error(error.response?.data?.message || "Error al crear la venta");
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-5 bg-gray-50 min-h-screen">
      <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 border-b pb-2">
        💵 Nueva Venta
      </h1>

      {/* 🔹 Controles superiores */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-600 transition text-sm sm:text-base"
        >
          🔍 Buscar Producto
        </button>

        <div className="flex-1 w-full">
          <ClientSearch onSelect={setClient} />
          {client && (
            <p className="text-xs text-gray-600 mt-1 text-center sm:text-left">
              Cliente: <span className="font-medium">{client.name}</span>
            </p>
          )}
        </div>

        <div className="flex justify-center sm:justify-end">
          <ExchangeButton
            isExchangeMode={isExchangeMode}
            onToggle={setIsExchangeMode}
          />
        </div>
      </div>

      {/* 🔹 Cuerpo principal (tabla + resumen) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mt-4">
        {/* Tabla de productos */}
        <div className="lg:col-span-2 bg-white border rounded-md shadow-sm p-3 overflow-x-auto">
          <ProductsTable
            products={products}
            onRemove={handleRemoveProduct}
            onToggleReturn={handleToggleReturn}
            isExchangeMode={isExchangeMode}
          />
        </div>

        {/* Resumen de venta */}
        <div className="bg-white border rounded-md shadow-sm p-3">
          <SaleSummary
            subtotal={subtotal}
            discount={discount}
            surcharge={surcharge}
            total={total}
            onDiscountChange={setDiscount}
            onSurchargeChange={setSurcharge}
            products={products}
          />
        </div>
      </div>

      {/* Botón de confirmación */}
      <div className="flex justify-center sm:justify-end">
        <button
          className="bg-green-500 text-white px-6 py-2 rounded-md shadow-sm hover:bg-green-600 transition text-sm sm:text-base w-full sm:w-auto"
          onClick={() => setShowCobroModal(true)}
        >
          ✅ Confirmar Venta
        </button>
      </div>

      {showCobroModal && (
        <ModalCobro
          total={total}
          client={client}
          onClose={() => setShowCobroModal(false)}
          onConfirm={(paymentData, print) => handleConfirmSale(paymentData, print)}
        />
      )}

      {showModal && (
        <ProductModal
          onClose={() => setShowModal(false)}
          onAddProduct={handleAddProduct}
        />
      )}
    </div>
  );
}
