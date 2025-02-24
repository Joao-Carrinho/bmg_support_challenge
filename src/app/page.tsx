"use client";
import { useEffect, useState } from "react";

interface Suporte {
  id?: number;
  data: string;
  problema: string;
  solucao: string;
  estado: string;
  site: string;
  userid: string;
  datafecho: string | null;
  tipoProblema: string;
  tipoSolucao: string;
  useridResponsavel: number | null;
}

export default function Home() {
  const [suportes, setSuportes] = useState<Suporte[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingData, setEditingData] = useState<Suporte | null>(null);
  const [filterField, setFilterField] = useState("problema");
  const [filterValue, setFilterValue] = useState("");
  const [sortField, setSortField] = useState("id");
  const [sortOrder, setSortOrder] = useState("ASC");
  const [showClosed, setShowClosed] = useState(false);

  // Carregar registos
  const fetchData = () => {
    let url = `/api/suporte?sortField=${sortField}&sortOrder=${sortOrder}&showClosed=${showClosed}`;

    if (filterValue) {
      url += `&filterField=${filterField}&filterValue=${filterValue}`;
    }

    fetch(url)
        .then((res) => res.json())
        .then((data: Suporte[]) => setSuportes(data))
        .catch((err) => console.error("Erro ao carregar dados:", err));
  };

  useEffect(() => {
    fetchData();
  }, [filterField, filterValue, sortField, sortOrder, showClosed]);

  // Abrir modal para adicionar ou editar registos
    const openModal = (registo: Suporte | null = null) => {
        setEditingData(
            registo
                ? {
                    ...registo,
                    data: registo.data ? registo.data.split("T")[0] : "", // Remove a hora da data
                    datafecho: registo.datafecho ? registo.datafecho.split("T")[0] : null, // Remove a hora da data de fecho
                }
                : {
                    data: new Date().toISOString().split("T")[0], // Define a data do sistema apenas para novos registos
                    problema: "",
                    solucao: "",
                    estado: "Aberto",
                    site: "",
                    userid: "",
                    datafecho: null,
                    tipoProblema: "",
                    tipoSolucao: "",
                    useridResponsavel: null,
                }
        );
        setModalOpen(true);
    };


  // Atualizar campo do formulário
    const updateField = (field: keyof Suporte, value: any) => {
        setEditingData((prev) => {
            if (!prev) return prev;

            let updatedData = { ...prev, [field]: value };

            // Se o estado mudar para "Aberto", remover a data de fecho
            if (field === "estado" && value === "Aberto") {
                updatedData.datafecho = null;
            }

            return updatedData;
        });
    };



  // Submeter formulário
    const [error, setError] = useState<string | null>(null);
    const handleSubmit = async (e: any) => {
        e.preventDefault();

        if (editingData?.estado === "Fechado" && (!editingData.datafecho || editingData.datafecho.trim() === "")) {
            setError("A data de fecho é obrigatória quando o estado está 'Fechado'.");
            return;
        }

        setError(null); // Limpa o erro se não houver problemas

        const method = editingData?.id ? "PUT" : "POST";
        const url = "/api/suporte";

        await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(editingData),
        });

        setModalOpen(false);
        fetchData();
    };


    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Lista de Registos de Suporte</h1>

          {/* Filtros Responsivos */}
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <select value={filterField} onChange={(e) => setFilterField(e.target.value)}
                      className="p-3 border rounded-lg w-full sm:w-auto bg-white text-black focus:ring-2 focus:ring-blue-400 shadow">
                  {Object.keys(suportes[0] || {}).map((key) => (
                      <option key={key} value={key}>
                          {key}
                      </option>
                  ))}
              </select>

              <input
                  type="text"
                  value={filterValue}
                  onChange={(e) => setFilterValue(e.target.value)}
                  placeholder="Pesquisar..."
                  className="p-3 border rounded-lg w-full sm:w-auto bg-white text-black focus:ring-2 focus:ring-blue-400 shadow"
              />

              <button onClick={() => setFilterValue("")}
                      className="p-3 bg-white text-black border rounded-lg w-full sm:w-auto hover:bg-gray-200 transition shadow">
                  Limpar Filtro
              </button>
          </div>



          {/* Ordenação Responsiva */}
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <select value={sortField} onChange={(e) => setSortField(e.target.value)}
                      className="p-3 border rounded-lg w-full sm:w-auto bg-white text-black focus:ring-2 focus:ring-blue-400 shadow">
                  {Object.keys(suportes[0] || {}).map((key) => (
                      <option key={key} value={key}>
                          {key}
                      </option>
                  ))}
              </select>

              <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}
                      className="p-3 border rounded-lg w-full sm:w-auto bg-white text-black focus:ring-2 focus:ring-blue-400 shadow">
                  <option value="ASC">Ascendente</option>
                  <option value="DESC">Descendente</option>
              </select>
          </div>



          {/* Checkbox para mostrar registos fechados */}
        <div className="mb-4">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={showClosed} onChange={() => setShowClosed(!showClosed)} />
            Mostrar registos fechados
          </label>
        </div>

        {/* Botão Adicionar */}
          <button
              onClick={() => openModal(null)}
              className="mt-8 mb-8 p-3 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition">
              Adicionar Registo
          </button>




          {/* Tabela de registos */}
          <div className="w-full overflow-x-auto">
              <div className="min-w-full max-w-full">
                  <table className="w-full border-collapse bg-white text-black shadow-lg rounded-lg">
                      <thead className="bg-gray-200 text-gray-700">
                      <tr className="border-b border-gray-300">
                          {Object.keys(suportes[0] || {}).map((key) => (
                              <th key={key} className="p-3 text-left uppercase tracking-wide">{key}</th>
                          ))}
                          <th className="p-3 text-left uppercase tracking-wide">Ações</th>
                      </tr>
                      </thead>
                      <tbody>
                      {suportes.map((item) => (
                          <tr key={item.id} className="border-b border-gray-300 hover:bg-gray-100 transition">
                              {Object.entries(item).map(([key, value], index) => (
                                  <td key={index} className="p-3">
                                      {key === "data" || key === "datafecho"
                                          ? value ? new Date(value as string).toLocaleDateString("pt-PT") : "—"
                                          : value || "—"}
                                  </td>
                              ))}
                              <td className="p-3">
                                  <button onClick={() => openModal(item)} className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
                                      Editar
                                  </button>
                              </td>
                          </tr>
                      ))}
                      </tbody>
                  </table>
              </div>
          </div>




          {/* Model form*/}
          {modalOpen && editingData && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                  <div className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-lg">
                      <h2 className="text-2xl font-bold mb-4 text-gray-700">{editingData?.id ? "Editar Registo" : "Novo Registo"}</h2>

                      {Object.keys(editingData).map((field) => (
                          field !== "id" && (
                              <div key={field} className="mb-3">
                                  <label className="block text-gray-600 text-sm font-semibold mb-1">{field}</label>
                                  {field === "estado" ? (
                                      <select
                                          value={(editingData as any)[field]}
                                          onChange={(e) => updateField(field as keyof Suporte, e.target.value)}
                                          className="p-2 border rounded w-full focus:ring-2 focus:ring-blue-400"
                                      >
                                          <option value="Aberto">Aberto</option>
                                          <option value="Fechado">Fechado</option>
                                      </select>
                                  ) : (
                                      <input
                                          type="text"
                                          placeholder={field}
                                          value={(editingData as any)[field] || ""}
                                          onChange={(e) => updateField(field as keyof Suporte, e.target.value)}
                                          className="p-2 border rounded w-full focus:ring-2 focus:ring-blue-400"
                                      />
                                  )}
                              </div>
                          )
                      ))}

                      {editingData.estado === "Fechado" && (
                          <div className="mb-3">
                              <label className="block text-gray-600 text-sm font-semibold mb-1">Data Fecho</label>
                              <input
                                  type="date"
                                  value={editingData.datafecho || ""}
                                  onChange={(e) => updateField("datafecho", e.target.value)}
                                  className="p-2 border rounded w-full focus:ring-2 focus:ring-blue-400"
                              />
                          </div>
                      )}

                      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

                      <div className="flex gap-2">
                          <button onClick={handleSubmit} className="w-full bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 transition">
                              Guardar
                          </button>
                          <button onClick={() => setModalOpen(false)} className="w-full bg-red-500 text-white p-3 rounded-lg hover:bg-red-600 transition">
                              Cancelar
                          </button>
                      </div>
                  </div>
              </div>
          )}


      </div>
  );
}
