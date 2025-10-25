import { useState, useEffect } from "react";
import api from "../../api/axios.js";

export default function NuevoProducto() {
  const [form, setForm] = useState({
    code: "",
    description: "",
    price: "",
    cost: "",
    color: "",
    categoryId: "",
    variants: [],
  });
  const [categories, setCategories] = useState([]);
  const [variantTemp, setVariantTemp] = useState([{ size: "", stock: "" }]); // empieza con 1 fila
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/categorias");
        setCategories(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleVariantChange = (index, field, value) => {
    const newVariants = [...variantTemp];
    newVariants[index][field] = value;
    setVariantTemp(newVariants);
  };

  const handleAddVariantLine = () => {
    setVariantTemp([...variantTemp, { size: "", stock: "" }]);
  };

  const handleSaveVariants = () => {
    const validVariants = variantTemp
      .filter((v) => v.size && v.stock)
      .map((v) => ({ size: v.size, stock: parseInt(v.stock) }));
    setForm({ ...form, variants: [...form.variants, ...validVariants] });
    setVariantTemp([{ size: "", stock: "" }]); // reset del modal
    setShowModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/productos", {
        code: form.code,
        description: form.description,
        price: parseFloat(form.price),
        cost: form.cost ? parseFloat(form.cost) : null,
        color: form.color,
        categoryId: form.categoryId ? parseInt(form.categoryId) : null,
        variants: form.variants,
      });
      alert("Producto creado correctamente");
      setForm({
        code: "",
        description: "",
        price: "",
        cost: "",
        color: "",
        categoryId: "",
        variants: [],
      });
    } catch (err) {
      console.error(err);
      alert("Error al crear producto");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Nuevo Producto</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-md">
        <input name="code" value={form.code} onChange={handleChange} placeholder="Código" className="border px-2 py-1"/>
        <input name="description" value={form.description} onChange={handleChange} placeholder="Descripción" className="border px-2 py-1"/>
        <input name="price" type="number" value={form.price} onChange={handleChange} placeholder="Precio" className="border px-2 py-1"/>
        <input name="cost" type="number" value={form.cost} onChange={handleChange} placeholder="Costo" className="border px-2 py-1"/>
        <input name="color" value={form.color} onChange={handleChange} placeholder="Color" className="border px-2 py-1"/>
        <select name="categoryId" value={form.categoryId} onChange={handleChange} className="border px-2 py-1">
          <option value="">Seleccionar categoría</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        {/* Variantes */}
        <button type="button" onClick={() => setShowModal(true)} className="bg-green-500 text-white px-2 py-1 rounded">Agregar Talle</button>
        {form.variants.length > 0 && (
          <ul>
            {form.variants.map((v, i) => (
              <li key={i}>{v.size} - Stock: {v.stock}</li>
            ))}
          </ul>
        )}

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Guardar Producto</button>
      </form>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-4 rounded w-96 max-h-[80vh] overflow-y-auto">
            <h3 className="font-bold mb-2">Agregar Variantes</h3>

            {variantTemp.map((v, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input
                  placeholder="Talle"
                  value={v.size}
                  onChange={(e) => handleVariantChange(i, "size", e.target.value)}
                  className="border px-2 py-1 flex-1"
                />
                <input
                  placeholder="Stock"
                  type="number"
                  value={v.stock}
                  onChange={(e) => handleVariantChange(i, "stock", e.target.value)}
                  className="border px-2 py-1 w-24"
                />
              </div>
            ))}

            <button onClick={handleAddVariantLine} className="px-2 py-1 mb-2 border rounded">Agregar Línea</button>

            <div className="flex gap-2 justify-end">
              <button onClick={() => setShowModal(false)} className="px-2 py-1 border rounded">Cancelar</button>
              <button onClick={handleSaveVariants} className="px-2 py-1 bg-green-500 text-white rounded">Guardar Variantes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
