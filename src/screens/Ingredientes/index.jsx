import React, { useState } from "react";

export default function Ingredientes() {
  const [ingredientes, setIngredientes] = useState([]);

  const handleSelectAll = async () => {
    const request = await fetch("http://localhost:8081/ingredientes", {
      method: "GET",
      credentials: "include"//añadir esto en cada fetch, permite acceder a las rutas protegidas con los metodos crud
    });
    const data = await request.json();
    setIngredientes(data);
  };

  return (
    <div>
      <h1>Ingredientes</h1>
      <button onClick={() => handleSelectAll()}>Ver datos</button>
      
      {ingredientes.length > 0 && (
        <table border="1">
          <thead>
            <tr>
              {Object.keys(ingredientes[0]).map((key) => (
                <th key={key}>{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ingredientes.map((ingrediente, index) => (
              <tr key={index}>
                {Object.values(ingrediente).map((value, i) => (
                  <td key={i}>{String(value)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
