import { useNavigate } from 'react-router-dom';

export default function Users() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Users</h1>
      <button onClick={() => navigate('/home')}>Volver a Home</button>
    </div>
  );
}
