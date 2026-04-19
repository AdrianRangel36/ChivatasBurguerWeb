// Archivo: server.cjs

const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const session = require("express-session"); // 1. Importación del módulo de sesiones

const app = express();

// 2. Modificación de CORS para permitir cookies (credenciales) desde el frontend
app.use(
  cors({
    origin: ["http://localhost:5173"], // Asegúrate de colocar el puerto en el que corre tu React
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true, // Permitir envío de cookies entre puertos diferentes
  }),
);

app.use(express.json());

// 3. Configuración del middleware de sesiones
app.use(
  session({
    secret: "secreto_super_seguro_hamburguesas", // Clave para firmar la cookie
    resave: false, // No guarda la sesión si no cambia
    saveUninitialized: false, // Es mejor mantenerlo en false para no guardar sesiones vacías
    cookie: {
      secure: false, // true solo si usaras HTTPS
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // La cookie de sesión dura 1 día
    },
  }),
);

// Middleware para verificar si el usuario ha iniciado sesión
const verificarSesion = (req, res, next) => {
  if (req.session.usuario) {
    // Si existe la sesión, permite que la petición continúe
    next();
  } else {
    // Si no existe, devuelve un error 401 (No autorizado)
    res
      .status(401)
      .json({ Message: "Acceso denegado. Por favor, inicia sesión." });
  }
};

// Conexión a la base de datos MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "sistema_hamburguesas",
});

db.connect((err) => {
  if (err) {
    console.error("Error conectando a la base de datos:", err);
    return;
  }
  console.log("¡Conectado a MySQL con éxito! 🍔");
});

// Ruta de Login Modificada (Autenticación y creación de sesión)
app.post("/login", (req, res) => {
  const { usuario, password } = req.body;
  const sql = "SELECT * FROM usuarios WHERE usuario = ? AND password = ?";

  db.query(sql, [usuario, password], (err, data) => {
    if (err) return res.status(500).json({ Message: "Error en el servidor" });
    if (data.length > 0) {
      // 4. Se crea la sesión guardando los datos del usuario en req.session
      req.session.usuario = {
        id: data[0].id,
        nombre: data[0].usuario,
      };

      return res.json({ Status: "Success" });
    } else {
      return res.json({ Status: "Fail" });
    }
  });
});

// Ruta para registrar un nuevo usuario (Sign Up)
app.post("/signup", (req, res) => {
  const { usuario, password } = req.body;

  // 1. Primero verificamos si el usuario ya existe en la base de datos
  const checkSql = "SELECT * FROM usuarios WHERE usuario = ?";
  db.query(checkSql, [usuario], (err, data) => {
    if (err) return res.status(500).json({ Message: "Error en el servidor al verificar usuario" });
    
    if (data.length > 0) {
      // Si el usuario existe, devolvemos un error
      return res.status(400).json({ Status: "Fail", Message: "El nombre de usuario ya está en uso" });
    } else {
      // 2. Si no existe, lo insertamos en la tabla usuarios
      const insertSql = "INSERT INTO usuarios (usuario, password) VALUES (?, ?)";
      db.query(insertSql, [usuario, password], (err, result) => {
        if (err) return res.status(500).json({ Message: "Error al registrar el usuario en la base de datos" });
        return res.json({ Status: "Success", Message: "Usuario registrado con éxito" });
      });
    }
  });
});

// 5. Ruta para cerrar sesión (Logout)
app.get("/logout", (req, res) => {
  req.session.destroy();
  res.clearCookie("connect.sid"); // Se limpia la cookie en el navegador
  return res.json({ Status: "Success", Message: "Sesión cerrada" });
});

// 6. Ejemplo de Ruta Protegida
app.get("/perfil", (req, res) => {
  if (!req.session.usuario) {
    // Valida si la sesión existe
    return res.status(401).json({ Message: "No autorizado" }); //
  }
  // Retorna los datos si la sesión es válida
  res.json(req.session.usuario); //
});

// ----------------------------------------------------
// Tus otras rutas CRUD (También puedes protegerlas añadiendo el mismo 'if' del punto 6)
// ----------------------------------------------------

// Ruta para obtener ingredientes (Protegida)
app.get("/ingredientes", verificarSesion, (req, res) => {
  const sql = "SELECT * FROM ingredientes";
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json(err);
    return res.json(result);
  });
});

// Ruta para crear (Protegida)
app.post("/crear", verificarSesion, (req, res) => {
  const { nombre, cantidad, unidad } = req.body;
  const sql =
    "INSERT INTO ingredientes (nombre, cantidad, unidad) VALUES (?, ?, ?)";
  db.query(sql, [nombre, cantidad, unidad], (err, result) => {
    if (err) return res.status(500).json(err);
    return res.json({ Status: "Success" });
  });
});

// Ruta para eliminar (Protegida)
app.delete("/eliminar/:id", verificarSesion, (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM ingredientes WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json(err);
    return res.json({ Status: "Success" });
  });
});

// Ruta para actualizar (Protegida)
app.put("/actualizar/:id", verificarSesion, (req, res) => {
  const { nombre,cantidad,unidad } = req.body;
  const id = req.params.id;
  const sql = "UPDATE ingredientes SET nombre = ?, cantidad = ?, unidad = ?  WHERE id = ?";
  db.query(sql, [nombre,cantidad,unidad, id], (err, result) => {
    if (err) return res.status(500).json(err);
    return res.json({ Status: "Success" });
  });
});
app.listen(8081, () => {
  console.log("Servidor Backend corriendo en el puerto 8081");
});
