import { connectDB } from "../../../../lib/db";

export async function GET() {
    try {
        const pool = await connectDB();
        return new Response(JSON.stringify({ message: "Connected to SQL Server via Docker!" }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: "Database connection failed", details: error.message }), { status: 500 });
    }
}
