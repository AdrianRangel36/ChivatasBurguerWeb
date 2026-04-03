import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  
  // 1. Estados para almacenar el usuario y la contraseña ingresados por el usuario
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');

  // 2. Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault(); // Esto es para que no se refresque la página 

    try {
      // 3. Hacer la petición POST al backend
      const respuesta = await fetch('http://localhost:8081/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Permitir que se envíen y guarden las cookies
        body: JSON.stringify({ usuario, password }), // Los nombres coinciden con algo
      });

      const credenciales = await respuesta.json();

      // 4. Evaluar la respuesta del servidor
      if (credenciales.Status === "Success") { 
        localStorage.setItem('isAuthenticated', 'true'); // Esto es para que se guarde la sesion en el navegador
        navigate('/home'); // Redirige a la página principal si el login es correcto
      } else {
        alert("Credenciales incorrectas. Intenta de nuevo."); 
      }
    } catch (err) {
      console.error("Error en la petición:", err);
      alert("Hubo un problema al conectar con el servidor.");
    }
  };

  return (
    <div>
      <h1>Bienvenido a Chivatas Burger</h1>
      <h2>Ingresa tus credenciales</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Usuario:</label>
          <input 
            type="text" 
            id="username" 
            name="username" 
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)} 
            required
          />
        </div>
        <div>
          <label htmlFor="password">Contraseña:</label>
          <input 
            type="password" 
            id="password" 
            name="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Iniciar sesión</button>
      </form>
    </div>
  );
}