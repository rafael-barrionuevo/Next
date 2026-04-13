import React, { useState, useEffect } from 'react';
import api from '../services/api';
import NavBar from '../components/NavBar';

export default function AdminEpisodios() {
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estados do Formulário
  const [selectedSerieId, setSelectedSerieId] = useState('');
  const [numeroTemporada, setNumeroTemporada] = useState('');
  const [dadosEpisodio, setDadosEpisodio] = useState({
    titulo: '',
    descricao: '',
    ordem: '',
    url_video: ''
  });

  useEffect(() => {
    const fetchSeries = async () => {
      try {
        const response = await api.get('/conteudos');
        // Filtra para mostrar apenas séries que tenham temporadas cadastradas
        const apenasSeries = response.data.filter(item => item.tipo_midia === 'serie');
        setSeries(apenasSeries);
        setLoading(false);
      } catch (err) {
        console.error("Erro ao buscar séries:", err);
        setLoading(false);
      }
    };
    fetchSeries();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Estado atual de dadosEpisodio:", dadosEpisodio);

    if (!selectedSerieId) return alert("Selecione uma série!");

    try {
      const payload = {
        numeroTemporada: parseInt(numeroTemporada, 10),
        dadosEpisodio: {
          titulo: dadosEpisodio.titulo,
          descricao: dadosEpisodio.descricao,
          ordem: parseInt(dadosEpisodio.ordem, 10),
          url_video: dadosEpisodio.url_video
        }
      };
      console.log("Payload que será enviado:", payload);
      await api.patch(`/conteudos/${selectedSerieId}/episodios`, payload);
      
      alert("Episódio adicionado com sucesso!");
      setDadosEpisodio({ titulo: '', descricao: '', ordem: '', url_video: '' });
    } catch (err) {
      alert("Erro: " + (err.response?.data?.erro || "Erro interno"));
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-white">
      <NavBar />
      <main className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-purple-500 mb-8">Adicionar Episódio</h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* SELEÇÃO DA SÉRIE (Bullet Buttons) */}
          <section className="bg-[#161b22] p-6 rounded-2xl border border-white/10">
            <h2 className="text-sm font-bold text-gray-400 uppercase mb-4">1. Selecione a Série</h2>
            <div className="space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
              {loading ? <p>Carregando...</p> : series.map(serie => (
                <label key={serie._id} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${selectedSerieId === serie._id ? 'border-purple-500 bg-purple-500/10' : 'border-white/5 bg-white/5 hover:border-white/20'}`}>
                  <input 
                    type="radio" 
                    name="serie" 
                    value={serie._id} 
                    onChange={(e) => setSelectedSerieId(e.target.value)}
                    className="accent-purple-500"
                  />
                  <span className="text-sm font-medium">{serie.titulo}</span>
                </label>
              ))}
            </div>
          </section>

          {/* DADOS DO EPISÓDIO */}
          <section className="space-y-4">
            <h2 className="text-sm font-bold text-gray-400 uppercase">2. Detalhes do Episódio</h2>
            
            <input 
              type="number" 
              placeholder="Número da Temporada (ex: 1)" 
              className="w-full p-3 rounded bg-white/5 border border-white/10 focus:border-purple-500 outline-none"
              value={numeroTemporada}
              onChange={(e) => setNumeroTemporada(e.target.value)}
              required
            />

            <input 
              placeholder="Título do Episódio" 
              className="w-full p-3 rounded bg-white/5 border border-white/10 focus:border-purple-500 outline-none"
              value={dadosEpisodio.titulo}
              onChange={(e) => setDadosEpisodio({...dadosEpisodio, titulo: e.target.value})}
              required
            />

            <input 
              type="number" 
              placeholder="Número do Episódio (ex: 1)"
              className="w-full p-3 rounded bg-white/5 border border-white/10 focus:border-purple-500 outline-none"
              value={dadosEpisodio.ordem}
              onChange={(e) => setDadosEpisodio({...dadosEpisodio, ordem: e.target.value})}
            />

            <input 
              placeholder="URL do Vídeo (Embed/Stream)" 
              className="w-full p-3 rounded bg-white/5 border border-white/10 focus:border-purple-500 outline-none"
              value={dadosEpisodio.url_video}
              onChange={(e) => setDadosEpisodio({...dadosEpisodio, url_video: e.target.value})}
            />

            <textarea 
              placeholder="Descrição curta" 
              className="w-full p-3 rounded bg-white/5 border border-white/10 focus:border-purple-500 outline-none h-24"
              value={dadosEpisodio.descricao}
              onChange={(e) => setDadosEpisodio({...dadosEpisodio, descricao: e.target.value})}
            />

            <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 py-3 rounded-xl font-bold transition-all shadow-lg shadow-purple-600/20">
              Vincular Episódio
            </button>
          </section>
        </form>
      </main>
    </div>
  );
}