import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  // Estados para almacenar el usuario y la contraseña ingresados
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  
  // NUEVO: Estado para alternar entre Login (true) y Registro (false)
  const [isLogin, setIsLogin] = useState(true);

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault(); 

    // Determinamos dinámicamente a qué ruta del backend hacer la petición
    const endpoint = isLogin ? "http://localhost:8081/login" : "http://localhost:8081/signup";

    try {
      const respuesta = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", 
        body: JSON.stringify({ usuario, password }),
      });

      const data = await respuesta.json();

      if (isLogin) {
        // LÓGICA DE INICIO DE SESIÓN
        if (data.Status === "Success") {
          localStorage.setItem("isAuthenticated", "true"); 
          navigate("/home"); 
        } else {
          alert("Credenciales incorrectas. Intenta de nuevo.");
        }
      } else {
        // LÓGICA DE REGISTRO
        if (data.Status === "Success") {
          alert("Usuario creado con éxito. Por favor, inicia sesión.");
          setIsLogin(true); // Cambiamos la vista de nuevo a "Iniciar sesión"
          setPassword("");  // Limpiamos la contraseña por seguridad
        } else {
          alert(data.Message || "Hubo un error al registrar el usuario.");
        }
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
          <h2 className="text-xl lg:text-2xl text-white font-semibold mt-2">
            {/* El título cambia según el estado */}
            {isLogin ? "Ingresa tus credenciales" : "Crea una nueva cuenta"}
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
            <div className="grid grid-cols-2 mt-2">
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
              {/* El texto del botón principal cambia según el estado */}
              {isLogin ? "Iniciar sesión" : "Registrarse"}
            </button>
          </form>

          {/* NUEVO: Botón para cambiar entre las vistas de Login y Sign up */}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="mt-6 text-white font-semibold underline hover:text-gray-200 transition-colors"
          >
            {isLogin 
              ? "¿No tienes cuenta? Regístrate aquí" 
              : "¿Ya tienes cuenta? Inicia sesión"}
          </button>

        </div>
      </div>
    </div>
  );
}