import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from '../screens/login/index.jsx';
import Home from '../screens/home/index.jsx';
import RutaProtegida from '../navigation/rutaProtegida.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta pública */}
        <Route path="/" element={<Login />} />

        {/* Ruta protegida */}
        <Route 
          path="/home" 
          element={
            <RutaProtegida>
              <Home />
            </RutaProtegida>
          } 
        />
        
        {/* Puedes proteger más rutas envolviéndolas igual */}
        {/* <Route path="/configuracion" element={<ProtectedRoute><Configuracion /></ProtectedRoute>} /> */}
      </Routes>
    </BrowserRouter>
  );
}