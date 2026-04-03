import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../screens/Login/index.jsx";
import Home from "../screens/Home/index.jsx";
import Ingredientes from "../screens/Ingredientes/index.jsx";
import RutaProtegida from "./RutaProtegida.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta pública */}
        <Route path="/" element={<Login />} />

        {/* Rutas protegida */}
        <Route
          path="/home"
          element={
            <RutaProtegida>
              <Home />
            </RutaProtegida>
          }
        />

        <Route
          path="/ingredientes"
          element={
            <RutaProtegida>
              <Ingredientes />
            </RutaProtegida>
          }
        />

        {/* Puedes proteger más rutas envolviéndolas igual */}
        {/* <Route path="/configuracion" element={<ProtectedRoute><Configuracion /></ProtectedRoute>} /> */}
      </Routes>
    </BrowserRouter>
  );
}
