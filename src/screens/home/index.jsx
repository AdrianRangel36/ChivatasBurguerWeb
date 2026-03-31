import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('auth'); // Borra la sesión
    navigate('/'); // Regresa al login
  };

  return (
    <div>
      <h1>Bienvenido al Sistema de Hamburguesas 🍔</h1>
      <button onClick={() => navigate('/inventory')}>Ver Inventario</button>
      <button onClick={handleLogout} style={{ color: 'red' }}>
        Cerrar Sesión
      </button>
    </div>
  );
}