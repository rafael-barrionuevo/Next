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

  function formatarPreco(preco) {
    return Number(preco).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    });
  }

  function simOuNao(valor) {
    return valor ? "Sim" : "Nao";
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <NavBar />

      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-8 flex items-center gap-4">
          <button
            onClick={() => navigate("/admin")}
            className="flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-gray-300 transition-all hover:bg-white/5 hover:text-white"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Voltar ao painel
          </button>
          <h1 className="text-3xl font-bold">Gerenciar Planos</h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mb-8 space-y-6 rounded-2xl border border-white/10 bg-slate-800/95 p-6 shadow-lg"
        >
          <div>
            <h2 className="text-xl font-semibold text-white">
              {editandoId ? "Editar plano" : "Novo plano"}
            </h2>
            <p className="mt-1 text-sm text-gray-400">
              Preencha as informacoes do plano no mesmo padrao visual das outras telas.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-gray-300">Nome do plano</span>
              <input
                name="nome"
                value={form.nome}
                onChange={handleChange}
                placeholder="Ex: Premium"
                className="rounded-xl border border-white/10 bg-black/30 p-3 text-white outline-none transition focus:border-purple-400"
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-gray-300">Preco mensal</span>
              <input
                name="preco"
                value={form.preco}
                onChange={handleChange}
                placeholder="Ex: 39.90"
                type="number"
                step="0.01"
                className="rounded-xl border border-white/10 bg-black/30 p-3 text-white outline-none transition focus:border-purple-400"
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-gray-300">Qualidade de video</span>
              <input
                name="qualidade_video"
                value={form.qualidade_video}
                onChange={handleChange}
                placeholder="Ex: 4K + HDR"
                className="rounded-xl border border-white/10 bg-black/30 p-3 text-white outline-none transition focus:border-purple-400"
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-gray-300">Telas simultaneas</span>
              <input
                name="telas_simultaneas"
                value={form.telas_simultaneas}
                onChange={handleChange}
                placeholder="Quantidade de telas"
                type="number"
                className="rounded-xl border border-white/10 bg-black/30 p-3 text-white outline-none transition focus:border-purple-400"
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-gray-300">Limite de perfis</span>
              <input
                name="limite_perfis"
                value={form.limite_perfis}
                onChange={handleChange}
                placeholder="Quantidade de perfis"
                type="number"
                className="rounded-xl border border-white/10 bg-black/30 p-3 text-white outline-none transition focus:border-purple-400"
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-gray-300">Ordem de exibicao</span>
              <input
                name="ordem"
                value={form.ordem}
                onChange={handleChange}
                placeholder="Posicao na lista"
                type="number"
                className="rounded-xl border border-white/10 bg-black/30 p-3 text-white outline-none transition focus:border-purple-400"
              />
            </label>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-gray-200">
              <input
                type="checkbox"
                name="permite_download"
                checked={form.permite_download}
                onChange={handleChange}
              />
              Permite download
            </label>

            <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-gray-200">
              <input
                type="checkbox"
                name="tem_anuncios"
                checked={form.tem_anuncios}
                onChange={handleChange}
              />
              Tem anuncios
            </label>

            <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-gray-200">
              <input
                type="checkbox"
                name="conteudo_exclusivo"
                checked={form.conteudo_exclusivo}
                onChange={handleChange}
              />
              Conteudo exclusivo
            </label>
          </div>

          <div className="flex gap-3">
            <button type="submit" className="rounded bg-blue-600 px-5 py-2 hover:bg-blue-500">
              {editandoId ? "Atualizar plano" : "Criar plano"}
            </button>

            <button
              type="button"
              onClick={() => {
                setForm(initialForm);
                setEditandoId(null);
              }}
              className="rounded border border-white/20 px-5 py-2 hover:bg-white/10"
            >
              Limpar
            </button>
          </div>
        </form>

        <div className="space-y-4">
          {planos.map((plano) => (
            <div
              key={plano._id}
              className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-slate-800/95 p-5 md:flex-row md:items-start md:justify-between"
            >
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-lg font-semibold">{plano.nome}</p>
                  {!plano.ativo && (
                    <span className="rounded-full bg-red-500/10 px-2 py-1 text-xs font-medium text-red-300">
                      Inativo
                    </span>
                  )}
                </div>

                <div className="mt-4 grid gap-3 text-sm text-gray-300 md:grid-cols-2">
                  <p className="rounded-lg border border-white/5 bg-black/20 px-3 py-2">
                    <span className="block text-xs uppercase tracking-wide text-gray-500">Preco</span>
                    <span className="mt-1 block text-base text-white">{formatarPreco(plano.preco)}</span>
                  </p>

                  <p className="rounded-lg border border-white/5 bg-black/20 px-3 py-2">
                    <span className="block text-xs uppercase tracking-wide text-gray-500">Qualidade</span>
                    <span className="mt-1 block text-base text-white">{plano.qualidade_video}</span>
                  </p>

                  <p className="rounded-lg border border-white/5 bg-black/20 px-3 py-2">
                    <span className="block text-xs uppercase tracking-wide text-gray-500">Perfis</span>
                    <span className="mt-1 block text-base text-white">{plano.limite_perfis} perfis</span>
                  </p>

                  <p className="rounded-lg border border-white/5 bg-black/20 px-3 py-2">
                    <span className="block text-xs uppercase tracking-wide text-gray-500">Telas</span>
                    <span className="mt-1 block text-base text-white">{plano.telas_simultaneas} simultaneas</span>
                  </p>

                  <p className="rounded-lg border border-white/5 bg-black/20 px-3 py-2">
                    <span className="block text-xs uppercase tracking-wide text-gray-500">Download</span>
                    <span className="mt-1 block text-base text-white">{simOuNao(plano.permite_download)}</span>
                  </p>

                  <p className="rounded-lg border border-white/5 bg-black/20 px-3 py-2">
                    <span className="block text-xs uppercase tracking-wide text-gray-500">
                      Anuncios / Exclusivo
                    </span>
                    <span className="mt-1 block text-base text-white">
                      {simOuNao(plano.tem_anuncios)} / {simOuNao(plano.conteudo_exclusivo)}
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex gap-3 md:pt-1">
                <button onClick={() => editarPlano(plano)} className="rounded bg-yellow-600 px-4 py-2 hover:bg-yellow-500">
                  Editar
                </button>

                <button onClick={() => removerPlano(plano._id)} className="rounded bg-red-600 px-4 py-2 hover:bg-red-500">
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
