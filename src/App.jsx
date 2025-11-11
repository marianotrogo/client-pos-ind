import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import { Toaster } from "react-hot-toast";
import Home from "./pages/Home";
import Productos from "./pages/Productos";
import Ventas from "./pages/Ventas";
import Clientes from "./pages/Clientes";
import Configuracion from "./pages/Configuracion";
import Reportes from "./components/reportes/Reportes";
import LoginPage from "./pages/LoginPage";
import PrivateRoute from "./components/PrivateRoute";
import GlobalLoader from "./components/GlobalLoader";
import api from "./api/axios";

function App() {
  const [appReady, setAppReady] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [serverError, setServerError] = useState(false);
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  useEffect(() => {
    const checkServer = async () => {
      try {
        const token = localStorage.getItem("token");
        await api.get("/ping", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        setAppReady(true); // backend disponible
      } catch (err) {
        console.warn("⏳ Servidor no disponible, continuando en modo local...");
        setServerError(true);

        // Si estamos en localhost, cargamos la app de todos modos
        if (window.location.hostname === "localhost") {
          setTimeout(() => setAppReady(true), 500);
        } else {
          // Reintenta solo en producción
          setTimeout(checkServer, 1500);
        }
      }
    };

    checkServer();
  }, []);

  if (!appReady) return <GlobalLoader serverError={serverError} />;

  return (
    <BrowserRouter>
      <Toaster position="top-right" reverseOrder={false} />

      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/*"
          element={
            <PrivateRoute>
              <div className="flex h-screen overflow-hidden bg-gray-50">
                {/* 🔹 Sidebar */}
                <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

                {/* 🔸 Contenido principal */}
                <div className="flex-1 flex flex-col w-full">
                  <Header title="Panel Principal" onToggleSidebar={toggleSidebar} />
                  <main className="mt-16 p-4 md:ml-64 overflow-y-auto">
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
              </div>
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
