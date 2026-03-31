import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';

/**
 * ARCHIVO INTEGRAL: Burger Admin Pro
 * Este archivo ha sido consolidado para resolver los errores de resolución.
 * Contiene la navegación protegida, el login y la gestión de inventario.
 */

// --- ESTILOS CSS (Inyectados para cumplir con el mandato de archivo único) ---
const styles = `
  .burger-container { 
    max-width: 900px; 
    margin: 40px auto; 
    padding: 20px; 
    font-family: sans-serif; 
    }
  .burger-card { 
    background: white; 
    padding: 25px; 
    border-radius: 12px; 
    box-shadow: 0 4px 15px rgba(0,0,0,0.1); 
    }
  .burger-input { 
    padding: 12px; 
    margin: 8px 0; 
    border: 1px solid #ddd; 
    border-radius: 6px; 
    width: 100%; 
    box-sizing: border-box; }
  .btn-main { 
    background-color: #f4b400; 
    color: white; 
    border: none; 
    padding: 12px 20px; 
    border-radius: 6px; 
    cursor: pointer; 
    font-weight: bold; 
    width: 100%; 
    transition: background 0.3s; 
    }
  .btn-main:hover { 
    background-color: #d49d00; 
    }
  .btn-edit { 
    background-color: #2196F3; 
    color: white; 
    border: none; 
    padding: 6px 12px; 
    border-radius: 4px; 
    cursor: pointer; 
    margin-right: 5px; 
    }
  .btn-delete { 
    background-color: #f44336; 
    color: white; 
    border: none; 
    padding: 6px 12px; 
    border-radius: 4px; 
    cursor: pointer; 
    }
  .burger-table { 
    width: 100%; 
    border-collapse: collapse; 
    margin-top: 20px; 
  }
  .burger-table th { 
    background-color: #f4b400; 
    color: white; 
    padding: 12px; 
    text-align: left; 
    }
  .burger-table td { 
    padding: 12px; 
    border-bottom: 1px solid #eee; 
    }
  .burger-nav { 
    background-color: #333; 
    padding: 15px 25px; 
    color: white; 
    display: flex; 
    justify-content: space-between; 
    align-items: center; 
    border-radius: 8px; 
    margin-bottom: 20px; 
    }
  .nav-links button { 
    background: none; 
    border: none; 
    color: white; 
    margin-left: 15px; 
    cursor: pointer; 
    font-weight: bold; }
`;

// --- COMPONENTE: LOGIN ---
const Login = () => {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Petición al servidor (Requisito 6 del PDF)
    fetch('http://localhost:8081/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario, password })
    })
    .then(res => res.json())
    .then(data => {
      if (data.Status === "Success") {
        localStorage.setItem('auth', 'true');
        navigate('/home');
      } else {
        alert("Usuario o contraseña incorrectos");
      }
    })
    .catch(() => alert("Error: Asegúrate de que tu servidor server.js esté corriendo en el puerto 8081"));
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
      <div className="burger-card" style={{ width: '350px' }}>
        <h2 style={{ textAlign: 'center', color: '#333' }}>🍔 Burger Login</h2>
        <form onSubmit={handleLogin}>
          <input 
            type="text" 
            className="burger-input" 
            placeholder="Usuario" 
            onChange={e => setUsuario(e.target.value)} 
            required 
          />
          <input 
            type="password" 
            className="burger-input" 
            placeholder="Contraseña" 
            onChange={e => setPassword(e.target.value)} 
            required 
          />
          <button type="submit" className="btn-main" style={{ marginTop: '10px' }}>Entrar al Sistema</button>
        </form>
      </div>
    </div>
  );
};

// --- COMPONENTE: HOME ---
const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="burger-card" style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1 style={{ fontSize: '2.5rem', color: '#333' }}>Bienvenido al Panel Central 🍟</h1>
      <p style={{ color: '#666', marginBottom: '30px' }}>Controla los suministros de tu puesto de hamburguesas de forma eficiente.</p>
      <button 
        onClick={() => navigate('/inventory')} 
        className="btn-main" 
        style={{ width: 'auto', padding: '15px 40px', fontSize: '1.2rem' }}
      >
        Gestionar Inventario
      </button>
    </div>
  );
};

