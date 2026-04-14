import React, { useState, useEffect } from 'react';
import api from '../services/api';
import NavBar from '../components/NavBar';
import { IoTrashOutline, IoChevronDownOutline, IoChevronUpOutline } from "react-icons/io5";

export default function AdminRemover() {
  const [conteudos, setConteudos] = useState([]);
  const [expandedSerie, setExpandedSerie] = useState(null);

  const carregarDados = async () => {
    try {
      const res = await api.get('/conteudos');
      setConteudos(res.data);
    } catch (err) {
      console.error("Erro ao carregar:", err);
    }
  };

  useEffect(() => { carregarDados(); }, []);

  // DELETE /conteudos/:id
  const handleDeletarConteudo = async (id, titulo) => {
    if (window.confirm(`Deletar "${titulo}" e todos os seus dados?`)) {
      try {
        await api.delete(`/conteudos/${id}`);
        alert("Conteúdo removido!");
        carregarDados();
      } catch (err) {
        alert("Erro: " + (err.response?.data?.erro || "Erro interno"));
      }
    }
  };

  // DELETE /conteudos/:id/episodios
  const handleDeletarEpisodio = async (serieId, numTemp, epId, epTitulo) => {
    if (window.confirm(`Remover episódio "${epTitulo}"?`)) {
      try {
        // ATENÇÃO: No axios.delete, o body vai dentro da chave 'data'
        await api.delete(`/conteudos/${serieId}/episodios`, {
          data: { 
            numeroTemporada: numTemp, 
            episodioId: epId 
          }
        });
        
        alert("Episódio removido!");
        carregarDados();
      } catch (err) {
        alert("Erro: " + (err.response?.data?.erro || "Erro interno"));
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-white">
      <NavBar />
      <main className="max-w-5xl mx-auto p-6 py-12">
        <h1 className="text-3xl font-bold text-red-500 mb-2">Gerenciar Catálogo</h1>
        <p className="text-gray-400 mb-8">Exclusão de títulos e episódios.</p>

        <div className="space-y-4">
          {conteudos.map((item) => (
            <div key={item._id} className="bg-[#161b22] border border-white/5 rounded-xl overflow-hidden">
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-black bg-white/10 px-2 py-1 rounded text-gray-300">
                    {item.tipo_midia?.toUpperCase()}
                  </span>
                  <h3 className="text-lg font-bold">{item.titulo}</h3>
                </div>

                <div className="flex items-center gap-2">
                  {item.tipo_midia === 'serie' && (
                    <button 
                      onClick={() => setExpandedSerie(expandedSerie === item._id ? null : item._id)}
                      className="p-2 hover:bg-white/5 rounded-lg text-gray-400 transition-colors"
                    >
                      {expandedSerie === item._id ? <IoChevronUpOutline /> : <IoChevronDownOutline />}
                    </button>
                  )}
                  <button 
                    onClick={() => handleDeletarConteudo(item._id, item.titulo)}
                    className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <IoTrashOutline size={20} />
                  </button>
                </div>
              </div>

              {expandedSerie === item._id && item.temporadas && (
                <div className="bg-black/20 p-4 border-t border-white/5">
                  {item.temporadas.map(temp => (
                    <div key={temp._id} className="mb-4 last:mb-0">
                      <h4 className="text-xs font-bold text-purple-500 uppercase mb-2">Temporada {temp.numero}</h4>
                      <div className="space-y-2">
                        {temp.episodios.map(ep => (
                          <div key={ep._id} className="flex justify-between items-center bg-white/5 p-3 rounded-lg border border-white/5">
                            <span className="text-sm text-gray-300">
                              <b className="text-gray-500 mr-2">{ep.ordem}º</b> {ep.titulo}
                            </span>
                            <button 
                              onClick={() => handleDeletarEpisodio(item._id, temp.numero, ep._id, ep.titulo)}
                              className="text-xs font-bold text-red-400 hover:text-red-300 uppercase tracking-widest p-1"
                            >
                              Remover
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}