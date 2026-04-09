import { Home, LogOut } from "lucide-react";
import React, { useState, useEffect } from "react";

const UNIDADES_PERMITIDAS = ["Kg", "Gr", "Pieza", "Litro", "Paquete"];

export default function Ingredientes() {
  // 1. Estados
  const [ingredientes, setIngredientes] = useState([]);
  const [nuevo, setNuevo] = useState({ nombre: "", cantidad: "", unidad: "" });

  // Nuevos estados para la edición en línea
  const [editandoId, setEditandoId] = useState(null);
  const [datosEditados, setDatosEditados] = useState({
    nombre: "",
    cantidad: "",
    unidad: "",
  });

  // 2. Función para cargar (Read)
  const cargarDatos = async () => {
    try {
      const request = await fetch("http://localhost:8081/ingredientes", {
        method: "GET",
        credentials: "include",
      });
      const data = await request.json();
      setIngredientes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error al cargar:", error);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  // 3. Función para crear (Create)
  const handleCrear = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8081/crear", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevo),
        credentials: "include",
      });
      const data = await response.json();
      if (data.Status === "Success") {
        setNuevo({ nombre: "", cantidad: "", unidad: "" });
        cargarDatos();
      }
    } catch (error) {
      alert("Error al guardar el ingrediente");
    }
  };

  // 4. Función para eliminar (Delete)
  const handleEliminar = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este insumo?")) {
      try {
        const response = await fetch(`http://localhost:8081/eliminar/${id}`, {
          method: "DELETE",
          credentials: "include",
        });
        const data = await response.json();
        if (data.Status === "Success") cargarDatos();
      } catch (error) {
        alert("Error al eliminar");
      }
    }
  };

  // 5. Iniciar Edición (Pone la fila en modo input)
  const iniciarEdicion = (item) => {
    setEditandoId(item.id);
    // Copiamos los datos actuales de la fila a nuestro estado temporal
    setDatosEditados({
      nombre: item.nombre,
      cantidad: item.cantidad,
      unidad: item.unidad,
    });
  };

  // 6. Cancelar Edición
  const cancelarEdicion = () => {
    setEditandoId(null);
    setDatosEditados({ nombre: "", cantidad: "", unidad: "" });
  };

  // 7. Guardar Edición (Update completo)
  const guardarEdicion = async (id) => {
    try {
      // Ahora enviamos todos los campos editados al backend
      const response = await fetch(`http://localhost:8081/actualizar/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datosEditados),
        credentials: "include",
      });
      const data = await response.json();
      if (data.Status === "Success") {
        setEditandoId(null); // Salimos del modo edición
        cargarDatos(); // Refrescamos los datos
      }
    } catch (error) {
      alert("Error al actualizar");
    }
  };

  return (
    <div className="h-full w-full flex flex-col">
      <div className="w-full h-20 sm:h-24 md:h-28 lg:h-32 flex flex-row bg-red-500 items-center p-2 justify-between">
        <div className="flex h-full w-auto object-contain rounded-2xl mr-4">
          <img
            src="logo.png"
            alt=""
            className=" rounded-2xl mr-4"
          />
          <h1 className="text-xl sm:text-2xl font-semibold text-white self-center">
            Ingredientes
          </h1>
        </div>
        <button className="text-white self-center items-center m-10 cursor-pointer pt-5" onClick={()=>navigation.navigate("/home")}>
          <Home size={40}/>
        </button>
      </div>

      <div className="w-full max-w-6xl mx-auto flex flex-col gap-8 p-4 sm:p-6 lg:p-8">
        {/* Sección del Formulario */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-xl font-bold text-black mb-4 border-b pb-2">
            Añadir Nuevo Insumo
          </h3>
          <form
            onSubmit={handleCrear}
            className="flex flex-col sm:flex-row gap-4 items-end"
          >
            <div className="w-full">
              <label className="text-sm font-semibold text-gray-700 mb-1 block">
                Nombre
              </label>
              <input
                type="text"
                placeholder="Ej. Carne para hamburguesa"
                value={nuevo.nombre}
                onChange={(e) => setNuevo({ ...nuevo, nombre: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 bg-gray-50"
              />
            </div>
            <div className="w-full sm:w-1/3">
              <label className="text-sm font-semibold text-gray-700 mb-1 block">
                Stock Inicial
              </label>
              <input
                type="number"
                placeholder="0"
                value={nuevo.cantidad}
                onChange={(e) =>
                  setNuevo({ ...nuevo, cantidad: e.target.value })
                }
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 bg-gray-50"
              />
            </div>
            <div className="w-full sm:w-1/3">
              <label className="text-sm font-semibold text-gray-700 mb-1 block">
                Unidad
              </label>
              <select
                value={nuevo.unidad}
                onChange={(e) => setNuevo({ ...nuevo, unidad: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 bg-gray-50 cursor-pointer"
              >
                <option value="" disabled>
                  Selecciona...
                </option>
                {UNIDADES_PERMITIDAS.map((uni) => (
                  <option key={uni} value={uni}>
                    {uni}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-lg shadow-sm transition-all duration-200 whitespace-nowrap active:scale-95 cursor-pointer"
            >
              Guardar Insumo
            </button>
          </form>
        </div>

        {/* Sección del Inventario */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-2xl font-bold text-black">Inventario Actual</h2>
            <button
              onClick={cargarDatos}
              className="cursor-pointer w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-all duration-200 active:scale-95 flex items-center justify-center gap-2"
            >
              Refrescar
            </button>
          </div>

          {/* Contenedor de la Tabla */}
          <div className=" bg-white rounded-xl shadow-md border border-gray-200 max-h-96 overflow-scroll">
            <table className="w-full text-left ">
              <thead className="bg-black text-white">
                <tr>
                  <th className="px-6 py-4 font-bold text-sm tracking-wider uppercase">
                    ID
                  </th>
                  <th className="px-6 py-4 font-bold text-sm tracking-wider uppercase">
                    Nombre
                  </th>
                  <th className="px-6 py-4 font-bold text-sm tracking-wider uppercase">
                    Cantidad
                  </th>
                  <th className="px-6 py-4 font-bold text-sm tracking-wider uppercase">
                    Unidad
                  </th>
                  <th className="px-6 py-4 font-bold text-sm tracking-wider uppercase text-center">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 max-h-44">
                {ingredientes.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-red-200/50 transition-colors duration-150 group"
                  >
                    <td className="px-6 py-4 font-medium text-gray-500">
                      {item.id}
                    </td>

                    {/* Renderizado Condicional: Modo Edición vs Modo Vista */}
                    {editandoId === item.id ? (
                      <>
                        <td className="px-6 py-2">
                          <input
                            type="text"
                            value={datosEditados.nombre}
                            onChange={(e) =>
                              setDatosEditados({
                                ...datosEditados,
                                nombre: e.target.value,
                              })
                            }
                            className="w-full px-2 py-1 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-6 py-2">
                          <input
                            type="number"
                            value={datosEditados.cantidad}
                            onChange={(e) =>
                              setDatosEditados({
                                ...datosEditados,
                                cantidad: e.target.value,
                              })
                            }
                            className="w-24 px-2 py-1 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-6 py-2">
                          <select
                            value={datosEditados.unidad}
                            onChange={(e) =>
                              setDatosEditados({
                                ...datosEditados,
                                unidad: e.target.value,
                              })
                            }
                            className="w-full px-2 py-1 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                          >
                            {UNIDADES_PERMITIDAS.map((uni) => (
                              <option key={uni} value={uni}>
                                {uni}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-6 py-2 flex justify-center gap-2">
                          <button
                            onClick={() => guardarEdicion(item.id)}
                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-1.5 rounded-md text-sm font-bold shadow-sm transition-all active:scale-95"
                          >
                            ✓ Guardar
                          </button>
                          <button
                            onClick={cancelarEdicion}
                            className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-1.5 rounded-md text-sm font-bold shadow-sm transition-all active:scale-95"
                          >
                            ✗ Cancelar
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-6 py-4 text-gray-800 font-medium">
                          {item.nombre}
                        </td>
                        <td className="px-6 py-4 text-gray-800 font-semibold">
                          {item.cantidad}
                        </td>
                        <td className="px-6 py-4 text-gray-800">
                          <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-bold border border-gray-200">
                            {item.unidad}
                          </span>
                        </td>
                        <td className="px-6 py-4 flex justify-center gap-2 opacity-100  transition-opacity duration-200">
                          <button
                            onClick={() => iniciarEdicion(item)}
                            className="bg-green-500 hover:bg-green-600 text-white cursor-pointer px-4 py-1.5 rounded-md text-sm font-bold shadow-sm transition-all active:scale-95"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleEliminar(item.id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 cursor-pointer py-1.5 rounded-md text-sm font-bold shadow-sm transition-all active:scale-95"
                          >
                            Borrar
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>

            {ingredientes.length === 0 && (
              <div className="w-full text-center py-12 flex flex-col items-center justify-center bg-gray-50">
                <svg
                  className="w-12 h-12 text-gray-300 mb-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  ></path>
                </svg>
                <p className="text-gray-500 text-lg font-medium">
                  El inventario está vacío.
                </p>
                <p className="text-gray-400 text-sm">
                  Añade tu primer insumo en el formulario de arriba.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
