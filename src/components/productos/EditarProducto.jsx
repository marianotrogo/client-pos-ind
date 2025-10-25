import { useState, useEffect } from "react";
import api from "../../api/axios.js";

export default function EditarProducto({ producto, onClose }) {
  const [form, setForm] = useState({
    code: producto.code,
    description: producto.description,
    price: producto.price,
    cost: producto.cost || "",
    color: producto.color || "",
    categoryId: producto.categoryId || "",
    variants: producto.variants || [],
  });

  const [categorias, setCategorias] = useState([]); // 🔹 Categorías desde backend
  const [variantTemp, setVariantTemp] = useState({ size: "", stock: "" });
  const [showModal, setShowModal] = useState(false);

  // 🟩 Obtener categorías desde backend
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const res = await api.get("/categorias");
        setCategorias(res.data);
      } catch (error) {
        console.error("Error al obtener categorías:", error);
      }
    };
    fetchCategorias();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleStockChange = (index, value) => {
    const updated = [...form.variants];
    updated[index].stock = parseInt(value) || 0;
    setForm({ ...form, variants: updated });
  };

  const handleAddVariant = () => {
    if (!variantTemp.size || !variantTemp.stock) return;

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
        { ...variantTemp, stock: parseInt(variantTemp.stock) },
      ];
    }

    setForm({ ...form, variants: updatedVariants });
    setVariantTemp({ size: "", stock: "" });
    setShowModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/productos/${producto.id}`, {
        code: form.code,
        description: form.description,
        price: parseFloat(form.price),
        cost: form.cost ? parseFloat(form.cost) : null,
        color: form.color,
        categoryId: form.categoryId ? parseInt(form.categoryId) : null,
        variants: form.variants,
      });
      alert("Producto actualizado correctamente");
      onClose();
    } catch (err) {
      console.error(err);
      alert("Error al actualizar producto");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-4 rounded w-96">
        <h3 className="font-bold mb-3 text-lg">Editar Producto</h3>
        <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
          <input
            name="code"
            value={form.code}
            onChange={handleChange}
            placeholder="Código"
            className="border px-2 py-1"
          />
          <input
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Descripción"
            className="border px-2 py-1"
          />
          <input
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            placeholder="Precio"
            className="border px-2 py-1"
          />
          <input
            name="cost"
            type="number"
            value={form.cost}
            onChange={handleChange}
            placeholder="Costo"
            className="border px-2 py-1"
          />
          <input
            name="color"
            value={form.color}
            onChange={handleChange}
            placeholder="Color"
            className="border px-2 py-1"
          />

          {/* 🔹 Select de categorías */}
          <select
            name="categoryId"
            value={form.categoryId}
            onChange={handleChange}
            className="border px-2 py-1"
          >
            <option value="">Seleccionar categoría...</option>
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          <button
            type="button"
            className="bg-green-500 text-white px-2 py-1 rounded mt-2"
            onClick={() => setShowModal(true)}
          >
            Editar Stock
          </button>

          {form.variants.length > 0 && (
            <div className="mt-2">
              <h4 className="font-semibold mb-1 text-sm">Stock actual:</h4>
              <ul>
                {form.variants.map((v, i) => (
                  <li key={i} className="flex justify-between items-center mb-1">
                    <span>
                      {v.size} -{" "}
                      <input
                        type="number"
                        value={v.stock}
                        onChange={(e) => handleStockChange(i, e.target.value)}
                        className="border px-1 py-0.5 w-16 text-right"
                      />{" "}
                      unidades
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex gap-2 justify-end mt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1 border rounded"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-3 py-1 bg-blue-500 text-white rounded"
            >
              Guardar
            </button>
          </div>
        </form>

        {/* 🔹 Modal para agregar más stock */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-4 rounded w-80">
              <h4 className="font-bold mb-3 text-lg">Agregar Más Stock</h4>
              <input
                placeholder="Talle"
                value={variantTemp.size}
                onChange={(e) =>
                  setVariantTemp({ ...variantTemp, size: e.target.value })
                }
                className="border px-2 py-1 mb-2 w-full"
              />
              <input
                placeholder="Cantidad a agregar"
                type="number"
                value={variantTemp.stock}
                onChange={(e) =>
                  setVariantTemp({ ...variantTemp, stock: e.target.value })
                }
                className="border px-2 py-1 mb-3 w-full"
              />
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-2 py-1 border rounded"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAddVariant}
                  className="px-2 py-1 bg-green-500 text-white rounded"
                >
                  Agregar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
