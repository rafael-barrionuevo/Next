import { useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { atualizarPlano } from "../store/userSlice";
import { atualizarUsuario } from "../store/userSlice";
import { useNavigate } from "react-router-dom";

const PLANOS = [
  { id: "Básico", preco: "R$ 19,90", qualidade: "HD", telas: "1 tela" },
  { id: "Padrão", preco: "R$ 39,90", qualidade: "Full HD", telas: "2 telas" },
  { id: "Premium", preco: "R$ 54,90", qualidade: "4K + HDR", telas: "4 telas" }
];

export default function PerfilUser() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();

  const planoAtual = user.assinatura?.tipo_plano || "Nenhum plano selecionado";
  const [novoPlano, setNovoPlano] = useState(planoAtual !== "Nenhum plano selecionado" ? planoAtual : "");
  const [loading, setLoading] = useState(false);
 

  const [nome, setNome] = useState(user.nome || "");
  const [sobrenome, setSobrenome] = useState(user.sobrenome || "");
  const [dataNascimento, setDataNascimento] = useState(user.data_nascimento ? String(user.data_nascimento).substring(0, 10) : ""); // Formata para YYYY-MM-DD

  async function handleAtualizarPerfil() {
    if (!nome.trim()){
      alert("O nome é obrigatório.");
      return;
    }

    try {
      setLoading(true);

      await dispatch(
        atualizarUsuario({
          nome: nome.trim(),// Garante que o nome não tenha espaços extras
          sobrenome: sobrenome.trim(), // Garante que o sobrenome não tenha espaços extras
          data_nascimento: dataNascimento // Envia a data de nascimento no formato YYYY-MM-DD
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

    if (novoPlano === user.assinatura?.tipo_plano) {
      alert("Você já está nesse plano.");
      return;
    }

    try {
      setLoading(true);

      await dispatch(
        atualizarPlano({ 
          id: user.id,
          tipo_plano: novoPlano,
          tipo_pagamento: "cartao" // ou "boleto", dependendo do que o usuário escolher
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
    <div className="min-h-screen bg-gradient-to-b from-[#0f172a] to-black text-white px-6 py-10">
      <div className="max-w-6xl mx-auto space-y-6">

      <button
        onClick={() => navigate(-1)}
        className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10"
      >
        <span className="text-lg">←</span>
        <span>Voltar</span>
      </button>

        <h1 className="text-3xl font-semibold">Meu Perfil</h1>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-xl font-medium mb-4">Editar dados</h2>

          <div className="grid gap-3 md:grid-cols-3">
            <input
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Nome"
              className="px-3 py-2 rounded bg-black/30 border border-white/20"
            />
            <input
              value={sobrenome}
              onChange={(e) => setSobrenome(e.target.value)}
              placeholder="Sobrenome"
              className="px-3 py-2 rounded bg-black/30 border border-white/20"
            />
            <input
              type="date"
              value={dataNascimento}
              onChange={(e) => setDataNascimento(e.target.value)}
              className="px-3 py-2 rounded bg-black/30 border border-white/20"
            />
          </div>

          <button
            onClick={handleAtualizarPerfil}
            disabled={loading}
            className="mt-4 px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40"
          >
            {loading ? "Salvando..." : "Salvar dados"}
          </button>
        </section>


        <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <p className="text-sm text-gray-400">Usuário</p>
          <p className="text-lg">{user.nome} ({user.email})</p>
          <p className="mt-3 text-sm text-gray-400">Plano atual</p>
          <p className="text-xl font-semibold">{planoAtual}</p>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-xl font-medium mb-4">Alterar plano</h2>

          <div className="grid gap-4 md:grid-cols-3">
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
          </div>

          <div className="mt-6 flex gap-3">
            <button
              onClick={handleAtualizarPlano}
              
              disabled={!novoPlano || novoPlano === planoAtual}
              
              className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Confirmar alteração
            </button>

            <button 
            
            className="px-5 py-2 rounded-lg border border-white/20 hover:bg-white/10">
              Cancelar
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
