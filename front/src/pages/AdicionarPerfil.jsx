import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { adicionarPerfil } from "../store/userSlice";
import { avatarList } from "../constants/avatars"; 

export default function AdicionarPerfil() {
  const [nome, setNome] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const avatarPadrao = avatarList[0]?.url || "https://picsum.photos/200";

  const handleSalvar = async () => {
    if (nome.trim().length === 0) {
      alert("Por favor, insira um nome para o perfil.");
      return;
    }

    try {
      await dispatch(adicionarPerfil({ nome, avatar: avatarPadrao })).unwrap();
      navigate("/gerenciar-perfis");
    } catch (err) {
      console.error(err);
      alert("Erro ao criar perfil. Tente novamente.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-900 px-4 font-sans text-white">
      
      <div className="w-full max-w-2xl">
        
        <h1 className="mb-4 text-4xl font-medium md:text-5xl">
          Adicionar perfil
        </h1>
        
        <p className="text-gray-400 text-lg md:text-xl mb-6">
          Adicione um perfil para outra pessoa que assista à Next.
        </p>

        <hr className="border-gray-800 mb-8" />
        <div className="flex items-center gap-6 mb-8">
          <div className="h-24 w-24 shrink-0 overflow-hidden rounded-md md:h-32 md:w-32">
            <img 
              src={avatarPadrao} 
              alt="Avatar Padrão" 
              className="w-full h-full object-cover"
            />
          </div>

          <div className="w-full">
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Nome"
              maxLength={25}
              className="w-full border border-transparent bg-neutral-900 px-4 py-2 text-lg text-white outline-none transition-colors focus:border-white"
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.2)", 
                borderBottom: "1px solid #fff" 
              }}
              autoFocus
            />
          </div>
        </div>

        <hr className="border-gray-800 mb-10" />

        {/* Botões de Ação */}
        <div className="flex gap-4">
          <button 
            onClick={handleSalvar}
            className={`px-8 py-2 text-lg font-medium transition-colors ${
              nome.trim().length > 0 
                ? "cursor-pointer bg-white text-black hover:bg-gray-200" 
                : "cursor-not-allowed bg-gray-600 text-gray-400"
            }`}
            disabled={nome.trim().length === 0}
          >
            Continuar
          </button>
          
          <button 
            onClick={() => navigate("/gerenciar-perfis")}
            className="px-8 py-2 border border-gray-500 text-gray-400 hover:text-white hover:border-white transition-colors text-lg"
          >
            Cancelar
          </button>
        </div>

      </div>
    </div>
  );
}