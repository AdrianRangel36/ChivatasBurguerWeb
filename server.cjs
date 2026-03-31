// Archivo: server.js (Colócalo en la raíz de tu proyecto)
// Instalación previa: npm install express mysql2 cors
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// 1. Conexión a la base de datos MySQL (Requisito 3)
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',      // Cambia esto si tu usuario de MySQL es diferente
    password: '',      // Cambia esto si tienes contraseña en MySQL
    database: 'sistema_hamburguesas'
});

db.connect(err => {
    if (err) {
        console.error("Error conectando a la base de datos:", err);
        return;
    }
    console.log("¡Conectado a MySQL con éxito! 🍔");
});

// 2. Ruta de Login (Requisito 1: Autenticación)
app.post('/login', (req, res) => {
    const { usuario, password } = req.body;
    const sql = "SELECT * FROM usuarios WHERE usuario = ? AND password = ?";
    
    db.query(sql, [usuario, password], (err, data) => {
        if (err) return res.status(500).json({ Message: "Error en el servidor" });
        if (data.length > 0) {
            return res.json({ Status: "Success" });
        } else {
            return res.json({ Status: "Fail" });
        }
    });
});

// 3. CRUD: Leer Ingredientes (Requisito 4: Read)
app.get('/ingredientes', (req, res) => {
    const sql = "SELECT * FROM ingredientes";
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json(err);
        return res.json(result);
    });
});

// 4. CRUD: Crear Ingrediente (Requisito 4: Create)
app.post('/crear', (req, res) => {
    const { nombre, cantidad, unidad } = req.body;
    const sql = "INSERT INTO ingredientes (nombre, cantidad, unidad) VALUES (?, ?, ?)";
    db.query(sql, [nombre, cantidad, unidad], (err, result) => {
        if (err) return res.status(500).json(err);
        return res.json({ Status: "Success" });
    });
});

// 5. CRUD: Eliminar Ingrediente (Requisito 4: Delete)
app.delete('/eliminar/:id', (req, res) => {
    const id = req.params.id;
    const sql = "DELETE FROM ingredientes WHERE id = ?";
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json(err);
        return res.json({ Status: "Success" });
    });
});

// 6. CRUD: Actualizar Ingrediente (Requisito 4: Update)
app.put('/actualizar/:id', (req, res) => {
    const { cantidad } = req.body;
    const id = req.params.id;
    const sql = "UPDATE ingredientes SET cantidad = ? WHERE id = ?";
    db.query(sql, [cantidad, id], (err, result) => {
        if (err) return res.status(500).json(err);
        return res.json({ Status: "Success" });
    });
});

app.listen(8081, () => {
    console.log("Servidor Backend corriendo en el puerto 8081");
});