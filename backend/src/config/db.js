// src/config/db.js
import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

/**
 * Activa SSL si DB_SSL=true|1
 *   - Con Hostinger, a veces se requiere SSL. Si tienes un CA, puedes ponerlo en DB_SSL_CA (PEM).
 *   - Si no tienes CA, usar { rejectUnauthorized: true } suele funcionar si el servidor presenta un certificado válido.
 */
const useSSL = process.env.DB_SSL === "true" || process.env.DB_SSL === "1";
let ssl = undefined;

if (useSSL) {
    const ca = process.env.DB_SSL_CA; // opcional (contenido PEM)
    ssl = ca
        ? { ca, rejectUnauthorized: true }
        : { rejectUnauthorized: true };
    console.log("🔐 MySQL SSL habilitado");
}

export const pool = mysql.createPool({
    host: process.env.DB_HOST,           // ej: mysql.hostinger.com
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,       // ej: nutriperformance
    port: Number(process.env.DB_PORT || 3306),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    // timeouts algo más generosos para PaaS
    connectTimeout: 20000,               // 20s
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000,
    ssl,                                 // undefined o config SSL
});

// Log mínimo para confirmar parámetros clave
console.log(`[DB] host=${process.env.DB_HOST} db=${process.env.DB_NAME} port=${process.env.DB_PORT || 3306} ssl=${useSSL ? "on" : "off"}`);