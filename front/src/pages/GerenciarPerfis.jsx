import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FiPlus, FiEdit2 } from "react-icons/fi"; 
import { avatarList } from "../constants/avatars";
import { editarPerfil } from "../store/userSlice"; 
import PerfilFeminino from "../assets/perfil-feminino.png";
import logo from '../assets/logo.png';


export default function GerenciarPerfis() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);


  const [perfilEmEdicao, setPerfilEmEdicao] = useState(null); 
  const [novoAvatarTemp, setNovoAvatarTemp] = useState(null); 

  const perfisAtuais = user.perfis && user.perfis.length > 0 
    ? user.perfis 
    : [{ id: 1, nome: user.nome || "Matheus", avatar: PerfilFeminino }];
  
  
  const LIMITES_POR_PLANO = { basico: 1, padrao: 2, premium: 4 };
  const planoAtual = user.assinatura?.tipo_plano?.toLowerCase() || "basico";
  const limiteDePerfis = LIMITES_POR_PLANO[planoAtual] || 1;
  const podeAdicionarPerfil = limiteDePerfis > 1 && perfisAtuais.length < limiteDePerfis;


  const abrirEdicao = (perfil) => {
    setPerfilEmEdicao(perfil);
    setNovoAvatarTemp(perfil.avatar); 
  };

  
  const salvarAlteracoes = () => {
    if (perfilEmEdicao && novoAvatarTemp) {
      
      dispatch(
        editarPerfil({
          perfilId: perfilEmEdicao._id, 
          nome: perfilEmEdicao.nome, 
          avatar: novoAvatarTemp, 
        })
      );
    }
    
    setPerfilEmEdicao(null);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#141414] text-white font-sans relative">
      
      {/* TÍTULO */}
      <h1 className="text-3xl md:text-5xl font-medium mb-8 md:mb-12 tracking-wide">
        Gerenciar perfis:
      </h1>

      {/* GRID DE PERFIS PARA EDIÇÃO */}
      <div className="flex gap-4 md:gap-8 flex-wrap justify-center max-w-4xl px-4">
        {perfisAtuais.map((perfil) => (
          <div key={perfil._id} className="flex flex-col items-center w-24 sm:w-32 relative">
            
            {/* Avatar com Lápis de Edição */}
            <div 
              onClick={() => abrirEdicao(perfil)}
              className="w-24 h-24 sm:w-32 sm:h-32 rounded-md overflow-hidden relative cursor-pointer group"
            >
              {/* Imagem do Perfil */}
              <img
                src={perfil.avatar}
                alt={perfil.nome}
                className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity"
              />
              
              {/* Ícone de Lápis Centralizado */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="p-3 bg-black/60 rounded-full border border-white/50 group-hover:border-white transition-colors">
                  <FiEdit2 className="text-white text-xl sm:text-2xl" />
                </div>
              </div>
            </div>
            
            <p className="mt-4 text-sm sm:text-base text-gray-400 text-center line-clamp-3">
              {perfil.nome}
            </p>
          </div>
        ))}

        {/* BOTÃO ADICIONAR PERFIL */}
        {podeAdicionarPerfil && (
          <div 
            onClick={() => navigate("/adicionar-perfil")} 
            className="flex flex-col items-center cursor-pointer group w-24 sm:w-32"
          >
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-md flex items-center justify-center border border-transparent group-hover:bg-white/10 transition-all duration-300">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white/10 flex items-center justify-center text-white/50 group-hover:text-white group-hover:bg-white/20 transition-all">
                <FiPlus className="text-3xl sm:text-5xl" />
              </div>
            </div>
            <p className="mt-4 text-sm sm:text-base text-gray-400 group-hover:text-white transition-colors text-center">
              Adicionar perfil
            </p>
          </div>
        )}
      </div>

      {/* BOTÃO CONCLUÍDO */}
      <button 
        onClick={() => navigate("/perfil")}
        className="mt-16 px-8 py-2 bg-white text-black font-medium text-lg hover:bg-gray-200 transition-colors"
      >
        Concluído
      </button>

     
      {perfilEmEdicao && (
  <div className="fixed inset-0 bg-black z-50 flex flex-col items-center overflow-y-auto">
    
    {/* HEADER SUPERIOR  */}
    <div className="w-full px-4 sm:px-8 pt-4 pb-2 flex items-center gap-6">
      
      {/* Botão de Voltar  */}
      <button 
        onClick={() => setPerfilEmEdicao(null)}
        className="w-12 h-12 flex items-center justify-center rounded-full bg-transparent hover:bg-white/20 transition-colors"
        aria-label="Voltar"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="28" 
          height="28" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Logo Next  */}
      <img src={logo} alt="Next Logo" className="w-24 md:w-28" />
    </div>
          <div className="max-w-5xl w-full px-4 pt-16 pb-20">
            <h2 className="text-3xl md:text-5xl font-bold mb-2">Escolha o ícone do seu perfil</h2>         
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 pb-4 border-b border-gray-800">
              <div className="flex items-center gap-3 mb-4 sm:mb-0">
                <span className="text-gray-400 text-lg">Para {perfilEmEdicao.nome}</span>
                <img src={novoAvatarTemp} alt="Preview" className="w-10 h-10 rounded-md object-cover border border-gray-600" />
              </div>
              
              <div className="flex gap-4">
                <button 
                  onClick={() => setPerfilEmEdicao(null)} 
                  className="px-6 py-2 border border-gray-500 text-gray-300 hover:text-white hover:border-white transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={salvarAlteracoes} 
                  className="px-6 py-2 bg-white text-black font-medium hover:bg-gray-200 transition-colors"
                >
                  Salvar
                </button>
              </div>
            </div>

            {/* Grid do Banco de Imagens */}
            <div>
              <h3 className="text-2xl font-medium mb-6">Os clássicos</h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                {avatarList.map((avatar) => (
                  <div 
                    key={avatar.id}
                    onClick={() => setNovoAvatarTemp(avatar.url)}
                    className={`cursor-pointer rounded-md overflow-hidden transition-all duration-200 ${
                      novoAvatarTemp === avatar.url 
                        ? "border-4 border-white scale-105" 
                        : "border border-transparent hover:scale-105"
                    }`}
                  >
                    <img src={avatar.url} alt={`Avatar ${avatar.id}`} className="w-full aspect-square object-cover" />
                  </div>
                ))}
              </div>
            </div>
            
          </div>
        </div>
      )}
      
    </div>
  );
}