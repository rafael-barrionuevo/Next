import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { listarConteudos } from '../store/contentSlice'; // Importe seus thunks aqui
import NavBar from '../components/NavBar';
import { 
  IoAddCircleOutline, 
  IoListOutline, 
  IoPlayForwardOutline, 
  IoTrashOutline 
} from "react-icons/io5";

export default function AdminHome() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Função para testar a listagem (Listar todos os conteúdos)
  const handleRefreshList = () => {
    dispatch(listarConteudos())
      .unwrap()
      .then(() => alert("Catálogo atualizado via Redux!"))
      .catch((err) => alert("Erro ao listar: " + err));
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-white">
      <NavBar />
      
      <main className="max-w-5xl mx-auto px-6 py-12">
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-600">
            Painel de Controle
          </h1>
          <p className="text-gray-400 mt-2">Gerencie o catálogo, episódios e conteúdos da plataforma.</p>
        </header>

        {/* GRID DE BOTÕES/AÇÕES */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* BOTÃO: CRIAR CONTEÚDO */}
          <Link to="/admin/cadastro" className="group p-6 bg-[#161b22] border border-white/5 rounded-2xl hover:border-purple-500/50 transition-all">
            <div className="bg-purple-600/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-600 transition-colors">
              <IoAddCircleOutline className="text-2xl text-purple-500 group-hover:text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">Novo Conteúdo</h3>
            <p className="text-sm text-gray-500">Cadastrar filmes ou séries inéditas no MongoDB.</p>
          </Link>

          {/* BOTÃO: LISTAR/ATUALIZAR (listarConteudos) */}
          <button onClick={handleRefreshList} className="text-left group p-6 bg-[#161b22] border border-white/5 rounded-2xl hover:border-purple-500/50 transition-all">
            <div className="bg-blue-600/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors">
              <IoListOutline className="text-2xl text-blue-500 group-hover:text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">Sincronizar Catálogo</h3>
            <p className="text-sm text-gray-500">Forçar atualização do estado global do Redux.</p>
          </button>

          {/* BOTÃO: GERENCIAR EPISÓDIOS (adicionarEpisodio) */}
          <Link to="/admin/episodios" className="group p-6 bg-[#161b22] border border-white/5 rounded-2xl hover:border-purple-500/50 transition-all">
            <div className="bg-green-600/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-600 transition-colors">
              <IoPlayForwardOutline className="text-2xl text-green-500 group-hover:text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">Adicionar Episódios</h3>
            <p className="text-sm text-gray-500">Incluir novos capítulos em temporadas existentes.</p>
          </Link>

          {/* BOTÃO: DELETAR CONTEÚDO (deletarConteudo) */}
          <Link to="/admin/remover" className="group p-6 bg-[#161b22] border border-white/5 rounded-2xl hover:border-red-500/50 transition-all">
            <div className="bg-red-600/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-red-600 transition-colors">
              <IoTrashOutline className="text-2xl text-red-500 group-hover:text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">Remover Títulos</h3>
            <p className="text-sm text-gray-500">Excluir permanentemente do banco de dados.</p>
          </Link>

        </div>
      </main>
    </div>
  );
}