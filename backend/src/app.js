import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import indexRoutes from "./routes/index.js";
import materiaRoutes from "./routes/materia.routes.js";
import clasificacionRoutes from "./routes/clasificacion.routes.js";

dotenv.config();

const app = express();

// CORS: permite 1 o varios orígenes desde ENV (o * mientras pruebas)
const origins = (process.env.CORS_ORIGIN || "*").split(",");
app.use(cors({
    origin: origins,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// Rutas API
app.use("/api", indexRoutes);
app.use("/api/materias", materiaRoutes);
app.use("/api/clasificaciones", clasificacionRoutes);

// Healthchecks
app.get("/health", (_req, res) => res.send("OK"));      // fácil de probar en Render

// Arranque: puerto de Render y bind 0.0.0.0
const PORT = process.env.PORT || 10000;
app.listen(PORT, "0.0.0.0", () => {
    console.log(`✅ API escuchando en puerto ${PORT}`);
});
