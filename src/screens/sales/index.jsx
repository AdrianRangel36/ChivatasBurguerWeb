import { useNavigate } from 'react-router-dom';

export default function Sales() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Sales</h1>
      <button onClick={() => navigate('/home')}>Volver a Home</button>
    </div>
  );
}
