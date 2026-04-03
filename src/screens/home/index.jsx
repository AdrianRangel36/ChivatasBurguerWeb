import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:8081/logout", {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();
      if (data.Status === "Success") {
        localStorage.removeItem("isAuthenticated");
        navigate("/");
      }
    } catch (error) {
      alert(`Error al cerrar sesión:, ${error}`);
    }
  };

  return (
    <div>
      <h1>Bienvenido al Dashboard 🍔</h1>
      <button onClick={()=>navigate("/ingredientes")}>Ver ingredientes</button>

      <button onClick={handleLogout}>Cerrar Sesión</button>
    </div>
  );
}