// --- COMPONENTE: INVENTARIO (CRUD) ---
const Inventory = () => {
  const [ingredientes, setIngredientes] = useState([]);
  const [nuevo, setNuevo] = useState({ nombre: '', cantidad: '', unidad: '' });

  const fetchDatos = () => {
    fetch('http://localhost:8081/api/ingredientes')
      .then(res => res.json())
      .then(data => setIngredientes(data))
      .catch(err => console.log(err));
  };

  useEffect(() => { fetchDatos(); }, []);

  const handleCrear = (e) => {
    e.preventDefault();
    fetch('http://localhost:8081/api/crear', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevo)
    })
    .then(() => {
      setNuevo({ nombre: '', cantidad: '', unidad: '' });
      fetchDatos();
    });
  };

  const handleEliminar = (id) => {
    if(confirm("¿Seguro que quieres eliminar este ingrediente?")) {
      fetch(`http://localhost:8081/api/eliminar/${id}`, { method: 'DELETE' })
      .then(() => fetchDatos());
    }
  };

  const handleEditar = (id, cant) => {
    const n = prompt("Nueva cantidad:", cant);
    if(n !== null) {
      fetch(`http://localhost:8081/api/actualizar/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cantidad: n })
      })
      .then(() => fetchDatos());
    }
  };

  return (
    <div className="burger-card">
      <h2 style={{ borderBottom: '2px solid #f4b400', paddingBottom: '10px', marginBottom: '20px' }}>📦 Gestión de Insumos</h2>
      
      <form onSubmit={handleCrear} style={{ display: 'flex', gap: '10px', marginBottom: '30px', flexWrap: 'wrap' }}>
        <input style={{ flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }} placeholder="Nombre (ej. Carne)" value={nuevo.nombre} onChange={e => setNuevo({...nuevo, nombre: e.target.value})} required />
        <input style={{ width: '100px', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }} type="number" placeholder="Cantidad" value={nuevo.cantidad} onChange={e => setNuevo({...nuevo, cantidad: e.target.value})} required />
        <input style={{ width: '100px', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }} placeholder="Unidad" value={nuevo.unidad} onChange={e => setNuevo({...nuevo, unidad: e.target.value})} required />
        <button type="submit" style={{ ...btnStyle, backgroundColor: '#4CAF50' }}>Añadir</button>
      </form>

      <table className="burger-table">
        <thead>
          <tr>
            <th>Ingrediente</th>
            <th>Stock</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {ingredientes.map(item => (
            <tr key={item.id}>
              <td>{item.nombre}</td>
              <td style={{ fontWeight: 'bold' }}>{item.cantidad} <small style={{ color: '#888' }}>{item.unidad}</small></td>
              <td>
                <button onClick={() => handleEditar(item.id, item.cantidad)} className="btn-edit">Editar</button>
                <button onClick={() => handleEliminar(item.id)} className="btn-delete">Borrar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const btnStyle = { border: 'none', color: 'white', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' };

// --- COMPONENTE DE PROTECCIÓN ---
const PrivateRoute = ({ children }) => {
  const isAuth = localStorage.getItem('auth') === 'true';
  return isAuth ? children : <Navigate to="/login" />;
};

// --- COMPONENTE PRINCIPAL (App) ---
export default function App() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('auth');
    window.location.href = "/";
  };

  return (
    <div className="burger-container">
      <style>{styles}</style>
      
      {localStorage.getItem('auth') === 'true' && (
        <nav className="burger-nav">
          <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>Burger Manager 🍔</span>
          <div className="nav-links">
            <button onClick={() => window.location.href = "/home"}>Inicio</button>
            <button onClick={() => window.location.href = "/inventory"}>Inventario</button>
            <button onClick={handleLogout} style={{ color: '#ff4d4d' }}>Cerrar Sesión</button>
          </div>
        </nav>
      )}

      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        
        {/* Rutas Protegidas */}
        <Route path="/home" element={
          <PrivateRoute> <Home /> </PrivateRoute>
        } />
        <Route path="/inventory" element={
          <PrivateRoute> <Inventory /> </PrivateRoute>
        } />
      </Routes>
    </div>
  );
}