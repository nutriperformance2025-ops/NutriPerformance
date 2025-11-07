// src/app.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import indexRoutes from "./routes/index.js";
import materiaRoutes from "./routes/materia.routes.js";
import clasificacionRoutes from "./routes/clasificacion.routes.js";

dotenv.config();

const app = express();

// 🟢 Configuración CORS — admite múltiples orígenes desde .env
const origins = (process.env.CORS_ORIGIN || "*").split(",");
app.use(cors({
    origin: origins,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

// Middleware para parsear JSON
app.use(express.json());

// 🔗 Rutas principales de la API
app.use("/api", indexRoutes);
app.use("/api/materias", materiaRoutes);
app.use("/api/clasificaciones", clasificacionRoutes);

// 🌿 Ruta raíz para Render y pruebas de despliegue
app.get("/", (_req, res) => {
    res.send("🌿 NutriPerformance API desplegada correctamente en Render ✅");
});

// 🩺 Healthcheck (para verificar estado del servicio)
app.get("/health", (_req, res) => res.send("OK"));

// 🚀 Arranque del servidor (puerto dinámico para Render)
const PORT = process.env.PORT || 10000;
app.listen(PORT, "0.0.0.0", () => {
    console.log(`✅ API escuchando en puerto ${PORT}`);
});
