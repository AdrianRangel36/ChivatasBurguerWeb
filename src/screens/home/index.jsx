import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Home</h1>
      <button onClick={() => navigate('/sales')}>Ir a Ventas</button>
      <button onClick={() => navigate('/users')}>Ir a Usuarios</button>
      <button onClick={() => navigate('/login')}>Cerrar sesión</button>
    </div>
  );
}
