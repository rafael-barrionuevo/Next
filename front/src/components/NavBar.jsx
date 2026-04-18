import { IoMdSearch } from "react-icons/io";
import { PiScreencastBold } from "react-icons/pi";
import { IoNotificationsOutline, IoChevronDownOutline } from "react-icons/io5";
import { FiEdit2, FiUser, FiHelpCircle } from 'react-icons/fi';
import { BiTransfer } from 'react-icons/bi';
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout, selecionarPerfilAtivo } from "../store/userSlice";
import logo from '../assets/logo.png';

function NavBar() {
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const perfis = user.perfis || [];
  const perfilAtivo = user.perfilAtivo || perfis[0];
  const outrosPerfis = perfis.filter(p => p.id !== perfilAtivo?.id);


  const handleLogout = () => {
    dispatch(logout());
    sessionStorage.removeItem("token");
    navigate("/");
  };

  const trocarPerfil = (perfil) => {
    dispatch(selecionarPerfilAtivo(perfil));
    navigate("/home");
  };


  const MenuDropdown = () => (
    <div className="absolute right-0 top-full pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 w-56">
      <div className="absolute top-2 right-4 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[8px] border-b-black/95"></div>
      <div className="bg-black/95 border border-gray-800 flex flex-col py-2 font-medium">

        {/* Lista de Outros Perfis */}
        {outrosPerfis.map(perfil => (
          <div
            key={perfil._id}
            onClick={() => trocarPerfil(perfil)}
            className="flex items-center gap-3 px-4 py-2 hover:underline cursor-pointer"
          >
            <img src={perfil.avatar} alt={perfil.nome} className="w-8 h-8 rounded object-cover" />
            <span className="text-sm text-gray-300">{perfil.nome}</span>
          </div>
        ))}

        {/* Gerenciar Perfis */}
        <div
          onClick={() => navigate("/gerenciar-perfis")}
          className="flex items-center gap-3 px-4 py-2 mt-2 hover:underline text-gray-300 cursor-pointer"
        >
          <FiEdit2 className="text-xl" />
          <span className="text-sm">Gerenciar perfis</span>
        </div>

        {/* Transferir Perfil */}
        <div
          onClick={() => navigate("/perfil")}
          className="flex items-center gap-3 px-4 py-2 hover:underline text-gray-300 cursor-pointer">
          <BiTransfer className="text-xl" />
          <span className="text-sm">Transferir perfil</span>
        </div>

        {/* Conta */}
        <div
          onClick={() => navigate("/perfilUser")}
          className="flex items-center gap-3 px-4 py-2 hover:underline text-gray-300 cursor-pointer">
          <FiUser className="text-xl" />
          <span className="text-sm">Conta</span>
        </div>


        <hr className="border-gray-600 my-2" />

        {/* Sair */}
        <div
          onClick={handleLogout}
          className="px-4 py-2 text-center text-sm text-gray-300 hover:underline cursor-pointer text-red-600 font-bold"
        >
          Sair da Next
        </div>

      </div>
    </div>
  );

  return (
    <nav className='bg-[#0d1117]/80 backdrop-blur-md sticky top-0 z-50 border-b border-white/5'>

      {/* MOBILE */}
      <div className='md:hidden flex flex-col'>
        <div className='flex justify-between items-center px-6 py-4'>
          <img src={logo} alt="Next Logo" className='w-20' />
          <div className="flex items-center gap-4">
            <IoMdSearch className='text-2xl text-white/70 hover:text-purple-500 cursor-pointer transition-colors' />
            <PiScreencastBold className='text-2xl text-white/70 hover:text-purple-500 cursor-pointer transition-colors' />

            {/* AVATAR MOBILE COM HOVER */}
            <div className='relative flex items-center gap-2 cursor-pointer group'>
              <img
                src={perfilAtivo?.avatar || "https://picsum.photos/32/32?random=profile"}
                alt="Avatar"
                className='w-8 h-8 rounded border border-transparent group-hover:border-white transition-colors'
              />
              <MenuDropdown />
            </div>

          </div>
        </div>

        <div className='flex flex-wrap justify-center gap-x-6 gap-y-2 items-center pb-4 px-4 text-sm font-medium text-white/60'>
          <Link to="/series" className='hover:text-white transition-all cursor-pointer border-b-2 border-transparent hover:border-purple-600 pb-1'>Filmes</Link>
          <Link to="/filmes" className='hover:text-white transition-all cursor-pointer border-b-2 border-transparent hover:border-purple-600 pb-1'>Séries</Link>
          <Link to="#" className='hover:text-white transition-all cursor-pointer border-b-2 border-transparent hover:border-purple-600 pb-1'>Animes</Link>
          {user.role === 'admin' && (
            <Link to="/admin" className='text-purple-500 font-bold border-b-2 border-transparent hover:border-purple-600 pb-1'>Admin</Link>
          )}
        </div>
      </div>

      {/* DESKTOP */}
      <div className='hidden md:flex w-full items-center justify-between px-8 py-4 max-w-7xl mx-auto'>
        <div className='flex items-center gap-10'>
          <img src={logo} alt="Next Logo" className='w-24' />

          <div className='flex items-center gap-6 text-sm font-medium text-white/80'>
            <Link to="/home" className='hover:text-white transition-colors cursor-pointer'>Início</Link>
            <Link to="/serie" className="seu-codigo-de-estilizacao-aqui">Séries</Link>
            <Link to="/filme" className="seu-codigo-de-estilizacao-aqui">Filmes</Link>
            <Link to="/wishList" className='hover:text-white transition-colors cursor-pointer'>Minha Lista</Link>
          </div>
        </div>

        <div className='flex items-center gap-6 text-sm font-medium text-white/80'>
          <IoMdSearch className='text-2xl hover:text-white cursor-pointer transition-colors' />

          <a className='hover:text-white transition-colors cursor-pointer'>Gêneros</a>

          {user.role === 'admin' && (
            <Link to="/admin" className='text-purple-500 font-bold hover:text-purple-400 transition-colors'>
              Painel Admin
            </Link>
          )}

          <div className='relative cursor-pointer hover:text-white transition-colors'>
            <IoNotificationsOutline className='text-2xl' />
            <span className='absolute -top-1 -right-1 bg-purple-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full'>
              14
            </span>
          </div>

          {/* AVATAR DESKTOP COM HOVER E SETA ROTACIONAL */}
          <div className='relative flex items-center gap-2 cursor-pointer group py-2'>
            <img
              src={perfilAtivo?.avatar || "https://picsum.photos/32/32?random=profile"}
              alt="Avatar"
              className='w-8 h-8 rounded border border-transparent group-hover:border-white transition-colors'
            />
            {/* A Seta rotaciona no hover */}
            <IoChevronDownOutline className='text-white/80 transition-transform duration-300 group-hover:rotate-180 group-hover:text-white' />

            <MenuDropdown />
          </div>
        </div>
      </div>

    </nav>
  )
}

export default NavBar;