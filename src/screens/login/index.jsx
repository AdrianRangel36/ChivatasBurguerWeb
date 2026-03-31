// Archivo: src/screens/login/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    
    // Petición POST para validar credenciales (Punto 6 del PDF)
    fetch('http://localhost:8081/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario, password })
    })
    .then(res => res.json())
    .then(data => {
      if (data.Status === "Success") {
        // Guardamos sesión básica (Punto 2 del PDF)
        localStorage.setItem('auth', 'true');
        navigate('/home'); 
      } else {
        alert("Usuario o contraseña incorrectos");
      }
    })
    .catch(err => console.log("Error:", err));
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '100px' }}>
      <div style={{ padding: '30px', border: '1px solid #ddd', borderRadius: '10px', backgroundColor: '#fff8e1' }}>
        <h2>🍔 Acceso al Sistema</h2>
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '15px' }}>
            <label>Usuario:</label><br/>
            <input type="text" onChange={e => setUsuario(e.target.value)} required style={{ padding: '8px', width: '100%' }} />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label>Contraseña:</label><br/>
            <input type="password" onChange={e => setPassword(e.target.value)} required style={{ padding: '8px', width: '100%' }} />
          </div>
          <button type="submit" style={{ padding: '10px', width: '100%', backgroundColor: '#f4b400', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}