import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import { Toaster } from "react-hot-toast";
import Home from "./pages/Home";
import Productos from "./pages/Productos";
import Ventas from "./pages/Ventas";
import Clientes from "./pages/Clientes";
import Configuracion from "./pages/Configuracion";
import LoginPage from "./pages/LoginPage";
import PrivateRoute from "./components/PrivateRoute";
import Reportes from "./components/reportes/Reportes";



function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" reverseOrder={false} />

      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/*"
          element={
            <PrivateRoute>
              <Sidebar />
              <div className="ml-64">
                <main className="p-6">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/productos" element={<Productos />} />
                    <Route path="/ventas" element={<Ventas />} />
                    <Route path="/clientes" element={<Clientes />} />
                    <Route path="/reportes" element={<Reportes />} />
                    <Route path="/configuracion" element={<Configuracion />} />
                  </Routes>
                </main>
              </div>
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
