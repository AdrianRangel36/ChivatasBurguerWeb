import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // 1. Borramos la bandera
    localStorage.removeItem('isAuthenticated');
    // 2. Redirigimos al login
    navigate('/');
  };

  return (
    <div>
      <h1>Bienvenido al Dashboard 🍔</h1>
      <button onClick={handleLogout}>Cerrar Sesión</button>
    </div>
  );
}