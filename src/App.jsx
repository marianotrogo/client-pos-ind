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
import Loader from "./components/GlobalLoader";


function App() {
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);


  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);
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
                {/* Sidebar */}
                <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

                {/* Contenido principal */}
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
