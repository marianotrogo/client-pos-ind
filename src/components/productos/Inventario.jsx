import { useEffect, useState } from "react";
import JsBarcode from "jsbarcode";
import api from "../../api/axios.js";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";


export default function Inventario() {
  const [productos, setProductos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState({});

  // Cargar productos
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const res = await api.get("/productos");
        setProductos(res.data);
      } catch (err) {
        console.error(err);
        toast.error("Error al cargar productos");
      }
    };
    fetchProductos();
  }, []);

  // Filtrado autocompletante
  const filtered = productos.filter((p) =>
    [p.code, p.description].some((field) =>
      field?.toLowerCase().includes(search.toLowerCase())
    )
  );

  const toggleSelect = (variantId) => {
    setSelected((prev) => ({
      ...prev,
      [variantId]: prev[variantId] ? undefined : 1,
    }));
  };

  const changeCopies = (variantId, value) => {
    const num = parseInt(value) || 1;
    setSelected((prev) => ({ ...prev, [variantId]: num }));
  };

  const handlePrint = () => {
    const etiquetas = [];
    productos.forEach((p) =>
      p.variants?.forEach((v) => {
        if (selected[v.id]) {
          etiquetas.push({
            code: v.barcode || p.code,
            description: p.description,
            size: v.size,
            copies: selected[v.id],
          });
        }
      })
    );

    if (etiquetas.length === 0) {
      toast.error("Seleccione al menos un producto para imprimir");
      return;
    }

    const etiquetasHTML = etiquetas
      .map((et, i) =>
        Array(et.copies)
          .fill(`
            <div class="etiqueta">
              <svg id="barcode-${i}-${et.code}"></svg>
              <div class="codigo">${et.code}</div>
              <div class="texto">${et.description} — Talle: ${et.size}</div>
            </div>
          `)
          .join("")
      )
      .join("");

    const html = `
      <html>
        <head>
          <title>Etiquetas</title>
          <style>
            @page { size: 80mm 50mm landscape; margin: 0; }
            body { margin:0; padding:0; font-family:'Courier New', monospace; }
            .etiqueta {
              width: 80mm;
              height: 50mm;
              font-weight: bold;
              font-size: 12px;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: top-bottom;
              page-break-after: always;
            }
            svg { width: 70mm; height: 22mm; }
            .codigo { margin-top:2px; font-weight:bold; text-align:center; }
            .texto { margin-top:2px; font-weight:bold; text-align:center; max-width:75mm; overflow:hidden; white-space:nowrap; text-overflow:ellipsis; }
          </style>
        </head>
        <body>
          ${etiquetasHTML}
        </body>
      </html>
    `;

    const w = window.open("", "_blank", "width=400,height=600");
    w.document.write(html);
    w.document.close();

    w.onload = () => {
      etiquetas.forEach((et, i) => {
        for (let c = 0; c < et.copies; c++) {
          const svg = w.document.getElementById(`barcode-${i}-${et.code}`);
          if (svg) {
            try {
              JsBarcode(svg, et.code.toString(), {
                format: "CODE128",
                displayValue: false,
                width: 2,
                height: 40,
                margin: 0,
              });
            } catch (err) {
              console.error("Error generando código de barras:", err);
            }
          }
        }
      });
      w.print();
      w.close();
    };
  };

  const handleExport = () => {
    if (productos.length === 0) {
      toast.error("No hay productos para exportar");
      return;
    }

    // Construir datos para Excel
    const data = productos.flatMap(p =>
      p.variants?.map(v => ({
        Código: v.barcode || p.code,
        Nombre: p.description,
        Talle: v.size,
        Stock: v.stock,
        Precio: p.price?.toFixed(2) ?? "-",
        Costo: p.cost?.toFixed(2) ?? "-",
        Categoría: p.category?.name || "-",
      }))
    );

    // Crear workbook y worksheet
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Inventario");

    // Generar buffer y descargar
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([wbout], { type: "application/octet-stream" });
    saveAs(blob, `inventario_${Date.now()}.xlsx`);

    toast.success("Exportación a Excel completada");
  };

  return (
    <div className="flex flex-col gap-3 p-4">
      <div className="flex gap-2">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => setShowModal(true)}
        >
          Imprimir
        </button>
        <button className="bg-green-500 text-white px-4 py-2 rounded">
          Importar
        </button>
        <button
          className="bg-yellow-500 text-white px-4 py-2 rounded"
          onClick={handleExport}
        >
          Exportar
        </button>

      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-[600px] max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-3 border-b flex justify-between items-center">
              <h2 className="font-semibold text-lg">Seleccionar productos</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-black"
              >
                ✕
              </button>
            </div>

            <div className="p-3">
              <input
                type="text"
                placeholder="Buscar por código o nombre..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border rounded w-full p-2 mb-3"
                autoFocus
              />

              <div className="overflow-y-auto max-h-[50vh] border rounded">
                <table className="w-full text-sm border-collapse">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border p-1">✔</th>
                      <th className="border p-1 text-left">Código</th>
                      <th className="border p-1 text-left">Nombre</th>
                      <th className="border p-1 text-left">Talle</th>
                      <th className="border p-1 text-left">Copias</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.flatMap((p) =>
                      p.variants?.map((v) => (
                        <tr key={v.id}>
                          <td className="border text-center">
                            <input
                              type="checkbox"
                              checked={!!selected[v.id]}
                              onChange={() => toggleSelect(v.id)}
                            />
                          </td>
                          <td className="border p-1">{v.barcode || p.code}</td>
                          <td className="border p-1">{p.description}</td>
                          <td className="border p-1">{v.size}</td>
                          <td className="border p-1 text-center">
                            {selected[v.id] && (
                              <input
                                type="number"
                                min="1"
                                value={selected[v.id]}
                                onChange={(e) =>
                                  changeCopies(v.id, e.target.value)
                                }
                                className="w-16 border rounded text-center"
                              />
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className="mt-3 flex justify-end gap-2">
                <button
                  className="bg-gray-300 px-4 py-1 rounded"
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </button>
                <button
                  className="bg-blue-600 text-white px-4 py-1 rounded"
                  onClick={handlePrint}
                >
                  Imprimir
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
