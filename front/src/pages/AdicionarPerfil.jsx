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
    <div className="min-h-screen bg-[#141414] text-white flex items-center justify-center px-4 font-sans">
      
      <div className="w-full max-w-2xl">
        
        <h1 className="text-4xl md:text-5xl font-medium mb-4">
          Adicionar perfil
        </h1>
        
        <p className="text-gray-400 text-lg md:text-xl mb-6">
          Adicione um perfil para outra pessoa que assista à Next.
        </p>

        <hr className="border-gray-800 mb-8" />
        <div className="flex items-center gap-6 mb-8">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-md overflow-hidden shrink-0">
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
              className="w-full bg-[#141414] border border-transparent focus:border-white text-white text-lg px-4 py-2 outline-none transition-colors"
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
            className={`px-8 py-2 font-medium text-lg transition-colors ${
              nome.trim().length > 0 
                ? "bg-white text-black hover:bg-gray-200 cursor-pointer" 
                : "bg-gray-600 text-gray-400 cursor-not-allowed"
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