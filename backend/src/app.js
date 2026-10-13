```js
// src/app.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import indexRoutes from "./routes/index.js";
import materiaRoutes from "./routes/materia.routes.js";
import clasificacionRoutes from "./routes/clasificacion.routes.js";
import { pool } from "./config/db.js";

// Cargar variables de entorno
dotenv.config();

const app = express();

// =======================
// Configuración de CORS
// =======================
const origins = [
    "https://nutriperformance.com.co",
    "https://www.nutriperformance.com.co",
];

app.use(cors({
    origin: origins,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

// Parseo de JSON
app.use(express.json());

// =======================
// Rutas de la aplicación
// =======================
app.use("/api", indexRoutes);
app.use("/api/materias", materiaRoutes);
app.use("/api/clasificaciones", clasificacionRoutes);

// =======================
// Ruta raíz
// =======================
app.get("/", (_req, res) => {
    res.send("🌿 NutriPerformance API desplegada correctamente en Render ✅");
});

// =======================
// Healthcheck
// =======================
app.get("/health", (_req, res) => {
    res.send("OK");
});

// =======================
// Diagnóstico de conexión a MySQL
// =======================
app.get("/api/diag", async (_req, res) => {
    try {
        const [rows] = await pool.query("SELECT 1 AS ok");

        res.json({
            ok: true,
            db_ok: rows?.[0]?.ok === 1,
            env: {
                host: process.env.DB_HOST,
                db: process.env.DB_NAME,
                port: Number(process.env.DB_PORT || 3306),
                ssl:
                    process.env.DB_SSL === "true" ||
                    process.env.DB_SSL === "1",
            },
            ts: new Date().toISOString(),
        });
    } catch (e) {
        console.error("DIAG DB ERROR:", e);

        res.status(500).json({
            ok: false,
            code: e.code,
            errno: e.errno,
            sqlState: e.sqlState,
            message: e.message,
        });
    }
});

// =======================
// Arranque del servidor
// Render proporciona PORT automáticamente
// =======================
const PORT = process.env.PORT || 10000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`✅ API escuchando en puerto ${PORT}`);
});
```
