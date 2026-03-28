import { useState } from "react";
import PerfilFeminino from "../assets/perfil-feminino.png";
import PerfilMasculino from "../assets/perfil-masculino.png";

import { useSelector } from "react-redux";

export default function Perfil() {

  const user = useSelector(state => state.user);
  const subscription = useSelector(state => state.subscription);

  console.log("USER:",user);
  console.log("SUBSCRIPTION",subscription);
  



  // PERFIS
  const [perfis, setPerfis] = useState([
    { nome: "Fernanda", img: PerfilFeminino },
    { nome: "Pedro", img: PerfilMasculino }
  ]);

  // MODAL
  const [mostrarModal, setMostrarModal] = useState(false);
  const [novoNome, setNovoNome] = useState("");
  const [novaImagem, setNovaImagem] = useState(PerfilFeminino);

  // CRIAR PERFIL
  function adicionarPerfil() {
    if (!novoNome.trim()) return;

    const novoPerfil = {
      nome: novoNome,
      img: novaImagem
    };

    setPerfis([...perfis, novoPerfil]);

    // reset
    setNovoNome("");
    setNovaImagem(PerfilFeminino);
    setMostrarModal(false);
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#1f2a44] to-black text-white">

      {/* TÍTULO */}
      <h1 className="text-2xl font-semibold mb-10">
        Quem vai assistir?
      </h1>

      {/* PERFIS */}
      <div className="flex gap-10 flex-wrap justify-center">

        {perfis.map((perfil, index) => (
          <div
            key={index}
            className="flex flex-col items-center cursor-pointer group"
          >
            <div className="w-20 h-20 sm:w-32 sm:h-32 rounded-full overflow-hidden border-2 border-transparent group-hover:border-purple-500 transition">
              <img
                src={perfil.img}
                alt={perfil.nome}
                className="w-full h-full object-cover"
              />
            </div>

            <p className="mt-2 text-sm text-gray-300 group-hover:text-white">
              {perfil.nome}
            </p>
          </div>
        ))}

        {/* BOTÃO ADICIONAR */}
        <div
          onClick={() => setMostrarModal(true)}
          className="flex flex-col items-center cursor-pointer group"
        >
          <div className="w-20 h-20 sm:w-32 sm:h-32 rounded-full bg-gray-600 flex items-center justify-center text-3xl text-white group-hover:bg-purple-600 transition">
            +
          </div>

          <p className="mt-2 text-sm text-gray-300">
            Adicionar
          </p>
        </div>

      </div>

      {/* MODAL */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">

          <div className="bg-zinc-900 p-6 rounded-xl w-80 text-center">

            <h2 className="text-lg font-semibold mb-4">
              Criar Perfil
            </h2>

            {/* INPUT NOME */}
            <input
              type="text"
              placeholder="Nome"
              value={novoNome}
              onChange={(e) => setNovoNome(e.target.value)}
              className="w-full p-2 rounded bg-white/10 text-white mb-4 outline-none"
            />

            {/* AVATAR */}
            <div className="flex justify-center gap-4 mb-4">

              <img
                src={PerfilFeminino}
                onClick={() => setNovaImagem(PerfilFeminino)}
                className={`w-16 h-16 rounded-full cursor-pointer border-2 ${
                  novaImagem === PerfilFeminino
                    ? "border-purple-500"
                    : "border-transparent"
                }`}
              />

              <img
                src={PerfilMasculino}
                onClick={() => setNovaImagem(PerfilMasculino)}
                className={`w-16 h-16 rounded-full cursor-pointer border-2 ${
                  novaImagem === PerfilMasculino
                    ? "border-purple-500"
                    : "border-transparent"
                }`}
              />

            </div>

            {/* BOTÕES */}
            <div className="flex gap-3 justify-center">

              <button
                onClick={adicionarPerfil}
                className="bg-purple-600 px-4 py-2 rounded hover:bg-purple-700 transition"
              >
                Criar
              </button>

              <button
                onClick={() => setMostrarModal(false)}
                className="bg-gray-600 px-4 py-2 rounded hover:bg-gray-700 transition"
              >
                Cancelar
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}