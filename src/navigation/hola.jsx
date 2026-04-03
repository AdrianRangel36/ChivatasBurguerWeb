import { Navigate } from 'react-router-dom';

export default function RutaProtegida({ children }) {
  // Verificamos si existe la bandera de autenticación
  const estaAutenticado = localStorage.getItem('isAuthenticated');

  // Si no está autenticado, lo redirigimos a la raíz (o a /login)
  // 'replace' borra el historial para que no puedan volver usando el botón "Atrás"
  if (!estaAutenticado) {
    return <Navigate to="/" replace />; 
  }

  // Si está autenticado, renderizamos el componente que intentaba visitar (children)
  return children;
}