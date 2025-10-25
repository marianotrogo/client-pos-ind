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
  const [isExchangeMode, setIsExchangeMode] = useState(false); // 🆕 modo cambio
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
          // si es devolución, el subtotal se mantiene igual (precio * cantidad)
          // pero el cálculo general lo trata como ingreso
          return { ...p, isReturn: newIsReturn };
        }
        return p;
      })
    );
  };


  const handleConfirmSale = async (paymentData, print = false) => {
    const isExchange = products.some((p) => p.isReturn);


    if (products.length === 0) {
      toast.error("Agrega productos antes de confirmar la venta", { duration: 4000 });
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Usuario no autenticado", { duration: 4000 });
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
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const res = await axios.post("/sales", payload, config);

      if (print) {
        printTicket({
          ...res.data.sale,
          isExchange
        });
      }

      if (isExchange) {
        toast.custom(
          (t) => (
            <div
              className={`${t.visible ? 'animate-enter' : 'animate-leave'
                } max-w-xs w-full bg-blue-500 text-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
            >
              <div className="flex-1 p-4">
                <p className="text-sm font-bold">🔄 Cambio registrado correctamente</p>
              </div>
            </div>
          ),
          { duration: 4000 }
        );
      } else {
        toast.success("✅ Venta registrada correctamente", { duration: 4000 });
      }

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
      toast.error(error.response?.data?.message || error.message || "Error al crear la venta");
    }
  };




  return (
    <div className="p-6 space-y-5 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold text-gray-800 border-b pb-2">
        💵 Nueva Venta
      </h1>

      <div className="flex justify-between items-center gap-6">
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-600 transition"
        >
          🔍 Buscar Producto
        </button>

        <div className="flex-1">
          <ClientSearch onSelect={setClient} />
          {client && (
            <p className="text-xs text-gray-600 mt-1">
              Cliente seleccionado:{" "}
              <span className="font-medium">{client.name}</span>
            </p>
          )}
        </div>

        {/*  Checkbox de modo cambio */}
        <ExchangeButton
          isExchangeMode={isExchangeMode}
          onToggle={setIsExchangeMode}
        />
      </div>

      <div className="grid grid-cols-3 gap-6 mt-4">
        <div className="col-span-2 bg-white border rounded-md shadow-sm p-3">
          <ProductsTable
            products={products}
            onRemove={handleRemoveProduct}
            onToggleReturn={handleToggleReturn}
            isExchangeMode={isExchangeMode}
          />
        </div>

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

      <div className="text-right">
        <button
          className="bg-green-500 text-white px-6 py-2 rounded-md shadow-sm hover:bg-green-600 transition"
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
