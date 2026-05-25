import { useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { atualizarPlano } from "../store/AssinaturaSlice";
import { atualizarUsuario } from "../store/userSlice";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import api from "../services/api";
import NavBar from "../components/NavBar";
import InputField from "../components/inputField";
import Button from "../components/button";
import { getImageUrl } from "../utils/getImageUrl";

export default function PerfilUser() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const assinatura = useSelector((state) => state.assinatura);
  const assinaturaAtiva = assinatura.assinaturaAtiva;
  const navigate = useNavigate();

  
const [planos, setPlanos] = useState([]);
const [novoPlano, setNovoPlano] = useState(assinaturaAtiva?.plano_id || "");
const [loading, setLoading] = useState(false);

useEffect(() => {
  carregarPlanos();
}, []);

async function carregarPlanos() {
  try {
    const response = await api.get("/planos");
    setPlanos(response.data);
  } catch (e) {
    console.error("Erro ao carregar planos:", e);
  }
}
      
  const planoAtual = assinaturaAtiva?.tipo_plano || "Nenhum plano selecionado";
 
  const [nome, setNome] = useState(user.nome || "");
  const [sobrenome, setSobrenome] = useState(user.sobrenome || "");
  const [dataNascimento, setDataNascimento] = useState(user.data_nascimento ? String(user.data_nascimento).substring(0, 10) : ""); // Formata para YYYY-MM-DD

  function getAge(dob) {
    if (!dob) return null;
    try {
      const birth = new Date(dob);
      const diff = Date.now() - birth.getTime();
      const ageDt = new Date(diff);
      return Math.abs(ageDt.getUTCFullYear() - 1970);
    } catch {
      return null;
    }
  }

  async function handleAtualizarPerfil() {
    if (!nome.trim()){
      alert("O nome é obrigatório.");
      return;
    }

    try {
      setLoading(true);

      await dispatch(
        atualizarUsuario({
          nome: nome.trim(),
          sobrenome: sobrenome.trim(),
          data_nascimento: dataNascimento
        })
      ).unwrap();

      alert("Perfil atualizado com sucesso!");
    }catch (e) {
      alert("Erro ao atualizar perfil: " + (e?.message || e));
    } finally {
      setLoading(false);
    } 
  }

  async function handleAtualizarPlano() {
    if (!user?.id) {
      alert("Usuário não encontrado. Faça o cadastro ou login novamente.");
      return;
    }

    if(!novoPlano) {
      alert("Selecione um plano antes de atualizar.");
      return;
    }

    if (novoPlano === assinaturaAtiva?.plano_id) {
      alert("Você já está nesse plano.");
      return;
    }

    try {
      setLoading(true);

      await dispatch(
        atualizarPlano({ 
          plano_id: novoPlano,
          tipo_pagamento: assinaturaAtiva?.tipo_pagamento || "cartao"

        })
      ).unwrap();
      
      alert("Plano atualizado com sucesso!");
    } catch (e) {
      alert("Erro ao atualizar plano: " +(e?.message || e));
    } finally {
      setLoading(false);
    }
  }
       

     

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f172a] to-black text-white">
      <NavBar />

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-6 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="px-3 py-2 rounded-md border border-purple-600/30 hover:bg-purple-600/5 text-purple-200"
          >
            ← Voltar
          </button>

          <h1 className="text-3xl font-semibold">Meu Perfil</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left: avatar + summary */}
          <aside className="col-span-1 rounded-2xl border border-white/10 bg-gradient-to-br from-black/5 to-black/10 p-6 space-y-6 shadow-md">
            <div className="flex flex-col items-center text-center">
              <div className="w-36 h-36 rounded-full p-1 bg-gradient-to-br from-purple-600 to-pink-500 shadow-inner">
                <img
                  src={getImageUrl(user?.avatar || user?.perfilAtivo?.avatar || "/usuarios/default.png")}
                  alt={user.nome}
                  className="w-full h-full rounded-full object-cover border-2 border-black/40"
                />
              </div>

              <h2 className="mt-4 text-2xl font-bold tracking-wide">{user.nome}</h2>
              <p className="text-sm text-gray-300">{user.email}</p>

              <div className="mt-3 flex items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-purple-700/20 text-purple-200 text-sm font-medium">{planoAtual}</span>
                {dataNascimento && (
                  <span className="px-2 py-1 rounded-full bg-white/5 text-sm text-gray-200">{getAge(dataNascimento)} anos</span>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-white/5 flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-400">Assinatura</p>
                  <p className="text-lg font-semibold">{planoAtual}</p>
                </div>
                <div className="text-sm text-gray-300">{assinaturaAtiva?.tipo_pagamento ? assinaturaAtiva.tipo_pagamento : '—'}</div>
              </div>

              <div className="flex gap-3">
                <Button className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 shadow">Gerenciar perfis</Button>
                <Button className="flex-1 px-4 py-2 rounded-lg border border-white/10 text-gray-200 hover:bg-white/3">Editar perfil</Button>
              </div>
            </div>
          </aside>

          {/* Right: edit form + planos */}
          <main className="col-span-1 md:col-span-2 space-y-6">
            <section className="rounded-2xl border border-white/10 bg-white/3 p-6">
              <h3 className="text-xl font-medium mb-4">Editar dados</h3>

              <div className="grid gap-3 md:grid-cols-3">
                <div className="flex flex-col">
                  <p className="text-sm text-gray-400 mb-2">Nome</p>
                  <InputField
                    id="perfil-nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Digite seu nome"
                    className="px-3 py-2 rounded bg-black/30 border border-white/20 w-full"
                  />
                </div>

                <div className="flex flex-col">
                  <p className="text-sm text-gray-400 mb-2">Sobrenome</p>
                  <InputField
                    id="perfil-sobrenome"
                    value={sobrenome}
                    onChange={(e) => setSobrenome(e.target.value)}
                    placeholder="Digite seu sobrenome"
                    className="px-3 py-2 rounded bg-black/30 border border-white/20 w-full"
                  />
                </div>

                <div className="flex flex-col">
                  <p className="text-sm text-gray-400 mb-2">Data de nascimento</p>
                  <InputField
                    id="perfil-data"
                    type="date"
                    value={dataNascimento}
                    onChange={(e) => setDataNascimento(e.target.value)}
                    className="px-3 py-2 rounded bg-black/30 border border-white/20 w-full"
                  />
                </div>
              </div>

              <div className="mt-4">
                <Button onClick={handleAtualizarPerfil} disabled={loading} className="px-5 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 disabled:opacity-40 flex items-center justify-center gap-2">
                  {loading ? "Salvando..." : "Salvar dados"}
                </Button>
              </div>
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/3 p-6">
              <h3 className="text-xl font-medium mb-4">Alterar plano</h3>

          {/* <div className="grid gap-4 md:grid-cols-3">
            {PLANOS.map((plano) => {
              const ativo = novoPlano === plano.id;
              const isAtual = planoAtual === plano.id;

              return (
                <button
                  key={plano.id}
                  onClick={() => setNovoPlano(plano.id)}
                  className={`text-left rounded-xl p-4 border transition ${
                    ativo
                      ? "border-blue-400 bg-blue-500/20"
                      : "border-white/15 bg-black/30 hover:border-white/30"
                  }`}
                >
                  <p className="text-lg font-semibold">{plano.id}</p>
                  <p className="text-sm text-gray-300">{plano.preco}/mês</p>
                  <p className="text-sm text-gray-400 mt-2">{plano.qualidade} • {plano.telas}</p>
                  {isAtual && (
                    <span className="inline-block mt-3 text-xs px-2 py-1 rounded bg-emerald-600/30 border border-emerald-400/40">
                      Plano atual
                    </span>
                  )}
                </button>
              );
            })}
          </div> */}

            <div className="grid gap-4 md:grid-cols-3">
        {planos.map((plano) => {
          const ativo = novoPlano === plano._id;
          const isAtual = assinaturaAtiva?.plano_id === plano._id;

          return (
            <button
              key={plano._id}
              onClick={() => setNovoPlano(plano._id)}
              className={`text-left rounded-xl p-4 border transition ${
                ativo
                  ? "border-purple-400 bg-purple-600/8 shadow-[0_8px_30px_rgba(124,58,237,0.06)]"
                  : "border-white/15 bg-black/30 hover:border-white/30"
              }`}
            >
              <p className="text-lg font-semibold">{plano.nome}</p>
              <p className="text-sm text-gray-300">
                {Number(plano.preco).toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL"
                })}/mês
              </p>
              <p className="text-sm text-gray-400 mt-2">
                {plano.qualidade_video} • {plano.telas_simultaneas} telas
              </p>

              {isAtual && (
                <span className="inline-block mt-3 text-xs px-2 py-1 rounded bg-emerald-600/30 border border-emerald-400/40">
                  Plano atual
                </span>
              )}
            </button>
          );
        })}
      </div>


          <div className="mt-6 flex gap-3">
            <button
              onClick={handleAtualizarPlano}
              
              disabled={!novoPlano || novoPlano === assinaturaAtiva?.plano_id}
              
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Confirmar alteração
            </button>

            <button 
            
            className="px-5 py-2 rounded-lg border border-white/20 hover:bg-white/10">
              Cancelar
            </button>
          </div>
        </section>
          </main>
        </div>
      </div>
    </div>
  );
}