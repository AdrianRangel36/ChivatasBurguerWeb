import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  // 1. Estados para almacenar el usuario y la contraseña ingresados por el usuario
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");

  // 2. Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault(); // Esto es para que no se refresque la página

    try {
      // 3. Hacer la petición POST al backend
      const respuesta = await fetch("http://localhost:8081/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Permitir que se envíen y guarden las cookies
        body: JSON.stringify({ usuario, password }), // Los nombres coinciden con algo
      });

      const credenciales = await respuesta.json();

      // 4. Evaluar la respuesta del servidor
      if (credenciales.Status === "Success") {
        localStorage.setItem("isAuthenticated", "true"); // Esto es para que se guarde la sesion en el navegador
        navigate("/home"); // Redirige a la página principal si el login es correcto
      } else {
        alert("Credenciales incorrectas. Intenta de nuevo.");
      }
    } catch (err) {
      console.error("Error en la petición:", err);
      alert("Hubo un problema al conectar con el servidor.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div
        className="absolute h-screen w-screen z-0 opacity-90"
        style={{
          backgroundImage: "url('/fondojeje.jpeg')",
          backgroundSize: "auto",
          backgroundPosition: "center",
        }}
      />
      <div className="flex flex-col lg:flex-row items-center bg-red-500 rounded-2xl z-10">
        <img src="logo.png" alt="" className="w-50 lg:w-80 rounded-2xl" />
        <div className="flex flex-col items-center p-5">
          <h1 className="text-2xl lg:text-3xl text-white font-semibold">
            Bienvenido a Chivatas Burger
          </h1>
          <h2 className="text-xl lg:text-2xl text-white font-semibold">
            Ingresa tus credenciales
          </h2>
          <form onSubmit={handleSubmit} className="w-70 mt-5">
            <div className="grid grid-cols-2">
              <label htmlFor="username" className="text-lg lg:text-2xl font-semibold">
                Usuario:
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                required
                className="bg-white rounded-xl p-1 m-1"
              />
            </div>
            <div className="grid grid-cols-2">
              <label htmlFor="password" className="text-lg lg:text-2xl font-semibold">
                Contraseña:
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-white rounded-xl p-1 m-1"
              />
            </div>
            <button
              type="submit"
              className="bg-black text-xl text-white font-bold p-2 w-full rounded-2xl mt-5"
            >
              Iniciar sesión
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
