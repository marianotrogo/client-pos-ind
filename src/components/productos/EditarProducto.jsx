// src/components/productos/EditarProducto.jsx
import { useState, useEffect } from "react";
import api from "../../api/axios.js";
import toast from "react-hot-toast";

export default function EditarProducto({ producto, onClose }) {
  const [form, setForm] = useState({
    code: producto.code || "",
    description: producto.description || "",
    price: producto.price || "",
    cost: producto.cost || "",
    color: producto.color || "",
    categoryId: producto.categoryId || "",
    variants: producto.variants || [],
  });

  const [categorias, setCategorias] = useState([]);
  const [variantTemp, setVariantTemp] = useState({ size: "", stock: "" });
  const [showModalStock, setShowModalStock] = useState(false);
  const [loading, setLoading] = useState(false);

  // 🟩 Obtener categorías desde el backend
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const res = await api.get("/categorias");
        setCategorias(res.data);
      } catch (error) {
        console.error("Error al obtener categorías:", error);
        toast.error("No se pudieron cargar las categorías");
      }
    };
    fetchCategorias();
  }, []);

  // 🟦 Manejo de campos de formulario
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // 🟧 Cambiar stock existente
  const handleStockChange = (index, value) => {
    const updated = [...form.variants];
    updated[index].stock = parseInt(value) || 0;
    setForm({ ...form, variants: updated });
  };

  // 🟩 Agregar nueva variante o sumar stock
  const handleAddVariant = () => {
    if (!variantTemp.size || !variantTemp.stock) {
      toast.error("Complete talle y cantidad");
      return;
    }

    const existingIndex = form.variants.findIndex(
      (v) => v.size.toLowerCase() === variantTemp.size.toLowerCase()
    );

    let updatedVariants;
    if (existingIndex !== -1) {
      updatedVariants = [...form.variants];
      updatedVariants[existingIndex].stock += parseInt(variantTemp.stock);
    } else {
      updatedVariants = [
        ...form.variants,
        { size: variantTemp.size, stock: parseInt(variantTemp.stock) },
      ];
    }

    setForm({ ...form, variants: updatedVariants });
    setVariantTemp({ size: "", stock: "" });
    setShowModalStock(false);
    toast.success("Stock actualizado");
  };

  // 🟦 Guardar producto editado
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.description || !form.price) {
      toast.error("Faltan campos obligatorios");
      return;
    }

    setLoading(true);
    try {
      await api.put(`/productos/${producto.id}`, {
        code: form.code || null,
        description: form.description,
        price: parseFloat(form.price),
        cost: form.cost ? parseFloat(form.cost) : null,
        color: form.color || null,
        categoryId: form.categoryId ? parseInt(form.categoryId) : null,
        variants: form.variants,
      });

      toast.success("Producto actualizado correctamente ✅");
      onClose();
    } catch (err) {
      console.error("Error al actualizar producto:", err);
      toast.error("No se pudo actualizar el producto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-5 rounded-lg w-96 shadow-lg">
        <h3 className="font-bold mb-3 text-lg">Editar Producto</h3>

        <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
          <input
            name="code"
            value={form.code}
            onChange={handleChange}
            placeholder="Código"
            className="border px-2 py-1 rounded"
          />
          <input
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Descripción *"
            className="border px-2 py-1 rounded"
          />
          <input
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            placeholder="Precio *"
            className="border px-2 py-1 rounded"
          />
          <input
            name="cost"
            type="number"
            value={form.cost}
            onChange={handleChange}
            placeholder="Costo"
            className="border px-2 py-1 rounded"
          />
          <input
            name="color"
            value={form.color}
            onChange={handleChange}
            placeholder="Color"
            className="border px-2 py-1 rounded"
          />

          {/* 🔹 Select de categoría */}
          <select
            name="categoryId"
            value={form.categoryId}
            onChange={handleChange}
            className="border px-2 py-1 rounded"
          >
            <option value="">Seleccionar categoría...</option>
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* 🔸 Variantes de stock */}
          <div className="mt-2">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-semibold text-sm">Stock por talle</h4>
              <button
                type="button"
                onClick={() => setShowModalStock(true)}
                className="bg-green-500 text-white text-sm px-2 py-1 rounded hover:bg-green-600"
              >
                + Agregar
              </button>
            </div>

            {form.variants.length === 0 ? (
              <p className="text-gray-500 text-sm">Sin talles cargados</p>
            ) : (
              <ul className="text-sm">
                {form.variants.map((v, i) => (
                  <li
                    key={i}
                    className="flex justify-between items-center border-b py-1"
                  >
                    <span>{v.size}</span>
                    <input
                      type="number"
                      value={v.stock}
                      onChange={(e) => handleStockChange(i, e.target.value)}
                      className="border rounded px-1 py-0.5 w-16 text-right"
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex justify-end gap-2 mt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1 border rounded hover:bg-gray-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-3 py-1 rounded text-white ${
                loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>

      {/* 🟩 Modal interno para agregar stock */}
      {showModalStock && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-md w-80">
            <h4 className="font-bold mb-3 text-lg">Agregar Stock</h4>

            <input
              placeholder="Talle"
              value={variantTemp.size}
              onChange={(e) =>
                setVariantTemp({ ...variantTemp, size: e.target.value })
              }
              className="border px-2 py-1 mb-2 w-full rounded"
            />
            <input
              placeholder="Cantidad"
              type="number"
              value={variantTemp.stock}
              onChange={(e) =>
                setVariantTemp({ ...variantTemp, stock: e.target.value })
              }
              className="border px-2 py-1 mb-3 w-full rounded"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModalStock(false)}
                className="px-3 py-1 border rounded hover:bg-gray-100"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddVariant}
                className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Agregar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
