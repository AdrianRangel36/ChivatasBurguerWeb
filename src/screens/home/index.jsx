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
    <div className="h-full w-full flex flex-col">
      <div className="w-full h-20 sm:h-24 md:h-28 lg:h-32 flex flex-row bg-red-500 items-center p-2">
        <img
          src="logo.png"
          alt=""
          className="h-full w-auto object-contain rounded-2xl mr-4"
        />
        <h1 className="text-xl sm:text-2xl font-semibold text-white self-center">
          Chivata's Burguer Inventory Manager
        </h1>
      </div>
      <div className="self-center flex flex-col mt-10 gap-4">
        <button
          onClick={() => navigate("/ingredientes")}
          className="bg-black text-xl text-white p-2 rounded-xl hover:bg-gray-800 cursor-pointer transition"
        >
          Ver ingredientes
        </button>

        <button
          onClick={handleLogout}
          className="bg-black text-xl text-white p-2 rounded-xl hover:bg-gray-800 cursor-pointer transition"
        >
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
}
