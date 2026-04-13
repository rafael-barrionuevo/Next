import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { criarConteudo } from "../store/contentSlice";
import InputField from "../components/inputField";
import Button from "../components/button";
import NavBar from "../components/NavBar";

export default function AdminCadastro() {
  const dispatch = useDispatch();

  // Estados para o formulário
  const [titulo, setTitulo] = useState("");
  const [tipoMidia, setTipoMidia] = useState("filme");
  const [genero, setGenero] = useState("");
  const [sinopse, setSinopse] = useState("");
  const [duracao, setDuracao] = useState("");
  const [urlVideo, setUrlVideo] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Montando o objeto conforme o ConteudoSchema do seu backend
    const novoConteudo = {
      titulo,
      tipo_midia: tipoMidia,
      genero: genero.split(",").map((g) => g.trim()), // Transforma "Ação, Sci-fi" em ["Ação", "Sci-fi"]
      sinopse,
      filme: tipoMidia === "filme" ? {
        duracao,
        url_filme: urlVideo
      } : undefined
    };

    dispatch(criarConteudo(novoConteudo))
      .unwrap()
      .then(() => {
        alert("Conteúdo salvo com sucesso no MongoDB!");
        // Limpar campos após sucesso
        setTitulo("");
        setSinopse("");
      })
      .catch((err) => alert("Erro ao salvar: " + err));
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-white">
      <NavBar />
      
      <main className="max-w-2xl mx-auto pt-10 px-4">
        <h1 className="text-3xl font-bold mb-8 border-l-4 border-purple-600 pl-4">
          Cadastrar Novo Conteúdo
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6 bg-black/40 p-8 rounded-2xl border border-white/10 backdrop-blur-xl">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Título"
              placeholder="Ex: Matrix Resurrections"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="w-full p-3 rounded-lg bg-black/50 border border-purple-400/50 outline-none focus:ring-2 focus:ring-purple-500"
              required
            />

            <div className="flex flex-col">
              <label className="text-sm text-gray-400 mb-2 ml-1">Tipo de Mídia</label>
              <select 
                value={tipoMidia}
                onChange={(e) => setTipoMidia(e.target.value)}
                className="w-full p-3 rounded-lg bg-black/50 border border-purple-400/50 text-white outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="filme">Filme</option>
                <option value="serie">Série</option>
              </select>
            </div>
          </div>

          <InputField
            label="Gêneros (separados por vírgula)"
            placeholder="Ação, Sci-Fi, Suspense"
            value={genero}
            onChange={(e) => setGenero(e.target.value)}
            className="w-full p-3 rounded-lg bg-black/50 border border-purple-400/50 outline-none focus:ring-2 focus:ring-purple-500"
          />

          <div className="flex flex-col">
            <label className="text-sm text-gray-400 mb-2 ml-1">Sinopse</label>
            <textarea
              value={sinopse}
              onChange={(e) => setSinopse(e.target.value)}
              className="w-full p-3 h-32 rounded-lg bg-black/50 border border-purple-400/50 text-white outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              placeholder="Descreva o conteúdo..."
            />
          </div>

          {tipoMidia === "filme" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-purple-900/10 rounded-xl border border-purple-500/20">
              <InputField
                label="Duração"
                placeholder="Ex: 2h 10min"
                value={duracao}
                onChange={(e) => setDuracao(e.target.value)}
                className="w-full p-3 rounded-lg bg-black/50 border border-purple-400/50 outline-none focus:ring-2 focus:ring-purple-500"
              />
              <InputField
                label="URL do Vídeo"
                placeholder="https://..."
                value={urlVideo}
                onChange={(e) => setUrlVideo(e.target.value)}
                className="w-full p-3 rounded-lg bg-black/50 border border-purple-400/50 outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          )}

          <Button 
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-500 hover:to-purple-700 py-4 rounded-xl font-bold text-lg shadow-lg shadow-purple-500/20 transition-all"
          >
            Salvar no Catálogo
          </Button>
        </form>
      </main>
    </div>
  );
}