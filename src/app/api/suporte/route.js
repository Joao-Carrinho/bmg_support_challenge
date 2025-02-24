import { connectDB } from '@/lib/db';

// Listar registos (GET)
export async function GET(req) {
    try {
        const pool = await connectDB();
        const { searchParams } = new URL(req.url);

        const filterField = searchParams.get("filterField");
        const filterValue = searchParams.get("filterValue");
        const sortField = searchParams.get("sortField") || "id";
        const sortOrder = searchParams.get("sortOrder") || "ASC";
        const showClosed = searchParams.get("showClosed") === "true";

        let query = `
      SELECT id, data, problema, solucao, estado, site, userid, datafecho, 
             tipoProblema, tipoSolucao, useridResponsavel
      FROM Suporte
      WHERE 1=1
    `;

        if (!showClosed) {
            query += " AND estado != 'Fechado'";
        }

        if (filterField && filterValue) {
            query += ` AND ${filterField} LIKE '%${filterValue}%'`;
        }

        query += ` ORDER BY ${sortField} ${sortOrder}`;

        const result = await pool.request().query(query);
        return new Response(JSON.stringify(result.recordset), { status: 200 });
    } catch (error) {
        console.error("❌ Erro ao buscar registos:", error);
        return new Response(JSON.stringify({ error: 'Erro ao buscar registos', details: error.message }), { status: 500 });
    }
}

// Criar um novo registo (POST)
export async function POST(req) {
    try {
        const pool = await connectDB();
        const body = await req.json();

        const query = `
            INSERT INTO Suporte (data, problema, solucao, estado, site, userid, datafecho, tipoProblema, tipoSolucao, useridResponsavel)
            VALUES (@data, @problema, @solucao, @estado, @site, @userid, @datafecho, @tipoProblema, @tipoSolucao, @useridResponsavel)
        `;

        await pool.request()
            .input("data", body.data)
            .input("problema", body.problema)
            .input("solucao", body.solucao)
            .input("estado", body.estado)
            .input("site", body.site)
            .input("userid", body.userid)
            .input("datafecho", body.datafecho)
            .input("tipoProblema", body.tipoProblema)
            .input("tipoSolucao", body.tipoSolucao)
            .input("useridResponsavel", body.useridResponsavel)
            .query(query);

        return new Response(JSON.stringify({ message: "Registo criado com sucesso!" }), { status: 201 });
    } catch (error) {
        console.error("❌ Erro ao inserir registo:", error);
        return new Response(JSON.stringify({ error: 'Erro ao inserir registo', details: error.message }), { status: 500 });
    }
}

// Editar um registo existente (PUT)
export async function PUT(req) {
    try {
        const pool = await connectDB();
        const body = await req.json();

        const query = `
      UPDATE Suporte 
      SET data = @data, problema = @problema, solucao = @solucao, estado = @estado, site = @site, 
          userid = @userid, datafecho = @datafecho, tipoProblema = @tipoProblema, 
          tipoSolucao = @tipoSolucao, useridResponsavel = @useridResponsavel
      WHERE id = @id
    `;

        await pool.request()
            .input("id", body.id)
            .input("data", body.data)
            .input("problema", body.problema)
            .input("solucao", body.solucao)
            .input("estado", body.estado)
            .input("site", body.site)
            .input("userid", body.userid)
            .input("datafecho", body.datafecho)
            .input("tipoProblema", body.tipoProblema)
            .input("tipoSolucao", body.tipoSolucao)
            .input("useridResponsavel", body.useridResponsavel)
            .query(query);

        return new Response(JSON.stringify({ message: "Registo atualizado com sucesso!" }), { status: 200 });
    } catch (error) {
        console.error("❌ Erro ao atualizar registo:", error);
        return new Response(JSON.stringify({ error: 'Erro ao atualizar registo', details: error.message }), { status: 500 });
    }
}
