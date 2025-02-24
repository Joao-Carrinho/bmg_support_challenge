import { connectDB } from '@/lib/db';

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

        return new Response(JSON.stringify({ message: "Registo adicionado com sucesso!" }), {
            status: 201,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error("❌ Erro ao inserir registo:", error);
        return new Response(JSON.stringify({ error: 'Erro ao inserir registo', details: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
