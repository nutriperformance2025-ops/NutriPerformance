// src/app.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import indexRoutes from "./routes/index.js";
import materiaRoutes from "./routes/materia.routes.js";
import clasificacionRoutes from "./routes/clasificacion.routes.js";
import { pool } from "./config/db.js"; // para /api/diag

dotenv.config();

const app = express();

// CORS: admite varios orígenes separados por coma (Render/Hostinger)
const origins = (process.env.CORS_ORIGIN || "*").split(",");
app.use(cors({
    origin: origins,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

// Parseo JSON
app.use(express.json());

// =======================
// Rutas de la aplicación
// =======================
app.use("/api", indexRoutes);                 // /api/health, /api/clasificaciones, /api/materias
app.use("/api/materias", materiaRoutes);      // /api/materias...
app.use("/api/clasificaciones", clasificacionRoutes);

// Ruta raíz (útil para Render al abrir el dominio base)
app.get("/", (_req, res) => {
    res.send("🌿 NutriPerformance API desplegada correctamente en Render ✅");
});

// Healthcheck simple
app.get("/health", (_req, res) => res.send("OK"));

// Endpoint de diagnóstico: prueba conexión a MySQL
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
                ssl: !!(process.env.DB_SSL === "true" || process.env.DB_SSL === "1"),
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

// Arranque (Render provee PORT)
const PORT = process.env.PORT || 10000;
app.listen(PORT, "0.0.0.0", () => {
    console.log(`✅ API escuchando en puerto ${PORT}`);
});
