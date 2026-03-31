import React, { useState, useEffect } from 'react';

/**
 * ARCHIVO ÚNICO: Burger Admin Pro
 * Este archivo contiene la lógica de navegación, autenticación, 
 * gestión de inventario y estilos integrados para evitar errores de resolución.
 */

const App = () => {
    // Estado para manejar la vista actual (Login, Home o Inventario)
    const [view, setView] = useState('login');
    const [isAuth, setIsAuth] = useState(localStorage.getItem('auth') === 'true');

    // Función para cerrar sesión (Requisito 1.10)
    const handleLogout = () => {
        localStorage.removeItem('auth');
        setIsAuth(false);
        setView('login');
    };

    // Estilos integrados para asegurar compatibilidad (Requisito 6)
    const styles = {
        container: { 
            maxWidth: '900px', 
            margin: '40px auto', 
            padding: '20px', 
            fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif' 
        },
        card: { 
            backgroundColor: '#ffffff', 
            padding: '30px', 
            borderRadius: '12px', 
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)', 
            marginBottom: '20px' 
        },
        nav: { 
            backgroundColor: '#333', 
            padding: '15px 25px', 
            color: 'white', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            borderRadius: '8px', 
            marginBottom: '25px' 
        },
        input: { 
            padding: '12px', 
            margin: '8px 0', 
            border: '1px solid #ddd', 
            borderRadius: '6px', 
            width: '100%', 
            boxSizing: 'border-box' 
        },
        btnMain: { 
            backgroundColor: '#f4b400', 
            color: 'white', 
            border: 'none', 
            padding: '12px 20px', 
            borderRadius: '6px', 
            cursor: 'pointer', 
            fontWeight: 'bold', 
            transition: '0.3s' 
        },
        btnAction: { 
            border: 'none', 
            padding: '8px 15px', 
            borderRadius: '4px', 
            cursor: 'pointer', 
            color: 'white', 
            fontWeight: 'bold', 
            marginRight: '5px' 
        },
        table: { 
            width: '100%', 
            borderCollapse: 'collapse', 
            marginTop: '20px' 
        },
        th: { 
            backgroundColor: '#f4b400', 
            color: 'white', 
            padding: '12px', 
            textAlign: 'left' 
        },
        td: { 
            padding: '12px', 
            borderBottom: '1px solid #eee' 
        }
    };

    // --- VISTA: LOGIN ---
    if (!isAuth || view === 'login') {
        return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', backgroundColor: '#f9f9f9' }}>
            <div style={{ ...styles.card, width: '400px' }}>
            <h2 style={{ textAlign: 'center', color: '#333', marginBottom: '25px' }}>🍔 Acceso al Sistema</h2>
            <form onSubmit={(e) => {
                e.preventDefault();
                const usuario = e.target.usuario.value;
                const password = e.target.password.value;
                fetch('http://localhost:8081/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ usuario, password })
                })
                .then(res => res.json())
                .then(data => {
                if (data.Status === "Success") {
                    localStorage.setItem('auth', 'true');
                    setIsAuth(true);
                    setView('home');
                } else alert("Credenciales incorrectas");
                })
                .catch(() => alert("Asegúrate de que el servidor (server.js) esté corriendo en el puerto 8081"));
            }}>
                <label style={{ 
                    fontWeight: 'bold', 
                    fontSize: '0.9em' 
                    }}>Nombre de Usuario</label>
                <input name="usuario" placeholder="Ej. admin" style={styles.input} required />
                <label style={{ 
                    fontWeight: 'bold', 
                    fontSize: '0.9em' }}>Contraseña</label>
                <input name="password" type="password" placeholder="••••••••" style={styles.input} required />
                <button type="submit" style={{ 
                    ...styles.btnMain, 
                    width: '100%', 
                    marginTop: '15px' }}>Iniciar Sesión</button>
            </form>
            </div>
        </div>
        );
    }

    // --- VISTA: HOME ---
    if (view === 'home') {
        return (
        <div style={styles.container}>
            <div style={styles.nav}>
            <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>BurgerStock Manager 🍔</span>
            <button onClick={handleLogout} style={{ 
                background: 'none', 
                color: '#ff4d4d', 
                border: 'none', 
                cursor: 'pointer', 
                fontWeight: 'bold' 
                }}>Cerrar Sesión</button>
            </div>
            <div style={{ 
                ...styles.card, 
                textAlign: 'center' }}>
            <h1 style={{ 
                fontSize: '2.5rem', 
                color: '#333' }}>¡Bienvenido!</h1>
            <p style={{ color: '#666', 
                marginBottom: '30px' }}>Gestiona los insumos y el stock de tu puesto de hamburguesas de forma sencilla.</p>
            <button 
                onClick={() => setView('inventory')} 
                style={{ 
                    ...styles.btnMain, 
                    width: 'auto', 
                    padding: '15px 40px' }}>
                Ir al Inventario de Insumos
            </button>
            </div>
        </div>
        );
    }

    // --- VISTA: INVENTARIO (CRUD) ---
    if (view === 'inventory') {
        return <InventoryView onBack={() => setView('home')} styles={styles} onLogout={handleLogout} />;
    }
    };

    // Componente para la Gestión de Inventario
    const InventoryView = ({ onBack, styles, onLogout }) => {
    const [ingredientes, setIngredientes] = useState([]);
    const [nuevo, setNuevo] = useState({ nombre: '', cantidad: '', unidad: '' });

    const fetchIngredientes = () => {
        fetch('http://localhost:8081/api/ingredientes')
        .then(res => res.json())
        .then(data => setIngredientes(data))
        .catch(err => console.log("Error al cargar datos:", err));
    };

    useEffect(() => {
        fetchIngredientes();
    }, []);

    const handleCrear = (e) => {
        e.preventDefault();
        fetch('http://localhost:8081/api/crear', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevo)
        })
        .then(() => {
        setNuevo({ nombre: '', cantidad: '', unidad: '' });
        fetchIngredientes();
        });
    };

    const handleEliminar = (id) => {
        if (window.confirm("¿Deseas eliminar este ingrediente de la lista?")) {
        fetch(`http://localhost:8081/api/eliminar/${id}`, { method: 'DELETE' })
        .then(() => fetchIngredientes());
        }
    };

    const handleEditar = (id, actual) => {
        const nuevaCant = prompt("Ingresa la nueva cantidad en stock:", actual);
        if (nuevaCant !== null) {
        fetch(`http://localhost:8081/api/actualizar/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cantidad: nuevaCant })
        })
        .then(() => fetchIngredientes());
        }
    };

    return (
        <div style={styles.container}>
        <div style={styles.nav}>
            <span style={{ fontWeight: 'bold' }}>Inventario de Insumos</span>
            <div>
            <button onClick={onBack} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', marginRight: '15px' }}>Atrás</button>
            <button onClick={onLogout} style={{ background: 'none', border: 'none', color: '#ff4d4d', cursor: 'pointer' }}>Salir</button>
            </div>
        </div>

        <div style={styles.card}>
            <h3 style={{ marginTop: 0, color: '#f4b400' }}>Registrar Nuevo Producto</h3>
            <form onSubmit={handleCrear} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <input 
                placeholder="Nombre (ej. Pan)" 
                style={{ ...styles.input, flex: 2 }} 
                value={nuevo.nombre} 
                onChange={e => setNuevo({...nuevo, nombre: e.target.value})} 
                required 
            />
            <input 
                type="number" 
                placeholder="Stock" 
                style={{ ...styles.input, flex: 1 }} 
                value={nuevo.cantidad} 
                onChange={e => setNuevo({...nuevo, cantidad: e.target.value})} 
                required 
            />
            <input 
                placeholder="Unidad (Pza/Kg)" 
                style={{ ...styles.input, flex: 1 }} 
                value={nuevo.unidad} 
                onChange={e => setNuevo({...nuevo, unidad: e.target.value})} 
                required 
            />
            <button type="submit" style={{ ...styles.btnMain, width: 'auto', backgroundColor: '#4CAF50' }}>Añadir</button>
            </form>
        </div>

        <div style={styles.card}>
            <table style={styles.table}>
            <thead>
                <tr>
                <th style={styles.th}>Ingrediente</th>
                <th style={styles.th}>Stock Disponible</th>
                <th style={styles.th}>Acciones</th>
                </tr>
            </thead>
            <tbody>
                {ingredientes.map(item => (
                <tr key={item.id}>
                    <td style={styles.td}>{item.nombre}</td>
                    <td style={styles.td}>
                    <span style={{ fontWeight: 'bold', color: '#333' }}>{item.cantidad}</span> 
                    <small style={{ marginLeft: '5px', color: '#888' }}>{item.unidad}</small>
                    </td>
                    <td style={styles.td}>
                    <button 
                        onClick={() => handleEditar(item.id, item.cantidad)} 
                        style={{ ...styles.btnAction, backgroundColor: '#2196F3' }}
                    >
                        Editar
                    </button>
                    <button 
                        onClick={() => handleEliminar(item.id)} 
                        style={{ ...styles.btnAction, backgroundColor: '#f44336' }}
                    >
                        Borrar
                    </button>
                    </td>
                </tr>
                ))}
                {ingredientes.length === 0 && (
                <tr><td colSpan="3" style={{ textAlign: 'center', padding: '30px', color: '#999' }}>No hay insumos registrados aún.</td></tr>
                )}
            </tbody>
            </table>
        </div>
        </div>
    );
};

export default App;