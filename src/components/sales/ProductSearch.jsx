import { useState } from "react";
import axios from "../../api/axios.js";

export default function ProductSearch({ onAddProduct }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleSearch = async (e) => {
    const value = e.target.value;
    setQuery(value);
    if (value.length < 2) return setResults([]);
    try {
      const res = await axios.get(`/products/search?query=${value}`);
      setResults(res.data);
    } catch (err) {
      console.error("Error buscando producto:", err);
    }
  };

  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Buscar por código o nombre"
        value={query}
        onChange={handleSearch}
        className="border p-2 w-full"
      />

      {results.length > 0 && (
        <ul className="absolute bg-white border mt-1 w-full z-10 max-h-48 overflow-auto">
          {results.map((p) => {
            const hasStock = p.variants.some((v) => v.stock > 0);
            return (
              <li
                key={p.id}
                className={`p-2 flex justify-between items-center cursor-pointer ${
                  hasStock ? "hover:bg-gray-100" : "opacity-50 cursor-not-allowed"
                }`}
                onClick={() => hasStock && setSelectedProduct(p)}
              >
                <span>{p.code} - {p.description}</span>
                {!hasStock && (
                  <span className="bg-red-500 text-white px-1 rounded text-xs">
                    Sin stock
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {/* SUBMODAL de talles */}
      {selectedProduct && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-4 rounded shadow-md w-72">
            <h3 className="font-semibold text-lg mb-2">
              {selectedProduct.description}
            </h3>
            <table className="w-full text-sm border">
              <thead>
                <tr className="bg-gray-100">
                  <th>Talle</th>
                  <th>Stock</th>
                  <th>Precio</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {selectedProduct.variants.map((v) => (
                  <tr key={v.id}>
                    <td>{v.size}</td>
                    <td>
                      {v.stock > 0 ? (
                        v.stock
                      ) : (
                        <span className="bg-red-500 text-white px-1 rounded text-xs">
                          0
                        </span>
                      )}
                    </td>
                    <td>${v.price.toFixed(2)}</td>
                    <td>
                      <button
                        disabled={v.stock === 0}
                        className={`px-2 py-1 rounded text-xs text-white ${
                          v.stock > 0
                            ? "bg-blue-500 hover:bg-blue-600"
                            : "bg-gray-400 cursor-not-allowed"
                        }`}
                        onClick={() => {
                          onAddProduct({
                            id: selectedProduct.id,
                            variantId: v.id,
                            code: selectedProduct.code,
                            description: selectedProduct.description,
                            size: v.size,
                            price: v.price,
                            qty: 1,
                            subtotal: v.price,
                          });
                          setSelectedProduct(null);
                        }}
                      >
                        {v.stock > 0 ? "Agregar" : "Sin stock"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <button
              onClick={() => setSelectedProduct(null)}
              className="mt-3 text-sm text-gray-500 hover:underline"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
