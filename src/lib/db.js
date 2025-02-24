import sql from "mssql";
import dotenv from "dotenv";

dotenv.config();

const config = {
    user: process.env.DB_USER ,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    server: process.env.DB_SERVER,
    port: Number(process.env.DB_PORT) || 1433,
    options: {
        encrypt: false,  // ✅ Disable SSL
        trustServerCertificate: true,  // ✅ Allow self-signed certificates
    },
};

// Debugging: Print the connection details
console.log("🔍 DB Config:", config);

let pool;

export async function connectDB() {
    if (!pool) {
        try {
            pool = await sql.connect(config);
            console.log("✅ Connected to SQL Server");
        } catch (err) {
            console.error("❌ Database connection error:", err);
            throw err;
        }
    }
    return pool;
}
