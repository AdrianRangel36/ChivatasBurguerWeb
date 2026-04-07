import React, { useState, useEffect } from "react";

export default function Ingredientes() {
  // 1. Estados para los datos de la tabla y el formulario
  const [ingredientes, setIngredientes] = useState([]);
  const [nuevo, setNuevo] = useState({ nombre: '', cantidad: '', unidad: '' });

  // 2. Función para cargar todos los datos (Read)
  const cargarDatos = async () => {
    try {
      const request = await fetch("http://localhost:8081/ingredientes", {
        method: "GET",
        credentials: "include" // Obligatorio para sesiones
      });
      const data = await request.json();
      setIngredientes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error al cargar:", error);
    }
  };

  // Cargar datos automáticamente al abrir la pantalla
  useEffect(() => {
    cargarDatos();
  }, []);

  // 3. Función para crear un nuevo ingrediente (Create)
  const handleCrear = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8081/crear", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevo),
        credentials: "include"
      });
      const data = await response.json();
      if (data.Status === "Success") {
        setNuevo({ nombre: '', cantidad: '', unidad: '' }); // Limpiar campos
        cargarDatos(); // Refrescar tabla
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
          credentials: "include"
        });
        const data = await response.json();
        if (data.Status === "Success") cargarDatos();
      } catch (error) {
        alert("Error al eliminar");
      }
    }
  };

  // 5. Función para editar cantidad (Update)
  const handleEditar = async (id, cantidadActual) => {
    const nuevaCant = prompt("Ingresa la nueva cantidad:", cantidadActual);
    if (nuevaCant !== null) {
      try {
        const response = await fetch(`http://localhost:8081/actualizar/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cantidad: nuevaCant }),
          credentials: "include"
        });
        const data = await response.json();
        if (data.Status === "Success") cargarDatos();
      } catch (error) {
        alert("Error al actualizar");
      }
    }
  };

  // --- DISEÑO ---
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ color: '#333', textAlign: 'center' }}>Gestión de Ingredientes 🍔</h1>

      {/* FORMULARIO DE REGISTRO */}
      <div style={{ 
        backgroundColor: '#f9f9f9', 
        padding: '20px', 
        borderRadius: '10px', 
        marginBottom: '30px', 
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)' 
      }}>
        <h3 style={{ marginTop: 0, color: '#f4b400' }}>Añadir Nuevo Insumo</h3>
        <form onSubmit={handleCrear} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <input 
            type="text" 
            placeholder="Nombre (ej. Carne)" 
            style={inputStyle}
            value={nuevo.nombre}
            onChange={e => setNuevo({...nuevo, nombre: e.target.value})}
            required 
          />
          <input 
            type="number" 
            placeholder="Stock" 
            style={inputStyle}
            value={nuevo.cantidad}
            onChange={e => setNuevo({...nuevo, cantidad: e.target.value})}
            required 
          />
          <input 
            type="text" 
            placeholder="Unidad (Kg/Pza)" 
            style={inputStyle}
            value={nuevo.unidad}
            onChange={e => setNuevo({...nuevo, unidad: e.target.value})}
            required 
          />
          <button type="submit" style={{ ...btnStyle, backgroundColor: '#4CAF50' }}>Guardar</button>
        </form>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Inventario Actual</h2>
        <button onClick={cargarDatos} style={{ ...btnStyle, backgroundColor: '#2196F3' }}>Refrescar Tabla</button>
      </div>

      {/* TABLA DE RESULTADOS */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f4b400', color: 'white' }}>
              <th style={cellStyle}>ID</th>
              <th style={cellStyle}>Nombre</th>
              <th style={cellStyle}>Cantidad</th>
              <th style={cellStyle}>Unidad</th>
              <th style={cellStyle}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {ingredientes.map((item) => (
              <tr key={item.id} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={cellStyle}>{item.id}</td>
                <td style={cellStyle}>{item.nombre}</td>
                <td style={cellStyle}>{item.cantidad}</td>
                <td style={cellStyle}>{item.unidad}</td>
                <td style={cellStyle}>
                  <button 
                    onClick={() => handleEditar(item.id, item.cantidad)} 
                    style={{ ...actionBtnStyle, backgroundColor: '#2196F3' }}
                  >
                    Editar
                  </button>
                  <button 
                    onClick={() => handleEliminar(item.id)} 
                    style={{ ...actionBtnStyle, backgroundColor: '#f44336' }}
                  >
                    Borrar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {ingredientes.length === 0 && (
        <p style={{ textAlign: 'center', color: '#888', marginTop: '20px' }}>No hay ingredientes registrados.</p>
      )}
    </div>
  );
}

// --- ESTILOS EN LÍNEA ---
const inputStyle = { 
  padding: '10px', borderRadius: '5px', border: '1px solid #ccc', flex: '1', minWidth: '150px' };
const btnStyle = { 
  padding: '10px 20px', border: 'none', borderRadius: '5px', color: 'white', fontWeight: 'bold', cursor: 'pointer' };
const cellStyle = { 
  padding: '12px', textAlign: 'left' };
const actionBtnStyle = { 
  padding: '5px 10px', border: 'none', borderRadius: '3px', color: 'white', cursor: 'pointer', marginRight: '5px' };