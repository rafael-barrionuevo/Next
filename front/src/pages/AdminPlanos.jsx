import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import api from "../services/api";

const initialForm = {
  nome: "",
  preco: "",
  qualidade_video: "",
  permite_download: false,
  telas_simultaneas: 1,
  tem_anuncios: false,
  conteudo_exclusivo: false,
  limite_perfis: 1,
  ordem: 0
};

export default function AdminPlanos() {
  const navigate = useNavigate();
  const [planos, setPlanos] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editandoId, setEditandoId] = useState(null);

  useEffect(() => {
    carregarPlanos();
  }, []);

  async function carregarPlanos() {
    try {
      const response = await api.get("/planos/admin/todos");
      setPlanos(response.data);
    } catch (e) {
      alert("Erro ao carregar planos.");
    }
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const payload = {
      ...form,
      preco: Number(form.preco),
      telas_simultaneas: Number(form.telas_simultaneas),
      limite_perfis: Number(form.limite_perfis),
      ordem: Number(form.ordem)
    };

    try {
      if (editandoId) {
        await api.patch(`/planos/${editandoId}`, payload);
        alert("Plano atualizado com sucesso.");
      } else {
        await api.post("/planos", payload);
        alert("Plano criado com sucesso.");
      }

      setForm(initialForm);
      setEditandoId(null);
      carregarPlanos();
    } catch (e) {
      alert(e.response?.data?.erro || "Erro ao salvar plano.");
    }
  }

  function editarPlano(plano) {
    setEditandoId(plano._id);
    setForm({
      nome: plano.nome,
      preco: plano.preco,
      qualidade_video: plano.qualidade_video,
      permite_download: plano.permite_download,
      telas_simultaneas: plano.telas_simultaneas,
      tem_anuncios: plano.tem_anuncios,
      conteudo_exclusivo: plano.conteudo_exclusivo,
      limite_perfis: plano.limite_perfis,
      ordem: plano.ordem
    });
  }

  async function removerPlano(id) {
    const confirmar = window.confirm("Deseja desativar este plano?");
    if (!confirmar) return;

    try {
      await api.delete(`/planos/${id}`);
      alert("Plano desativado com sucesso.");
      carregarPlanos();
    } catch (e) {
      alert(e.response?.data?.erro || "Erro ao desativar plano.");
    }
  }

  return (
    <div className="min-h-screen bg-[#0d1117] text-white">
      <NavBar />

      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/admin')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 text-gray-300 hover:bg-white/5 hover:text-white transition-all text-sm font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Voltar ao painel
          </button>
          <h1 className="text-3xl font-bold">Gerenciar Planos</h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#161b22] p-6 rounded-xl space-y-4 mb-8">
          <div className="grid md:grid-cols-2 gap-4">
            <input name="nome" value={form.nome} onChange={handleChange} placeholder="Nome" className="p-3 rounded bg-black/30 border border-white/10" />
            <input name="preco" value={form.preco} onChange={handleChange} placeholder="Preço" type="number" step="0.01" className="p-3 rounded bg-black/30 border border-white/10" />

            <input name="qualidade_video" value={form.qualidade_video} onChange={handleChange} placeholder="Qualidade do vídeo" className="p-3 rounded bg-black/30 border border-white/10" />
            <input name="telas_simultaneas" value={form.telas_simultaneas} onChange={handleChange} placeholder="Telas simultâneas" type="number" className="p-3 rounded bg-black/30 border border-white/10" />

            <input name="limite_perfis" value={form.limite_perfis} onChange={handleChange} placeholder="Limite de perfis" type="number" className="p-3 rounded bg-black/30 border border-white/10" />
            <input name="ordem" value={form.ordem} onChange={handleChange} placeholder="Ordem" type="number" className="p-3 rounded bg-black/30 border border-white/10" />
          </div>

          <div className="flex gap-6 flex-wrap">
            <label className="flex items-center gap-2">
              <input type="checkbox" name="permite_download" checked={form.permite_download} onChange={handleChange} />
              Permite download
            </label>

            <label className="flex items-center gap-2">
              <input type="checkbox" name="tem_anuncios" checked={form.tem_anuncios} onChange={handleChange} />
              Tem anúncios
            </label>

            <label className="flex items-center gap-2">
              <input type="checkbox" name="conteudo_exclusivo" checked={form.conteudo_exclusivo} onChange={handleChange} />
              Conteúdo exclusivo
            </label>
          </div>

          <div className="flex gap-3">
            <button type="submit" className="px-5 py-2 rounded bg-blue-600 hover:bg-blue-500">
              {editandoId ? "Atualizar plano" : "Criar plano"}
            </button>

            <button
              type="button"
              onClick={() => {
                setForm(initialForm);
                setEditandoId(null);
              }}
              className="px-5 py-2 rounded border border-white/20 hover:bg-white/10"
            >
              Limpar
            </button>
          </div>
        </form>

        <div className="space-y-4">
          {planos.map((plano) => (
            <div key={plano._id} className="bg-[#161b22] p-4 rounded-xl border border-white/5 flex items-center justify-between">
              <div>
                <p className="font-semibold">
                  {plano.nome} {!plano.ativo && <span className="text-red-400">(inativo)</span>}
                </p>
                <p className="text-sm text-gray-400">
                  R$ {Number(plano.preco).toFixed(2)} | {plano.qualidade_video} | {plano.limite_perfis} perfis
                </p>
              </div>

              <div className="flex gap-3">
                <button onClick={() => editarPlano(plano)} className="px-4 py-2 rounded bg-yellow-600 hover:bg-yellow-500">
                  Editar
                </button>

                <button onClick={() => removerPlano(plano._id)} className="px-4 py-2 rounded bg-red-600 hover:bg-red-500">
                  Desativar
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
