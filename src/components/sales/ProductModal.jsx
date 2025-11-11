import { useState, useEffect, useRef } from "react";
import axios from "../../api/axios.js";

export default function ProductModal({ onClose, onAddProduct }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // 🔍 Buscar productos
  const searchProducts = async () => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get(`/productos/search?query=${query}`);
      setResults(res.data || []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(searchProducts, 400);
    return () => clearTimeout(timeout);
  }, [query]);

  // 🧹 Limpiar campo y resultados
  const clearSearch = () => {
    setQuery("");
    setResults([]);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div
        className="bg-white w-full max-w-[900px] h-[90vh] sm:h-[550px] rounded-lg shadow-2xl flex flex-col overflow-hidden"
      >
        {/* 🔹 Header */}
        <div className="flex justify-between items-center bg-gray-100 border-b px-4 sm:px-5 py-3 sm:py-4">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 tracking-wide">
            Buscar Producto
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 transition text-xl sm:text-2xl"
          >
            ✖
          </button>
        </div>

        {/* 🔹 Input de búsqueda */}
        <div className="flex flex-col sm:flex-row gap-3 p-4 border-b bg-white">
          <input
            ref={inputRef}
            type="text"
            placeholder="Buscar por código o nombre..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 sm:px-4 py-2 text-base focus:ring-1 focus:ring-blue-400 focus:outline-none"
          />
          <button
            onClick={clearSearch}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-2 rounded-md text-sm transition w-full sm:w-auto"
          >
            Limpiar
          </button>
        </div>

        {/* 🔹 Resultados */}
        <div className="flex-1 overflow-y-auto px-3 sm:px-5 py-3 sm:py-4">
          {loading ? (
            <p className="text-center text-gray-500 mt-6 text-base">
              Buscando...
            </p>
          ) : results.length === 0 ? (
            <p className="text-center text-gray-400 mt-6 text-base">
              Sin coincidencias
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm sm:text-[15px] border-collapse">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr className="text-left text-gray-600 border-b font-medium">
                    <th className="py-2 sm:py-3 px-2 sm:px-3">Código</th>
                    <th className="py-2 sm:py-3 px-2 sm:px-3">Descripción</th>
                    <th className="py-2 sm:py-3 px-2 sm:px-3">Talle</th>
                    <th className="py-2 sm:py-3 px-2 sm:px-3">Stock</th>
                    <th className="py-2 sm:py-3 px-2 sm:px-3">Precio</th>
                    <th className="py-2 sm:py-3 px-2 sm:px-3 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((prod) =>
                    prod.variants.map((v) => {
                      const noStock = v.stock === 0;
                      return (
                        <tr
                          key={v.id}
                          className={`border-b transition ${
                            noStock
                              ? "bg-gray-100 opacity-60"
                              : "hover:bg-blue-50"
                          }`}
                        >
                          <td className="py-2 sm:py-3 px-2 sm:px-3">{prod.code}</td>
                          <td className="py-2 sm:py-3 px-2 sm:px-3">{prod.description}</td>
                          <td className="py-2 sm:py-3 px-2 sm:px-3">{v.size}</td>
                          <td className="py-2 sm:py-3 px-2 sm:px-3">
                            {noStock ? (
                              <span className="bg-red-500 text-white px-1 rounded text-xs">
                                0
                              </span>
                            ) : (
                              v.stock
                            )}
                          </td>
                          <td className="py-2 sm:py-3 px-2 sm:px-3 font-semibold text-gray-800">
                            ${prod.price?.toFixed(2) ?? "—"}
                          </td>
                          <td className="py-2 sm:py-3 px-2 sm:px-3 text-right">
                            <button
                              onClick={() =>
                                !noStock &&
                                onAddProduct({
                                  id: prod.id,
                                  variantId: v.id,
                                  code: prod.code,
                                  description: prod.description,
                                  size: v.size,
                                  price: prod.price ?? 0,
                                  qty: 1,
                                  subtotal: prod.price ?? 0,
                                })
                              }
                              disabled={noStock}
                              className={`px-3 sm:px-4 py-1.5 rounded-md text-sm text-white transition ${
                                noStock
                                  ? "bg-gray-400 cursor-not-allowed"
                                  : "bg-blue-500 hover:bg-blue-600"
                              }`}
                            >
                              {noStock ? "Sin stock" : "Agregar"}
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
