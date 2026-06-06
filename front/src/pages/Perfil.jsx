import PerfilFeminino from "../assets/perfil-feminino.png";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FiPlus } from "react-icons/fi"; // Ícone de + (lembre de instalar react-icons se não tiver)
import { useDispatch } from "react-redux";
import { selecionarPerfilAtivo } from "../store/userSlice";
import { getImageUrl } from "../utils/getImageUrl";

export default function Perfil() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const assinatura = useSelector((state) => state.assinatura);
  
  /* const LIMITES_POR_PLANO = {
    basico: 1,
    padrao: 2,
    premium: 4,
  };

  const planoAtual = user.assinatura?.tipo_plano?.toLowerCase() || "basico";
  const limiteDePerfis = LIMITES_POR_PLANO[planoAtual] || 1; */

  const limiteDePerfis = assinatura.assinaturaAtiva?.limite_perfis || 1; // Usa o limite definido na assinatura do usuário, ou 1 se não tiver assinatura ativa

 
  const perfisAtuais = user.perfis || [
    { id: 1, nome: user.nome || "Principal", avatar: PerfilFeminino }
  ];

  
  /* const podeAdicionarPerfil = limiteDePerfis > 1 && perfisAtuais.length < limiteDePerfis; */

  const podeAdicionarPerfil = perfisAtuais.length < limiteDePerfis;


  function handleSelectUser(perfilSelecionado) {
    dispatch(selecionarPerfilAtivo(perfilSelecionado));
    navigate("/home");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-900 font-sans text-white">
      
      {/* TÍTULO */}
      <h1 className="mb-8 text-3xl font-medium tracking-wide md:mb-12 md:text-5xl">
        Quem está assistindo?
      </h1>

      {/* GRID DE PERFIS */}
      <div className="flex max-w-4xl flex-wrap justify-center gap-4 px-4 md:gap-8">
        
        {/* Renderiza os perfis existentes */}
        {perfisAtuais.map((perfil) => (
          <div 
            key={perfil._id || perfil.id} 
            onClick={() => handleSelectUser(perfil)}
            className="group flex w-24 cursor-pointer flex-col items-center sm:w-32"
          >
            {/* Avatar Quadrado */}
            <div className="relative h-24 w-24 overflow-hidden rounded-md border-2 border-transparent transition-all duration-300 group-hover:border-white sm:h-32 sm:w-32">
              {}
              <div className="absolute inset-0 z-10 bg-black/0 transition-colors group-hover:bg-black/10"></div>
              <img
                src={getImageUrl(perfil.avatar)}
                alt={perfil.nome}
                className="w-full h-full object-cover"
              />
            </div>
            {/* Nome do perfil */}
            <p className="line-clamp-3 mt-4 text-center text-sm text-gray-400 transition-colors group-hover:text-white sm:text-base">
              {perfil.nome}
            </p>
          </div>
        ))}

        {/* BOTÃO ADICIONAR PERFIL ) */}
        {podeAdicionarPerfil && (
          <div 
            onClick={() => navigate("/adicionar-perfil")} 
            className="group flex w-24 cursor-pointer flex-col items-center sm:w-32"
          >
            <div className="flex h-24 w-24 items-center justify-center rounded-md border-2 border-transparent transition-all duration-300 group-hover:bg-white/10 sm:h-32 sm:w-32">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white/50 transition-all group-hover:bg-white/20 group-hover:text-white sm:h-16 sm:w-16">
                <FiPlus className="text-3xl sm:text-5xl" />
              </div>
            </div>
            <p className="mt-4 text-center text-sm text-gray-400 transition-colors group-hover:text-white sm:text-base">
              Adicionar perfil
            </p>
          </div>
        )}
      </div>

      {/* BOTÃO GERENCIAR PERFIS */}
      <button 
        onClick={() => navigate("/gerenciar-perfis")}
        className="mt-16 border border-gray-500 px-6 py-2 text-sm uppercase tracking-widest text-gray-500 transition-colors hover:border-white hover:text-white"
      >
        Gerenciar perfis
      </button>

    </div>
  );
}