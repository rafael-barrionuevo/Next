import PerfilFeminino from "../assets/perfil-feminino.png";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FiPlus } from "react-icons/fi"; // Ícone de + (lembre de instalar react-icons se não tiver)
import { useDispatch } from "react-redux";
import { selecionarPerfilAtivo } from "../store/userSlice";

export default function Perfil() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  
  const LIMITES_POR_PLANO = {
    basico: 1,
    padrao: 2,
    premium: 4,
  };

  
  const planoAtual = user.assinatura?.tipo_plano?.toLowerCase() || "basico";
  const limiteDePerfis = LIMITES_POR_PLANO[planoAtual] || 1;

 
  const perfisAtuais = user.perfis || [
    { id: 1, nome: user.nome || "Principal", avatar: PerfilFeminino }
  ];

  
  const podeAdicionarPerfil = limiteDePerfis > 1 && perfisAtuais.length < limiteDePerfis;

  function handleSelectUser(perfilSelecionado) {
    dispatch(selecionarPerfilAtivo(perfilSelecionado));
    navigate("/home");
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#141414] text-white font-sans">
      
      {/* TÍTULO */}
      <h1 className="text-3xl md:text-5xl font-medium mb-8 md:mb-12 tracking-wide">
        Quem está assistindo?
      </h1>

      {/* GRID DE PERFIS */}
      <div className="flex gap-4 md:gap-8 flex-wrap justify-center max-w-4xl px-4">
        
        {/* Renderiza os perfis existentes */}
        {perfisAtuais.map((perfil) => (
          <div 
            key={perfil._id || perfil.id} 
            onClick={() => handleSelectUser(perfil)}
            className="flex flex-col items-center cursor-pointer group w-24 sm:w-32"
          >
            {/* Avatar Quadrado */}
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-md overflow-hidden border-2 border-transparent group-hover:border-white transition-all duration-300 relative">
              {}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors z-10"></div>
              <img
                src={perfil.avatar}
                alt={perfil.nome}
                className="w-full h-full object-cover"
              />
            </div>
            {/* Nome do perfil */}
            <p className="mt-4 text-sm sm:text-base text-gray-400 group-hover:text-white transition-colors text-center line-clamp-3">
              {perfil.nome}
            </p>
          </div>
        ))}

        {/* BOTÃO ADICIONAR PERFIL ) */}
        {podeAdicionarPerfil && (
          <div 
            onClick={() => navigate("/adicionar-perfil")} 
            className="flex flex-col items-center cursor-pointer group w-24 sm:w-32"
          >
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-md flex items-center justify-center border-2 border-transparent group-hover:bg-white/10 transition-all duration-300">
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

      {/* BOTÃO GERENCIAR PERFIS */}
      <button 
        onClick={() => navigate("/gerenciar-perfis")}
        className="mt-16 px-6 py-2 border border-gray-500 text-gray-500 uppercase tracking-widest text-sm hover:border-white hover:text-white transition-colors"
      >
        Gerenciar perfis
      </button>

    </div>
  );
}