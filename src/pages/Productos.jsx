import { useState } from "react";
import MiniMenu from "../components/productos/MiniMenu.jsx";
import NuevoProducto from "../components/productos/NuevoProducto.jsx";
import ListaProductos from "../components/productos/ListaProductos.jsx";
import Inventario from "../components/productos/Inventario.jsx";
import Categorias from "../components/productos/categorias/Categorias.jsx";

export default function Productos() {
    const [seccionActiva, setSeccionActiva] = useState("lista");

    const renderSeccion = () => {
        switch (seccionActiva) {
            case "nuevo":
                return <NuevoProducto />;
            case "lista":
                return <ListaProductos />;
            case "inventario":
                return <Inventario />;
            case "categorias":
                return <Categorias />
            default:
                return <ListaProductos />;
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Productos</h1>
            <MiniMenu seccionActiva={seccionActiva} setSeccionActiva={setSeccionActiva} />
            <div className="mt-4">{renderSeccion()}</div>
        </div>
    );
}
