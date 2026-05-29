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
    <div className="min-h-screen bg-slate-900 text-white">
      <NavBar />
      
      <main className="mx-auto max-w-5xl px-6 py-12">
        <header className="mb-12">
          <h1 className="bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-4xl font-bold text-transparent">
            Painel de Controle
          </h1>
          <p className="mt-2 text-gray-400">Gerencie o catálogo, episódios e conteúdos da plataforma.</p>
        </header>

        


        {/* GRID DE BOTÕES/AÇÕES */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          
          <Link to="/admin/planos" className="group rounded-2xl border border-white/5 bg-slate-800 p-6 transition-all hover:border-cyan-500/50">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-cyan-600/10 transition-colors group-hover:bg-cyan-600">
              <IoListOutline className="text-2xl text-cyan-500 group-hover:text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">Gerenciar Planos</h3>
            <p className="text-sm text-gray-500">Criar, editar e desativar planos da plataforma.</p>
          </Link>

          <Link to="/admin/catalogo" className="group rounded-2xl border border-white/5 bg-slate-800 p-6 transition-all hover:border-purple-500/50">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-600/10 transition-colors group-hover:bg-purple-600">
              <IoPlayForwardOutline className="text-2xl text-purple-500 group-hover:text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">Gerenciar Catálogo</h3>
            <p className="text-sm text-gray-500">Adicionar, editar e remover filmes, séries e episódios.</p>
          </Link>

          <button onClick={handleRefreshList} className="group rounded-2xl border border-white/5 bg-slate-800 p-6 text-left transition-all hover:border-blue-500/50">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600/10 transition-colors group-hover:bg-blue-600">
              <IoListOutline className="text-2xl text-blue-500 group-hover:text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">Sincronizar Catálogo</h3>
            <p className="text-sm text-gray-500">Forçar atualização do estado global do Redux.</p>
          </button>

        </div>
      </main>
    </div>
  );
}